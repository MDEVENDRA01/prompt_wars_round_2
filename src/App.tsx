/**
 * @file App.tsx
 * @description Root application component that orchestrates the layout, routing (sections), 
 * and global services like analytics and translation.
 */

import { Suspense, lazy } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useActiveSection } from './hooks/useActiveSection';
import { useAnalytics } from './hooks/useAnalytics';

// Global Component Imports
import { GoogleTranslateInit } from './components/GoogleTranslate';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HelpButton } from './components/HelpButton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

// Application Constants
import { ARIA_LABELS, APP_NAME, SKIP_LINK_TARGET } from './constants';

/**
 * Lazy-loaded feature sections to optimize initial bundle size and load time.
 */
const LazyHeroSection      = lazy(() => import('./features/hero/Hero').then((module) => ({ default: module.Hero })));
const LazyStatsSection     = lazy(() => import('./features/stats/Stats').then((module) => ({ default: module.StatsSection })));
const LazyTimelineSection  = lazy(() => import('./features/timeline/Timeline').then((module) => ({ default: module.Timeline })));
const LazyHowItWorksSection = lazy(() => import('./features/core/HowItWorks').then((module) => ({ default: module.HowItWorks })));
const LazyPollMapSection   = lazy(() => import('./features/map/PollMap').then((module) => ({ default: module.PollMap })));
const LazyQuizSection      = lazy(() => import('./features/quiz/Quiz').then((module) => ({ default: module.Quiz })));
const LazyGlossarySection  = lazy(() => import('./features/core/Glossary').then((module) => ({ default: module.Glossary })));
const LazyCTASection       = lazy(() => import('./features/core/CTA').then((module) => ({ default: module.CTA })));

/**
 * Root application component.
 * Implements performance-critical features like scroll reveal, section tracking, 
 * and lazy-loaded code splitting with comprehensive error boundaries.
 * 
 * @returns {JSX.Element} The rendered application shell.
 */
function App() {
  // Initialize scroll animations and tracking
  useScrollReveal();
  const currentViewportActiveSectionId = useActiveSection();
  
  // Track page views and engagement based on active section
  useAnalytics(currentViewportActiveSectionId);

  /**
   * Capitalizes the section ID for accessible screen reader announcements.
   */
  const formattedActiveSectionName = currentViewportActiveSectionId.charAt(0).toUpperCase() + 
                                     currentViewportActiveSectionId.slice(1);

  return (
    <>
      {/* Dynamic ARIA live region for screen reader navigation feedback */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Viewing ${formattedActiveSectionName} section`}
      </div>

      {/* Invisible Google Translate bridge component */}
      <GoogleTranslateInit />

      {/* Accessibility enhancement: keyboard-only skip navigation link */}
      <a
        id="skip-to-content-link"
        href={`#${SKIP_LINK_TARGET}`}
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary focus:text-white z-50"
      >
        {ARIA_LABELS.SKIP_LINK}
      </a>

      <header role="banner">
        <Navbar />
      </header>

      <main id={SKIP_LINK_TARGET} role="main" aria-label={`${APP_NAME} main content body`}>
        
        <ErrorBoundary componentName="HeroSection">
          <Suspense fallback={<LoadingSpinner label="Loading Hero section" />}>
            <LazyHeroSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="StatsSection">
          <Suspense fallback={<LoadingSpinner label="Loading statistics" />}>
            <LazyStatsSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="TimelineSection">
          <Suspense fallback={<LoadingSpinner label="Loading election timeline" />}>
            <LazyTimelineSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="HowItWorksSection">
          <Suspense fallback={<LoadingSpinner label="Loading process steps" />}>
            <LazyHowItWorksSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="PollMapSection">
          <Suspense fallback={<LoadingSpinner label="Loading polling station map" />}>
            <LazyPollMapSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="QuizSection">
          <Suspense fallback={<LoadingSpinner label="Loading knowledge quiz" />}>
            <LazyQuizSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="GlossarySection">
          <Suspense fallback={<LoadingSpinner label="Loading glossary" />}>
            <LazyGlossarySection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary componentName="CTASection">
          <Suspense fallback={<LoadingSpinner label="Loading call to action" />}>
            <LazyCTASection />
          </Suspense>
        </ErrorBoundary>

      </main>

      <footer role="contentinfo">
        <Footer />
      </footer>
      
      <HelpButton />
    </>
  );
}

export { App };

