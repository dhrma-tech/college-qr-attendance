import { NextResponse } from "next/server";
import { AuthzError, requireAnyRole } from "@/lib/backend/authz";
import { hasSupabaseServerEnv } from "@/lib/backend/env";
import { getAttendanceReport } from "@/lib/backend/attendance-service";

type ReportRow = Record<string, string | number | boolean | null | undefined>;

export async function GET(request: Request) {
  try {
    const format = new URL(request.url).searchParams.get("format") || "json";
    const actor = hasSupabaseServerEnv() ? await requireAnyRole(["student", "teacher", "hod", "admin"]) : null;
    const result = await getAttendanceReport(actor ? { actorId: actor.user.id, role: actor.profile.role } : undefined);
    const rows = normalizeRows(result);

    if (format === "csv") {
      return new Response(toCsv(rows), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${safeFilename("scanroll-attendance-report.csv")}"`
        }
      });
    }

    if (format === "pdf") {
      return new Response(toPdf(rows), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${safeFilename("scanroll-attendance-report.pdf")}"`
        }
      });
    }

    return NextResponse.json({ ...result, rows });
  } catch (error) {
    if (error instanceof AuthzError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate attendance report" }, { status: 400 });
  }
}

function normalizeRows(result: unknown): ReportRow[] {
  const payload = result as { data?: unknown; rows?: unknown };
  const data = payload.data || payload;
  const rows = Array.isArray((data as { rows?: unknown }).rows) ? (data as { rows: ReportRow[] }).rows : Array.isArray(data) ? (data as ReportRow[]) : [];
  return rows.slice(0, 500).map((row) => {
    const cleaned: ReportRow = {};
    Object.entries(row).forEach(([key, value]) => {
      cleaned[sanitizeText(key)] = typeof value === "string" ? sanitizeText(value) : value;
    });
    return cleaned;
  });
}

function toCsv(rows: ReportRow[]) {
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const body = rows.map((row) => headers.map((header) => csvCell(row[header])).join(","));
  return [headers.map(csvCell).join(","), ...body].join("\n");
}

function csvCell(value: ReportRow[string]) {
  const raw = sanitizeText(value == null ? "" : String(value));
  const formulaSafe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${formulaSafe.replaceAll('"', '""')}"`;
}

function toPdf(rows: ReportRow[]) {
  const lines = [
    "ScanRoll Attendance Report",
    `Generated: ${new Date().toISOString()}`,
    "",
    ...rows.slice(0, 40).map((row) => Object.values(row).map((value) => sanitizeText(value == null ? "" : String(value))).join(" | "))
  ];
  const stream = [
    "BT",
    "/F1 14 Tf",
    "50 780 Td",
    ...lines.flatMap((line, index) => [`${index === 0 ? "" : "0 -18 Td"}(${escapePdfText(line).slice(0, 110)}) Tj`]),
    "ET"
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`
  ];
  const chunks = ["%PDF-1.4\n"];
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(chunks.join("")));
    chunks.push(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });

  const xrefStart = Buffer.byteLength(chunks.join(""));
  chunks.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((offset) => chunks.push(`${String(offset).padStart(10, "0")} 00000 n \n`));
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

  return Buffer.from(chunks.join(""));
}

function sanitizeText(value: string) {
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function safeFilename(value: string) {
  return value.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
}
