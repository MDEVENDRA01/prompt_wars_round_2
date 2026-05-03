/**
 * @file geocodeService.ts
 * @description Service for reverse-geocoding coordinates using the Nominatim OpenStreetMap API.
 */

import { GEOCODE_API_BASE } from '../constants';

/**
 * Reverse-geocodes coordinates to a human-readable city/town name.
 * Uses the free Nominatim (OpenStreetMap) API — no key required.
 *
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @returns {Promise<string>} Human-readable location name (city, town, village, or county).
 * @throws {Error} Thrown if the API request fails.
 */
export const reverseGeocode = async (
  latitude: number, 
  longitude: number
): Promise<string> => {
  const geocodeUrl = new URL(GEOCODE_API_BASE);
  geocodeUrl.searchParams.set('lat', String(latitude));
  geocodeUrl.searchParams.set('lon', String(longitude));
  geocodeUrl.searchParams.set('format', 'json');

  const apiResponse = await fetch(geocodeUrl.href, {
    headers: { 'Accept-Language': 'en' },
  });

  if (!apiResponse.ok) {
    throw new Error(`Geocode API error: ${apiResponse.status} ${apiResponse.statusText}`);
  }

  const geocodeApiResponse = await apiResponse.json();
  const { address: locationAddressDetails } = geocodeApiResponse;

  // Fallback chain for different address granularity
  const locationName = 
    locationAddressDetails.city ?? 
    locationAddressDetails.town ?? 
    locationAddressDetails.village ?? 
    locationAddressDetails.county ?? 
    'Your Area';

  return locationName;
};

