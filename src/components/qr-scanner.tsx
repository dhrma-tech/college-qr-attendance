"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QrScanner() {
  const router = useRouter();
  const reactId = useId();
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const containerId = `scanroll-reader-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [status, setStatus] = useState<"idle" | "starting" | "scanning" | "error">("idle");
  const [message, setMessage] = useState("Use your camera to scan the QR code shown by your teacher.");

  useEffect(() => {
    return () => {
      void stopScanner({ updateState: false });
    };
  }, []);

  async function startScanner() {
    setStatus("starting");
    setMessage("Requesting camera access...");

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        async (decodedText) => {
          await stopScanner();
          router.push(`/scan/${encodeURIComponent(extractToken(decodedText))}`);
        },
        () => undefined
      );

      setStatus("scanning");
      setMessage("Point your camera at the ScanRoll QR code.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Camera scanner could not be started.");
    }
  }

  async function stopScanner({ updateState = true }: { updateState?: boolean } = {}) {
    const scanner = scannerRef.current;
    scannerRef.current = null;

    try {
      if (scanner?.isScanning) {
        await scanner.stop();
      }

      await scanner?.clear();
    } catch {
      // Scanner teardown can fail if the camera permission prompt is closed mid-start.
    }

    if (updateState) {
      setStatus("idle");
      setMessage("Use your camera to scan the QR code shown by your teacher.");
    }
  }

  return (
    <Card className="border-teal/15">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Scan QR Attendance</CardTitle>
          <p className="mt-1 text-sm font-semibold text-ink/55">{message}</p>
        </div>
        {status === "scanning" ? (
          <Button type="button" variant="outline" onClick={() => void stopScanner()}>
            <Square className="h-4 w-4" />
            Stop
          </Button>
        ) : (
          <Button type="button" className="bg-teal hover:bg-teal/90" onClick={startScanner} disabled={status === "starting"}>
            <Camera className="h-4 w-4" />
            {status === "starting" ? "Starting..." : "Open Scanner"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div id={containerId} className="min-h-[280px] overflow-hidden rounded-2xl border border-ink/10 bg-[#EAF8F4]" />
      </CardContent>
    </Card>
  );
}

function extractToken(decodedText: string) {
  try {
    const url = new URL(decodedText);
    const parts = url.pathname.split("/").filter(Boolean);
    const scanIndex = parts.indexOf("scan");
    if (scanIndex >= 0 && parts[scanIndex + 1]) return parts[scanIndex + 1];
  } catch {
    return decodedText;
  }

  return decodedText;
}
