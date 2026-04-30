"use client";

import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadButton({
  label = "Download PDF",
  format = "pdf"
}: {
  label?: string;
  format?: "pdf" | "csv";
}) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    if (state !== "done" && state !== "error") return;
    const timeout = window.setTimeout(() => setState("idle"), 1800);
    return () => window.clearTimeout(timeout);
  }, [state]);

  async function downloadReport() {
    setState("loading");

    try {
      const response = await fetch(`/api/reports/attendance?format=${format}`);
      if (!response.ok) throw new Error("Report export failed.");

      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = `scanroll-attendance-report.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(href);
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <Button type="button" variant="outline" onClick={downloadReport} disabled={state === "loading"}>
      {state === "done" ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
      {state === "loading" ? "Preparing..." : state === "done" ? "Downloaded" : state === "error" ? "Retry export" : label}
    </Button>
  );
}
