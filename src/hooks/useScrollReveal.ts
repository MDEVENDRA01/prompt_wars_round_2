/**
 * @file useScrollReveal.ts
 * @description Hook that implements scroll-based reveal animations using the Intersection Observer API.
 */

import { useEffect, useRef, useCallback } from 'react';
import { INTERSECTION_THRESHOLD } from '../constants';

/**
 * Automatically observes elements with the '.reveal' class and triggers a 'visible' CSS class
 * when they enter the viewport boundaries.
 *
 * @param {number} [intersectionVisibilityThreshold] - Percentage of the element (0.0 to 1.0) that must be visible to trigger.
 */
export const useScrollReveal = (
  intersectionVisibilityThreshold: number = INTERSECTION_THRESHOLD
): void => {
  const scrollObserverRef = useRef<IntersectionObserver | null>(null);

  /**
   * Identifies all revealable elements in the DOM and starts observing them.
   */
  const initializeScrollRevealObserver = useCallback((): void => {
    const revealableElements = document.querySelectorAll('.reveal');
    
    const scrollObserver = new IntersectionObserver(
      (intersectionEntries) => {
        intersectionEntries.forEach((intersectionEntry) => {
          if (intersectionEntry.isIntersecting) {
            // Add the visible class to trigger the CSS animation
            intersectionEntry.target.classList.add('visible');
            
            // Stop observing once the element is visible to save resources
            scrollObserver.unobserve(intersectionEntry.target);
          }
        });
      },
      { threshold: intersectionVisibilityThreshold }
    );
    
    scrollObserverRef.current = scrollObserver;
    
    // Register all identified elements with the observer
    revealableElements.forEach((targetElement) => {
      scrollObserver.observe(targetElement);
    });
  }, [intersectionVisibilityThreshold]);

  useEffect(() => {
    initializeScrollRevealObserver();
    
    // Clean up observer when the component or application unmounts
    return () => {
      scrollObserverRef.current?.disconnect();
    };
  }, [initializeScrollRevealObserver]);
};

