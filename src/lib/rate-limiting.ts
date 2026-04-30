/**
 * Rate Limiting Helper
 * 
 * This module provides basic server-side rate limiting for API endpoints.
 * It supports both IP-based and user-based rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// In-memory store for rate limiting
// In production, this should use Redis or another persistent store
const rateLimitStore = new Map<string, RateLimitEntry>();

// Default rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // Authentication endpoints - stricter limits
  signup: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  login: { windowMs: 15 * 60 * 1000, maxRequests: 10 }, // 10 requests per 15 minutes
  
  // Attendance endpoints - moderate limits
  attendanceMark: { windowMs: 1 * 60 * 1000, maxRequests: 30 }, // 30 requests per minute
  attendanceOverride: { windowMs: 5 * 60 * 1000, maxRequests: 20 }, // 20 requests per 5 minutes
  
  // Session management - moderate limits
  sessionStart: { windowMs: 5 * 60 * 1000, maxRequests: 10 }, // 10 requests per 5 minutes
  sessionRotate: { windowMs: 1 * 60 * 1000, maxRequests: 60 }, // 60 requests per minute
  
  // Reports - conservative limits
  reports: { windowMs: 1 * 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  
  // Default limit for other endpoints
  default: { windowMs: 1 * 60 * 1000, maxRequests: 100 } // 100 requests per minute
} as const;

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check rate limit for a given identifier
 */
function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  
  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to cleanup
    cleanupExpiredEntries();
  }
  
  const existing = rateLimitStore.get(key);
  
  if (!existing || now > existing.resetTime) {
    // New entry or window expired
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs
    };
    
    rateLimitStore.set(key, newEntry);
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime
    };
  }
  
  // Existing entry within window
  if (existing.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: existing.resetTime,
      retryAfter: Math.ceil((existing.resetTime - now) / 1000)
    };
  }
  
  // Increment counter
  existing.count++;
  
  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetTime: existing.resetTime
  };
}

/**
 * Get client IP address from request
 */
function getClientIP(request: Request): string {
  // Try various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  // Fallback to a default (this shouldn't happen in production)
  return 'unknown';
}

/**
 * Rate limiting middleware function
 */
export function createRateLimiter(configName: keyof typeof RATE_LIMIT_CONFIGS) {
  const config = RATE_LIMIT_CONFIGS[configName] || RATE_LIMIT_CONFIGS.default;
  
  return async function rateLimit(
    request: Request,
    userId?: string
  ): Promise<RateLimitResult> {
    // Get IP address
    const ip = getClientIP(request);
    
    // Create identifiers for IP and user (if available)
    const ipIdentifier = `ip:${ip}:${configName}`;
    const userIdentifier = userId ? `user:${userId}:${configName}` : null;
    
    // Check IP-based rate limit
    const ipResult = checkRateLimit(ipIdentifier, config);
    
    // Check user-based rate limit if user ID is available
    let userResult: RateLimitResult | null = null;
    if (userIdentifier) {
      userResult = checkRateLimit(userIdentifier, config);
    }
    
    // Both IP and user limits must be satisfied
    if (!ipResult.allowed) {
      return ipResult;
    }
    
    if (userResult && !userResult.allowed) {
      return userResult;
    }
    
    // Return the more restrictive remaining count
    const remaining = Math.min(
      ipResult.remaining,
      userResult?.remaining || ipResult.remaining
    );
    
    return {
      allowed: true,
      remaining,
      resetTime: ipResult.resetTime
    };
  };
}

/**
 * Express-style rate limiting middleware for Next.js API routes
 */
export function withRateLimit(configName: keyof typeof RATE_LIMIT_CONFIGS) {
  const rateLimiter = createRateLimiter(configName);
  
  return function handler(
    handler: (request: Request, context?: { userId?: string }) => Promise<Response>
  ) {
    return async function rateLimitedHandler(request: Request, context?: { userId?: string }): Promise<Response> {
      try {
        const result = await rateLimiter(request, context?.userId);
        
        // Add rate limit headers
        const headers = new Headers();
        headers.set('X-RateLimit-Limit', String(RATE_LIMIT_CONFIGS[configName].maxRequests));
        headers.set('X-RateLimit-Remaining', String(result.remaining));
        headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)));
        
        if (!result.allowed) {
          headers.set('Retry-After', String(result.retryAfter || 60));
          
          return new Response(
            JSON.stringify({
              error: 'Rate limit exceeded',
              message: `Too many requests. Try again in ${result.retryAfter || 60} seconds.`,
              retryAfter: result.retryAfter || 60
            }),
            {
              status: 429,
              headers
            }
          );
        }
        
        // Call the actual handler
        const response = await handler(request, context);
        
        // Add rate limit headers to the response
        Object.entries(headers).forEach(([key, value]) => {
          if (typeof value === 'string') {
            response.headers.set(key, value);
          }
        });
        
        return response;
        
      } catch (error) {
        // If rate limiting fails, allow the request but log the error
        console.error('Rate limiting error:', error);
        return handler(request, context);
      }
    };
  };
}

/**
 * Specific rate limiters for common endpoints
 */
export const rateLimiters = {
  signup: withRateLimit('signup'),
  login: withRateLimit('login'),
  attendanceMark: withRateLimit('attendanceMark'),
  attendanceOverride: withRateLimit('attendanceOverride'),
  sessionStart: withRateLimit('sessionStart'),
  sessionRotate: withRateLimit('sessionRotate'),
  reports: withRateLimit('reports'),
  default: withRateLimit('default')
} as const;

/**
 * Helper to get user ID from request for rate limiting
 */
export async function getUserIdForRateLimit(request: Request): Promise<string | undefined> {
  try {
    // This would typically involve parsing the JWT token from the request
    // For now, we'll return undefined and rely on IP-based limiting
    // In a real implementation, you'd extract the user ID from the auth token
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return undefined;
    }
    
    // TODO: Parse JWT token and extract user ID
    // This would require the Supabase JWT secret
    return undefined;
    
  } catch (error) {
    return undefined;
  }
}

/**
 * Rate limiting utility for manual usage
 */
export async function checkRateLimitManual(
  request: Request,
  configName: keyof typeof RATE_LIMIT_CONFIGS,
  userId?: string
): Promise<RateLimitResult> {
  const rateLimiter = createRateLimiter(configName);
  return rateLimiter(request, userId);
}
