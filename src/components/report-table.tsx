import type { TableColumn, TableRow } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function ReportTable({ columns, rows }: { columns: TableColumn[]; rows: TableRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-bold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                {columns.map((column) => {
                  const value = String(row[column.key]);
                  return (
                    <td key={column.key} className="px-4 py-3 text-slate-700">
                      {isBadgeValue(value) ? <Badge tone={badgeTone(value)}>{value}</Badge> : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function isBadgeValue(value: string) {
  return value.includes("%") || ["Active", "Closed", "Marked", "Upcoming", "Pending"].includes(value);
}

function badgeTone(value: string) {
  if (value.includes("88") || value.includes("84") || value.includes("79") || value === "Marked" || value === "Closed") return "success";
  if (value.includes("72") || value === "Upcoming" || value === "Pending") return "warning";
  if (value.includes("58")) return "danger";
  if (value === "Active") return "default";
  return "muted";
}
