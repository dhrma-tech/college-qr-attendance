/**
 * Environment Variable Validation
 * 
 * This module validates critical environment variables and prevents
 * unsafe fallback behavior in production.
 */

export interface EnvValidationResult {
  isValid: boolean;
  isDemoMode: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates Supabase environment variables
 * 
 * In production, this will throw errors if required variables are missing
 * or contain placeholder values. In development, it allows demo mode.
 */
export function validateSupabaseEnv(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Check for demo mode (empty Supabase variables)
  const isDemoMode = !supabaseUrl && !supabaseAnonKey;
  
  if (isDemoMode) {
    if (isProduction) {
      errors.push(
        'Demo mode is not allowed in production. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
      );
    } else {
      warnings.push(
        'Running in demo mode with mock data. ' +
        'Set Supabase environment variables for full functionality.'
      );
    }
  }
  
  // Validate Supabase URL
  if (supabaseUrl) {
    if (supabaseUrl.includes('example.supabase.co')) {
      errors.push(
        'NEXT_PUBLIC_SUPABASE_URL contains placeholder value. ' +
        'Replace with your actual Supabase project URL.'
      );
    }
    
    if (!supabaseUrl.startsWith('https://')) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL must start with https://');
    }
  }
  
  // Validate anon key
  if (supabaseAnonKey) {
    if (supabaseAnonKey.includes('demo-anon-key') || supabaseAnonKey.includes('placeholder')) {
      errors.push(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY contains placeholder value. ' +
        'Replace with your actual Supabase anon key.'
      );
    }
    
    if (supabaseAnonKey.length < 100) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)');
    }
  }
  
  // Validate service role key (server-side only)
  if (!serviceRoleKey && !isDemoMode && isProduction) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is required in production');
  } else if (serviceRoleKey) {
    if (serviceRoleKey.includes('placeholder') || serviceRoleKey.includes('demo')) {
      errors.push(
        'SUPABASE_SERVICE_ROLE_KEY contains placeholder value. ' +
        'Replace with your actual Supabase service role key.'
      );
    }
    
    if (serviceRoleKey.length < 100) {
      errors.push('SUPABASE_SERVICE_ROLE_KEY appears to be invalid (too short)');
    }
  }
  
  // Check for public exposure of service role key
  if (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    errors.push('CRITICAL: NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is set');
  }
  
  const isValid = errors.length === 0;
  
  // In production, fail hard on validation errors
  if (isProduction && !isValid) {
    throw new Error(
      'Environment validation failed for production:\n' +
      errors.join('\n') +
      '\n\nPlease review your environment variables and documentation.'
    );
  }
  
  return {
    isValid,
    isDemoMode,
    errors,
    warnings
  };
}

/**
 * Gets validated Supabase configuration
 * Throws in production if configuration is invalid
 */
export function getSupabaseConfig() {
  const validation = validateSupabaseEnv();
  
  if (!validation.isValid && !validation.isDemoMode) {
    throw new Error(
      'Supabase configuration is invalid:\n' +
      validation.errors.join('\n')
    );
  }
  
  // In demo mode, return empty strings to prevent test contamination
  if (validation.isDemoMode) {
    return {
      url: '',
      anonKey: '',
      serviceRoleKey: '',
      isDemoMode: true
    };
  }
  
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    isDemoMode: validation.isDemoMode
  };
}

/**
 * Validates that we're not accidentally exposing service role key to client
 * This should be called in client-side code
 */
export function validateClientSideSafety() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (typeof window !== 'undefined' && serviceRoleKey) {
    console.error('SECURITY WARNING: Service role key is available on client-side!');
    throw new Error(
      'Security violation: Service role key is exposed to client-side code. ' +
      'This should never happen in production.'
    );
  }
}
