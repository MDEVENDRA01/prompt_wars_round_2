/**
 * @file useSecureApi.ts
 * @description Secure middleware hook for external API interactions.
 * Handles JWT injection, response sanitization, and standardized error handling.
 */

import { useState, useCallback } from 'react';
import DOMPurify from 'dompurify';

/**
 * Configuration options for the secure fetch request.
 */
interface SecureFetchOptions extends RequestInit {
  /** Whether the request requires an authorization token. */
  requireAuth?: boolean;
}

/**
 * Secure middleware hook for external API interactions.
 * Automatically injects authorization tokens, sanitizes responses, 
 * and standardizes error handling.
 * 
 * @returns {Object} An object containing fetchSecure, loading, and error states.
 */
export const useSecureApi = () => {
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /**
   * Executes a secure fetch request with middleware features.
   * 
   * @template T The expected response data type.
   * @param {string} url - The endpoint URL.
   * @param {SecureFetchOptions} [options={}] - Fetch configuration options.
   * @returns {Promise<T | null>} The sanitized response data or null on error.
   */
  const fetchSecure = useCallback(async <T>(
    url: string, 
    options: SecureFetchOptions = {}
  ): Promise<T | null> => {
    setIsApiLoading(true);
    setApiError(null);

    try {
      const requestHeaders = new Headers(options.headers);
      
      // 1. JWT Injection (Middleware)
      if (options.requireAuth) {
        // In a real app, retrieve token from secure HttpOnly cookie or Firebase Auth instance
        const authToken = window.sessionStorage.getItem('auth_token'); 
        if (authToken) {
          requestHeaders.append('Authorization', `Bearer ${authToken}`);
        }
      }

      // 2. Enforce strict content types
      requestHeaders.append('Content-Type', 'application/json');
      requestHeaders.append('Accept', 'application/json');

      const apiResponse = await fetch(url, {
        ...options,
        headers: requestHeaders,
        // Ensure no credentials are leaked cross-origin unless explicitly requested
        credentials: options.credentials || 'same-origin', 
      });

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.status} ${apiResponse.statusText}`);
      }

      const rawResponseData = await apiResponse.json();

      // 3. XSS Sanitization (Deep traverse and sanitize string fields)
      // We stringify and sanitize the whole payload as a baseline security measure
      const sanitizedResponseString = DOMPurify.sanitize(JSON.stringify(rawResponseData));
      const safeResponseData = JSON.parse(sanitizedResponseString) as T;

      return safeResponseData;
    } catch (networkError: unknown) {
      const errorMessage = networkError instanceof Error 
        ? networkError.message 
        : 'An unknown network error occurred while communicating with the API.';
      
      setApiError(errorMessage);
      return null;
    } finally {
      setIsApiLoading(false);
    }
  }, []);

  return { fetchSecure, loading: isApiLoading, error: apiError };
};

