import { jwtDecode } from "jwt-decode";
import { getCookie, deleteCookie } from "@/utils/auth";

/**
 * Получает токены из кукисов
 */
export function getTokens() {
  const accessToken = getCookie("access_token");
  const refreshToken = getCookie("refresh_token");

  return { accessToken, refreshToken };
}

/**
 * Сохраняет токены в кукисы
 */
function setTokens(accessToken, refreshToken) {
  if (typeof document === "undefined") return;

  if (accessToken) {
    document.cookie = `access_token=${accessToken}; path=/; max-age=900; secure; samesite=strict`; // 15 minutes
  }

  if (refreshToken) {
    document.cookie = `refresh_token=${refreshToken}; path=/; max-age=604800; secure; samesite=strict`; // 7 days
  }
}

/**
 * Очищает токены из кукисов
 */
function clearTokens() {
  deleteCookie("access_token");
  deleteCookie("refresh_token");
  deleteCookie("userId");
}

/**
 * Проверяет, истек ли токен
 */
function isTokenExpired(token) {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp <= currentTime + 60;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}

/**
 * Обновляет access token используя refresh token
 */
async function refreshAccessToken() {
  const { refreshToken } = getTokens();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  if (isTokenExpired(refreshToken)) {
    throw new Error("Refresh token expired");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}users/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.access) {
      throw new Error("No access token in response");
    }

    setTokens(data.access, data.refresh || refreshToken);

    return data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    clearTokens();
    throw error;
  }
}

export async function getValidAccessToken() {
  const { accessToken, refreshToken } = getTokens();

  if (!refreshToken) {
    throw new Error("No refresh token - user not authenticated");
  }

  if (isTokenExpired(refreshToken)) {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Refresh token expired - redirecting to login");
  }

  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  try {
    const newAccessToken = await refreshAccessToken();
    return newAccessToken;
  } catch (error) {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw error;
  }
}

export function isAuthenticated() {
  const { refreshToken } = getTokens();
  return refreshToken && !isTokenExpired(refreshToken);
}

export function logout() {
  clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export function getUserFromToken(token = null) {
  try {
    const tokenToUse = token || getTokens().accessToken;
    if (!tokenToUse) return null;

    const decoded = jwtDecode(tokenToUse);
    return {
      userId: decoded.user_id,
      email: decoded.email,
    };
  } catch (error) {
    console.error("Error getting user from token:", error);
    return null;
  }
}
