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

  useEffect(() => {
    const scrollObserver = new IntersectionObserver(
      (intersectionEntries) => {
        intersectionEntries.forEach((intersectionEntry) => {
          if (intersectionEntry.isIntersecting) {
            intersectionEntry.target.classList.add('visible');
            scrollObserver.unobserve(intersectionEntry.target);
          }
        });
      },
      { threshold: intersectionVisibilityThreshold }
    );

    scrollObserverRef.current = scrollObserver;

    // Function to observe all current .reveal elements
    const observeElements = () => {
      const revealableElements = document.querySelectorAll('.reveal:not(.visible)');
      revealableElements.forEach((el) => scrollObserver.observe(el));
    };

    // Initial scan
    observeElements();

    // Use MutationObserver to catch lazy-loaded elements
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      scrollObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [intersectionVisibilityThreshold]);
};

