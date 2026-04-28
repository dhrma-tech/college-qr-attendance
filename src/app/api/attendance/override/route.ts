import { NextResponse } from "next/server";
import { overrideAttendance } from "@/lib/backend/attendance-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await overrideAttendance({
      recordId: body.recordId,
      status: body.status,
      reason: body.reason,
      actorId: body.actorId
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to override attendance" }, { status: 400 });
  }
}
