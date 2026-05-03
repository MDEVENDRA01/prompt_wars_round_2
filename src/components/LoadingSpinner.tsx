/**
 * @file LoadingSpinner.tsx
 * @description Global loading indicator component used as a fallback during lazy loading.
 */

interface LoadingSpinnerProps {
  /** Accessible label announcing what is currently being loaded. */
  loadingStateAnnouncementLabel?: string;
}

/**
 * Generic loading spinner component designed for use with React Suspense fallbacks.
 * Ensures the loading status is communicated to both visual and assistive technology users.
 * 
 * @param {LoadingSpinnerProps} props - Component props.
 * @returns {JSX.Element} The rendered loading spinner.
 */
export const LoadingSpinner = ({ 
  loadingStateAnnouncementLabel = 'Loading content, please wait…' 
}: LoadingSpinnerProps) => {
  return (
    <div
      className="application-loading-overlay"
      role="status"
      aria-label={loadingStateAnnouncementLabel}
      aria-live="polite"
    >
      <div className="loading-spinner-animation" aria-hidden="true" />
      <span className="loading-status-text-display">
        {loadingStateAnnouncementLabel}
      </span>
    </div>
  );
};

