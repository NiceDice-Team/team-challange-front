"use client";

import { useEffect } from "react";
import {
  AUTH_TOKENS_CHANGED_EVENT,
  isAuthenticated,
} from "@/lib/tokenManager";
import {
  deleteGuestCart,
  ensureGuestCart,
  mergeGuestCartIntoUserCart,
} from "@/services/cartServices";

export function useGuestCartInit(): void {
  useEffect(() => {
    if (!isAuthenticated()) {
      void ensureGuestCart();
    }
  }, []);

  useEffect(() => {
    const handleAuthTokensChanged = () => {
      if (!isAuthenticated()) {
        return;
      }

      void (async () => {
        try {
          await mergeGuestCartIntoUserCart();
        } catch (error) {
          console.error("Failed to merge guest cart on login:", error);
          return;
        }

        await deleteGuestCart();
      })();
    };

    window.addEventListener(AUTH_TOKENS_CHANGED_EVENT, handleAuthTokensChanged);

    return () => {
      window.removeEventListener(
        AUTH_TOKENS_CHANGED_EVENT,
        handleAuthTokensChanged,
      );
    };
  }, []);
}
