import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types";

export async function requireRole(role: Role) {
  return requireAnyRole([role]);
}

export async function requireAnyRole(roles: Role[]) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new AuthzError("Authentication required", 401);
  }

  const { data: profile, error: profileError } = await supabase.from("users").select("role,is_active").eq("id", user.id).single();

  if (profileError || !profile?.is_active || !roles.includes(profile.role)) {
    throw new AuthzError(`Active ${roles.join(" or ")} account required`, 403);
  }

  return { user, profile, supabase };
}

export class AuthzError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
