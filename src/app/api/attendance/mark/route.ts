import { NextResponse } from "next/server";
import { hasSupabaseServerEnv } from "@/lib/backend/env";
import { markAttendance } from "@/lib/backend/attendance-service";
import { createClient } from "@/lib/supabase/server";
import { validateRequest, validateMarkAttendanceRequest, ValidationError } from "@/lib/validation/schemas";
import { rateLimiters } from "@/lib/rate-limiting";

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitHandler = rateLimiters.attendanceMark(async (req) => {
      return NextResponse.json({ status: "ok" });
    });
    
    const rateLimitResponse = await rateLimitHandler(request);
    if (rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }

    const body = await request.json();

    // Validate input with strict schema
    const validatedData = validateRequest(body, validateMarkAttendanceRequest);

    if (hasSupabaseServerEnv()) {
      const supabase = await createClient();
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }

      // Verify student profile and status
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role, is_active, college_id")
        .eq("id", user.id)
        .single();

      if (profileError || !profile?.is_active || profile.role !== "student") {
        return NextResponse.json({ 
          error: "Only active student accounts can mark attendance" 
        }, { status: 403 });
      }

      // Mark attendance with authenticated user ID
      const result = await markAttendance({
        token: validatedData.token,
        studentId: user.id, // Override with authenticated user ID
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        deviceFingerprint: validatedData.deviceFingerprint
      });

      return NextResponse.json(result);
    }

    // Demo mode - use provided student ID
    if (!validatedData.studentId) {
      return NextResponse.json({ 
        error: "Student ID is required in demo mode" 
      }, { status: 400 });
    }

    const result = await markAttendance({
      token: validatedData.token,
      studentId: validatedData.studentId,
      latitude: validatedData.latitude,
      longitude: validatedData.longitude,
      deviceFingerprint: validatedData.deviceFingerprint
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Attendance marking error:', error);
    
    // Handle validation errors specifically
    if (error instanceof ValidationError) {
      return NextResponse.json({ 
        error: "Invalid input data",
        details: error.message,
        field: error.field
      }, { status: 400 });
    }

    // Handle duplicate attendance specifically
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json({ 
        error: "Attendance already marked for this session" 
      }, { status: 409 });
    }

    // Handle expired/invalid QR tokens
    if (error instanceof Error && (
      error.message.includes('expired') || 
      error.message.includes('invalid') ||
      error.message.includes('not found')
    )) {
      return NextResponse.json({ 
        error: "Invalid or expired QR code" 
      }, { status: 400 });
    }

    // Generic error - don't expose internal details
    return NextResponse.json({ 
      error: "Unable to mark attendance at this time" 
    }, { status: 500 });
  }
}
