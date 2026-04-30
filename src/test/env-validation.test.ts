import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateSupabaseEnv, getSupabaseConfig, validateClientSideSafety } from '@/lib/env-validation';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment after each test
    process.env = originalEnv;
  });

  describe('validateSupabaseEnv', () => {
    it('should validate production environment with all required variables', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service-role';

      const result = validateSupabaseEnv();
      expect(result.isValid).toBe(true);
      expect(result.isDemoMode).toBe(false);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect demo mode when Supabase variables are empty', () => {
      process.env.NODE_ENV = 'development';
      process.env.NEXT_PUBLIC_SUPABASE_URL = '';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

      const result = validateSupabaseEnv();
      expect(result.isValid).toBe(true);
      expect(result.isDemoMode).toBe(true);
      expect(result.warnings).toContain(
        expect.stringContaining('Running in demo mode')
      );
    });

    it('should reject demo mode in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SUPABASE_URL = '';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

      expect(() => validateSupabaseEnv()).toThrow(
        'Demo mode is not allowed in production'
      );
    });

    it('should reject placeholder values in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'demo-anon-key';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

      expect(() => validateSupabaseEnv()).toThrow(
        'NEXT_PUBLIC_SUPABASE_URL contains placeholder value'
      );
    });

    it('should reject invalid URL format', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'invalid-url';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-key';

      const result = validateSupabaseEnv();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'NEXT_PUBLIC_SUPABASE_URL must start with https://'
      );
    });

    it('should reject short anon key', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'short';

      const result = validateSupabaseEnv();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)'
      );
    });

    it('should detect public service role key exposure', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-key';
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY = 'exposed-service-role';

      const result = validateSupabaseEnv();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'CRITICAL: NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is set'
      );
    });

    it('should require service role key in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-key';
      // Missing SUPABASE_SERVICE_ROLE_KEY

      expect(() => validateSupabaseEnv()).toThrow(
        'SUPABASE_SERVICE_ROLE_KEY is required in production'
      );
    });
  });

  describe('getSupabaseConfig', () => {
    it('should return config for valid environment', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-key';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

      const config = getSupabaseConfig();
      expect(config.url).toBe('https://test.supabase.co');
      expect(config.anonKey).toBe('valid-key');
      expect(config.serviceRoleKey).toBe('service-key');
      expect(config.isDemoMode).toBe(false);
    });

    it('should return demo mode config', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = '';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

      const config = getSupabaseConfig();
      expect(config.url).toBe('');
      expect(config.anonKey).toBe('');
      expect(config.serviceRoleKey).toBe('');
      expect(config.isDemoMode).toBe(true);
    });

    it('should throw error for invalid config in non-demo mode', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'invalid-url';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-key';

      expect(() => getSupabaseConfig()).toThrow(
        'Supabase configuration is invalid'
      );
    });
  });

  describe('validateClientSideSafety', () => {
    it('should pass when service role key is not available', () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = '';

      // Mock window object
      global.window = undefined;

      expect(() => validateClientSideSafety()).not.toThrow();
    });

    it('should throw error when service role key is available client-side', () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

      // Mock window object to simulate client-side
      global.window = { location: { href: 'http://localhost:3000' } };

      expect(() => validateClientSideSafety()).toThrow(
        'Security violation: Service role key is exposed to client-side code'
      );

      // Clean up
      global.window = undefined;
    });

    it('should pass on server-side even with service role key', () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

      // No window object means server-side
      global.window = undefined;

      expect(() => validateClientSideSafety()).not.toThrow();
    });
  });
});
