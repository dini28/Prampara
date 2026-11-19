import { NextResponse, type NextRequest } from "next/server";
import {
  CSRF_COOKIE,
  getAdminPathSegment,
  SESSION_MAX_AGE_SEC,
  STAFF_SESSION_COOKIE,
} from "@/lib/admin-config";
import { createCsrfToken, parseStaffSession } from "@/lib/session-token";

async function isStaffRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(STAFF_SESSION_COOKIE)?.value;
  return (await parseStaffSession(token)) !== null;
}

function withCsrf(res: NextResponse, request: NextRequest) {
  if (!request.cookies.get(CSRF_COOKIE)?.value) {
    res.cookies.set(CSRF_COOKIE, createCsrfToken(), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SEC,
    });
  }
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSeg = getAdminPathSegment();
  const adminPrefix = `/${adminSeg}`;

  // Hide internal /staff from direct public discovery
  if (pathname === "/staff" || pathname.startsWith("/staff/")) {
    return new NextResponse(null, { status: 404 });
  }

  // Legacy /admin , hard 404 (no links, no discovery)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new NextResponse(null, { status: 404 });
  }

  // Obscure public URL → internal /staff rewrite
  if (pathname === adminPrefix || pathname.startsWith(`${adminPrefix}/`)) {
    const rest = pathname.slice(adminPrefix.length) || "";
    const url = request.nextUrl.clone();
    url.pathname = `/staff${rest || ""}`;

    const isLoginSurface = url.pathname === "/staff" || url.pathname === "/staff/";
    const authed = await isStaffRequest(request);

    if (!isLoginSurface && !authed) {
      const login = request.nextUrl.clone();
      login.pathname = adminPrefix;
      login.search = "";
      return NextResponse.redirect(login);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pp-desk", "1");
    const res = withCsrf(
      NextResponse.rewrite(url, { request: { headers: requestHeaders } }),
      request,
    );
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (pathname.startsWith("/api/staff")) {
    if (!(await isStaffRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/staff",
    "/staff/:path*",
    "/api/staff/:path*",
    "/((?!_next/static|_next/image|favicon.ico|icons/|sw.js|manifest.webmanifest|offline|india-states.svg).*)",
  ],
};
