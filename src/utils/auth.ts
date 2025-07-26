/*
Get cookie from client
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Delete cookie from client
 */
export function deleteCookie(name: string): void {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const accessToken = getCookie("accessToken");
  return !!accessToken;
}

/**
 * Synchronize tokens from cookies to store
 */
export function syncTokensFromCookies() {
  if (typeof window === "undefined") return null;

  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");
  const userId = getCookie("userId");

  return {
    accessToken,
    refreshToken,
    userId,
  };
}

/**
 * Get url from query params
 */
export function getReturnUrl(): string | null {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("returnUrl");
}

/**
 * Clear returnUrl from url
 */
export function clearReturnUrl(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.delete("returnUrl");
  window.history.replaceState({}, "", url.toString());
}
