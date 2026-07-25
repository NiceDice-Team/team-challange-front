import { useState, useCallback } from "react";
import { getValidAccessToken, logout } from "@/lib/tokenManager";

export function useTokenManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getValidAccessToken();
      return token;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to get access token");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const executeWithToken = useCallback(async <T>(apiCall: () => Promise<T>): Promise<T> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await apiCall();
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authenticated request failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);


  const handleLogout = useCallback(() => {
    logout();
  }, []);

  return {
    getToken,
    executeWithToken,
    handleLogout,
    isLoading,
    error,
  };
}
