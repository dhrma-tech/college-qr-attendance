"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "How It Works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Portals", href: "#portals" },
  { label: "For Staff", href: "#staff" }
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const nextY = window.scrollY;
      setHidden(nextY > 96 && nextY > lastY);
      lastY = nextY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur transition-transform duration-300",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="mx-auto flex max-w-[110rem] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-10 2xl:px-12">
        <div className="min-w-0">
          <BrandMark />
        </div>
        <nav className="hidden items-center gap-8 text-sm font-bold text-ink/70 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-teal">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button asChild className="bg-teal hover:bg-teal/90">
            <Link href="/login">
              Student Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <button
          type="button"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-ink/10 bg-white text-ink md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-[#EAF8F4]/85 backdrop-blur-sm md:hidden">
          <div className="ml-auto flex h-full w-[min(92vw,380px)] flex-col bg-paper p-4 shadow-soft sm:p-5">
            <div className="flex items-center justify-between">
              <BrandMark />
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-lg border border-ink/10 bg-white"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-8 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-white px-4 py-4 text-base font-black text-ink"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <Button asChild className="mt-6 w-full bg-teal hover:bg-teal/90">
              <Link href="/login">
                Student Login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <div className="mt-auto rounded-xl border border-ink/10 bg-white p-4 text-sm font-bold text-ink/55">
              <p className="font-black text-ink">Staff Portal</p>
              <div className="mt-3 flex gap-4">
                <Link href="/teacherlogin" className="text-teal">
                  Teacher
                </Link>
                <Link href="/hodlogin" className="text-teal">
                  HOD
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
