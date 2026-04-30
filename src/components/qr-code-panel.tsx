"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { ChevronUp, Flag, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const scannedStudents = [
  { name: "Arjun Mehta", roll: "CSE-501", time: "09:04 AM", flagged: false },
  { name: "Priya Nair", roll: "CSE-518", time: "09:05 AM", flagged: false },
  { name: "Rohan Das", roll: "CSE-542", time: "09:06 AM", flagged: true }
];

export function QrCodePanel({ token: sessionId }: { token: string }) {
  const [token, setToken] = useState(sessionId);
  const [src, setSrc] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function rotateToken() {
      try {
        const response = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/rotate`, { method: "POST" });
        const result = await response.json();
        const payload = result.data || result;
        const nextToken = payload.qrToken || payload.qr_token;

        if (!cancelled && nextToken) {
          setToken(String(nextToken));
        }
      } catch {
        if (!cancelled) setToken(sessionId);
      }
    }

    rotateToken();
    const interval = window.setInterval(rotateToken, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [sessionId]);

  useEffect(() => {
    setSrc("");
    QRCode.toDataURL(`${window.location.origin}/scan/${token}`, {
      margin: 1,
      width: 420,
      color: { dark: "#000000", light: "#FFFFFF" }
    }).then(setSrc);
  }, [token]);

  return (
    <div className="min-h-screen bg-[#EAF8F4] text-ink">
      <header className="flex flex-col gap-2 border-b border-ink/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <h1 className="text-lg font-black">Mathematics - Section A</h1>
          <p className="text-xs font-semibold text-ink/50">Prof. Mehta - Tue 28 Apr - Room 201</p>
        </div>
        <p className="font-mono text-sm font-black text-teal">00:18:42</p>
      </header>

      <main className="grid min-h-[calc(100svh-148px)] place-items-center px-4 py-6 sm:px-5 sm:py-8">
        <div className="w-full max-w-4xl text-center">
          <div className="mx-auto grid h-[min(82vw,420px)] min-h-[240px] w-[min(82vw,420px)] min-w-[240px] place-items-center rounded-2xl border-8 border-white bg-white p-4 shadow-qr sm:p-5">
            {src ? (
              <Image
                src={src}
                alt="Attendance QR code"
                width={420}
                height={420}
                className="h-full w-full opacity-100 transition-opacity duration-500"
                unoptimized
                priority
              />
            ) : (
              <div className="text-sm font-black text-ink/50">Generating QR...</div>
            )}
          </div>

          <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-1">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} className={`h-2 flex-1 rounded-full ${index < 9 ? "bg-teal" : "bg-white/70"}`} />
            ))}
          </div>
          <p className="mt-2 text-sm font-black text-ink/60">Refreshes in 18s</p>
          <p className="mt-8 text-3xl font-black text-teal sm:text-4xl">38 / 48 students present</p>
        </div>
      </main>

      <section className="border-t border-ink/10 bg-white px-4 py-4 text-ink sm:px-5">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Button variant="outline" className="border-ink/15">
            <ChevronUp className="h-4 w-4" />
            View Students
          </Button>
          <div className="grid w-full gap-2 md:min-w-[420px]">
            {scannedStudents.map((student) => (
              <div key={student.roll} className="flex items-center justify-between rounded-xl border border-ink/10 bg-paper px-3 py-2 text-sm">
                <div>
                  <p className="font-black">{student.name}</p>
                  <p className="font-mono text-xs font-bold text-ink/45">{student.roll} - {student.time}</p>
                </div>
                {student.flagged ? <Flag className="h-4 w-4 text-coral" /> : <span className="h-3 w-3 rounded-full bg-present" />}
              </div>
            ))}
          </div>
          <Button variant="danger">
            <XCircle className="h-4 w-4" />
            End Session
          </Button>
        </div>
      </section>
    </div>
  );
}
