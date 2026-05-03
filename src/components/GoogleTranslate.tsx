/**
 * @file GoogleTranslate.tsx
 * @description Background service initializer for Google Translate integration.
 */

import { useEffect } from 'react';

/**
 * Initializes the Google Translate widget in a hidden container to provide localized content.
 * Exposes a global `window.__setGoogleTranslateLang(code)` function for programmatic language switching.
 *
 * Renders no visible UI directly; the widget is managed in a hidden DOM element
 * that the custom navbar language switcher proxies interaction into.
 * 
 * @returns {JSX.Element} A hidden container for the Google Translate widget.
 */
export const GoogleTranslateInit = () => {
  useEffect(() => {
    
    /**
     * Callback invoked by the Google Translate script upon initialization.
     */
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) {
        return;
      }
      
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,hi,ar,zh-CN,pt,ja,ko,ru,sw',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
        },
        'gt-hidden-container'
      );
    };

    /**
     * Programmatic language trigger exposed to the rest of the application.
     * 
     * @param {string} targetLanguageCode - The ISO language code to switch to.
     */
    window.__setGoogleTranslateLang = (targetLanguageCode: string) => {
      
      /**
       * Recursively attempts to set the language on the Google Translate select element,
       * retrying if the widget is still loading.
       * 
       * @param {number} retryAttemptCount - The current number of failed attempts.
       */
      const attemptLanguageSelectionWithRetry = (retryAttemptCount: number = 0) => {
        const translateSelectElement = document.querySelector(
          '#gt-hidden-container select.goog-te-combo'
        ) as HTMLSelectElement;

        if (translateSelectElement) {
          translateSelectElement.value = targetLanguageCode;
          translateSelectElement.dispatchEvent(new Event('change', { bubbles: true }));
        } else if (retryAttemptCount < 20) {
          // Retry every 250ms for up to 5 seconds
          setTimeout(() => attemptLanguageSelectionWithRetry(retryAttemptCount + 1), 250);
        }
      };

      attemptLanguageSelectionWithRetry();
    };

    // Inject the Google Translate core script only if it hasn't been added yet
    const existingTranslateScript = document.getElementById('gt-script');
    
    if (!existingTranslateScript) {
      const googleTranslateLoaderScript = document.createElement('script');
      googleTranslateLoaderScript.id = 'gt-script';
      googleTranslateLoaderScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      googleTranslateLoaderScript.async = true;
      document.head.appendChild(googleTranslateLoaderScript);
    }

    // Cleanup global callbacks on component unmount
    return () => {
      window.googleTranslateElementInit = undefined;
      window.__setGoogleTranslateLang = undefined;
    };
  }, []);

  return (
    <div
      id="gt-hidden-container"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        width: 0,
        height: 0,
        overflow: 'hidden',
      }}
    />
  );
};

