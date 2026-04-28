import { NextResponse } from "next/server";
import { markAttendance } from "@/lib/backend/attendance-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await markAttendance({
      token: String(body.token || ""),
      studentId: body.studentId,
      latitude: typeof body.latitude === "number" ? body.latitude : undefined,
      longitude: typeof body.longitude === "number" ? body.longitude : undefined,
      deviceFingerprint: body.deviceFingerprint
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to mark attendance" }, { status: 400 });
  }
}
