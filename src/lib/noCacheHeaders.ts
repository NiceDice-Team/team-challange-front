import { isAuthenticated } from "@/lib/tokenManager";

export const NO_CACHE_CONTROL_VALUE = "no-store, no-cache, must-revalidate";

export const NO_CACHE_REQUEST_HEADERS: Readonly<Record<string, string>> = {
  "Cache-Control": NO_CACHE_CONTROL_VALUE,
};

export const NO_CACHE_ROUTE_PREFIXES = [
  "/login",
  "/profile",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/confirm-signup",
] as const;

export function isNoCacheRoute(pathname: string): boolean {
  return NO_CACHE_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function shouldAttachNoCacheHeaders(): boolean {
  if (typeof window !== "undefined" && isNoCacheRoute(window.location.pathname)) {
    return true;
  }

  return isAuthenticated();
}

export interface MergeNoCacheHeadersOptions {
  force?: boolean;
}

export function mergeNoCacheHeaders(
  headers: Record<string, string> = {},
  options: MergeNoCacheHeadersOptions = {},
): Record<string, string> {
  if (!options.force && !shouldAttachNoCacheHeaders()) {
    return headers;
  }

  return {
    ...headers,
    ...NO_CACHE_REQUEST_HEADERS,
  };
}
