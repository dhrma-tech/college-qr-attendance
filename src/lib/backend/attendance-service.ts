import { createAdminClient } from "@/lib/supabase/admin";
import { demoResponse, hasSupabaseServerEnv } from "@/lib/backend/env";

export type MarkAttendanceInput = {
  token: string;
  studentId?: string;
  latitude?: number;
  longitude?: number;
  deviceFingerprint?: string;
};

export type StartSessionInput = {
  subjectAssignmentId?: string;
  teacherId?: string;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
};

export type OverrideInput = {
  recordId?: string;
  status?: "present" | "absent" | "late" | "excused";
  reason?: string;
  actorId?: string;
};

export async function markAttendance(input: MarkAttendanceInput) {
  if (!hasSupabaseServerEnv()) {
    return demoResponse({
      status: "present",
      subject: "Mathematics",
      section: "A",
      markedAt: new Date().toISOString(),
      proxyFlagged: false,
      token: input.token
    });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("mark_attendance_from_qr", {
    scan_token: input.token,
    student_uuid: input.studentId,
    scan_latitude: input.latitude,
    scan_longitude: input.longitude,
    scan_device_fingerprint: input.deviceFingerprint
  });

  if (error) throw new Error(error.message);
  return { mode: "connected" as const, data };
}

export async function startSession(input: StartSessionInput) {
  if (!hasSupabaseServerEnv()) {
    return demoResponse({
      id: "demo-session",
      status: "active",
      qrToken: "demo-token-rotates-30s",
      expiresInSeconds: 30,
      ...input
    });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("attendance_sessions")
    .insert({
      subject_assignment_id: input.subjectAssignmentId,
      teacher_id: input.teacherId,
      latitude: input.latitude,
      longitude: input.longitude,
      radius_meters: input.radiusMeters || 100
    })
    .select("id,status,qr_token,qr_expires_at")
    .single();

  if (error) throw new Error(error.message);
  return { mode: "connected" as const, data };
}

export async function rotateSessionToken(sessionId: string) {
  if (!hasSupabaseServerEnv()) {
    return demoResponse({
      id: sessionId,
      qrToken: "demo-token-next-window",
      expiresInSeconds: 30
    });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("rotate_attendance_session_token", {
    session_uuid: sessionId
  });

  if (error) throw new Error(error.message);
  return { mode: "connected" as const, data };
}

export async function endSession(sessionId: string) {
  if (!hasSupabaseServerEnv()) {
    return demoResponse({ id: sessionId, status: "closed", endedAt: new Date().toISOString() });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("attendance_sessions")
    .update({ status: "closed", end_time: new Date().toISOString() })
    .eq("id", sessionId)
    .select("id,status,end_time")
    .single();

  if (error) throw new Error(error.message);
  return { mode: "connected" as const, data };
}

export async function overrideAttendance(input: OverrideInput) {
  if (!hasSupabaseServerEnv()) {
    return demoResponse({
      recordId: input.recordId || "demo-record",
      status: input.status || "present",
      manuallyOverridden: true,
      reason: input.reason || "Demo override"
    });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("attendance_records")
    .update({
      status: input.status,
      manually_overridden: true,
      override_reason: input.reason,
      override_by: input.actorId
    })
    .eq("id", input.recordId)
    .select("id,status,manually_overridden,override_reason")
    .single();

  if (error) throw new Error(error.message);
  return { mode: "connected" as const, data };
}

export async function getAttendanceReport() {
  if (!hasSupabaseServerEnv()) {
    return demoResponse({
      generatedAt: new Date().toISOString(),
      rows: [
        { roll: "CSE-501", name: "Aarav Sharma", subject: "DBMS", attendance: 88 },
        { roll: "CSE-542", name: "Kabir Khan", subject: "Web Engineering", attendance: 58 }
      ]
    });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("student_attendance_summary").select("*").limit(200);

  if (error) throw new Error(error.message);
  return { mode: "connected" as const, data };
}
