/**
 * @file useFetch.ts
 * @description Generic hook for managing asynchronous fetch requests with basic session caching.
 */

import { useState, useCallback } from 'react';

/**
 * Prefix used for session storage caching to avoid collisions.
 */
const FETCH_CACHE_PREFIX = 'fetch_cache_';

/**
 * Manages async fetch state: loading, data, and error.
 * Caches results in sessionStorage by URL to avoid redundant requests within the same session.
 *
 * @template T - The expected type of the fetched data.
 * @returns {Object} An object containing the data, loading state, error state, and the fetchData function.
 */
export const useFetch = <T>() => {
  const [fetchedData, setFetchedData] = useState<T | null>(null);
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);

  /**
   * Executes a fetch request and updates the state.
   * 
   * @param {string} url - The URL to fetch from.
   * @param {RequestInit} [options={}] - Standard fetch options.
   * @returns {Promise<void>}
   */
  const executeFetch = useCallback(async (
    url: string, 
    options: RequestInit = {}
  ): Promise<void> => {
    if (!url) {
      return;
    }

    const cacheKey = `${FETCH_CACHE_PREFIX}${url}`;
    const cachedDataString = sessionStorage.getItem(cacheKey);

    // Attempt to load from cache first
    if (cachedDataString) {
      try {
        setFetchedData(JSON.parse(cachedDataString));
        return;
      } catch (parseError) {
        // Cache entry is invalid, proceed with fresh fetch
        console.warn('Failed to parse cached data:', parseError);
      }
    }

    setIsFetchLoading(true);
    setFetchErrorMessage(null);

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }
      
      const responseBodyJson = await response.json();
      setFetchedData(responseBodyJson);
      
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(responseBodyJson));
      } catch (storageError) {
        // SessionStorage quota might be exceeded, we ignore this as caching is a non-critical optimization
        console.debug('SessionStorage cache update failed:', storageError);
      }
    } catch (networkOrParseError: unknown) {
      const message = networkOrParseError instanceof Error 
        ? networkOrParseError.message 
        : 'An unexpected error occurred during the fetch operation.';
      setFetchErrorMessage(message);
    } finally {
      setIsFetchLoading(false);
    }
  }, []);

  return { 
    data: fetchedData, 
    loading: isFetchLoading, 
    error: fetchErrorMessage, 
    fetchData: executeFetch 
  };
};

