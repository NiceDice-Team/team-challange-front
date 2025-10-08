"use server";

import { clearTokens } from "@/lib/tokenManager";
import { cookies } from "next/headers";

interface LogoutActionParams {
  provider?: string;
}

export async function logoutAction({ provider }: LogoutActionParams = {}) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (accessToken && refreshToken) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${API_URL}users/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        });
        if (!response.ok) {
          console.error("Server error logout", response.status);
        }
      } catch (error) {
        console.error("Sending error logout:", error);
      }
    }

    clearTokens();

    return {
      success: true,
      needsOAuthLogout: provider === "google" || provider === "facebook",
      provider: provider,
    };
  } catch (error) {
    console.error("Error in logout action:", error);
    throw new Error("Error in logout action");
  }
}
