import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig, validateClientSideSafety } from "../env-validation";

export function createClient() {
  // Validate that we're not exposing service role key to client
  validateClientSideSafety();
  
  const config = getSupabaseConfig();
  
  // In demo mode, return a mock client that works with localStorage
  if (config.isDemoMode) {
    return createBrowserClient(
      "https://example.supabase.co",
      "demo-anon-key"
    );
  }
  
  return createBrowserClient(config.url, config.anonKey);
}
