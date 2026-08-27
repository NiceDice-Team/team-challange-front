import { NextRequest, NextResponse } from "next/server";

const ALLOWED_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
const ALLOWED_HEADERS = "Content-Type, Authorization, X-Requested-With";

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, "");
}

export function getAllowedOrigins(): string[] {
  const origins: string[] = [];

  if (process.env.NEXTAUTH_URL) {
    origins.push(normalizeOrigin(process.env.NEXTAUTH_URL));
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    origins.push(normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL));
  }

  if (process.env.NODE_ENV === "development") {
    origins.push("http://localhost:3000", "http://127.0.0.1:3000");
  }

  return [...new Set(origins)];
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) {
    return false;
  }

  const normalizedOrigin = normalizeOrigin(origin);

  return getAllowedOrigins().some(
    (allowedOrigin) => normalizeOrigin(allowedOrigin) === normalizedOrigin,
  );
}

export function applyCorsHeaders(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  const origin = request.headers.get("origin");

  if (origin && isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.append("Vary", "Origin");
  }

  response.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  response.headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);

  return response;
}

export function handleCorsPreflightRequest(
  request: NextRequest,
): NextResponse | null {
  if (request.method !== "OPTIONS") {
    return null;
  }

  const origin = request.headers.get("origin");

  if (origin && !isAllowedOrigin(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  const response = new NextResponse(null, { status: 204 });
  return applyCorsHeaders(request, response);
}

export function rejectDisallowedCrossOriginApiRequest(
  request: NextRequest,
): NextResponse | null {
  const origin = request.headers.get("origin");

  if (!origin || isAllowedOrigin(origin)) {
    return null;
  }

  return new NextResponse(null, { status: 403 });
}
