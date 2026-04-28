import { NextResponse } from "next/server";
import { getAttendanceReport } from "@/lib/backend/attendance-service";

export async function GET() {
  try {
    const result = await getAttendanceReport();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate attendance report" }, { status: 400 });
  }
}
