import { NextResponse } from "next/server";
import { AuthzError, requireAnyRole } from "@/lib/backend/authz";
import { hasSupabaseServerEnv } from "@/lib/backend/env";
import { getAttendanceReport } from "@/lib/backend/attendance-service";
import { validateRequest, validateReportsQuery, ValidationError } from "@/lib/validation/schemas";
import { rateLimiters } from "@/lib/rate-limiting";
import { createClient } from "@/lib/supabase/server";

type ReportRow = Record<string, string | number | boolean | null | undefined>;

export async function GET(request: Request) {
  try {
    // Apply rate limiting for reports
    const rateLimitHandler = rateLimiters.reports(async (req) => {
      return NextResponse.json({ status: "ok" });
    });
    
    const rateLimitResponse = await rateLimitHandler(request);
    if (rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }

    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = {
      startDate: url.searchParams.get("startDate"),
      endDate: url.searchParams.get("endDate"),
      subjectId: url.searchParams.get("subjectId"),
      classId: url.searchParams.get("classId"),
      studentId: url.searchParams.get("studentId"),
      format: url.searchParams.get("format") || "json",
      limit: url.searchParams.get("limit"),
      offset: url.searchParams.get("offset")
    };

    const validatedParams = validateRequest(queryParams, validateReportsQuery);

    const actor = hasSupabaseServerEnv() ? await requireAnyRole(["student", "teacher", "hod", "admin"]) : null;

    // Apply role-based data scoping
    let scopedParams = { ...validatedParams };
    
    if (actor) {
      switch (actor.profile.role) {
        case 'student':
          // Students can only see their own data
          scopedParams.studentId = actor.user.id;
          // Remove filters that would allow seeing other students
          delete scopedParams.classId;
          delete scopedParams.subjectId;
          break;
          
        case 'teacher':
          // Teachers can only see data for their assigned classes
          const supabase = await createClient();
          const { data: teacherAssignments } = await supabase
            .from('subject_assignments')
            .select('id, subject_id')
            .eq('teacher_id', actor.user.id);
          
          if (teacherAssignments && teacherAssignments.length > 0) {
            // If subjectId is provided, ensure it's one of their assigned subjects
            if (scopedParams.subjectId) {
              const isAssigned = teacherAssignments.some(
                assignment => assignment.subject_id === scopedParams.subjectId
              );
              if (!isAssigned) {
                return NextResponse.json({ 
                  error: "Access denied: Subject not assigned to this teacher" 
                }, { status: 403 });
              }
            }
          }
          break;
          
        case 'hod':
          // HODs can only see data for their department
          // This is enforced at the RLS level, but we add additional validation
          if (scopedParams.studentId) {
            const supabase = await createClient();
            const { data: student } = await supabase
              .from('users')
              .select('department_id')
              .eq('id', scopedParams.studentId)
              .single();
            
            if (student && student.department_id !== actor.profile.department_id) {
              return NextResponse.json({ 
                error: "Access denied: Student not in HOD's department" 
              }, { status: 403 });
            }
          }
          break;
          
        case 'admin':
          // Admins can see all data in their college
          // This is enforced at the RLS level
          break;
      }
    }

    // Get the attendance report with scoped parameters
    const result = await getAttendanceReport(actor ? { 
      actorId: actor.user.id, 
      role: actor.profile.role,
      ...scopedParams 
    } : { ...scopedParams });
    
    const rows = normalizeRows(result);

    // Log export for audit purposes
    if (actor && validatedParams.format !== 'json') {
      const supabase = await createClient();
      await supabase
        .from('audit_logs')
        .insert({
          actor_id: actor.user.id,
          action: 'EXPORT_ATTENDANCE_REPORT',
          table_name: 'attendance_records',
          record_id: null,
          old_val: null,
          new_val: {
            format: validatedParams.format,
            record_count: rows.length,
            filters: scopedParams,
            exported_at: new Date().toISOString()
          }
        });
    }

    // Apply export rate limiting (additional protection)
    if (validatedParams.format !== 'json' && rows.length > 1000) {
      return NextResponse.json({ 
        error: "Export too large. Please apply filters to reduce data size." 
      }, { status: 400 });
    }

    if (validatedParams.format === "csv") {
      return new Response(toCsv(rows), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${safeFilename(`scanroll-attendance-report-${actor?.profile.role || 'demo'}-${Date.now()}.csv")}"`
        }
      });
    }

    if (validatedParams.format === "pdf") {
      return new Response(toPdf(rows), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${safeFilename(`scanroll-attendance-report-${actor?.profile.role || 'demo'}-${Date.now()}.pdf`)}`"
        }
      });
    }

    return NextResponse.json({ 
      ...result, 
      rows,
      meta: {
        recordCount: rows.length,
        role: actor?.profile.role || 'demo',
        exportedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Attendance report error:', error);
    
    // Handle validation errors specifically
    if (error instanceof ValidationError) {
      return NextResponse.json({ 
        error: "Invalid query parameters",
        details: error.message,
        field: error.field
      }, { status: 400 });
    }

    // Handle authorization errors specifically
    if (error instanceof AuthzError) {
      return NextResponse.json({ 
        error: error.message 
      }, { status: error.status });
    }

    // Generic error - don't expose internal details
    return NextResponse.json({ 
      error: "Unable to generate attendance report at this time" 
    }, { status: 500 });
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
