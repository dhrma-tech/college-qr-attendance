import {
  AlertTriangle,
  Archive,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Clock3,
  ClipboardList,
  Database,
  GraduationCap,
  Home,
  IdCard,
  LayoutDashboard,
  QrCode,
  Settings,
  ShieldCheck,
  UserCog,
  Users
} from "lucide-react";
import type { Metric, NavItem, TableColumn, TableRow } from "@/lib/types";

export const studentNav: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Attendance", href: "/dashboard/attendance", icon: ClipboardList },
  { label: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
  { label: "Profile", href: "/dashboard/profile", icon: IdCard }
];

export const teacherNav: NavItem[] = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { label: "Start Attendance", href: "/teacher/attendance", icon: QrCode },
  { label: "Students", href: "/teacher/students", icon: Users },
  { label: "Reports", href: "/teacher/reports", icon: BarChart3 },
  { label: "Profile", href: "/teacher/profile", icon: IdCard }
];

export const hodNav: NavItem[] = [
  { label: "Dashboard", href: "/hod/dashboard", icon: LayoutDashboard },
  { label: "Teachers", href: "/hod/teachers", icon: UserCog },
  { label: "Subjects", href: "/hod/subjects", icon: BookOpen },
  { label: "Students", href: "/hod/students", icon: GraduationCap },
  { label: "Alerts", href: "/hod/alerts", icon: Bell },
  { label: "Reports", href: "/hod/reports", icon: BarChart3 },
  { label: "Profile", href: "/hod/profile", icon: IdCard }
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Departments", href: "/admin/departments", icon: Building2 },
  { label: "Teachers", href: "/admin/teachers", icon: UserCog },
  { label: "Students", href: "/admin/students", icon: GraduationCap },
  { label: "Subjects", href: "/admin/subjects", icon: BookOpen },
  { label: "Timetable", href: "/admin/timetable", icon: CalendarDays },
  { label: "Config", href: "/admin/config", icon: Settings },
  { label: "Backup", href: "/admin/backup", icon: Archive },
  { label: "Audit Logs", href: "/admin/logs", icon: Database }
];

export const landingStats = [
  { label: "Students enrolled", value: "1,248" },
  { label: "Sessions held", value: "8,420" },
  { label: "Average attendance", value: "82%" }
];

export const demoStudents = [
  { id: "stu-001", name: "Aarav Sharma", rollNumber: "CSE-501", department: "Computer Science" },
  { id: "stu-002", name: "Meera Nair", rollNumber: "CSE-518", department: "Computer Science" },
  { id: "stu-003", name: "Kabir Khan", rollNumber: "CSE-542", department: "Computer Science" }
];

export const demoTeachers = [
  { id: "tch-001", name: "Dr. Priya Menon", subject: "Database Management Systems" },
  { id: "tch-002", name: "Prof. Arjun Rao", subject: "Computer Networks" },
  { id: "tch-003", name: "Ms. Sana Iqbal", subject: "Web Engineering" }
];

export const demoSessions = [
  { id: "qr-dbms-001", subject: "Database Management Systems", date: "2026-04-28", time: "09:00", qrCodeId: "SCANROLL-DBMS-001" },
  { id: "qr-web-001", subject: "Web Engineering", date: "2026-04-28", time: "11:00", qrCodeId: "SCANROLL-WEB-001" },
  { id: "qr-net-001", subject: "Computer Networks", date: "2026-04-28", time: "14:00", qrCodeId: "SCANROLL-NET-001" }
];

export const demoAttendanceLogs = [
  { studentId: "stu-001", sessionId: "qr-dbms-001", timestamp: "2026-04-28T09:03:00+05:30", status: "present" },
  { studentId: "stu-002", sessionId: "qr-dbms-001", timestamp: "2026-04-28T09:04:00+05:30", status: "present" },
  { studentId: "stu-003", sessionId: "qr-web-001", timestamp: "2026-04-28T11:12:00+05:30", status: "late" }
];

export const dashboardMetrics: Record<string, Metric[]> = {
  student: [
    { label: "Overall attendance", value: "82%", detail: "7% above college threshold", tone: "success" },
    { label: "Present sessions", value: "92", detail: "Across 6 active subjects", tone: "primary" },
    { label: "Absences", value: "18", detail: "3 need attention this month", tone: "warning" },
    { label: "Late marks", value: "4", detail: "No late marks this week", tone: "neutral" }
  ],
  teacher: [
    { label: "Today's sessions", value: "3", detail: "2 completed, 1 scheduled", tone: "primary" },
    { label: "Week hours", value: "14", detail: "Across 4 subjects", tone: "neutral" },
    { label: "Avg attendance", value: "79%", detail: "Department target is 75%", tone: "success" },
    { label: "Proxy flags", value: "2", detail: "Need review", tone: "warning" }
  ],
  hod: [
    { label: "Department average", value: "81%", detail: "Computer Science semester 5", tone: "success" },
    { label: "Active sessions", value: "5", detail: "Live across campus", tone: "primary" },
    { label: "At-risk students", value: "37", detail: "Below 75% threshold", tone: "danger" },
    { label: "Teachers reporting", value: "24", detail: "100% synced this week", tone: "neutral" }
  ],
  admin: [
    { label: "Total users", value: "1,396", detail: "Students, teachers, HODs", tone: "primary" },
    { label: "Active sessions", value: "5", detail: "Realtime channels online", tone: "success" },
    { label: "DB health", value: "Good", detail: "Last backup 02:00", tone: "success" },
    { label: "Open flags", value: "9", detail: "Proxy and override reviews", tone: "warning" }
  ]
};

export const tableColumns: Record<string, TableColumn[]> = {
  schedule: [
    { label: "Time", key: "time" },
    { label: "Subject", key: "subject" },
    { label: "Room", key: "room" },
    { label: "Status", key: "status" }
  ],
  sessions: [
    { label: "Subject", key: "subject" },
    { label: "Class", key: "class" },
    { label: "Present", key: "present" },
    { label: "Status", key: "status" }
  ],
  students: [
    { label: "Roll No", key: "roll" },
    { label: "Name", key: "name" },
    { label: "Subject", key: "subject" },
    { label: "Attendance", key: "attendance" }
  ],
  teachers: [
    { label: "Teacher", key: "teacher" },
    { label: "Subjects", key: "subjects" },
    { label: "Sessions", key: "sessions" },
    { label: "Average", key: "average" }
  ],
  logs: [
    { label: "Actor", key: "actor" },
    { label: "Action", key: "action" },
    { label: "Record", key: "record" },
    { label: "Time", key: "time" }
  ]
};

export const tableRows: Record<string, TableRow[]> = {
  schedule: [
    { time: "09:00", subject: "Database Management Systems", room: "Lab 204", status: "Marked" },
    { time: "11:00", subject: "Web Engineering", room: "Room 312", status: "Upcoming" },
    { time: "14:00", subject: "Computer Networks", room: "Room 208", status: "Pending" }
  ],
  sessions: [
    { subject: "Database Management Systems", class: "CSE 5A", present: "51 / 58", status: "Closed" },
    { subject: "Web Engineering", class: "CSE 5B", present: "46 / 52", status: "Closed" },
    { subject: "Operating Systems", class: "CSE 3A", present: "Live", status: "Active" }
  ],
  students: [
    { roll: "CSE-501", name: "Aarav Sharma", subject: "DBMS", attendance: "88%" },
    { roll: "CSE-518", name: "Meera Nair", subject: "Networks", attendance: "72%" },
    { roll: "CSE-542", name: "Kabir Khan", subject: "Web Engineering", attendance: "58%" }
  ],
  teachers: [
    { teacher: "Dr. Priya Menon", subjects: "3", sessions: "42", average: "84%" },
    { teacher: "Prof. Arjun Rao", subjects: "2", sessions: "38", average: "79%" },
    { teacher: "Ms. Sana Iqbal", subjects: "4", sessions: "51", average: "76%" }
  ],
  logs: [
    { actor: "Admin", action: "Updated threshold", record: "College config", time: "09:12" },
    { actor: "Teacher", action: "Manual override", record: "CSE-542", time: "10:48" },
    { actor: "System", action: "Proxy flag", record: "Session DBMS", time: "11:03" }
  ]
};

export const subjectCards = [
  { subject: "Database Management Systems", teacher: "Dr. Priya Menon", percent: 88, status: "Healthy" },
  { subject: "Computer Networks", teacher: "Prof. Arjun Rao", percent: 72, status: "Watch" },
  { subject: "Web Engineering", teacher: "Ms. Sana Iqbal", percent: 58, status: "Critical" }
];

export const alerts = [
  { title: "Critical attendance", detail: "Kabir Khan is at 58% in Web Engineering.", icon: AlertTriangle },
  { title: "Proxy review", detail: "2 scans were outside the configured 100m radius.", icon: ShieldCheck },
  { title: "Timetable conflict", detail: "Room 204 has an overlapping lab slot on Thursday.", icon: Clock3 }
];
