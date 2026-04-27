"use client";

import { PortalShell } from "@/components/portal-shell";
import { teacherNav } from "@/lib/mock-data";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell nav={teacherNav} title="Teacher Portal" subtitle="Start sessions, watch scans live, and manage class records.">
      {children}
    </PortalShell>
  );
}
