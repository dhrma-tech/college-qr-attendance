import Link from "next/link";
import { CalendarDays, CheckCircle2, Download, Plus, Search } from "lucide-react";
import { AlertBanner } from "@/components/alert-banner";
import { AdminStructureManager } from "@/components/admin-structure-manager";
import { AttendanceCharts } from "@/components/attendance-chart";
import { AttendanceBadge } from "@/components/attendance-badge";
import { ApiSurfaceCard, BackendPipeline } from "@/components/backend-pipeline";
import { DemoQrFlow } from "@/components/demo-qr-flow";
import { DownloadButton } from "@/components/download-button";
import { MetricCard } from "@/components/metric-card";
import { QrScanner } from "@/components/qr-scanner";
import { ReportTable } from "@/components/report-table";
import { SessionCard } from "@/components/session-card";
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

  if (role === "student" && mode === "dashboard") return <StudentDashboard />;
  if (role === "student" && mode === "attendance") return <StudentAttendancePage />;
  if (role === "teacher" && mode === "dashboard") return <TeacherDashboard metrics={metrics} />;
  if (role === "hod" && mode === "dashboard") return <HodDashboard metrics={metrics} />;
  if (role === "admin" && mode === "dashboard") return <AdminDashboard metrics={metrics} />;
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
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
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

function StudentDashboard() {
  const atRisk = subjectCards.filter((subject) => subject.percent < 75).map((subject) => ({ name: subject.subject, percentage: subject.percent }));

  return (
    <div className="space-y-6">
      <Card className="border-teal/15 bg-[#EAF8F4] text-ink">
        <CardContent className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)]">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-teal">Good morning, Aarav.</p>
            <h2 className="mt-4 text-4xl font-normal text-ink sm:text-5xl">82%</h2>
            <p className="mt-3 text-sm font-semibold text-ink/60">overall this semester</p>
            <p className="mt-6 text-sm font-bold text-ink/70">6 subjects enrolled - 64 present - 14 absent</p>
          </div>
          <div className="rounded-2xl border border-teal/15 bg-white/65 p-5">
            <p className="text-sm font-black text-ink">Next class</p>
            <p className="mt-3 text-2xl font-black text-teal">Physics</p>
            <p className="mt-1 text-sm font-semibold text-ink/60">11:00 AM - Lab 3</p>
            <Badge className="mt-5 bg-teal text-white ring-teal">Live scan opens soon</Badge>
          </div>
        </CardContent>
      </Card>
      <AlertBanner subjects={atRisk} />
      <DemoQrFlow />
      <MetricGrid metrics={dashboardMetrics.student} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <AttendanceCharts />
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportTable columns={tableColumns.schedule} rows={tableRows.schedule} />
          </CardContent>
        </Card>
      </div>
      <SubjectBreakdown />
    </div>
  );
}

function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <Card className="border-ink/10">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-teal">My attendance</p>
            <h2 className="mt-2 text-3xl font-normal text-ink">Semester summary and subject risk</h2>
            <p className="mt-2 text-sm font-semibold text-ink/55">Filter by semester, export parent-ready reports, and inspect every session.</p>
          </div>
          <DownloadButton label="Download certificate" />
        </CardContent>
      </Card>
      <QrScanner />
      <SubjectBreakdown />
      <Card>
        <CardHeader>
          <CardTitle>Session Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, index) => {
              const status = index % 11 === 0 ? "absent" : index % 7 === 0 ? "late" : index % 5 === 0 ? "empty" : "present";
              return (
                <div
                  key={index}
                  className={`grid aspect-square place-items-center rounded-lg text-xs font-black ${
                    status === "present"
                      ? "bg-present/12 text-present"
                      : status === "late"
                        ? "bg-late/12 text-late"
                        : status === "absent"
                          ? "bg-absent/12 text-absent"
                          : "bg-[#EAF8F4] text-ink/30"
                  }`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-black text-ink/55">
            <span>Green: present</span>
            <span>Orange: late</span>
            <span>Red: absent</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherDashboard({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="space-y-6">
      <MetricGrid metrics={metrics} />
      <div className="grid gap-4 lg:grid-cols-3">
        <SessionCard subject="Operating Systems" teacher="Prof. Arjun Rao" present={38} total={48} />
        <SessionCard subject="Database Management" teacher="Dr. Priya Menon" present={51} total={58} />
        <SessionCard subject="Web Engineering" teacher="Ms. Sana Iqbal" present={46} total={52} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Sessions</CardTitle>
            <Button size="sm" variant="outline">
              <CalendarDays className="h-4 w-4" />
              Today
            </Button>
          </CardHeader>
          <CardContent>
            <ReportTable columns={tableColumns.sessions} rows={tableRows.sessions} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Action Center</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.title} className="flex gap-3 rounded-xl border border-ink/10 p-4">
                <alert.icon className="mt-0.5 h-5 w-5 text-teal" />
                <div>
                  <p className="font-black text-ink">{alert.title}</p>
                  <p className="text-sm font-semibold text-ink/55">{alert.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HodDashboard({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="space-y-6">
      <MetricGrid metrics={metrics} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="border-teal/15 bg-[#EAF8F4] text-ink">
          <CardContent className="p-5 sm:p-6">
            <p className="text-sm font-black uppercase tracking-wide text-teal">Department health</p>
            <h2 className="mt-4 text-4xl font-normal text-ink sm:text-5xl">81%</h2>
            <p className="mt-2 text-sm font-semibold text-ink/60">Computer Science average this semester</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {["24 teachers", "5 live sessions", "37 at risk"].map((item) => (
                <div key={item} className="rounded-xl border border-teal/15 bg-white/65 p-4 text-sm font-black text-ink/75">
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Attendance Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subjectCards.filter((item) => item.percent < 75).map((item) => (
              <div key={item.subject} className="rounded-xl border border-coral/20 bg-coral/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-ink">{item.subject}</p>
                    <p className="text-sm font-semibold text-ink/55">{item.teacher}</p>
                  </div>
                  <AttendanceBadge percentage={item.percent} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ReportTable columns={tableColumns.teachers} rows={tableRows.teachers} />
        <AttendanceCharts />
      </div>
      <BackendPipeline title="Department Data Pipeline" />
    </div>
  );
}

function AdminDashboard({ metrics }: { metrics: Metric[] }) {
  const setup = [
    { label: "College config", done: true },
    { label: "Departments", done: true },
    { label: "Teacher import", done: true },
    { label: "Student import", done: false },
    { label: "Timetable", done: false }
  ];

  return (
    <div className="space-y-6">
      <MetricGrid metrics={metrics} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Card className="border-teal/15 bg-[#EAF8F4] text-ink">
          <CardContent className="p-5 sm:p-6">
            <p className="text-sm font-black uppercase tracking-wide text-teal">Setup progress</p>
            <h2 className="mt-4 text-4xl font-normal text-ink sm:text-5xl">60%</h2>
            <p className="mt-2 text-sm font-semibold text-ink/60">Complete the remaining steps before first rollout.</p>
            <div className="mt-7 space-y-3">
              {setup.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-teal/15 bg-white/65 p-3 text-sm font-black">
                  <span>{item.label}</span>
                  <span className={item.done ? "text-teal" : "text-ink/35"}>{item.done ? "Done" : "Pending"}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <ApiSurfaceCard />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <BackendPipeline />
        <Card>
          <CardHeader>
            <CardTitle>Admin Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Configure college", href: "/admin/config" },
              { label: "Add departments", href: "/admin/departments" },
              { label: "Import teachers", href: "/admin/teachers" },
              { label: "Import students", href: "/admin/students" }
            ].map((action) => (
              <Button key={action.href} asChild variant="outline" className="h-14 justify-start border-ink/10">
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      <ReportTable columns={tableColumns.logs} rows={tableRows.logs} />
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
              <AttendanceBadge percentage={item.percent} />
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
        <CardContent className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <Badge>Primary flow</Badge>
            <h2 className="mt-4 text-2xl font-bold text-slate-950 sm:text-3xl">Start a ScanRoll QR session</h2>
            <p className="mt-3 text-slate-500">
              Select subject and section, confirm classroom location, then display a rotating QR code for students.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Input placeholder="Subject: DBMS" />
              <Input placeholder="Section: CSE 5A" />
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/teacher/attendance/demo-session">
                  <Plus className="h-4 w-4" />
                  Start Session
                </Link>
              </Button>
              <Button variant="outline">Use timetable slot</Button>
            </div>
            <div className="mt-7 grid gap-3">
              {["Select subject and section", "Confirm classroom location", "Project QR and watch live count"].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-paper p-3 text-sm font-black text-ink/70">
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-teal/15 bg-[#EAF8F4] text-xs text-ink">{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-950 p-4 text-white sm:p-6">
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
      <BackendPipeline title="Teacher Session Pipeline" />
      <DemoQrFlow />
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
          <DownloadButton label="Export PDF" />
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
      <CardContent className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[220px_1fr]">
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
  return <AdminStructureManager />;
}

function BackupPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {["Students CSV", "Attendance JSON", "Full backup ZIP"].map((item) => (
        <Card key={item}>
          <CardContent className="p-5">
            <Download className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-bold text-slate-950">{item}</h2>
            <p className="mt-2 text-sm text-slate-500">Prepared for future storage-backed exports.</p>
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
