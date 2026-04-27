import Link from "next/link";
import { CheckCircle2, MapPin, ShieldAlert } from "lucide-react";
import { validateScanToken } from "@/lib/attendance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Page({ params }: { params: { token: string } }) {
  const result = validateScanToken(params.token);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-soft">
        <CardContent className="p-7 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-success">
            {result.ok ? <CheckCircle2 className="h-9 w-9" /> : <ShieldAlert className="h-9 w-9 text-danger" />}
          </div>
          <Badge className="mt-5" tone={result.ok ? "success" : "danger"}>
            {result.ok ? "Attendance marked" : "Scan failed"}
          </Badge>
          <h1 className="mt-4 text-2xl font-bold text-slate-950">{result.subject}</h1>
          <p className="mt-2 text-slate-500">{result.message}</p>
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-slate-950">Location verification ready</p>
                <p className="text-sm text-slate-500">Live Supabase validation will compare student GPS with the teacher session radius.</p>
              </div>
            </div>
          </div>
          <Button asChild className="mt-6 w-full">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
