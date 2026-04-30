import { NextResponse } from "next/server";
import { AuthzError, requireAnyRole } from "@/lib/backend/authz";
import { hasSupabaseServerEnv } from "@/lib/backend/env";
import { overrideAttendance } from "@/lib/backend/attendance-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const allowedStatuses = ["present", "absent", "late", "excused"];

    if (!body.recordId) {
      return NextResponse.json({ error: "Attendance record id is required" }, { status: 400 });
    }

    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid attendance status" }, { status: 400 });
    }

    if (!String(body.reason || "").trim()) {
      return NextResponse.json({ error: "Override reason is required" }, { status: 400 });
    }

    const actor = hasSupabaseServerEnv() ? await requireAnyRole(["teacher", "hod", "admin"]) : null;

    if (actor?.profile.role === "teacher") {
      const { data: readableRecord } = await actor.supabase.from("attendance_records").select("id").eq("id", body.recordId).single();

      if (!readableRecord) {
        return NextResponse.json({ error: "Attendance record not found for this teacher" }, { status: 404 });
      }
    }

    const result = await overrideAttendance({
      recordId: body.recordId,
      status: body.status,
      reason: body.reason,
      actorId: actor?.user.id || body.actorId
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthzError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to override attendance" }, { status: 400 });
  }
}
