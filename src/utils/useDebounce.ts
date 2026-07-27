import { useEffect, useRef, useMemo } from "react";

type DebouncedFunction<T extends (...args: never[]) => unknown> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
};

function createDebouncedFunction<T extends (...args: never[]) => unknown>(
  callback: (...args: Parameters<T>) => void,
  delay: number,
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  }) as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
}

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
export const useDebounce = <T extends (...args: never[]) => unknown>(
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

    return createDebouncedFunction<T>(func, delay);
  }, [delay]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};
