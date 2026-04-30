import { NextResponse } from "next/server";
import { hasSupabaseServerEnv } from "@/lib/backend/env";
import { markAttendance } from "@/lib/backend/attendance-service";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token || "").trim();

    if (!token) {
      return NextResponse.json({ error: "QR token is required" }, { status: 400 });
    }

    if (hasSupabaseServerEnv()) {
      if (!isUuid(token)) {
        return NextResponse.json({ error: "Invalid QR token format" }, { status: 400 });
      }

      const supabase = await createClient();
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json({ error: "Sign in as a student to mark attendance" }, { status: 401 });
      }

      const { data: profile, error: profileError } = await supabase.from("users").select("role,is_active").eq("id", user.id).single();

      if (profileError || !profile?.is_active || profile.role !== "student") {
        return NextResponse.json({ error: "Only active student accounts can mark attendance" }, { status: 403 });
      }

      const result = await markAttendance({
        token,
        studentId: user.id,
        latitude: typeof body.latitude === "number" ? body.latitude : undefined,
        longitude: typeof body.longitude === "number" ? body.longitude : undefined,
        deviceFingerprint: typeof body.deviceFingerprint === "string" ? body.deviceFingerprint : undefined
      });

      return NextResponse.json(result);
    }

    const result = await markAttendance({
      token,
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

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
