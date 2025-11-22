import { RefObject, useEffect } from "react";

/**
 * Custom hook to detect clicks outside of a referenced element
 * @param ref - React ref object pointing to the target element
 * @param callback - Function to call when a click outside is detected
 */
export default function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: () => void
): void {
  function handleClickOutside(event: MouseEvent): void {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
}
