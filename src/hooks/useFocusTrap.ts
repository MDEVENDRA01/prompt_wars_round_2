/**
 * @file useFocusTrap.ts
 * @description Hook that traps keyboard focus within a specific DOM container, essential for modal accessibility.
 */

import { useEffect, useRef, RefObject } from 'react';

/**
 * Traps keyboard focus within a container element to prevent users from tabbing out of active modals or dialogs.
 * Restores focus to the previously active element when the trap is deactivated.
 *
 * @param {RefObject<HTMLElement>} containerRef - React ref pointing to the container element to trap focus within.
 * @param {boolean} isTrapActive - Flag to enable or disable the focus trap.
 */
export const useFocusTrap = (containerRef: RefObject<HTMLElement>, isTrapActive: boolean) => {
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isTrapActive || !containerRef.current) {
      return;
    }

    // Capture the element that was focused before the trap was activated
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
    
    const containerElement = containerRef.current;

    // Selector for all potentially interactive elements
    const interactiveElementsSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const interactiveElements = containerElement.querySelectorAll(interactiveElementsSelector);
    
    const firstFocusableElement = interactiveElements[0] as HTMLElement;
    const lastFocusableElement = interactiveElements[interactiveElements.length - 1] as HTMLElement;

    // Set initial focus to the first interactive element
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    /**
     * Handles the 'Tab' key press to cycle focus within the container boundaries.
     * 
     * @param {KeyboardEvent} keyboardEvent - The native keyboard event.
     */
    const handleTrapKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key !== 'Tab') {
        return;
      }

      if (keyboardEvent.shiftKey) {
        // Shift + Tab: Move focus to the end if we're at the start
        if (document.activeElement === firstFocusableElement) {
          keyboardEvent.preventDefault();
          lastFocusableElement.focus();
        }
      } else {
        // Tab: Move focus to the start if we're at the end
        if (document.activeElement === lastFocusableElement) {
          keyboardEvent.preventDefault();
          firstFocusableElement.focus();
        }
      }
    };

    containerElement.addEventListener('keydown', handleTrapKeyDown);

    return () => {
      // Cleanup: remove listener and restore focus to the original element
      containerElement.removeEventListener('keydown', handleTrapKeyDown);
      
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [isTrapActive, containerRef]);
};

