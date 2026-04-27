"use client";

import Link from "next/link";
import { Eye, Lock, Mail } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Role } from "@/lib/types";

const labels: Record<Role, { title: string; detail: string; target: string }> = {
  student: { title: "Student Login", detail: "Access your attendance, schedule, and subject records.", target: "/dashboard" },
  teacher: { title: "Teacher Portal", detail: "Start QR sessions and manage class attendance.", target: "/teacher/dashboard" },
  hod: { title: "Head of Department Portal", detail: "Monitor department health and low-attendance alerts.", target: "/hod/dashboard" },
  admin: { title: "Admin Panel", detail: "Configure college data, users, timetable, and audit logs.", target: "/admin/dashboard" }
};

export function LoginCard({ role }: { role: Role }) {
  const copy = labels[role];

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-[420px] shadow-soft">
        <CardContent className="p-7">
          <div className="mb-8 flex justify-center">
            <BrandMark />
          </div>
          <div className="mb-6 text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">{copy.title}</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">{copy.detail}</p>
          </div>
          <form className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Email address</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input className="pl-10" autoFocus type="email" placeholder="name@college.edu" />
              </span>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input className="pl-10 pr-10" type="password" placeholder="Enter password" />
                <button type="button" className="absolute right-3 top-3 text-slate-400" aria-label="Show password">
                  <Eye className="h-5 w-5" />
                </button>
              </span>
            </label>
            <div className="flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="font-semibold text-primary">
                Forgot password?
              </Link>
              {role === "student" && (
                <Link href="/register" className="font-semibold text-slate-600">
                  Register
                </Link>
              )}
            </div>
            <Button asChild className="w-full">
              <Link href={copy.target}>Continue</Link>
            </Button>
          </form>
          <Link href="/" className="mt-6 block text-center text-sm font-semibold text-slate-500">
            Back to college site
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
