import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock3, Info, LogIn, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const states = {
  success: {
    icon: CheckCircle2,
    title: "Attendance Marked",
    detail: "Mathematics - Section A",
    meta: "Prof. Mehta - Tue 28 Apr - 09:23 AM",
    tone: "bg-present text-white",
    action: "View My Attendance",
    href: "/dashboard"
  },
  already: {
    icon: Info,
    title: "Already Marked",
    detail: "You marked attendance for this class at 09:23 AM.",
    meta: "No duplicate record was created.",
    tone: "bg-amber text-ink",
    action: "View My Attendance",
    href: "/dashboard"
  },
  expired: {
    icon: Clock3,
    title: "Session Closed",
    detail: "This QR has expired. Session ended at 09:45 AM.",
    meta: "Ask your teacher if this is unexpected.",
    tone: "bg-coral text-white",
    action: "Back to Dashboard",
    href: "/dashboard"
  },
  location: {
    icon: MapPin,
    title: "Location Failed",
    detail: "Your attendance has been flagged for teacher review.",
    meta: "GPS can vary indoors, so this is not auto-rejected.",
    tone: "bg-amber text-ink",
    action: "View My Attendance",
    href: "/dashboard"
  },
  login: {
    icon: LogIn,
    title: "Please Sign In",
    detail: "You need to sign in before attendance can be marked.",
    meta: "You will return to this scan after login.",
    tone: "bg-teal text-white",
    action: "Sign In",
    href: "/login"
  }
};

export default function Page({ params }: { params: { token: string } }) {
  const key = pickState(params.token);
  const state = states[key];

  return (
    <main className={`grid min-h-screen place-items-center px-4 py-8 ${state.tone}`}>
      <Card className="w-full max-w-md border-white/20 bg-white text-ink shadow-soft">
        <CardContent className="p-7 text-center">
          <div className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${state.tone}`}>
            <state.icon className="h-11 w-11" />
          </div>
          <h1 className="mt-6 text-4xl font-normal text-ink">{state.title}</h1>
          <p className="mt-4 text-lg font-black text-ink">{state.detail}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink/55">{state.meta}</p>
          {key === "success" && <p className="mt-5 text-xs font-black uppercase tracking-wide text-teal">Redirecting in 3...</p>}
          {key === "expired" && (
            <div className="mt-5 rounded-xl bg-coral/10 p-3 text-left text-sm font-semibold text-ink/60">
              <AlertCircle className="mr-2 inline h-4 w-4 text-coral" />
              Expired QR tokens cannot be reused.
            </div>
          )}
          <Button asChild className="mt-7 w-full border border-teal/15 bg-[#EAF8F4] text-ink hover:bg-[#dff4ef]">
            <Link href={state.href}>{state.action}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

function pickState(token: string): keyof typeof states {
  if (token.includes("already")) return "already";
  if (token.includes("expired")) return "expired";
  if (token.includes("location")) return "location";
  if (token.includes("login")) return "login";
  return "success";
}
