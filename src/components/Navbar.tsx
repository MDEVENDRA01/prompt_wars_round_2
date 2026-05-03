/**
 * @file Navbar.tsx
 * @description Primary navigation component featuring language localization, mobile-responsive menu, and section-based highlighting.
 */

import { useState, useCallback, memo, KeyboardEvent, MouseEvent } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GoogleTranslateInit } from './GoogleTranslate';
import { LANGUAGES, NAV_LINKS, APP_NAME, ARIA_LABELS, STORAGE_KEYS } from '../constants';

/**
 * Configuration for an application-supported language.
 */
interface AppLanguageConfiguration {
  /** ISO 639-1 language code. */
  languageCode: string;
  /** Specialized language code used for Google Translate integration. */
  googleTranslateCode: string;
  /** Display label for the language (e.g., "English", "Español"). */
  languageLabel: string;
  /** Emoji flag representation of the language. */
  flagEmoji: string;
}

/**
 * Properties for a single navigation link item.
 */
interface NavLinkProps {
  /** The target internal anchor URL (e.g., "#hero"). */
  targetAnchorUrl: string;
  /** The human-readable text to display for the link. */
  displayLabel: string;
  /** Descriptive ARIA label for screen readers. */
  accessibleAriaLabel: string;
  /** The unique ID of the section this link targets. */
  targetSectionId: string;
  /** The ID of the section currently active in the viewport. */
  currentActiveSectionId: string;
  /** Callback function triggered when the link is activated. */
  onLinkClickCallback: () => void;
}

// ── Icon Components ───────────────────────────────────────────────────────────

/** 
 * Globe SVG icon used as a visual indicator for the language selection tool.
 */
const GlobeIcon = memo(() => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
});

GlobeIcon.displayName = 'GlobeIcon';

/** 
 * Chevron SVG icon used to indicate the presence of a dropdown menu.
 */
const ChevronDownIcon = memo(() => {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
});

ChevronDownIcon.displayName = 'ChevronDownIcon';

// ── Language Selector ─────────────────────────────────────────────────────────

/**
 * Interactive dropdown component for selecting the application's display language.
 * Integrates with the Google Translate background service for automated localization.
 * 
 * @returns {JSX.Element} The rendered language selector.
 */
const LanguageSelectorDropdown = () => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [activeLanguageCode, setActiveLanguageCode] = useLocalStorage<string>(
    STORAGE_KEYS.LANGUAGE, 
    'en'
  );

  const currentSelectedLanguage = LANGUAGES.find(
    (lang) => lang.code === activeLanguageCode
  ) ?? (LANGUAGES[0] as unknown as AppLanguageConfiguration);

  /**
   * Processes a language change request.
   * Updates local state and triggers the global translation service.
   * 
   * @param {AppLanguageConfiguration} selectedLanguage - The language configuration to apply.
   */
  const applyLanguageSelection = useCallback((selectedLanguage: AppLanguageConfiguration) => {
    setActiveLanguageCode(selectedLanguage.languageCode);
    setIsLanguageDropdownOpen(false);
    
    // Set root document language for accessibility compliance
    document.documentElement.lang = selectedLanguage.languageCode;

    if (selectedLanguage.googleTranslateCode === 'en') {
      // Revert to original English content
      const googleTranslateRestoreTrigger = document.querySelector(
        '.goog-te-restore, a.goog-logo-link'
      ) as HTMLElement;
      
      if (googleTranslateRestoreTrigger) {
        googleTranslateRestoreTrigger.click();
      }
    } else {
      // Dispatch language code to the background Google Translate service
      window.__setGoogleTranslateLang?.(selectedLanguage.googleTranslateCode);
    }
  }, [setActiveLanguageCode]);

  const toggleDropdownVisibility = useCallback(() => {
    setIsLanguageDropdownOpen((previousState) => !previousState);
  }, []);

  const handleDropdownKeyboardEvents = useCallback((keydownEvent: KeyboardEvent<HTMLDivElement>) => {
    if (keydownEvent.key === 'Escape') {
      setIsLanguageDropdownOpen(false);
    }
  }, []);

  return (
    <div className="language-switcher-container" onKeyDown={handleDropdownKeyboardEvents}>
      <button
        id="language-selector-toggle"
        className={`language-selector-button${isLanguageDropdownOpen ? ' open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isLanguageDropdownOpen}
        aria-label={ARIA_LABELS.LANGUAGE}
        onClick={toggleDropdownVisibility}
        title="Translate via Google Translate"
      >
        <GlobeIcon />
        <span className="language-flag-display">
          {currentSelectedLanguage.flagEmoji || (currentSelectedLanguage as any).flag}
        </span>
        <span className="language-label-text-display">
          {currentSelectedLanguage.languageLabel || (currentSelectedLanguage as any).label}
        </span>
        <ChevronDownIcon />
      </button>

      {isLanguageDropdownOpen && (
        <div
          id="language-options-dropdown"
          className="language-options-dropdown"
          role="listbox"
          aria-label="Available translation languages"
        >
          <div className="google-translate-powered-by-label">
            Powered by Google Translate
          </div>
          {LANGUAGES.map((languageItem: any) => {
            const langConfig = languageItem as unknown as AppLanguageConfiguration;
            const code = langConfig.languageCode || (languageItem as any).code;
            const label = langConfig.languageLabel || (languageItem as any).label;
            const flag = langConfig.flagEmoji || (languageItem as any).flag;

            return (
              <button
                key={code}
                className={`language-menu-item${code === activeLanguageCode ? ' active' : ''}`}
                role="option"
                aria-selected={code === activeLanguageCode}
                onClick={() => applyLanguageSelection(langConfig)}
              >
                <span className="language-flag-display">{flag}</span>
                {label}
                {code === activeLanguageCode && (
                  <span className="language-selection-indicator-icon">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Navigation Link ───────────────────────────────────────────────────────────

/** 
 * A specialized navigation link that reflects the active scroll state of the page.
 */
const ActiveSectionNavigationLink = memo(({ 
  targetAnchorUrl, 
  displayLabel, 
  accessibleAriaLabel, 
  targetSectionId, 
  currentActiveSectionId, 
  onLinkClickCallback 
}: NavLinkProps) => {
  const isLinkCurrentlyActive = currentActiveSectionId === targetSectionId;

  return (
    <li>
      <a
        href={targetAnchorUrl}
        aria-label={accessibleAriaLabel}
        aria-current={isLinkCurrentlyActive ? 'true' : undefined}
        className={isLinkCurrentlyActive ? 'active' : ''}
        onClick={onLinkClickCallback}
      >
        {displayLabel}
      </a>
    </li>
  );
});

ActiveSectionNavigationLink.displayName = 'ActiveSectionNavigationLink';

// ── Navbar ────────────────────────────────────────────────────────────────────

/** 
 * Main application navigation container.
 * 
 * @returns {JSX.Element} The rendered Navbar component.
 */
export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const activeViewportSectionId = useActiveSection();

  const closeMobileNavigationMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileNavigationMenu = useCallback((clickEvent: MouseEvent<HTMLButtonElement>) => {
    clickEvent.stopPropagation();
    setIsMobileMenuOpen((previousState) => !previousState);
  }, []);

  return (
    <nav role="navigation" aria-label={ARIA_LABELS.MAIN_NAV}>
      <GoogleTranslateInit />

      <a 
        href="#hero" 
        className="nav-logo" 
        aria-label={`${APP_NAME} — Return to Home`}
      >
        {APP_NAME}
      </a>

      <div className="nav-right">
        <button
          className="nav-mobile-btn"
          id="mobile-navigation-toggle"
          aria-expanded={isMobileMenuOpen}
          aria-controls="main-navigation-links"
          aria-label="Toggle mobile menu"
          onClick={toggleMobileNavigationMenu}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <ul
          className={`nav-links${isMobileMenuOpen ? ' open' : ''}`}
          id="main-navigation-links"
          role="list"
        >
          {NAV_LINKS.map((linkData) => (
            <ActiveSectionNavigationLink
              key={linkData.href}
              targetAnchorUrl={linkData.href}
              displayLabel={linkData.label}
              accessibleAriaLabel={linkData.aria}
              targetSectionId={linkData.sectionId}
              currentActiveSectionId={activeViewportSectionId}
              onLinkClickCallback={closeMobileNavigationMenu}
            />
          ))}
        </ul>

        <LanguageSelectorDropdown />
      </div>
    </nav>
  );
};


