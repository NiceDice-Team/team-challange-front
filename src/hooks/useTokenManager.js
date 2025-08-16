import { useState, useCallback } from "react";
import {
  getValidAccessToken,
  isAuthenticated,
  logout,
  getUserFromToken,
} from "@/lib/tokenManager";

/**
 * Хук для управления токенами в React компонентах
 */
export function useTokenManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getValidAccessToken();
      return token;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Выполняет API запрос с автоматическим управлением токенами
   */
  const executeWithToken = useCallback(async (apiCall) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Выход из системы
   */
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
