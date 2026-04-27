import { NextResponse, type NextRequest } from "next/server";

const rolePrefixes = [
  { prefix: "/teacher", role: "teacher", login: "/teacherlogin" },
  { prefix: "/hod", role: "hod", login: "/hodlogin" },
  { prefix: "/admin", role: "admin", login: "/admin/login" },
  { prefix: "/dashboard", role: "student", login: "/login" }
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matched = rolePrefixes.find((item) => pathname.startsWith(item.prefix));

  if (!matched) return NextResponse.next();

  const cookieRole = request.cookies.get("college_attendance_role")?.value;
  if (!cookieRole || cookieRole === matched.role) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = matched.login;
  url.searchParams.set("error", "role-mismatch");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/teacher/:path*", "/hod/:path*", "/admin/:path*"]
};
