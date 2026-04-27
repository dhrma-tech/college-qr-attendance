"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
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
                  active ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Button asChild variant="ghost" className="absolute bottom-5 left-4 right-4 justify-start">
          <Link href="/">
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </Button>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-950 sm:text-2xl">{title}</h1>
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
            <Button size="sm" variant="outline">
              Export
            </Button>
          </div>
        </header>
        <main className="px-4 py-6 pb-24 lg:px-8">{children}</main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white px-2 py-2 shadow-lg lg:hidden">
        {nav.slice(0, 4).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold",
                active ? "bg-blue-50 text-primary" : "text-slate-500"
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
