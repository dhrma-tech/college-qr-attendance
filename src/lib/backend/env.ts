export function hasSupabaseServerEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function backendMode() {
  return hasSupabaseServerEnv() ? "connected" : "demo";
}

export function demoResponse<T>(data: T) {
  return {
    mode: "demo" as const,
    message: "Supabase environment variables are not configured. Returning a safe demo response.",
    data
  };
}
