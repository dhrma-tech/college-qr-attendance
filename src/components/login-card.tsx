"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, MapPinned, QrCode, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { demoCredentials, validateDemoCredential } from "@/lib/demo-credentials";
import type { Role } from "@/lib/types";

const labels: Record<Role, { title: string; detail: string; target: string; sideTitle: string; sideDetail: string }> = {
  student: {
    title: "Student Login",
    detail: "Access your attendance, schedule, and subject records.",
    target: "/dashboard",
    sideTitle: "Track your attendance. Anywhere.",
    sideDetail: "Scan live QR sessions, see subject risk, and keep your attendance record ready."
  },
  teacher: {
    title: "Teacher Portal",
    detail: "Start QR sessions and manage class attendance.",
    target: "/teacher/dashboard",
    sideTitle: "Run attendance without slowing class.",
    sideDetail: "Start a session, project the QR, and watch students appear in real time."
  },
  hod: {
    title: "Head of Department Portal",
    detail: "Monitor department health and low-attendance alerts.",
    target: "/hod/dashboard",
    sideTitle: "Department oversight, finally organized.",
    sideDetail: "Review teachers, at-risk students, alerts, and reports from one calm dashboard."
  },
  admin: {
    title: "Admin Panel",
    detail: "Configure college data, users, timetable, and audit logs.",
    target: "/admin/dashboard",
    sideTitle: "One college. One clean control room.",
    sideDetail: "Manage departments, users, subjects, timetable, and attendance rules."
  }
};

const signupHref: Partial<Record<Role, string>> = {
  student: "/register",
  teacher: "/teacher/register",
  hod: "/hod/register"
};

export function LoginCard({ role }: { role: Role }) {
  const copy = labels[role];
  const router = useRouter();
  const demo = demoCredentials[role];
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(demo.email);
  const [password, setPassword] = useState(demo.password);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!validateDemoCredential(role, email, password)) {
      setIsSubmitting(false);
      setError(`Use the ${copy.title.toLowerCase()} demo credentials shown below.`);
      return;
    }

    window.localStorage.setItem(
      "college-qr-demo-session",
      JSON.stringify({
        role,
        name: demo.name,
        email: demo.email,
        signedInAt: new Date().toISOString()
      })
    );
    router.push(copy.target);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4 py-10">
      <Card className="w-full max-w-5xl overflow-hidden border-ink/10 shadow-soft">
        <CardContent className="grid p-0 lg:grid-cols-[1fr_0.85fr]">
          <section className="bg-[#EAF8F4] p-8 text-ink sm:p-10">
            <BrandMark />
            <div className="mt-16 max-w-md">
              <p className="text-sm font-black uppercase tracking-wide text-teal">{copy.title}</p>
              <h1 className="mt-4 text-4xl font-normal leading-tight text-ink sm:text-5xl">{copy.sideTitle}</h1>
              <p className="mt-5 text-sm font-semibold leading-7 text-ink/60">{copy.sideDetail}</p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: QrCode, text: "Rotating QR sessions" },
                { icon: MapPinned, text: "Location-aware scans" },
                { icon: ShieldCheck, text: "Role-protected access" }
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 rounded-xl border border-teal/15 bg-white/60 p-4 text-sm font-bold text-ink/70 shadow-sm">
                  <item.icon className="h-5 w-5 text-teal" />
                  {item.text}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 sm:p-10">
            <div className="mb-8 lg:hidden">
              <BrandMark />
            </div>
            <div className="mb-7">
              <p className="text-sm font-black uppercase tracking-wide text-teal">{copy.title}</p>
              <h2 className="mt-2 text-3xl font-normal text-ink">Welcome back</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-ink/55">{copy.detail}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-black text-ink">Email address</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-ink/35" />
                  <Input
                    className="border-ink/15 pl-10"
                    autoFocus
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="name@college.edu"
                  />
                </span>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-black text-ink">Password</span>
                <span className="relative block">
                  <Lock className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-ink/35" />
                  <Input
                    className="border-ink/15 pl-10 pr-10"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-3 text-ink/40"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </span>
              </label>
              <div className="flex items-center justify-end text-xs">
                <Link href="/forgot-password" className="font-black text-teal">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="rounded-xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm font-bold text-coral" role="alert">
                  {error}
                </div>
              )}

              <div className="rounded-xl border border-teal/15 bg-teal/5 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-teal">Local demo credential</p>
                <div className="mt-3 grid gap-2 text-sm font-semibold text-ink/70">
                  <p>
                    Email: <span className="font-mono font-black text-ink">{demo.email}</span>
                  </p>
                  <p>
                    Password: <span className="font-mono font-black text-ink">{demo.password}</span>
                  </p>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-teal hover:bg-teal/90">
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm font-semibold text-ink/50">
              {signupHref[role] ? "Need an account? " : "Admin accounts are created internally. "}
              {signupHref[role] && (
                <Link href={signupHref[role]} className="font-black text-teal">
                  Request signup
                </Link>
              )}
            </p>
            {role === "student" && (
              <p className="mt-3 text-center text-sm font-semibold text-ink/50">
                Are you staff?{" "}
                <Link href="/teacherlogin" className="font-black text-teal">
                  Staff Login
                </Link>
              </p>
            )}
            <Link href="/" className="mt-4 block text-center text-sm font-black text-ink/45">
              Back to college site
            </Link>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
