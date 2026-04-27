import { CalendarDays, CheckCircle2, Download, Plus, Search } from "lucide-react";
import { AttendanceCharts } from "@/components/attendance-chart";
import { MetricCard } from "@/components/metric-card";
import { ReportTable } from "@/components/report-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { alerts, dashboardMetrics, subjectCards, tableColumns, tableRows } from "@/lib/mock-data";
import type { Metric } from "@/lib/types";

type PortalPageProps = {
  role: "student" | "teacher" | "hod" | "admin";
  mode: "dashboard" | "attendance" | "subjects" | "profile" | "students" | "reports" | "teachers" | "alerts" | "config" | "backup" | "logs" | "timetable" | "departments";
};

export function PortalPage({ role, mode }: PortalPageProps) {
  const metrics = dashboardMetrics[role] || dashboardMetrics.student;

  if (mode === "attendance" && role === "teacher") return <TeacherAttendance />;
  if (mode === "subjects" && role === "student") return <SubjectBreakdown />;
  if (mode === "profile") return <ProfilePanel role={role} />;
  if (mode === "reports") return <ReportsPanel role={role} />;
  if (mode === "alerts") return <AlertsPanel />;
  if (mode === "config") return <ConfigPanel />;
  if (mode === "backup") return <BackupPanel />;
  if (mode === "logs") return <ReportTable columns={tableColumns.logs} rows={tableRows.logs} />;
  if (mode === "timetable") return <TimetablePanel />;
  if (["students", "teachers", "departments", "subjects"].includes(mode)) return <DirectoryPanel mode={mode} role={role} />;

  return (
    <div className="space-y-6">
      <MetricGrid metrics={metrics} />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{role === "student" ? "Today's Schedule" : "Recent Sessions"}</CardTitle>
            <Button size="sm" variant="outline">
              <CalendarDays className="h-4 w-4" />
              Today
            </Button>
          </CardHeader>
          <CardContent>
            <ReportTable
              columns={role === "student" ? tableColumns.schedule : tableColumns.sessions}
              rows={role === "student" ? tableRows.schedule : tableRows.sessions}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{role === "student" ? "Attendance Health" : "Action Center"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.title} className="flex gap-3 rounded-xl border border-slate-200 p-4">
                <alert.icon className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-slate-950">{alert.title}</p>
                  <p className="text-sm text-slate-500">{alert.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <AttendanceCharts />
    </div>
  );
}

function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}

function SubjectBreakdown() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {subjectCards.map((item) => (
        <Card key={item.subject}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-950">{item.subject}</h2>
                <p className="mt-1 text-sm text-slate-500">{item.teacher}</p>
              </div>
              <Badge tone={item.percent >= 75 ? "success" : item.percent >= 60 ? "warning" : "danger"}>{item.status}</Badge>
            </div>
            <div className="mt-8 text-4xl font-bold text-slate-950">{item.percent}%</div>
            <Progress value={item.percent} className="mt-4" />
            <Button className="mt-5 w-full" variant="outline">
              View Calendar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TeacherAttendance() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="grid gap-8 p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge>Primary workflow</Badge>
            <h2 className="mt-4 text-3xl font-bold text-slate-950">Start a QR attendance session</h2>
            <p className="mt-3 text-slate-500">
              Select subject and section, confirm classroom location, then display a rotating QR code for students.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Input placeholder="Subject: DBMS" />
              <Input placeholder="Section: CSE 5A" />
            </div>
            <Button className="mt-5">
              <Plus className="h-4 w-4" />
              Start Session
            </Button>
          </div>
          <div className="rounded-2xl bg-slate-950 p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Projector Preview</span>
              <Badge tone="success">Live</Badge>
            </div>
            <div className="mx-auto mt-6 grid aspect-square max-w-[320px] place-items-center rounded-2xl bg-white p-6">
              <div className="grid h-full w-full grid-cols-5 gap-2">
                {Array.from({ length: 25 }).map((_, index) => (
                  <span key={index} className={(index * 7) % 3 === 0 ? "rounded-sm bg-slate-950" : "rounded-sm bg-slate-200"} />
                ))}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
              <span>Token rotates in 18s</span>
              <span>42 / 58 present</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <ReportTable columns={tableColumns.sessions} rows={tableRows.sessions} />
    </div>
  );
}

function DirectoryPanel({ mode, role }: { mode: string; role: string }) {
  const isTeacherList = mode === "teachers";
  const columns = isTeacherList ? tableColumns.teachers : tableColumns.students;
  const rows = isTeacherList ? tableRows.teachers : tableRows.students;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input className="pl-10" placeholder={`Search ${mode}`} />
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          {role === "admin" ? "Add Record" : "Export CSV"}
        </Button>
      </div>
      <ReportTable columns={columns} rows={rows} />
    </div>
  );
}

function ReportsPanel({ role }: { role: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">{role === "hod" ? "Department Report Builder" : "Attendance Reports"}</h2>
            <p className="text-sm text-slate-500">Filter by academic year, subject, teacher, section, and date range.</p>
          </div>
          <Button>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </CardContent>
      </Card>
      <AttendanceCharts />
      <ReportTable columns={tableColumns.students} rows={tableRows.students} />
    </div>
  );
}

function AlertsPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {alerts.map((alert) => (
        <Card key={alert.title}>
          <CardContent className="p-5">
            <alert.icon className="h-6 w-6 text-danger" />
            <h2 className="mt-4 font-bold text-slate-950">{alert.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{alert.detail}</p>
            <Button className="mt-5 w-full" variant="outline">
              Mark Reviewed
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProfilePanel({ role }: { role: string }) {
  return (
    <Card>
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[220px_1fr]">
        <div className="grid h-48 place-items-center rounded-xl bg-blue-50 text-primary">
          <CheckCircle2 className="h-14 w-14" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder={`${role} name`} />
          <Input placeholder="name@college.edu" />
          <Input placeholder="Department" />
          <Input placeholder="Phone" />
          <Button className="sm:col-span-2">Save Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ConfigPanel() {
  return (
    <Card>
      <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
        <Input placeholder="College name" />
        <Input placeholder="College code" />
        <Input placeholder="Attendance threshold: 75" />
        <Input placeholder="QR rotation seconds: 30" />
        <Input placeholder="Geofence radius meters: 100" />
        <Input placeholder="Current semester" />
        <Button className="sm:col-span-2">Save College Config</Button>
      </CardContent>
    </Card>
  );
}

function BackupPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {["Students CSV", "Attendance JSON", "Full backup ZIP"].map((item) => (
        <Card key={item}>
          <CardContent className="p-5">
            <Download className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-bold text-slate-950">{item}</h2>
            <p className="mt-2 text-sm text-slate-500">Prepared for Supabase Storage export workflow.</p>
            <Button className="mt-5 w-full" variant="outline">
              Download
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TimetablePanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
        <Card key={day}>
          <CardHeader>
            <CardTitle>{day}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-800">09:00 DBMS</div>
            <div className="rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800">11:00 Networks</div>
            <div className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">14:00 Web Lab</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
