/**
 * @file MapPlaceholder.tsx
 * @description Fallback UI shown when the Google Maps API is not configured or fails to load.
 */

import { MapPlaceholderProps } from '../types';

/** 
 * Visual placeholder component shown when the Google Maps API key is missing or invalid.
 * Displays the user's detected coordinates if available.
 * 
 * @param {MapPlaceholderProps} props - Component props.
 * @returns {JSX.Element} The rendered placeholder UI.
 */
export const MapPlaceholder = ({ currentUserCoordinates }: MapPlaceholderProps) => {
  return (
    <div className="pollmap-map-placeholder">
      <div 
        style={{ fontSize: '3rem', marginBottom: '1rem' }} 
        aria-hidden="true"
      >
        🗺️
      </div>
      <strong>Google Maps Not Configured</strong>
      <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Add your <code>VITE_GOOGLE_MAPS_API_KEY</code> to the <code>.env</code> file to enable
        interactive maps.
      </p>
      {currentUserCoordinates && (
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Your coordinates: {currentUserCoordinates.latitude.toFixed(4)}°, {currentUserCoordinates.longitude.toFixed(4)}°
        </p>
      )}
    </div>
  );
};

