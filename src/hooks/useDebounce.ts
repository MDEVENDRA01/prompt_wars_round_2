/**
 * @file useDebounce.ts
 * @description Hook that delays the update of a value until a specified duration has passed since the last change.
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a rapidly changing value.
 * Useful for delaying expensive operations like search queries or API calls until the user stops typing.
 *
 * @template T - The type of the value being debounced.
 * @param {T} inputValue - The value to debounce.
 * @param {number} delayMilliseconds - The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(inputValue: T, delayMilliseconds: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(inputValue);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const debounceTimerHandle = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delayMilliseconds);

    // If the input value or delay changes before the timer finishes, clear the old timer
    return () => {
      clearTimeout(debounceTimerHandle);
    };
  }, [inputValue, delayMilliseconds]);

  return debouncedValue;
}

