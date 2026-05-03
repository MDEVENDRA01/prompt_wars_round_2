/**
 * @file useAnalytics.ts
 * @description Hook that provides a standardized interface for logging events and errors to Firebase Analytics.
 */

import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { firebaseAnalytics, isFirebaseConfigured } from '@/firebase';

/**
 * Hook to handle Google Analytics tracking.
 * Provides a unified interface for logging events and handles section-based "page view" tracking.
 * 
 * @param {string} [currentActiveSectionName] - The name of the currently active section for page view tracking.
 * @returns {Object} An object containing trackEvent and trackError functions.
 */
export const useAnalytics = (currentActiveSectionName?: string) => {
  
  // Track "page views" when the active section changes (useful for single-page applications)
  useEffect(() => {
    if (isFirebaseConfigured && firebaseAnalytics && currentActiveSectionName) {
      logEvent(firebaseAnalytics, 'page_view', {
        page_title: currentActiveSectionName,
        page_path: `/#${currentActiveSectionName}`,
      });
    }
  }, [currentActiveSectionName]);

  /**
   * Logs a custom event to Firebase Analytics if the service is configured.
   * 
   * @param {string} eventName - The unique name identifying the event.
   * @param {Record<string, any>} [eventParameters] - Key-value pairs providing additional context.
   */
  const trackEvent = (eventName: string, eventParameters?: Record<string, any>) => {
    if (isFirebaseConfigured && firebaseAnalytics) {
      logEvent(firebaseAnalytics, eventName, eventParameters);
    }
  };

  /**
   * Specifically logs an application error as an analytics event.
   * 
   * @param {string} errorMessageText - The descriptive text of the error.
   * @param {string} sourceComponentName - The name of the component where the error was caught.
   */
  const trackError = (errorMessageText: string, sourceComponentName: string) => {
    trackEvent('app_error', {
      error_message: errorMessageText,
      component_name: sourceComponentName,
    });
  };

  return { trackEvent, trackError };
};


