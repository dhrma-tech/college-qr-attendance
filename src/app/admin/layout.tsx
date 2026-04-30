"use client";

import { PortalShell } from "@/components/portal-shell";
import { adminNav } from "@/lib/mock-data";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell nav={adminNav} title="Admin Panel" subtitle="College configuration, users, timetable, backups, and audit logs.">
      {children}
    </PortalShell>
  );
}
