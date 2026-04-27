"use client";

import { PortalShell } from "@/components/portal-shell";
import { studentNav } from "@/lib/mock-data";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell nav={studentNav} title="Student Dashboard" subtitle="Your attendance, timetable, and subject health.">
      {children}
    </PortalShell>
  );
}
