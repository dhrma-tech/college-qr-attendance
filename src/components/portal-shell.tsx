"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Radio } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/types";

export function PortalShell({
  nav,
  title,
  subtitle,
  children
}: {
  nav: NavItem[];
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const widget = getSidebarWidget(pathname);

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-ink/10 bg-white px-4 py-5 lg:block">
        <BrandMark />
        <nav className="mt-8 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                  active ? "bg-teal text-white" : "text-ink/60 hover:bg-mist hover:text-ink"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 space-y-3">
          <div className="rounded-xl border border-ink/10 bg-paper p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-teal">
              <Radio className="h-4 w-4" />
              {widget.kicker}
            </div>
            <p className="mt-2 text-sm font-black text-ink">{widget.title}</p>
            <p className="mt-1 text-xs font-semibold text-ink/50">{widget.detail}</p>
          </div>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/">
              <LogOut className="h-4 w-4" />
              Sign out
            </Link>
          </Button>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-ink sm:text-2xl">{title}</h1>
              <p className="text-sm font-semibold text-ink/50">{subtitle}</p>
            </div>
            <Button size="sm" variant="outline">
              Export
            </Button>
          </div>
        </header>
        <main className="px-4 py-6 pb-24 lg:px-8">{children}</main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-ink/10 bg-white px-2 py-2 shadow-lg lg:hidden">
        {nav.slice(0, 4).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold",
                active ? "bg-mist text-teal" : "text-ink/45"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function getSidebarWidget(pathname: string) {
  if (pathname.startsWith("/teacher")) {
    return { kicker: "Live", title: "1 session running", detail: "Operating Systems - CSE 3A" };
  }
  if (pathname.startsWith("/hod")) {
    return { kicker: "Alerts", title: "3 unreviewed alerts", detail: "2 critical, 1 watchlist" };
  }
  if (pathname.startsWith("/admin")) {
    return { kicker: "System", title: "Last backup 02:00", detail: "Supabase connection ready" };
  }
  return { kicker: "Next class", title: "Physics - 11:00 AM", detail: "Lab 3 - Scan opens in class" };
}
