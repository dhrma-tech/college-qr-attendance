"use client";

import Link from "next/link";
import { QrCode } from "lucide-react";
import { collegeConfig } from "../../college.config";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
        <QrCode className="h-6 w-6" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-sm font-bold text-slate-950">{collegeConfig.name}</span>
          <span className="block text-xs font-medium text-slate-500">QR Attendance</span>
        </span>
      )}
    </Link>
  );
}
