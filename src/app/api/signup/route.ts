import { NextResponse } from "next/server";
import { createSignupRequest } from "@/lib/backend/signup-service";
import { validateRequest, validateSignupRequest, ValidationError } from "@/lib/validation/schemas";
import { rateLimiters } from "@/lib/rate-limiting";

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitHandler = rateLimiters.signup(async (req) => {
      return NextResponse.json({ status: "ok" });
    });
    
    const rateLimitResponse = await rateLimitHandler(request);
    if (rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }

    const body = await request.json();

    // Validate input with strict schema
    const validatedData = validateRequest(body, validateSignupRequest);

    // Additional business logic validation
    // Admin signup is already prevented by validation schema (only student/teacher/hod allowed)

    // Create signup request with validated data
    const result = await createSignupRequest(validatedData);

    return NextResponse.json({
      ...result,
      // Don't expose internal details
      message: "Signup request submitted successfully. Please wait for approval."
    });

  } catch (error) {
    console.error('Signup request error:', error);
    
    // Handle validation errors specifically
    if (error instanceof ValidationError) {
      return NextResponse.json({ 
        error: "Invalid input data",
        details: error.message,
        field: error.field
      }, { status: 400 });
    }

    // Handle duplicate requests specifically
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json({ 
        error: "A signup request with this email or mobile number already exists"
      }, { status: 409 });
    }

    // Generic error - don't expose internal details
    return NextResponse.json({ 
      error: "Unable to process signup request at this time" 
    }, { status: 500 });
  }
}
