"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Clock3, Info, Loader2, LogIn, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hasSupabasePublicEnv } from "@/lib/public-env";

type ScanState = "loading" | "success" | "already" | "expired" | "location" | "login" | "error";

const stateCopy: Record<ScanState, { icon: typeof CheckCircle2; title: string; detail: string; meta: string; tone: string; action: string; href: string }> = {
  loading: {
    icon: Loader2,
    title: "Verifying QR",
    detail: "Checking session token and student account.",
    meta: "Keep this page open for a moment.",
    tone: "bg-teal text-white",
    action: "Dashboard",
    href: "/dashboard"
  },
  success: {
    icon: CheckCircle2,
    title: "Attendance Marked",
    detail: "Your attendance was recorded for this session.",
    meta: "Redirecting to your dashboard in 3 seconds.",
    tone: "bg-present text-white",
    action: "View My Attendance",
    href: "/dashboard"
  },
  already: {
    icon: Info,
    title: "Already Marked",
    detail: "Your attendance was already recorded for this class.",
    meta: "No duplicate record was created.",
    tone: "bg-amber text-ink",
    action: "View My Attendance",
    href: "/dashboard"
  },
  expired: {
    icon: Clock3,
    title: "Session Closed",
    detail: "This QR token is invalid or has expired.",
    meta: "Ask your teacher if this is unexpected.",
    tone: "bg-coral text-white",
    action: "Back to Dashboard",
    href: "/dashboard"
  },
  location: {
    icon: MapPin,
    title: "Attendance Flagged",
    detail: "Your scan was recorded but flagged for teacher review.",
    meta: "Location accuracy can vary indoors.",
    tone: "bg-amber text-ink",
    action: "View My Attendance",
    href: "/dashboard"
  },
  login: {
    icon: LogIn,
    title: "Please Sign In",
    detail: "You need a student account before attendance can be marked.",
    meta: "After login, scan the QR code again.",
    tone: "bg-teal text-white",
    action: "Sign In",
    href: "/login"
  },
  error: {
    icon: AlertCircle,
    title: "Unable To Mark",
    detail: "The attendance request could not be completed.",
    meta: "Try again or contact your teacher.",
    tone: "bg-coral text-white",
    action: "Back to Dashboard",
    href: "/dashboard"
  }
};

export function ScanAttendanceClient({ token }: { token: string }) {
  const router = useRouter();
  const [state, setState] = useState<ScanState>("loading");
  const [message, setMessage] = useState("");
  const copy = stateCopy[state];
  const Icon = copy.icon;
  const iconClassName = useMemo(() => `mx-auto grid h-20 w-20 place-items-center rounded-full ${copy.tone}`, [copy.tone]);

  useEffect(() => {
    let cancelled = false;

    async function submitScan() {
      setState("loading");

      if (!hasSupabasePublicEnv()) {
        const session = window.localStorage.getItem("scanroll-session") || window.localStorage.getItem("college-qr-demo-session");
        if (!session) {
          setState("login");
          return;
        }
      }

      const position = await getCurrentPosition();
      const response = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          latitude: position?.coords.latitude,
          longitude: position?.coords.longitude,
          deviceFingerprint: await getDeviceFingerprint()
        })
      });

      const result = await response.json();

      if (cancelled) return;

      if (response.status === 401) {
        setState("login");
        return;
      }

      if (!response.ok) {
        setMessage(result.error || "Unable to complete attendance scan.");
        setState(response.status === 400 ? "expired" : "error");
        return;
      }

      const payload = result.data || result;
      const status = payload.status || payload.data?.status;

      if (status === "already") setState("already");
      else if (status === "expired") setState("expired");
      else if (status === "flagged") setState("location");
      else setState("success");
    }

    submitScan().catch((error) => {
      if (!cancelled) {
        setMessage(error instanceof Error ? error.message : "Unable to complete attendance scan.");
        setState("error");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (state !== "success") return;
    const timeout = window.setTimeout(() => router.push("/dashboard"), 3000);
    return () => window.clearTimeout(timeout);
  }, [router, state]);

  return (
    <main className={`grid min-h-screen place-items-center px-4 py-8 ${copy.tone}`}>
      <Card className="w-full max-w-md border-white/20 bg-white text-ink shadow-soft">
        <CardContent className="p-7 text-center">
          <div className={iconClassName}>
            <Icon className={`h-11 w-11 ${state === "loading" ? "animate-spin" : ""}`} />
          </div>
          <h1 className="mt-6 text-4xl font-normal text-ink">{copy.title}</h1>
          <p className="mt-4 text-lg font-black text-ink">{copy.detail}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink/55">{message || copy.meta}</p>
          {state === "expired" && (
            <div className="mt-5 rounded-xl bg-coral/10 p-3 text-left text-sm font-semibold text-ink/60">
              <AlertCircle className="mr-2 inline h-4 w-4 text-coral" />
              Expired QR tokens cannot be reused.
            </div>
          )}
          {state !== "loading" && (
            <Button asChild className="mt-7 w-full border border-teal/15 bg-[#EAF8F4] text-ink hover:bg-[#dff4ef]">
              <Link href={state === "login" ? `/login?redirect=/scan/${encodeURIComponent(token)}` : copy.href}>{copy.action}</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function getCurrentPosition(): Promise<GeolocationPosition | null> {
  if (!("geolocation" in navigator)) return Promise.resolve(null);

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), {
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 30000
    });
  });
}

async function getDeviceFingerprint() {
  const source = [navigator.userAgent, navigator.language, Intl.DateTimeFormat().resolvedOptions().timeZone, `${screen.width}x${screen.height}`].join("|");
  const bytes = new TextEncoder().encode(source);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
