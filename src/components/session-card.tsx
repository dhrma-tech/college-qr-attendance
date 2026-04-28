import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function SessionCard({
  subject,
  teacher,
  present,
  total,
  href = "/teacher/attendance/demo-session"
}: {
  subject: string;
  teacher: string;
  present: number;
  total: number;
  href?: string;
}) {
  const percentage = Math.round((present / total) * 100);

  return (
    <Card className="border-ink/10">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-coral" />
              <Badge tone="danger">Live</Badge>
            </div>
            <h3 className="mt-4 font-black text-ink">{subject}</h3>
            <p className="mt-1 text-sm font-semibold text-ink/55">{teacher}</p>
          </div>
          <Link href={href} className="rounded-full border border-teal/15 bg-[#EAF8F4] p-2 text-ink" aria-label={`View ${subject}`}>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 flex items-center justify-between text-sm font-black text-ink/65">
          <span>{present} / {total}</span>
          <span>{percentage}%</span>
        </div>
        <Progress value={percentage} className="mt-2" />
      </CardContent>
    </Card>
  );
}
