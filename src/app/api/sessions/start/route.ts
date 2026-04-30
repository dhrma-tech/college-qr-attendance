import { NextResponse } from "next/server";
import { AuthzError, requireRole } from "@/lib/backend/authz";
import { hasSupabaseServerEnv } from "@/lib/backend/env";
import { startSession } from "@/lib/backend/attendance-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const teacherId = hasSupabaseServerEnv() ? (await requireRole("teacher")).user.id : body.teacherId;
    const result = await startSession({
      subjectAssignmentId: body.subjectAssignmentId,
      teacherId,
      latitude: typeof body.latitude === "number" ? body.latitude : undefined,
      longitude: typeof body.longitude === "number" ? body.longitude : undefined,
      radiusMeters: typeof body.radiusMeters === "number" ? body.radiusMeters : undefined
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthzError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start session" }, { status: 400 });
  }
}
