import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { validateSupabaseEnv, getSupabaseConfig, validateClientSideSafety } from '@/lib/env-validation';

describe('Environment Validation', () => {
  const originalEnv = { ...process.env };
  
  // Realistic Supabase keys (JWT-like, minimum 100 chars)
  const validAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjAwMDAwMCwiZXhwIjoyNTI0NjA4MDAwfQ.test-signature-here-valid-anonkey';
  const validServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjIyMDAwMDAwLCJleHAiOjI1MjQ2MDgwMDB9.test-signature-valid-servicekey';

  beforeEach(() => {
    // Reset environment before each test
    vi.unstubAllEnvs();
    Object.keys(process.env).forEach(key => {
      delete process.env[key];
    });
    Object.assign(process.env, originalEnv);
  });

  afterEach(() => {
    // Restore original environment after each test
    vi.unstubAllEnvs();
    Object.keys(process.env).forEach(key => {
      delete process.env[key];
    });
    Object.assign(process.env, originalEnv);
  });

  describe('validateSupabaseEnv', () => {
    it('should validate production environment with all required variables', () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', validAnonKey);
      vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', validServiceKey);

      const result = validateSupabaseEnv();
      expect(result.isValid).toBe(true);
      expect(result.isDemoMode).toBe(false);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect demo mode when Supabase variables are empty', () => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');

      const result = validateSupabaseEnv();
      expect(result.isValid).toBe(true);
      expect(result.isDemoMode).toBe(true);
      expect(result.warnings).toContain(
        expect.stringContaining('Running in demo mode')
      );
    });

    it('should reject demo mode in production', () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');

      expect(() => validateSupabaseEnv()).toThrow(
        'Demo mode is not allowed in production'
      );
    });

    it('should reject placeholder values in production', () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', validAnonKey);
      vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', validServiceKey);

      expect(() => validateSupabaseEnv()).toThrow(
        'NEXT_PUBLIC_SUPABASE_URL contains placeholder value'
      );
    });

    it('should reject invalid URL format', () => {
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'invalid-url');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', validAnonKey);

      const result = validateSupabaseEnv();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'NEXT_PUBLIC_SUPABASE_URL must start with https://'
      );
    });

    it('should reject short anon key', () => {
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'short');

      const result = validateSupabaseEnv();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)'
      );
    });

    it('should detect public service role key exposure', () => {
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', validAnonKey);
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY', 'exposed-service-role');

      const result = validateSupabaseEnv();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'CRITICAL: NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is set'
      );
    });

    it('should require service role key in production', () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', validAnonKey);
      // Missing SUPABASE_SERVICE_ROLE_KEY

      expect(() => validateSupabaseEnv()).toThrow(
        'SUPABASE_SERVICE_ROLE_KEY is required in production'
      );
    });
  });

  describe('getSupabaseConfig', () => {
    it('should return config for valid environment', () => {
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', validAnonKey);
      vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', validServiceKey);

      const config = getSupabaseConfig();
      expect(config.url).toBe('https://test.supabase.co');
      expect(config.anonKey).toBe(validAnonKey);
      expect(config.serviceRoleKey).toBe(validServiceKey);
      expect(config.isDemoMode).toBe(false);
    });

    it('should return demo mode config', () => {
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');

      const config = getSupabaseConfig();
      expect(config.url).toBe('');
      expect(config.anonKey).toBe('');
      expect(config.serviceRoleKey).toBe('');
      expect(config.isDemoMode).toBe(true);
    });

    it('should throw error for invalid config in non-demo mode', () => {
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'invalid-url');
      vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', validAnonKey);

      expect(() => getSupabaseConfig()).toThrow(
        'Supabase configuration is invalid'
      );
    });
  });

  describe('validateClientSideSafety', () => {
    it('should pass when service role key is not available', () => {
      vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');

      // Mock window object
      vi.stubGlobal('window', undefined);

      expect(() => validateClientSideSafety()).not.toThrow();
    });

    it('should throw error when service role key is available client-side', () => {
      vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key');

      // Mock window object to simulate client-side
      vi.stubGlobal('window', { 
        location: { 
          href: 'http://localhost:3000',
          ancestorOrigins: '',
          hash: '',
          host: 'localhost:3000',
          hostname: 'localhost',
          port: '3000',
          protocol: 'http:',
          search: '',
          assign: vi.fn(),
          replace: vi.fn(),
          reload: vi.fn()
        } 
      });

      expect(() => validateClientSideSafety()).toThrow(
        'Security violation: Service role key is exposed to client-side code'
      );

      // Clean up
      vi.unstubAllGlobals();
    });

    it('should pass on server-side even with service role key', () => {
      vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key');

      // No window object means server-side
      vi.stubGlobal('window', undefined);

      expect(() => validateClientSideSafety()).not.toThrow();
    });
  });
});
