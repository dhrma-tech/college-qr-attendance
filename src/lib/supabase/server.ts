import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig } from "../env-validation";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<Awaited<ReturnType<typeof cookies>>["set"]>[2];
};

export async function createClient() {
  const cookieStore = await cookies();
  const config = getSupabaseConfig();

  // In demo mode, return a mock client that works with localStorage
  if (config.isDemoMode) {
    return createServerClient(
      "https://example.supabase.co",
      "demo-anon-key",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: CookieToSet[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          }
        }
      }
    );
  }

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      }
    }
  });
}

/**
 * Creates a Supabase client with service role privileges
 * This bypasses RLS and should only be used for privileged server-side operations
 */
export async function createServiceRoleClient() {
  const config = getSupabaseConfig();
  
  if (config.isDemoMode) {
    throw new Error('Service role client is not available in demo mode');
  }
  
  if (!config.serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service role operations');
  }

  // Create admin client with service role key
  return createServerClient(config.url, config.serviceRoleKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // No-op for service role client
      }
    }
  });
}
