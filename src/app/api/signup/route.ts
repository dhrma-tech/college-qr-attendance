import { NextResponse } from "next/server";
import { createSignupRequest } from "@/lib/backend/signup-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await createSignupRequest({
      requestedRole: body.requestedRole,
      fullName: body.fullName,
      email: body.email,
      mobileNumber: body.mobileNumber,
      department: body.department,
      branch: body.branch,
      year: body.year,
      semester: body.semester,
      division: body.division,
      batch: body.batch,
      rollNumber: body.rollNumber,
      employeeId: body.employeeId,
      designation: body.designation,
      subjectsTaught: body.subjectsTaught,
      classesAssigned: body.classesAssigned,
      leadershipRole: body.leadershipRole,
      parentMobileNumber: body.parentMobileNumber,
      address: body.address,
      emergencyContact: body.emergencyContact,
      officeLocation: body.officeLocation,
      cabinRoomNumber: body.cabinRoomNumber
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create signup request" }, { status: 400 });
  }
}
