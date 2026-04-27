"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { getQrExpiryLabel } from "@/lib/attendance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function QrCodePanel({ token }: { token: string }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    QRCode.toDataURL(`${window.location.origin}/scan/${token}`, {
      margin: 1,
      width: 420,
      color: { dark: "#0f172a", light: "#ffffff" }
    }).then(setSrc);
  }, [token]);

  return (
    <div className="grid min-h-screen bg-slate-950 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Database Management Systems</h1>
          <p className="text-sm text-slate-300">CSE 5A · Lab 204 · Session elapsed 00:18:42</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">42 / 58</p>
          <p className="text-sm text-slate-300">students present</p>
        </div>
      </div>
      <main className="grid place-items-center px-6 py-10">
        <div className="text-center">
          <div className="mx-auto grid h-[min(72vw,520px)] w-[min(72vw,520px)] place-items-center rounded-[2rem] bg-white p-6 shadow-soft">
            {src ? (
              <Image src={src} alt="Attendance QR code" width={420} height={420} className="h-full w-full" unoptimized />
            ) : (
              <div className="text-slate-500">Generating QR...</div>
            )}
          </div>
          <p className="mt-6 text-lg font-semibold">{getQrExpiryLabel()}</p>
          <p className="mt-2 text-sm text-slate-300">Ask students to scan with their phone camera and allow location access.</p>
        </div>
      </main>
      <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
        <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
          View Students
        </Button>
        <Badge tone="success">Realtime ready</Badge>
        <Button variant="danger">End Session</Button>
      </div>
    </div>
  );
}
