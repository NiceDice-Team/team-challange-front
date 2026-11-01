import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import {
  applyCorsHeaders,
  handleCorsPreflightRequest,
  rejectDisallowedCrossOriginApiRequest,
} from "@/lib/cors";
import {
  applySecurityHeaders,
  buildContentSecurityPolicyHeader,
} from "@/lib/securityHeaders";

const NO_CACHE_PAGE_HEADER = "no-store, no-cache, must-revalidate";

const NO_CACHE_ROUTE_PREFIXES = [
  "/login",
  "/profile",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/confirm-signup",
];

function createCspNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary);
}

function isNoCacheRoute(pathname: string): boolean {
  return NO_CACHE_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function withNoCachePageHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", NO_CACHE_PAGE_HEADER);
  return response;
}

function finalizeResponse(response: NextResponse, nonce?: string): NextResponse {
  if (nonce) {
    response.headers.set("x-nonce", nonce);
  }
  applySecurityHeaders(response);
  response.headers.delete("x-nonce");
  return response;
}

function isTokenExpired(token?: string): boolean {
  if (!token) return true;

  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    const currentTime = Date.now() / 1000;
    return typeof decoded.exp !== "number" || decoded.exp <= currentTime + 60;
  } catch (error) {
    return true;
  }
}

function isAuthenticated(request: NextRequest): boolean {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  return Boolean(refreshToken && !isTokenExpired(refreshToken));
}

function handleApiRoute(request: NextRequest): NextResponse {
  const preflightResponse = handleCorsPreflightRequest(request);
  if (preflightResponse) {
    return finalizeResponse(preflightResponse);
  }

  const rejectedResponse = rejectDisallowedCrossOriginApiRequest(request);
  if (rejectedResponse) {
    return finalizeResponse(rejectedResponse);
  }

  const response = applyCorsHeaders(request, NextResponse.next());
  return finalizeResponse(response);
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = createCspNonce();
  const requestHeaders = new Headers(request.headers);
  const cspHeader = buildContentSecurityPolicyHeader(
    process.env.NODE_ENV === "production",
    { nonce },
  );
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(cspHeader.key, cspHeader.value);

  if (pathname.startsWith("/api/")) {
    return handleApiRoute(request);
  }

  const protectedRoutes = ["/profile"];
  const publicRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/confirm-signup",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    if (!isAuthenticated(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return finalizeResponse(
        withNoCachePageHeaders(NextResponse.redirect(loginUrl)),
        nonce,
      );
    }
  }

  if (isPublicRoute) {
    if (isAuthenticated(request)) {
      return finalizeResponse(NextResponse.redirect(new URL("/", request.url)), nonce);
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (isNoCacheRoute(pathname) || isProtectedRoute) {
    return finalizeResponse(withNoCachePageHeaders(response), nonce);
  }

  return finalizeResponse(response, nonce);
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
