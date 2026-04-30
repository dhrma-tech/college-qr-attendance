import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "demo-service-role-key",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
}
