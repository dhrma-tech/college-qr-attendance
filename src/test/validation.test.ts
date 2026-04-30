import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateString,
  validateEmail,
  validateMobileNumber,
  validateUUID,
  validateEnum,
  validateNumber,
  validateLatitude,
  validateLongitude,
  validateRadius,
  validateYear,
  validateSemester,
  validateOptional,
  validateSignupRequest,
  validateMarkAttendanceRequest,
  validateStartSessionRequest,
  validateAttendanceOverrideRequest,
  validateReportsQuery,
  ValidationError
} from '@/lib/validation/schemas';

describe('Validation Helpers', () => {
  describe('validateString', () => {
    it('should validate valid strings', () => {
      expect(validateString('test')).toBe('test');
      expect(validateString('  test  ')).toBe('test');
    });

    it('should reject non-strings', () => {
      expect(() => validateString(123)).toThrow('Expected string value');
      expect(() => validateString(null)).toThrow('Expected string value');
      expect(() => validateString(undefined)).toThrow('Expected string value');
    });

    it('should enforce minimum length', () => {
      expect(() => validateString('', 1)).toThrow('at least 1 characters long');
      expect(() => validateString('a', 2)).toThrow('at least 2 characters long');
    });

    it('should enforce maximum length', () => {
      expect(() => validateString('a'.repeat(101), 100)).toThrow('no more than 100 characters long');
    });
  });

  describe('validateEmail', () => {
    it('should validate valid emails', () => {
      expect(validateEmail('test@example.com')).toBe('test@example.com');
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe('user.name+tag@domain.co.uk');
    });

    it('should normalize email case', () => {
      expect(validateEmail('Test@Example.COM')).toBe('test@example.com');
    });

    it('should reject invalid emails', () => {
      expect(() => validateEmail('invalid')).toThrow('Invalid email format');
      expect(() => validateEmail('test@')).toThrow('Invalid email format');
      expect(() => validateEmail('@example.com')).toThrow('Invalid email format');
      expect(() => validateEmail('test..test@example.com')).toThrow('Invalid email format');
    });
  });

  describe('validateMobileNumber', () => {
    it('should validate valid mobile numbers', () => {
      expect(validateMobileNumber('+1234567890')).toBe('+1234567890');
      expect(validateMobileNumber('(555) 123-4567')).toBe('(555) 123-4567');
      expect(validateMobileNumber('555.123.4567')).toBe('555.123.4567');
    });

    it('should reject invalid mobile numbers', () => {
      expect(() => validateMobileNumber('abc')).toThrow('Invalid mobile number format');
      expect(() => validateMobileNumber('123')).toThrow('Invalid mobile number format');
      expect(() => validateMobileNumber('555-1234')).toThrow('Invalid mobile number format');
    });
  });

  describe('validateUUID', () => {
    it('should validate valid UUIDs', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      expect(validateUUID(validUUID)).toBe(validUUID.toLowerCase());
    });

    it('should reject invalid UUIDs', () => {
      expect(() => validateUUID('invalid')).toThrow('Invalid UUID format');
      expect(() => validateUUID('123e4567-e89b-12d3-a456-42661417400')).toThrow('Invalid UUID format');
      expect(() => validateUUID('123e4567-e89b-12d3-a456-4266141740000')).toThrow('Invalid UUID format');
    });
  });

  describe('validateLatitude', () => {
    it('should validate valid latitude values', () => {
      expect(validateLatitude(0)).toBe(0);
      expect(validateLatitude(45.5)).toBe(45.5);
      expect(validateLatitude(-45.5)).toBe(-45.5);
      expect(validateLatitude(90)).toBe(90);
      expect(validateLatitude(-90)).toBe(-90);
    });

    it('should reject invalid latitude values', () => {
      expect(() => validateLatitude(91)).toThrow('at least 90');
      expect(() => validateLatitude(-91)).toThrow('at least -90');
    });
  });

  describe('validateLongitude', () => {
    it('should validate valid longitude values', () => {
      expect(validateLongitude(0)).toBe(0);
      expect(validateLongitude(45.5)).toBe(45.5);
      expect(validateLongitude(-45.5)).toBe(-45.5);
      expect(validateLongitude(180)).toBe(180);
      expect(validateLongitude(-180)).toBe(-180);
    });

    it('should reject invalid longitude values', () => {
      expect(() => validateLongitude(181)).toThrow('at most 180');
      expect(() => validateLongitude(-181)).toThrow('at least -180');
    });
  });

  describe('validateRadius', () => {
    it('should validate valid radius values', () => {
      expect(validateRadius(1)).toBe(1);
      expect(validateRadius(100)).toBe(100);
      expect(validateRadius(5000)).toBe(5000);
    });

    it('should reject invalid radius values', () => {
      expect(() => validateRadius(0)).toThrow('at least 1');
      expect(() => validateRadius(10001)).toThrow('no more than 10000');
    });
  });

  describe('validateYear', () => {
    it('should validate valid years', () => {
      expect(validateYear(2023)).toBe(2023);
      expect(validateYear(2000)).toBe(2000);
      expect(validateYear(2100)).toBe(2100);
    });

    it('should reject invalid years', () => {
      expect(() => validateYear(1899)).toThrow('at least 1900');
      expect(() => validateYear(2101)).toThrow('no more than 2100');
    });
  });

  describe('validateSemester', () => {
    it('should validate valid semesters', () => {
      expect(validateSemester('1')).toBe('1');
      expect(validateSemester('8')).toBe('8');
    });

    it('should reject invalid semesters', () => {
      expect(() => validateSemester('0')).toThrow('must be one of: 1, 2, 3, 4, 5, 6, 7, 8');
      expect(() => validateSemester('9')).toThrow('must be one of: 1, 2, 3, 4, 5, 6, 7, 8');
      expect(() => validateSemester('spring')).toThrow('must be one of: 1, 2, 3, 4, 5, 6, 7, 8');
    });
  });

  describe('validateOptional', () => {
    it('should return undefined for empty values', () => {
      expect(validateOptional(null, validateString)).toBeUndefined();
      expect(validateOptional(undefined, validateString)).toBeUndefined();
      expect(validateOptional('', validateString)).toBeUndefined();
    });

    it('should apply validator for non-empty values', () => {
      expect(validateOptional('test', validateString)).toBe('test');
      expect(validateOptional('test@example.com', validateEmail)).toBe('test@example.com');
    });
  });
});

describe('Schema Validation', () => {
  describe('validateSignupRequest', () => {
    it('should validate valid student signup request', () => {
      const validRequest = {
        requestedRole: 'student',
        fullName: 'John Doe',
        email: 'john@example.com',
        mobileNumber: '+1234567890',
        year: 2023,
        semester: '1',
        rollNumber: 'CS2023001'
      };

      const result = validateSignupRequest(validRequest);
      expect(result.requestedRole).toBe('student');
      expect(result.email).toBe('john@example.com');
      expect(result.mobileNumber).toBe('+1234567890');
    });

    it('should validate valid teacher signup request', () => {
      const validRequest = {
        requestedRole: 'teacher',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        mobileNumber: '+1234567890',
        employeeId: 'EMP001',
        designation: 'Assistant Professor',
        subjectsTaught: ['Mathematics', 'Physics']
      };

      const result = validateSignupRequest(validRequest);
      expect(result.requestedRole).toBe('teacher');
      expect(result.employeeId).toBe('EMP001');
      expect(result.subjectsTaught).toEqual(['Mathematics', 'Physics']);
    });

    it('should reject invalid role', () => {
      const invalidRequest = {
        requestedRole: 'admin',
        fullName: 'Admin User',
        email: 'admin@example.com',
        mobileNumber: '+1234567890'
      };

      expect(() => validateSignupRequest(invalidRequest)).toThrow('must be one of: student, teacher, hod');
    });

    it('should reject invalid email', () => {
      const invalidRequest = {
        requestedRole: 'student',
        fullName: 'John Doe',
        email: 'invalid-email',
        mobileNumber: '+1234567890'
      };

      expect(() => validateSignupRequest(invalidRequest)).toThrow('Invalid email format');
    });

    it('should reject missing required fields', () => {
      const invalidRequest = {
        requestedRole: 'student',
        fullName: 'John Doe'
        // Missing email and mobileNumber
      };

      expect(() => validateSignupRequest(invalidRequest)).toThrow('Invalid email format');
    });

    it('should reject oversized fields', () => {
      const invalidRequest = {
        requestedRole: 'student',
        fullName: 'a'.repeat(101), // Too long
        email: 'test@example.com',
        mobileNumber: '+1234567890'
      };

      expect(() => validateSignupRequest(invalidRequest)).toThrow('no more than 100 characters long');
    });
  });

  describe('validateMarkAttendanceRequest', () => {
    it('should validate valid attendance marking request', () => {
      const validRequest = {
        token: '123e4567-e89b-12d3-a456-426614174000',
        latitude: 40.7128,
        longitude: -74.0060,
        deviceFingerprint: 'device-123'
      };

      const result = validateMarkAttendanceRequest(validRequest);
      expect(result.token).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.0060);
      expect(result.deviceFingerprint).toBe('device-123');
    });

    it('should reject invalid UUID token', () => {
      const invalidRequest = {
        token: 'invalid-uuid',
        latitude: 40.7128,
        longitude: -74.0060
      };

      expect(() => validateMarkAttendanceRequest(invalidRequest)).toThrow('Invalid UUID format');
    });

    it('should reject invalid coordinates', () => {
      const invalidRequest = {
        token: '123e4567-e89b-12d3-a456-426614174000',
        latitude: 91, // Invalid latitude
        longitude: -74.0060
      };

      expect(() => validateMarkAttendanceRequest(invalidRequest)).toThrow('at least 90');
    });
  });

  describe('validateStartSessionRequest', () => {
    it('should validate valid session start request', () => {
      const validRequest = {
        subjectAssignmentId: '123e4567-e89b-12d3-a456-426614174000',
        latitude: 40.7128,
        longitude: -74.0060,
        radiusMeters: 100
      };

      const result = validateStartSessionRequest(validRequest);
      expect(result.subjectAssignmentId).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.radiusMeters).toBe(100);
    });

    it('should reject invalid radius', () => {
      const invalidRequest = {
        subjectAssignmentId: '123e4567-e89b-12d3-a456-426614174000',
        radiusMeters: 0 // Invalid radius
      };

      expect(() => validateStartSessionRequest(invalidRequest)).toThrow('at least 1');
    });
  });

  describe('validateAttendanceOverrideRequest', () => {
    it('should validate valid override request', () => {
      const validRequest = {
        recordId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'present',
        reason: 'Student was actually present in class'
      };

      const result = validateAttendanceOverrideRequest(validRequest);
      expect(result.recordId).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.status).toBe('present');
      expect(result.reason).toBe('Student was actually present in class');
    });

    it('should reject invalid status', () => {
      const invalidRequest = {
        recordId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'invalid-status',
        reason: 'Test reason'
      };

      expect(() => validateAttendanceOverrideRequest(invalidRequest)).toThrow('must be one of: present, absent, late, excused');
    });

    it('should reject short reason', () => {
      const invalidRequest = {
        recordId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'present',
        reason: 'OK' // Too short
      };

      expect(() => validateAttendanceOverrideRequest(invalidRequest)).toThrow('at least 5 characters long');
    });
  });

  describe('validateReportsQuery', () => {
    it('should validate valid reports query', () => {
      const validQuery = {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        subjectId: '123e4567-e89b-12d3-a456-426614174000',
        format: 'csv',
        limit: 100
      };

      const result = validateReportsQuery(validQuery);
      expect(result.startDate).toBe('2023-01-01');
      expect(result.endDate).toBe('2023-12-31');
      expect(result.format).toBe('csv');
      expect(result.limit).toBe(100);
    });

    it('should reject invalid date format', () => {
      const invalidQuery = {
        startDate: '01/01/2023', // Invalid format
        format: 'json'
      };

      expect(() => validateReportsQuery(invalidQuery)).toThrow('Date must be in YYYY-MM-DD format');
    });

    it('should reject invalid format', () => {
      const invalidQuery = {
        format: 'xml' // Invalid format
      };

      expect(() => validateReportsQuery(invalidQuery)).toThrow('must be one of: json, csv');
    });

    it('should reject invalid limit', () => {
      const invalidQuery = {
        limit: 0 // Invalid limit
      };

      expect(() => validateReportsQuery(invalidQuery)).toThrow('at least 1');
    });
  });
});
