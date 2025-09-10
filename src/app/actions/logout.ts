"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
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

    // Clean cookies
    cookieStore.set("access_token", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    cookieStore.set("refresh_token", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    cookieStore.set("userId", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  } catch (error) {
    console.error("Error in logout action:", error);
    throw new Error("Error in logout action");
  }
}
