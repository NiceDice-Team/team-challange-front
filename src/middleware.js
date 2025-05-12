import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const NO_CACHE_PAGE_HEADER = "no-store, no-cache, must-revalidate";

const NO_CACHE_ROUTE_PREFIXES = [
  "/login",
  "/profile",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/confirm-signup",
];

function isNoCacheRoute(pathname) {
  return NO_CACHE_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function withNoCachePageHeaders(response) {
  response.headers.set("Cache-Control", NO_CACHE_PAGE_HEADER);
  return response;
}

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
      return withNoCachePageHeaders(NextResponse.redirect(loginUrl));
    }
  }

  if (isPublicRoute) {
    if (isAuthenticated(request)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const response = NextResponse.next();

  if (isNoCacheRoute(pathname) || isProtectedRoute) {
    return withNoCachePageHeaders(response);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
