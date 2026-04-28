import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  Bell,
  CheckCircle2,
  Code2,
  Database,
  Download,
  Github,
  MapPin,
  Play,
  QrCode,
  ShieldCheck,
  Smartphone,
  Users,
  Zap
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { collegeConfig } from "../../college.config";

const featureCards = [
  {
    icon: QrCode,
    title: "Rotating QR Anti-Proxy",
    copy: "Rotates every 30 seconds, so shared screenshots become useless fast."
  },
  {
    icon: MapPin,
    title: "Geofence Validation",
    copy: "Students must scan inside the configured classroom radius."
  },
  {
    icon: Zap,
    title: "Real-Time Attendance",
    copy: "Teachers see students appear as they scan, without refreshing."
  },
  {
    icon: BarChart2,
    title: "Attendance Analytics",
    copy: "Subject trends, risk bands, and semester comparisons stay visible."
  },
  {
    icon: ShieldCheck,
    title: "Three-Layer Protection",
    copy: "QR rotation, geofence checks, and device fingerprinting work together."
  },
  {
    icon: Download,
    title: "One-Click Reports",
    copy: "Student certificates, class summaries, and department PDFs are ready to export."
  }
];

export default function LandingPage() {
  return (
    <main className="bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <BrandMark />
          <nav className="hidden items-center gap-8 text-sm font-bold text-ink/70 md:flex">
            <a href="#how">How It Works</a>
            <a href="#features">Features</a>
            <a href="#staff">For Staff</a>
          </nav>
          <Button asChild className="bg-teal hover:bg-teal/90">
            <Link href="/login">
              Student Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="bg-ink text-white">
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <Badge className="w-fit bg-citron text-ink ring-citron">Open-source QR attendance</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-normal leading-[0.98] text-white sm:text-7xl">
              Attendance that actually works.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Students scan a rotating QR from their seat. Teachers see who is present live. Reports, alerts, records - automatic.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm font-bold text-white/70">
              {["< 10 sec mark time", "30s QR rotation", "3-layer anti-proxy"].map((item) => (
                <span key={item} className="rounded-full border border-white/15 px-4 py-2">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-citron text-ink hover:bg-citron/90">
                <a href="#how">See How It Works</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                <Link href="/login">
                  Student Login
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-qr backdrop-blur">
              <div className="rounded-[1.5rem] bg-paper p-5 text-ink">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-coral" />
                    <span className="h-3 w-3 rounded-full bg-amber" />
                    <span className="h-3 w-3 rounded-full bg-teal" />
                  </div>
                  <span className="text-sm font-black">Live Session</span>
                </div>
                <div className="mt-5">
                  <p className="text-xl font-black">Mathematics - Section A</p>
                  <p className="text-sm font-semibold text-ink/50">Prof. Mehta - Room 201</p>
                </div>
                <div className="mx-auto mt-7 grid aspect-square max-w-[180px] place-items-center rounded-2xl bg-white p-4 shadow-qr">
                  <div className="grid h-full w-full grid-cols-9 gap-1">
                    {Array.from({ length: 81 }).map((_, index) => (
                      <span key={index} className={(index * 13 + index) % 5 < 2 ? "rounded-sm bg-black" : "rounded-sm bg-white"} />
                    ))}
                  </div>
                </div>
                <div className="mt-7">
                  <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wide text-ink/50">
                    <span>Refreshes</span>
                    <span>18s</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink/10">
                    <div className="h-full w-[62%] rounded-full bg-teal" />
                  </div>
                </div>
                <p className="mt-6 text-2xl font-black">23 / 48 students present</p>
                <div className="mt-4 space-y-2 overflow-hidden">
                  {["Arjun Mehta    09:04 AM", "Priya Nair     09:05 AM", "Rohan Das      09:06 AM"].map((name, index) => (
                    <div
                      key={name}
                      className="animate-live-name flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-ink/70"
                      style={{ animationDelay: `${index * 0.7}s` }}
                    >
                      <span className="h-2 w-2 rounded-full bg-present" />
                      <span className="font-mono">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-ink/10 bg-paper py-3">
        <div className="animate-marquee flex w-max gap-8 px-4 text-sm font-black uppercase tracking-wide text-ink/55">
          {[...["Open Source", "MIT License", "Supabase", "Vercel", "Mobile-First", "Anti-Proxy QR", "Free to deploy"], ...["Open Source", "MIT License", "Supabase", "Vercel", "Mobile-First", "Anti-Proxy QR", "Free to deploy"]].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-teal" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-wide text-teal">How it works</p>
          <h2 className="mt-3 text-4xl font-normal text-ink sm:text-5xl">Three portals. One clean attendance flow.</h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            { label: "Students", iconA: QrCode, a: "Teacher shows QR", iconB: Smartphone, b: "Scan from seat", iconC: CheckCircle2, c: "Recorded instantly" },
            { label: "Teachers", iconA: Play, a: "Select and start", iconB: QrCode, b: "QR refreshes", iconC: Users, c: "See live attendance" },
            { label: "HOD", iconA: BarChart2, a: "Dept overview", iconB: Bell, b: "Auto-alerts", iconC: Download, c: "One-click reports" }
          ].map((flow) => (
            <Card key={flow.label} className="border-ink/10 bg-white">
              <CardContent className="p-6">
                <span className="rounded-full bg-ink px-4 py-2 text-sm font-black text-white">{flow.label}</span>
                <div className="mt-7 space-y-4">
                  {[
                    { icon: flow.iconA, text: flow.a },
                    { icon: flow.iconB, text: flow.b },
                    { icon: flow.iconC, text: flow.c }
                  ].map((step) => (
                    <div key={step.text} className="flex items-center gap-3 rounded-xl bg-mist p-4">
                      <step.icon className="h-5 w-5 text-teal" />
                      <span className="font-black">{step.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-teal">Features</p>
              <h2 className="mt-3 text-4xl font-normal text-ink sm:text-5xl">Built to stop proxy attendance.</h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-6 text-ink/55">
              The product keeps the daily teacher workflow fast while giving the college stronger records and cleaner reporting.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature) => (
              <Card key={feature.title} className="border-ink/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal">
                <CardContent className="p-6">
                  <feature.icon className="h-8 w-8 text-teal" />
                  <h3 className="mt-5 text-xl font-black text-ink">{feature.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-ink/55">{feature.copy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="staff" className="mx-auto grid max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <Card className="border-ink bg-ink text-white">
          <CardContent className="p-8">
            <p className="text-sm font-black uppercase tracking-wide text-citron">Teacher portal</p>
            <h2 className="mt-4 text-4xl font-normal text-white">Built for how teachers actually teach.</h2>
            <ul className="mt-8 space-y-4 text-sm font-bold text-white/70">
              <li>Start a session in 2 taps</li>
              <li>QR displays full-screen for projectors</li>
              <li>Override any record with audit trail</li>
            </ul>
            <Button asChild className="mt-8 bg-citron text-ink hover:bg-citron/90">
              <Link href="/teacherlogin">Teacher Portal</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-ink/10 bg-paper">
          <CardContent className="p-8">
            <p className="text-sm font-black uppercase tracking-wide text-teal">HOD portal</p>
            <h2 className="mt-4 text-4xl font-normal text-ink">Department oversight, not chaos.</h2>
            <ul className="mt-8 space-y-4 text-sm font-bold text-ink/60">
              <li>All teacher sessions in one view</li>
              <li>Auto-alerts below threshold</li>
              <li>One-click department report</li>
            </ul>
            <Button asChild variant="outline" className="mt-8 border-ink/20">
              <Link href="/hodlogin">HOD Portal</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="bg-mist py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-normal text-ink sm:text-5xl">Free for any college. Open to improve.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-ink/60">
            MIT licensed. Vercel and Supabase free tiers are enough to start a practical single-college rollout.
          </p>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              { icon: Code2, title: "5-min setup" },
              { icon: Database, title: "Supabase included" },
              { icon: Github, title: "MIT License" }
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-ink/10 bg-white p-6">
                <item.icon className="mx-auto h-7 w-7 text-teal" />
                <p className="mt-4 font-black text-ink">{item.title}</p>
              </div>
            ))}
          </div>
          <Button asChild className="mt-8 bg-ink text-white hover:bg-ink/90">
            <Link href="https://github.com/dhrma-tech/college-qr-attendance">
              View on GitHub
              <Github className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-ink px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <h2 className="text-4xl font-normal sm:text-5xl">Ready to end proxy attendance?</h2>
        <p className="mt-4 text-white/60">Set up in minutes. Free for any college.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="bg-citron text-ink hover:bg-citron/90">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
            <Link href="https://github.com/dhrma-tech/college-qr-attendance/blob/codex/ai-platform-rebuild/SETUP.md">Read the docs</Link>
          </Button>
        </div>
      </section>

      <footer className="bg-ink px-4 pb-10 text-white/60 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 border-t border-white/10 pt-10 md:grid-cols-[1fr_1fr]">
          <div>
            <BrandMark inverse />
            <p className="mt-4 max-w-md text-sm">Smart QR attendance for one college, with clean portals for students, teachers, HODs, and admins.</p>
            <p className="mt-5 text-xs">MIT License. Copyright 2026 {collegeConfig.name}.</p>
          </div>
          <div className="grid gap-6 text-sm font-bold sm:grid-cols-2">
            <div className="space-y-3">
              <a href="#how" className="block">How It Works</a>
              <a href="#features" className="block">Features</a>
              <a href="#staff" className="block">For Staff</a>
            </div>
            <div className="space-y-3">
              <Link href="/login" className="block">Student Login</Link>
              <Link href="/teacherlogin" className="block">Teacher Portal</Link>
              <Link href="/hodlogin" className="block">HOD Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
