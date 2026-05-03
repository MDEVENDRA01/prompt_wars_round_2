/**
 * @file useGeolocation.ts
 * @description Hook for requesting and managing the user's geographic coordinates using the Browser Geolocation API.
 */

import { useState } from 'react';

/**
 * Geographic coordinates (latitude and longitude).
 */
export interface GeographicCoordinates {
  /** Latitude in decimal degrees. */
  latitude: number;
  /** Longitude in decimal degrees. */
  longitude: number;
}

/**
 * Current status of the geolocation request process.
 */
export type GeolocationRequestStatus = 'idle' | 'locating' | 'ready' | 'denied' | 'error';

/**
 * State returned by the useGeolocation hook.
 */
export interface GeolocationState {
  /** The user's geographic coordinates if successfully retrieved. */
  userPosition: GeographicCoordinates | null;
  /** Human-readable error message if the request fails. */
  error: string | null;
  /** Whether a geolocation request is currently in progress. */
  loading: boolean;
  /** High-level status of the geolocation request. */
  status: GeolocationRequestStatus;
  /** Function to initiate the geolocation request. */
  startLocating: () => void;
}

/**
 * Custom hook to safely request and manage user geolocation.
 *
 * @returns {GeolocationState} An object containing userPosition, status, loading state, and startLocating function.
 */
export const useGeolocation = (): GeolocationState => {
  const [geolocationData, setGeolocationData] = useState<{
    userPosition: GeographicCoordinates | null;
    error: string | null;
    loading: boolean;
  }>({
    userPosition: null,
    error: null,
    loading: false,
  });

  const [geolocationStatus, setGeolocationStatus] = useState<GeolocationRequestStatus>('idle');

  /**
   * Initiates the browser's geolocation request sequence.
   * Handles browser support checks, success, and error callbacks.
   */
  const initiateLocationDetection = () => {
    if (!('geolocation' in navigator)) {
      setGeolocationData((previousData) => ({
        ...previousData,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      }));
      setGeolocationStatus('error');
      return;
    }

    setGeolocationStatus('locating');
    setGeolocationData((previousData) => ({ 
      ...previousData, 
      loading: true, 
      error: null 
    }));

    navigator.geolocation.getCurrentPosition(
      (positionSuccessEvent) => {
        setGeolocationData({
          userPosition: {
            latitude: positionSuccessEvent.coords.latitude,
            longitude: positionSuccessEvent.coords.longitude,
          },
          error: null,
          loading: false,
        });
        setGeolocationStatus('ready');
      },
      (geoErrorEvent) => {
        setGeolocationData({
          userPosition: null,
          error: geoErrorEvent.message,
          loading: false,
        });
        
        // Map browser error codes to our specialized status types
        const isPermissionDenied = geoErrorEvent.code === geoErrorEvent.PERMISSION_DENIED;
        setGeolocationStatus(isPermissionDenied ? 'denied' : 'error');
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };

  return { 
    ...geolocationData, 
    status: geolocationStatus, 
    startLocating: initiateLocationDetection 
  };
};



