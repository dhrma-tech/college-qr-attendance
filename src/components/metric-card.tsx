import type { Metric } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const toneMap = {
  primary: "default",
  success: "success",
  warning: "warning",
  danger: "danger",
  neutral: "muted"
} as const;

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Card className="border-ink/10">
      <CardContent className="p-4 sm:p-5">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <p className="text-sm font-black text-ink/50">{metric.label}</p>
          <Badge tone={toneMap[metric.tone || "neutral"]}>{metric.tone || "live"}</Badge>
        </div>
        <div className="mt-4 break-words text-2xl font-black text-ink sm:text-3xl">{metric.value}</div>
        <p className="mt-2 text-sm font-semibold text-ink/50">{metric.detail}</p>
      </CardContent>
    </Card>
  );
}
