import { useCallback, useRef } from "react";

export const useDebounce = (
  callback: (value: string) => void,
  delay: number
) => {
  const timeoutRef = useRef<number | null>(null);

  return useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => callback(value), delay);
    },
    [callback, delay]
  );
};
