import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token) {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp <= currentTime + 60;
  } catch (error) {
    return true;
  }
}

function isAuthenticated(request) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  return refreshToken && !isTokenExpired(refreshToken);
}

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/profile"];
  const publicRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/confirm-signup",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!isAuthenticated(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isPublicRoute) {
    if (isAuthenticated(request)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
