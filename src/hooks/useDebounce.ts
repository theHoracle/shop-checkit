"use client";

import { useEffect, useState } from "react";

export function useDebounce<TValue>(value: TValue, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}
