"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, QrCode, ScanLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoAttendanceLogs, demoSessions, demoStudents } from "@/lib/mock-data";

type DemoLog = {
  studentId: string;
  sessionId: string;
  timestamp: string;
  status: string;
};

const storageKey = "scanroll-demo-attendance";

export function DemoQrFlow() {
  const [activeSessionId, setActiveSessionId] = useState(demoSessions[0].id);
  const [logs, setLogs] = useState<DemoLog[]>(demoAttendanceLogs);

  const activeSession = useMemo(
    () => demoSessions.find((session) => session.id === activeSessionId) || demoSessions[0],
    [activeSessionId]
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        setLogs(JSON.parse(stored));
      } catch {
        setLogs(demoAttendanceLogs);
      }
    }
  }, []);

  function saveLogs(nextLogs: DemoLog[]) {
    setLogs(nextLogs);
    window.localStorage.setItem(storageKey, JSON.stringify(nextLogs));
  }

  function generateSession() {
    const nextSession = demoSessions[(demoSessions.findIndex((session) => session.id === activeSessionId) + 1) % demoSessions.length];
    setActiveSessionId(nextSession.id);
  }

  function scanQr() {
    const student = demoStudents[0];
    const alreadyMarked = logs.some((log) => log.studentId === student.id && log.sessionId === activeSession.id);
    if (alreadyMarked) return;

    saveLogs([
      {
        studentId: student.id,
        sessionId: activeSession.id,
        timestamp: new Date().toISOString(),
        status: "present"
      },
      ...logs
    ]);
  }

  const sessionLogs = logs.filter((log) => log.sessionId === activeSession.id);
  const markedStudentIds = new Set(sessionLogs.map((log) => log.studentId));

  return (
    <Card className="border-teal/15 bg-white">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>ScanRoll Demo QR Flow</CardTitle>
            <p className="mt-1 text-sm font-semibold text-ink/55">This is a demo implementation. Backend required for production.</p>
          </div>
          <Badge tone="warning">localStorage demo</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="rounded-2xl border border-ink/10 bg-[#EAF8F4] p-5">
          <div className="flex items-center gap-3">
            <QrCode className="h-6 w-6 text-teal" />
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-teal">Teacher side</p>
              <h3 className="font-black text-ink">Generate session QR</h3>
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-white p-4">
            <p className="text-sm font-semibold text-ink/55">Active session</p>
            <p className="mt-1 text-lg font-black text-ink">{activeSession.subject}</p>
            <p className="mt-1 font-mono text-xs font-black text-teal">{activeSession.qrCodeId}</p>
          </div>
          <Button onClick={generateSession} className="mt-5 w-full bg-teal hover:bg-teal/90">
            Generate New Session
          </Button>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-paper p-5">
          <div className="flex items-center gap-3">
            <ScanLine className="h-6 w-6 text-teal" />
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-teal">Student side</p>
              <h3 className="font-black text-ink">Simulate QR scan</h3>
            </div>
          </div>
          <Button onClick={scanQr} className="mt-5 w-full bg-teal hover:bg-teal/90">
            Scan QR and Mark Attendance
          </Button>
          <div className="mt-5 grid gap-2">
            {demoStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between rounded-xl border border-ink/10 bg-white px-3 py-2">
                <div>
                  <p className="text-sm font-black text-ink">{student.name}</p>
                  <p className="font-mono text-xs font-semibold text-ink/45">{student.rollNumber}</p>
                </div>
                {markedStudentIds.has(student.id) ? (
                  <Badge tone="success">
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    Present
                  </Badge>
                ) : (
                  <Badge tone="muted">Not marked</Badge>
                )}
              </div>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
