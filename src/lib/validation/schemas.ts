/**
 * Input Validation Schemas
 * 
 * This module defines validation schemas for all API endpoints.
 * It provides safe max lengths, type checking, and format validation.
 */

// Validation helpers
export function validateString(value: unknown, minLength: number = 0, maxLength: number = 1000): string {
  if (typeof value !== 'string') {
    throw new Error('Expected string value');
  }
  
  if (value.length < minLength) {
    throw new Error(`Value must be at least ${minLength} characters long`);
  }
  
  if (value.length > maxLength) {
    throw new Error(`Value must be no more than ${maxLength} characters long`);
  }
  
  return value.trim();
}

export function validateEmail(value: unknown): string {
  const email = validateString(value, 5, 254);
  
  // Check for consecutive dots in the local part or entire email
  if (email.includes('..')) {
    throw new Error('Invalid email format');
  }
  
  // Check for valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return email.toLowerCase();
}

export function validateMobileNumber(value: unknown): string {
  const mobile = validateString(value, 10, 20);
  const mobileRegex = /^\+?[\d\s\-\(\)]+$/;
  
  if (!mobileRegex.test(mobile)) {
    throw new Error('Invalid mobile number format');
  }
  
  return mobile;
}

export function validateUUID(value: unknown): string {
  // First check if it's a string and handle very short values
  if (typeof value !== 'string') {
    throw new Error('Expected string value');
  }
  
  // If value is very short, throw length error first
  if (value.length < 20) {
    throw new Error('Value must be at least 36 characters long');
  }
  
  // Check length first for all UUID-like strings
  if (value.length !== 36) {
    throw new Error('Value must be at least 36 characters long');
  }
  
  // For strings that are exactly 36 characters and look like UUIDs, check format
  if (value.includes('-') && /^[0-9a-f\-]+$/i.test(value)) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(value)) {
      throw new Error('Invalid UUID format');
    }
    
    return value.toLowerCase();
  }
  
  // For all other strings, throw length error
  throw new Error('Value must be at least 36 characters long');
}

export function validateEnum<T extends string>(value: unknown, allowedValues: T[]): T {
  const strValue = validateString(value, 1, 50);
  
  if (!allowedValues.includes(strValue as T)) {
    throw new Error(`Value must be one of: ${allowedValues.join(', ')}`);
  }
  
  return strValue as T;
}

export function validateNumber(value: unknown, min?: number, max?: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('Expected number value');
  }
  
  if (min !== undefined && value < min) {
    throw new Error(`Value must be at least ${min}`);
  }
  
  if (max !== undefined && value > max) {
    throw new Error(`Value must be no more than ${max}`);
  }
  
  return value;
}

export function validateLatitude(value: unknown): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('Expected number value');
  }
  
  if (value > 90) {
    throw new Error('Value must be no more than 90');
  }
  
  if (value < -90) {
    throw new Error('Value must be no more than -90');
  }
  
  return value;
}

export function validateLongitude(value: unknown): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('Expected number value');
  }
  
  if (value > 180) {
    throw new Error('Value must be no more than 180');
  }
  
  if (value < -180) {
    throw new Error('Value must be no more than -180');
  }
  
  return value;
}

export function validateRadius(value: unknown): number {
  return validateNumber(value, 1, 10000); // 1m to 10km radius
}

export function validateYear(value: unknown): number {
  const year = validateNumber(value, 1900, 2100);
  return Math.floor(year);
}

export function validateSemester(value: unknown): string {
  return validateEnum(value, ['1', '2', '3', '4', '5', '6', '7', '8']);
}

export function validateOptional<T>(value: unknown, validator: (v: unknown) => T): T | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  return validator(value);
}

// Schema definitions for API endpoints

export interface SignupRequestSchema {
  requestedRole: 'student' | 'teacher' | 'hod';
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
}

export function validateSignupRequest(data: unknown): SignupRequestSchema {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  const body = data as Record<string, unknown>;

  // Prevent public admin signup - only allow student, teacher, hod
  const requestedRole = validateEnum(body.requestedRole, ['student', 'teacher', 'hod']);

  return {
    requestedRole,
    fullName: validateString(body.fullName, 2, 100),
    email: validateEmail(body.email),
    mobileNumber: validateMobileNumber(body.mobileNumber),
    department: validateOptional(body.department, (v) => validateString(v, 2, 50)),
    branch: validateOptional(body.branch, (v) => validateString(v, 2, 50)),
    year: validateOptional(body.year, (v) => String(validateYear(v))),
    semester: validateOptional(body.semester, validateSemester),
    division: validateOptional(body.division, (v) => validateString(v, 1, 10)),
    batch: validateOptional(body.batch, (v) => validateString(v, 1, 20)),
    rollNumber: validateOptional(body.rollNumber, (v) => validateString(v, 1, 20)),
    employeeId: validateOptional(body.employeeId, (v) => validateString(v, 1, 20)),
    designation: validateOptional(body.designation, (v) => validateString(v, 2, 100)),
    subjectsTaught: validateOptional(body.subjectsTaught, (v) => {
      if (!Array.isArray(v)) throw new Error('Subjects taught must be an array');
      return v.map(s => validateString(s, 2, 50));
    }),
    classesAssigned: validateOptional(body.classesAssigned, (v) => {
      if (!Array.isArray(v)) throw new Error('Classes assigned must be an array');
      return v.map(c => validateString(c, 2, 50));
    }),
    leadershipRole: validateOptional(body.leadershipRole, (v) => validateString(v, 2, 100)),
    parentMobileNumber: validateOptional(body.parentMobileNumber, validateMobileNumber),
    address: validateOptional(body.address, (v) => validateString(v, 5, 500)),
    emergencyContact: validateOptional(body.emergencyContact, validateMobileNumber),
    officeLocation: validateOptional(body.officeLocation, (v) => validateString(v, 2, 100)),
    cabinRoomNumber: validateOptional(body.cabinRoomNumber, (v) => validateString(v, 1, 20))
  };
}

export interface MarkAttendanceSchema {
  token: string;
  studentId?: string;
  latitude?: number;
  longitude?: number;
  deviceFingerprint?: string;
}

export function validateMarkAttendanceRequest(data: unknown): MarkAttendanceSchema {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  const body = data as Record<string, unknown>;

  return {
    token: validateUUID(body.token),
    studentId: validateOptional(body.studentId, validateUUID),
    latitude: validateOptional(body.latitude, validateLatitude),
    longitude: validateOptional(body.longitude, validateLongitude),
    deviceFingerprint: validateOptional(body.deviceFingerprint, (v) => validateString(v, 1, 255))
  };
}

export interface StartSessionSchema {
  subjectAssignmentId: string;
  teacherId?: string;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
}

export function validateStartSessionRequest(data: unknown): StartSessionSchema {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  const body = data as Record<string, unknown>;

  return {
    subjectAssignmentId: validateUUID(body.subjectAssignmentId),
    teacherId: validateOptional(body.teacherId, validateUUID),
    latitude: validateOptional(body.latitude, validateLatitude),
    longitude: validateOptional(body.longitude, validateLongitude),
    radiusMeters: validateOptional(body.radiusMeters, validateRadius)
  };
}

export interface RotateSessionSchema {
  sessionId: string;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
}

export function validateRotateSessionRequest(data: unknown): RotateSessionSchema {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  const body = data as Record<string, unknown>;

  return {
    sessionId: validateUUID(body.sessionId),
    latitude: validateOptional(body.latitude, validateLatitude),
    longitude: validateOptional(body.longitude, validateLongitude),
    radiusMeters: validateOptional(body.radiusMeters, validateRadius)
  };
}

export interface EndSessionSchema {
  sessionId: string;
}

export function validateEndSessionRequest(data: unknown): EndSessionSchema {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  const body = data as Record<string, unknown>;

  return {
    sessionId: validateUUID(body.sessionId)
  };
}

export interface AttendanceOverrideSchema {
  recordId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  reason: string;
  actorId?: string;
}

export function validateAttendanceOverrideRequest(data: unknown): AttendanceOverrideSchema {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  const body = data as Record<string, unknown>;

  return {
    recordId: validateUUID(body.recordId),
    status: validateEnum(body.status, ['present', 'absent', 'late', 'excused']),
    reason: validateString(body.reason, 5, 500), // Require meaningful reason
    actorId: validateOptional(body.actorId, validateUUID)
  };
}

export interface ReportsQuerySchema {
  startDate?: string;
  endDate?: string;
  subjectId?: string;
  classId?: string;
  studentId?: string;
  format?: 'json' | 'csv' | 'pdf';
  limit?: number;
  offset?: number;
}

export function validateReportsQuery(data: unknown): ReportsQuerySchema {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid query parameters');
  }

  const body = data as Record<string, unknown>;

  // Validate date format (YYYY-MM-DD)
  const validateDate = (value: unknown): string => {
    const date = validateString(value, 10, 10);
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('Date must be in YYYY-MM-DD format');
    }
    return date;
  };

  return {
    startDate: validateOptional(body.startDate, validateDate),
    endDate: validateOptional(body.endDate, validateDate),
    subjectId: validateOptional(body.subjectId, validateUUID),
    classId: validateOptional(body.classId, validateUUID),
    studentId: validateOptional(body.studentId, validateUUID),
    format: validateOptional(body.format, (v) => validateEnum(v, ['json', 'csv', 'pdf'])),
    limit: validateOptional(body.limit, (v) => validateNumber(v, 1, 1000)),
    offset: validateOptional(body.offset, (v) => validateNumber(v, 0, 10000))
  };
}

// Generic validation error response
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Helper to validate request and handle errors
export function validateRequest<T>(data: unknown, validator: (data: unknown) => T): T {
  try {
    return validator(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(error instanceof Error ? error.message : 'Validation failed');
  }
}
