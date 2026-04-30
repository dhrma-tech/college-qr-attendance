"use client";

import Link from "next/link";
import { QrCode } from "lucide-react";
import { collegeConfig } from "../../college.config";
import { cn } from "@/lib/utils";

export function BrandMark({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-3">
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm", inverse ? "bg-citron text-ink" : "bg-teal text-white")}>
        <QrCode className="h-6 w-6" />
      </span>
      {!compact && (
        <span className="min-w-0 leading-tight">
          <span className={cn("block truncate text-sm font-black", inverse ? "text-white" : "text-ink")}>{collegeConfig.name}</span>
          <span className={cn("block text-xs font-bold", inverse ? "text-white/55" : "text-ink/50")}>QR Code Attendance System</span>
        </span>
      )}
    </Link>
  );
}
