import { NextResponse } from "next/server";
import { AuthzError, requireRole } from "@/lib/backend/authz";
import { hasSupabaseServerEnv } from "@/lib/backend/env";
import { endSession } from "@/lib/backend/attendance-service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (hasSupabaseServerEnv()) {
      const { user, supabase } = await requireRole("teacher");
      const { data: session } = await supabase.from("attendance_sessions").select("id").eq("id", id).eq("teacher_id", user.id).single();

      if (!session) {
        return NextResponse.json({ error: "Session not found for this teacher" }, { status: 404 });
      }
    }

    const result = await endSession(id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthzError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to end session" }, { status: 400 });
  }
}
