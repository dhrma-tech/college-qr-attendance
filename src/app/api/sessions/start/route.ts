import { NextResponse } from "next/server";
import { startSession } from "@/lib/backend/attendance-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await startSession({
      subjectAssignmentId: body.subjectAssignmentId,
      teacherId: body.teacherId,
      latitude: typeof body.latitude === "number" ? body.latitude : undefined,
      longitude: typeof body.longitude === "number" ? body.longitude : undefined,
      radiusMeters: typeof body.radiusMeters === "number" ? body.radiusMeters : undefined
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start session" }, { status: 400 });
  }
}
