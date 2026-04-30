import { CheckCircle2, CircleDot, Clock3, Database, Route, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiWorkflowPaths } from "@/lib/backend/workflow-map";

type PipelineStep = {
  label: string;
  detail: string;
  status: "ready" | "demo" | "next";
};

const statusTone = {
  ready: "success",
  demo: "warning",
  next: "muted"
} as const;

const statusIcon = {
  ready: CheckCircle2,
  demo: CircleDot,
  next: Clock3
};

export function BackendPipeline({
  title = "Backend Integration Pipeline",
  steps
}: {
  title?: string;
  steps?: PipelineStep[];
}) {
  const pipeline = steps || defaultPipeline;

  return (
    <Card className="border-ink/10">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge tone="warning">Demo-safe</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {pipeline.map((step, index) => {
          const Icon = statusIcon[step.status];
          return (
            <div key={step.label} className="grid gap-3 rounded-xl border border-ink/10 bg-paper p-4 sm:grid-cols-[32px_1fr_auto] sm:items-center">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-xs font-black text-ink">{index + 1}</span>
              <div>
                <p className="font-black text-ink">{step.label}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-ink/50">{step.detail}</p>
              </div>
              <Badge tone={statusTone[step.status]}>
                <Icon className="mr-1 h-3.5 w-3.5" />
                {step.status}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function ApiSurfaceCard() {
  return (
    <Card className="border-ink/10">
      <CardHeader>
        <CardTitle>API Surface</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {apiWorkflowPaths.map((endpoint) => (
          <div key={endpoint.path} className="flex items-center gap-3 rounded-xl border border-teal/15 bg-[#EAF8F4] px-4 py-3 font-mono text-xs font-black text-ink">
            <Route className="h-4 w-4 text-teal" />
            {endpoint.method} {endpoint.path}
          </div>
        ))}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-ink/10 bg-paper p-4">
            <Database className="h-5 w-5 text-teal" />
            <p className="mt-3 text-sm font-black text-ink">Views ready</p>
            <p className="text-xs font-semibold text-ink/50">summary, live sessions, alerts</p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-paper p-4">
            <ShieldCheck className="h-5 w-5 text-teal" />
            <p className="mt-3 text-sm font-black text-ink">RLS staged</p>
            <p className="text-xs font-semibold text-ink/50">role policies need expansion</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const defaultPipeline: PipelineStep[] = [
  {
    label: "Teacher starts session",
    detail: "/api/sessions/start writes attendance_sessions with teacher location and radius.",
    status: "ready"
  },
  {
    label: "QR token rotates",
    detail: "/api/sessions/[id]/rotate calls rotate_attendance_session_token().",
    status: "ready"
  },
  {
    label: "Student scans QR",
    detail: "/api/attendance/mark validates token, duplicate record, location, and device fingerprint.",
    status: "demo"
  },
  {
    label: "Realtime teacher counter",
    detail: "Teacher page subscribes to attendance_records once Supabase project is connected.",
    status: "next"
  },
  {
    label: "Reports and alerts",
    detail: "Views power student_attendance_summary and low_attendance_alerts.",
    status: "ready"
  }
];
