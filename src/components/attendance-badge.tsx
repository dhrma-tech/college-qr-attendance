import { Badge } from "@/components/ui/badge";

export function AttendanceBadge({ percentage, threshold = 75 }: { percentage: number; threshold?: number }) {
  const tone = percentage >= threshold ? "success" : percentage >= 60 ? "warning" : "danger";
  const label = percentage >= threshold ? "Healthy" : percentage >= 60 ? "Watch" : "Critical";

  return (
    <Badge tone={tone}>
      {percentage}% - {label}
    </Badge>
  );
}
