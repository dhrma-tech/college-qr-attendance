import { NextResponse } from "next/server";
import { endSession } from "@/lib/backend/attendance-service";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await endSession(params.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to end session" }, { status: 400 });
  }
}
