import { vi, expect } from 'vitest';

// Mock environment variables for testing
vi.stubEnv('NODE_ENV', 'test');
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key');
vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-role-key');

// Mock Next.js modules
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data) => ({
      json: () => data,
      status: 200,
    })),
  },
}));

// Mock Supabase client
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      single: vi.fn(),
    })),
  })),
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      single: vi.fn(),
    })),
  })),
}));

// Global test utilities
declare global {
  namespace Vi {
    interface Assertion {
      toBeValidUUID(): void;
      toBeValidEmail(): void;
      toBeValidMobileNumber(): void;
    }
  }
}

// Custom matchers
expect.extend({
  toBeValidUUID(received: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid UUID`
          : `expected ${received} to be a valid UUID`,
      pass,
    };
  },
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid email`
          : `expected ${received} to be a valid email`,
      pass,
    };
  },
  toBeValidMobileNumber(received: string) {
    const mobileRegex = /^\+?[\d\s\-\(\)]+$/;
    const pass = mobileRegex.test(received) && received.length >= 10;
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid mobile number`
          : `expected ${received} to be a valid mobile number`,
      pass,
    };
  },
});

// Test data factories
export const createTestUser = (overrides = {}) => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  college_id: '123e4567-e89b-12d3-a456-426614174001',
  department_id: '123e4567-e89b-12d3-a456-426614174002',
  role: 'student',
  name: 'Test Student',
  email: 'test@example.com',
  phone: '+1234567890',
  roll_number: 'CS2023001',
  is_active: true,
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createTestSession = (overrides = {}) => ({
  id: '123e4567-e89b-12d3-a456-426614174003',
  subject_assignment_id: '123e4567-e89b-12d3-a456-426614174004',
  teacher_id: '123e4567-e89b-12d3-a456-426614174005',
  date: new Date().toISOString().split('T')[0],
  start_time: new Date().toISOString(),
  qr_token: '123e4567-e89b-12d3-a456-426614174006',
  qr_expires_at: new Date(Date.now() + 30000).toISOString(),
  latitude: 40.7128,
  longitude: -74.0060,
  radius_meters: 100,
  status: 'active',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createTestAttendanceRecord = (overrides = {}) => ({
  id: '123e4567-e89b-12d3-a456-426614174007',
  session_id: '123e4567-e89b-12d3-a456-426614174003',
  student_id: '123e4567-e89b-12d3-a456-426614174000',
  status: 'present',
  marked_at: new Date().toISOString(),
  latitude: 40.7128,
  longitude: -74.0060,
  device_fingerprint: 'test-device',
  is_proxy_flagged: false,
  manually_overridden: false,
  ...overrides,
});
