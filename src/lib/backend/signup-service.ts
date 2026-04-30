import { demoResponse, hasSupabaseServerEnv } from "@/lib/backend/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Role } from "@/lib/types";

export type SignupRequestInput = {
  requestedRole: Extract<Role, "student" | "teacher" | "hod">;
  fullName: string;
  email: string;
  mobileNumber: string;
  department?: string;
  branch?: string;
  year?: string;
  semester?: string;
  division?: string;
  batch?: string;
  rollNumber?: string;
  employeeId?: string;
  designation?: string;
  subjectsTaught?: string[];
  classesAssigned?: string[];
  leadershipRole?: string;
  parentMobileNumber?: string;
  address?: string;
  emergencyContact?: string;
  officeLocation?: string;
  cabinRoomNumber?: string;
};

export async function createSignupRequest(input: SignupRequestInput) {
  if (!hasSupabaseServerEnv()) {
    return demoResponse({
      id: "demo-signup-request",
      status: "pending",
      requestedRole: input.requestedRole,
      email: input.email
    });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("signup_requests")
    .insert({
      requested_role: input.requestedRole,
      full_name: input.fullName,
      email: input.email,
      mobile_number: input.mobileNumber,
      department: input.department,
      branch: input.branch,
      year: input.year,
      semester: input.semester,
      division: input.division,
      batch: input.batch,
      roll_number: input.rollNumber,
      employee_id: input.employeeId,
      designation: input.designation,
      subjects_taught: input.subjectsTaught,
      classes_assigned: input.classesAssigned,
      leadership_role: input.leadershipRole,
      parent_mobile_number: input.parentMobileNumber,
      address: input.address,
      emergency_contact: input.emergencyContact,
      office_location: input.officeLocation,
      cabin_room_number: input.cabinRoomNumber
    })
    .select("id,status,requested_role,email")
    .single();

  if (error) throw new Error(error.message);
  return { mode: "connected" as const, data };
}
