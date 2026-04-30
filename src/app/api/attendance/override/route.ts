import { NextResponse } from "next/server";
import { AuthzError, requireAnyRole } from "@/lib/backend/authz";
import { hasSupabaseServerEnv } from "@/lib/backend/env";
import { overrideAttendance } from "@/lib/backend/attendance-service";
import { validateRequest, validateAttendanceOverrideRequest, ValidationError } from "@/lib/validation/schemas";
import { rateLimiters } from "@/lib/rate-limiting";

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitHandler = rateLimiters.attendanceOverride(async (req) => {
      return NextResponse.json({ status: "ok" });
    });
    
    const rateLimitResponse = await rateLimitHandler(request);
    if (rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }

    const body = await request.json();

    // Validate input with strict schema
    const validatedData = validateRequest(body, validateAttendanceOverrideRequest);

    const actor = hasSupabaseServerEnv() ? await requireAnyRole(["teacher", "hod", "admin"]) : null;

    if (actor?.profile.role === "teacher") {
      // Teachers can only override attendance for their own sessions
      const { data: attendanceRecord, error: recordError } = await actor.supabase
        .from("attendance_records")
        .select(`
          id,
          session_id,
          sessions!inner(
            id,
            teacher_id,
            subject_assignments!inner(
              id,
              teacher_id
            )
          )
        `)
        .eq("id", validatedData.recordId)
        .eq("sessions.teacher_id", actor.user.id)
        .single();

      if (recordError || !attendanceRecord) {
        return NextResponse.json({ 
          error: "Attendance record not found or not authorized for this teacher" 
        }, { status: 404 });
      }
    }

    if (actor?.profile.role === "hod") {
      // HODs can only override attendance for their department
      const { data: attendanceRecord, error: recordError } = await actor.supabase
        .from("attendance_records")
        .select(`
          id,
          student_id,
          users!inner(
            id,
            department_id
          )
        `)
        .eq("id", validatedData.recordId)
        .eq("users.department_id", actor.profile.department_id)
        .single();

      if (recordError || !attendanceRecord) {
        return NextResponse.json({ 
          error: "Attendance record not found or not in HOD's department" 
        }, { status: 404 });
      }
    }

    if (actor?.profile.role === "admin") {
      // Admins can only override attendance for their college
      const { data: attendanceRecord, error: recordError } = await actor.supabase
        .from("attendance_records")
        .select(`
          id,
          student_id,
          users!inner(
            id,
            college_id
          )
        `)
        .eq("id", validatedData.recordId)
        .eq("users.college_id", actor.profile.college_id)
        .single();

      if (recordError || !attendanceRecord) {
        return NextResponse.json({ 
          error: "Attendance record not found or not in admin's college" 
        }, { status: 404 });
      }
    }

    // Perform the override
    const result = await overrideAttendance({
      recordId: validatedData.recordId,
      status: validatedData.status,
      reason: validatedData.reason,
      actorId: actor?.user.id || validatedData.actorId
    });

    return NextResponse.json({
      ...result,
      message: "Attendance override completed successfully"
    });

  } catch (error) {
    console.error('Attendance override error:', error);
    
    // Handle validation errors specifically
    if (error instanceof ValidationError) {
      return NextResponse.json({ 
        error: "Invalid input data",
        details: error.message,
        field: error.field
      }, { status: 400 });
    }

    // Handle authorization errors specifically
    if (error instanceof AuthzError) {
      return NextResponse.json({ 
        error: error.message 
      }, { status: error.status });
    }

    // Handle record not found errors
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ 
        error: "Attendance record not found" 
      }, { status: 404 });
    }

    // Generic error - don't expose internal details
    return NextResponse.json({ 
      error: "Unable to override attendance at this time" 
    }, { status: 500 });
  }
}
