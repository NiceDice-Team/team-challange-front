"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { syncTokensFromCookies } from "@/utils/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setTokens, setUserId } = useAuthStore();

  useEffect(() => {
    const tokens = syncTokensFromCookies();

    if (tokens?.accessToken && tokens?.refreshToken) {
      setTokens(tokens.accessToken, tokens.refreshToken);

      if (tokens.userId) {
        setUserId(tokens.userId);
      }
    }
  }, [setTokens, setUserId]);

  return <>{children}</>;
}
