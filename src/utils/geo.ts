/**
 * @file geo.ts
 * @description Geographic utility functions for distance calculations and time estimations.
 */

/** Earth's radius in kilometers for Haversine calculations. */
const EARTH_RADIUS_KILOMETERS = 6371;

/** Estimated average urban driving speed in kilometers per hour. */
const AVERAGE_DRIVING_SPEED_KMH = 27;

/** Estimated average walking pace in kilometers per hour. */
const AVERAGE_WALKING_SPEED_KMH = 5;

/**
 * Computes the Haversine distance (km) between two latitude/longitude coordinates.
 * 
 * @param {number} startLatitude - Latitude of the first point.
 * @param {number} startLongitude - Longitude of the first point.
 * @param {number} endLatitude - Latitude of the second point.
 * @param {number} endLongitude - Longitude of the second point.
 * @returns {number} The great-circle distance between the two points in kilometers.
 */
export const haversineKm = (
  startLatitude: number, 
  startLongitude: number, 
  endLatitude: number, 
  endLongitude: number
): number => {
  const convertToRadians = (degrees: number): number => (degrees * Math.PI) / 180;
  
  const latitudeDifferenceRadians = convertToRadians(endLatitude - startLatitude);
  const longitudeDifferenceRadians = convertToRadians(endLongitude - startLongitude);
  
  const halfLatitudeDifferenceSin = Math.sin(latitudeDifferenceRadians / 2);
  const halfLongitudeDifferenceSin = Math.sin(longitudeDifferenceRadians / 2);
  
  // Haversine formula 'a' parameter (square of half the chord length between the points)
  const chordLengthSquared =
    halfLatitudeDifferenceSin * halfLatitudeDifferenceSin +
    Math.cos(convertToRadians(startLatitude)) * 
    Math.cos(convertToRadians(endLatitude)) * 
    halfLongitudeDifferenceSin * halfLongitudeDifferenceSin;
  
  // Haversine formula 'c' parameter (angular distance in radians)
  const angularDistanceRadians = 2 * Math.atan2(
    Math.sqrt(chordLengthSquared), 
    Math.sqrt(1 - chordLengthSquared)
  );
    
  return EARTH_RADIUS_KILOMETERS * angularDistanceRadians;
};

/**
 * Estimates drive time in minutes given distance.
 * 
 * @param {number} distanceKilometers - Distance in kilometers.
 * @returns {number} Estimated drive time in minutes (minimum 3 minutes).
 */
export const estimateDriveMinutes = (distanceKilometers: number): number => {
  const estimatedMinutes = (distanceKilometers / AVERAGE_DRIVING_SPEED_KMH) * 60;
  return Math.max(3, Math.round(estimatedMinutes));
};

/**
 * Estimates walk time in minutes given distance.
 * 
 * @param {number} distanceKilometers - Distance in kilometers.
 * @returns {number} Estimated walking time in minutes (minimum 1 minute).
 */
export const estimateWalkMinutes = (distanceKilometers: number): number => {
  const estimatedMinutes = (distanceKilometers / AVERAGE_WALKING_SPEED_KMH) * 60;
  return Math.max(1, Math.round(estimatedMinutes));
};

/**
 * Formats a distance value to a human-readable string with one decimal place.
 * 
 * @param {number} distanceKm - Distance in kilometers.
 * @returns {string} Formatted distance string (e.g., "5.2 km").
 */
export const formatDistance = (distanceKm: number): string => {
  return `${distanceKm.toFixed(1)} km`;
};

/**
 * Clamps a numeric value between a minimum and maximum range.
 * 
 * @param {number} numericValue - The value to clamp.
 * @param {number} minimumLimit - The lower bound.
 * @param {number} maximumLimit - The upper bound.
 * @returns {number} The clamped value.
 */
export const clampValue = (numericValue: number, minimumLimit: number, maximumLimit: number): number => {
  return Math.min(Math.max(numericValue, minimumLimit), maximumLimit);
};

