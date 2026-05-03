/**
 * @file useLocalStorage.ts
 * @description Hook for managing state that is automatically synchronized with the browser's localStorage.
 */

import { useState } from 'react';

/**
 * Custom hook to manage state synchronized with localStorage.
 * Handles parsing errors and private mode restrictions gracefully.
 *
 * @template T - The type of the value being stored.
 * @param {string} storageKey - The localStorage key used for persistence.
 * @param {T} initialFallbackValue - The initial value to use if no data exists in storage.
 * @returns {readonly [T, (value: T | ((v: T) => T)) => void]} A tuple containing the current state and a setter function.
 */
export const useLocalStorage = <T>(
  storageKey: string, 
  initialFallbackValue: T
): readonly [T, (value: T | ((v: T) => T)) => void] => {
  const [synchronizedValue, setSynchronizedValue] = useState<T>(() => {
    try {
      const rawStoredItem = window.localStorage.getItem(storageKey);
      return rawStoredItem ? JSON.parse(rawStoredItem) : initialFallbackValue;
    } catch (readError) {
      console.warn(`Error reading localStorage key "${storageKey}":`, readError);
      return initialFallbackValue;
    }
  });

  /**
   * Updates the synchronized state and persists it to localStorage.
   * 
   * @param {T | ((v: T) => T)} newValueOrUpdateFunction - The new value or a function to calculate it.
   */
  const updateValueAndPersist = (newValueOrUpdateFunction: T | ((v: T) => T)) => {
    try {
      const finalValueToPersist = newValueOrUpdateFunction instanceof Function 
        ? newValueOrUpdateFunction(synchronizedValue) 
        : newValueOrUpdateFunction;
        
      setSynchronizedValue(finalValueToPersist);
      window.localStorage.setItem(storageKey, JSON.stringify(finalValueToPersist));
    } catch (writeError) {
      console.warn(`Error setting localStorage key "${storageKey}":`, writeError);
    }
  };

  return [synchronizedValue, updateValueAndPersist] as const;
};

