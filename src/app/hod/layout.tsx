"use client";

import { PortalShell } from "@/components/portal-shell";
import { hodNav } from "@/lib/mock-data";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell nav={hodNav} title="HOD Portal" subtitle="Department-wide attendance health, alerts, and reports.">
      {children}
    </PortalShell>
  );
}
