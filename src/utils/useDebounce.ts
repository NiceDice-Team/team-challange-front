import { useEffect, useRef, useMemo } from "react";
import debounce from "lodash/debounce";

/**
 * Custom hook for debouncing callbacks with ref pattern
 * Prevents stale closures by using ref to always call the latest callback
 *
 * @param callback - The function to debounce
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns Debounced version of the callback
 *
 * @example
 * const handleSearch = () => {
 *   console.log("Searching:", searchValue);
 * };
 *
 * const debouncedSearch = useDebounce(handleSearch, 500);
 *
 * // In your input handler:
 * onChange={(e) => {
 *   setValue(e.target.value);
 *   debouncedSearch();
 * }}
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  const callbackRef = useRef<T>(callback);

  // Update ref when callback changes to avoid stale closures
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create debounced function with useMemo to avoid recreating on every render
  const debouncedCallback = useMemo(() => {
    const func = (...args: Parameters<T>) => {
      callbackRef.current?.(...args);
    };

    return debounce(func, delay);
  }, [delay]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};
