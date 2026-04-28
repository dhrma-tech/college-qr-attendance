export const apiWorkflowPaths = [
  {
    method: "POST",
    path: "/api/sessions/start",
    label: "Start attendance session",
    database: "attendance_sessions"
  },
  {
    method: "POST",
    path: "/api/sessions/[id]/rotate",
    label: "Rotate QR token",
    database: "rotate_attendance_session_token()"
  },
  {
    method: "POST",
    path: "/api/sessions/[id]/end",
    label: "End attendance session",
    database: "attendance_sessions"
  },
  {
    method: "POST",
    path: "/api/attendance/mark",
    label: "Mark attendance from QR",
    database: "mark_attendance_from_qr()"
  },
  {
    method: "POST",
    path: "/api/attendance/override",
    label: "Manual override",
    database: "attendance_records"
  },
  {
    method: "GET",
    path: "/api/reports/attendance",
    label: "Attendance report",
    database: "student_attendance_summary"
  }
];

export const databaseWorkflowPaths = [
  "colleges",
  "departments",
  "users",
  "subjects",
  "subject_assignments",
  "student_enrollments",
  "timetable",
  "attendance_sessions",
  "attendance_records",
  "student_attendance_summary",
  "active_session_status",
  "low_attendance_alerts",
  "audit_logs"
];

export const deploymentChecklist = [
  { label: "Supabase URL", env: "NEXT_PUBLIC_SUPABASE_URL" },
  { label: "Supabase anon key", env: "NEXT_PUBLIC_SUPABASE_ANON_KEY" },
  { label: "Service role key", env: "SUPABASE_SERVICE_ROLE_KEY" },
  { label: "College name", env: "NEXT_PUBLIC_COLLEGE_NAME" },
  { label: "Attendance threshold", env: "NEXT_PUBLIC_ATTENDANCE_THRESHOLD" }
];
