/**
 * @file useActiveSection.ts
 * @description Hook that identifies which logical section of the page is currently visible in the viewport.
 */

import { useState, useEffect, useCallback } from 'react';
import { SECTION_IDS } from '../constants';

/**
 * Tracks which section is currently visible in the viewport using the Intersection Observer API.
 * This is primarily used for navigation highlighting.
 *
 * @returns {string} The ID of the currently active/visible section.
 */
export const useActiveSection = (): string => {
  const [currentlyActiveSectionId, setCurrentlyActiveSectionId] = useState<string>(SECTION_IDS[0]);

  /**
   * Initializes and configures the Intersection Observer for all registered section IDs.
   * 
   * @returns {IntersectionObserver} The configured observer instance.
   */
  const createSectionIntersectionObserver = useCallback((): IntersectionObserver => {
    const sectionObserver = new IntersectionObserver(
      (intersectionEntries) => {
        intersectionEntries.forEach((intersectionEntry) => {
          if (intersectionEntry.isIntersecting) {
            setCurrentlyActiveSectionId(intersectionEntry.target.id);
          }
        });
      },
      { 
        // 30% visibility threshold to trigger the change
        threshold: 0.3 
      }
    );

    // Register each section element with the observer
    SECTION_IDS.forEach((id) => {
      const targetElement = document.getElementById(id);
      if (targetElement) {
        sectionObserver.observe(targetElement);
      }
    });

    return sectionObserver;
  }, []);

  useEffect(() => {
    const activeObserver = createSectionIntersectionObserver();
    
    // Clean up observer on component unmount
    return () => activeObserver.disconnect();
  }, [createSectionIntersectionObserver]);

  return currentlyActiveSectionId;
};

