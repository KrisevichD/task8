import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔑 Проверяем именно 'access_token', как в DevTools на скриншоте
  const token = request.cookies.get("access_token")?.value;
  const language = request.cookies.get("app_language")?.value;

  const response = NextResponse.next();

  if (!language) {
    response.cookies.set("app_language", "en", {
      path: "/",
      maxAge: 31536000,
    });
  }

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");

  const isAuthenticated = Boolean(token);

  if (!isAuthenticated && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    const employeesUrl = new URL("/employees", request.url);
    return NextResponse.redirect(employeesUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
