import Link from "next/link";
import { ArrowRight, CheckCircle2, Github, QrCode, ShieldCheck, Smartphone, Users } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { landingStats } from "@/lib/mock-data";
import { collegeConfig } from "../../college.config";

export default function LandingPage() {
  return (
    <main>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <BrandMark />
          <Button asChild>
            <Link href="/login">Student Login</Link>
          </Button>
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <Badge className="w-fit">Single-college QR attendance</Badge>
          <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-tight text-slate-950 sm:text-6xl">
            Smart Attendance, Zero Proxies
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {collegeConfig.name} gets fast QR marking, realtime teacher visibility, low-attendance alerts, and clean admin control in one secure campus system.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login">
                Login
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/teacherlogin">Teacher Portal</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Live QR Session</span>
              <Badge tone="success">Active</Badge>
            </div>
            <div className="mx-auto mt-8 grid aspect-square max-w-[360px] place-items-center rounded-3xl bg-white p-7">
              <div className="grid h-full w-full grid-cols-7 gap-2">
                {Array.from({ length: 49 }).map((_, index) => (
                  <span key={index} className={(index * 11) % 4 === 0 ? "rounded-sm bg-slate-950" : "rounded-sm bg-slate-200"} />
                ))}
              </div>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-2xl font-bold">42</p>
                <p className="text-xs text-slate-300">Present</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-2xl font-bold">18s</p>
                <p className="text-xs text-slate-300">Token</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-2xl font-bold">100m</p>
                <p className="text-xs text-slate-300">Radius</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          { icon: QrCode, title: "QR-based marking", detail: "Teacher starts a session and displays a high-contrast rotating QR." },
          { icon: Smartphone, title: "Mobile scan flow", detail: "Students scan, confirm location, and get a clear result in seconds." },
          { icon: ShieldCheck, title: "Anti-proxy checks", detail: "Expired tokens, duplicate scans, geofence mismatch, and device reuse are flagged." }
        ].map((feature) => (
          <Card key={feature.title}>
            <CardContent className="p-6">
              <feature.icon className="h-8 w-8 text-primary" />
              <h2 className="mt-5 text-xl font-bold text-slate-950">{feature.title}</h2>
              <p className="mt-2 text-slate-500">{feature.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Users, title: "Teacher starts session" },
              { icon: QrCode, title: "Student scans QR" },
              { icon: CheckCircle2, title: "Record updates instantly" }
            ].map((step, index) => (
              <div key={step.title} className="rounded-xl border border-slate-200 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-primary">{index + 1}</div>
                <step.icon className="mt-6 h-7 w-7 text-primary" />
                <h3 className="mt-4 text-lg font-bold text-slate-950">{step.title}</h3>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-4 rounded-2xl bg-slate-950 p-6 text-white md:grid-cols-3">
            {landingStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>{collegeConfig.name} · Open-source attendance infrastructure</span>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="font-semibold text-slate-600">
              Admin
            </Link>
            <Link href="https://github.com/dhrma-tech/college-qr-attendance" className="inline-flex items-center gap-2 font-semibold text-slate-600">
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
