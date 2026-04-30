import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AlertBanner({ subjects }: { subjects: Array<{ name: string; percentage: number }> }) {
  if (!subjects.length) return null;

  return (
    <div className="rounded-xl border border-coral/30 bg-coral/10 p-4 shadow-alert">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-coral" />
          <div>
            <p className="font-black text-ink">Below 75% attendance</p>
            <p className="mt-1 text-sm font-semibold text-ink/60">
              {subjects.map((subject) => `${subject.name} (${subject.percentage}%)`).join(", ")}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="border-coral/30 bg-white">
          <Link href="/dashboard/subjects">
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
