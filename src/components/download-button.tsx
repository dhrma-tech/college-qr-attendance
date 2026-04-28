"use client";

import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadButton({ label = "Download PDF" }: { label?: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const timeout = window.setTimeout(() => setDone(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [done]);

  return (
    <Button type="button" variant="outline" onClick={() => setDone(true)}>
      {done ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
      {done ? "Prepared" : label}
    </Button>
  );
}
