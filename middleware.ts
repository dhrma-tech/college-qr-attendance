import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Role } from "@/lib/types";

const protectedAreas: Array<{ role: Role; prefixes: string[]; login: string }> = [
  { role: "student", prefixes: ["/dashboard"], login: "/login" },
  { role: "teacher", prefixes: ["/teacher/dashboard", "/teacher/attendance", "/teacher/students", "/teacher/reports", "/teacher/profile"], login: "/teacherlogin" },
  { role: "hod", prefixes: ["/hod/dashboard", "/hod/teachers", "/hod/subjects", "/hod/students", "/hod/alerts", "/hod/reports", "/hod/profile"], login: "/hodlogin" },
  { role: "admin", prefixes: ["/admin/dashboard", "/admin/config", "/admin/teachers", "/admin/students", "/admin/departments", "/admin/subjects", "/admin/timetable", "/admin/backup", "/admin/logs"], login: "/admin/login" }
];

export async function middleware(request: NextRequest) {
  const protectedArea = protectedAreas.find((area) => area.prefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix)));

  if (!protectedArea || !hasSupabaseRuntimeEnv()) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Parameters<typeof response.cookies.set>[2] }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirectToLogin(request, protectedArea.login);
  }

  const { data: profile } = await supabase.from("users").select("role,is_active,department_id,college_id").eq("id", user.id).single();

  if (!profile?.is_active || profile.role !== protectedArea.role) {
    return redirectToLogin(request, protectedArea.login);
  }

  return response;
}

function redirectToLogin(request: NextRequest, loginPath: string) {
  const url = request.nextUrl.clone();
  url.pathname = loginPath;
  url.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function hasSupabaseRuntimeEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && !url.includes("example.supabase.co") && anonKey !== "demo-anon-key");
}

export const config = {
  matcher: ["/dashboard/:path*", "/teacher/:path*", "/hod/:path*", "/admin/:path*"]
};
