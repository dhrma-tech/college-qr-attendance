"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, MapPinned, QrCode, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export function LoginCard({ role }: { role: Role }) {
  const copy = labels[role];
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4 py-10">
      <Card className="w-full max-w-5xl overflow-hidden border-ink/10 shadow-soft">
        <CardContent className="grid p-0 lg:grid-cols-[1fr_0.85fr]">
          <section className="bg-ink p-8 text-white sm:p-10">
            <BrandMark inverse />
            <div className="mt-16 max-w-md">
              <p className="text-sm font-black uppercase tracking-wide text-citron">{copy.title}</p>
              <h1 className="mt-4 text-4xl font-normal leading-tight text-white sm:text-5xl">{copy.sideTitle}</h1>
              <p className="mt-5 text-sm font-semibold leading-7 text-white/60">{copy.sideDetail}</p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: QrCode, text: "Rotating QR sessions" },
                { icon: MapPinned, text: "Location-aware scans" },
                { icon: ShieldCheck, text: "Role-protected access" }
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-bold text-white/75">
                  <item.icon className="h-5 w-5 text-citron" />
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
            <form className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-black text-ink">Email address</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-ink/35" />
                  <Input className="border-ink/15 pl-10" autoFocus type="email" autoComplete="email" placeholder="name@college.edu" />
                </span>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-black text-ink">Password</span>
                <span className="relative block">
                  <Lock className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-ink/35" />
                  <Input
                    className="border-ink/15 pl-10 pr-10"
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
              <Button asChild className="w-full bg-teal hover:bg-teal/90">
                <Link href={copy.target}>Sign In</Link>
              </Button>
            </form>
            <p className="mt-6 text-center text-sm font-semibold text-ink/50">
              {role === "student" ? "Are you a teacher or HOD? " : "Wrong portal? "}
              <Link href={role === "student" ? "/teacherlogin" : "/login"} className="font-black text-teal">
                {role === "student" ? "Staff Login" : "Student Login"}
              </Link>
            </p>
            <Link href="/" className="mt-4 block text-center text-sm font-black text-ink/45">
              Back to college site
            </Link>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
