/**
 * @file pollingStationsService.ts
 * @description Logic for generating and calculating metadata for nearby polling stations based on user coordinates.
 */

import { POLL_OFFSETS } from '../constants';
import { haversineKm, estimateDriveMinutes, estimateWalkMinutes } from '../utils/geo';

/**
 * Data structure representing a polling station and its relationship to the user's location.
 */
export interface PollingStation {
  /** Unique identifier for the station. */
  id: string;
  /** Human-readable name of the station. */
  stationName: string;
  /** Categorization of the station (e.g., "Public Library"). */
  stationType: string;
  /** Latitude coordinate. */
  latitude: number;
  /** Longitude coordinate. */
  longitude: number;
  /** Calculated straight-line distance from the user in kilometers. */
  distanceInKilometers: number;
  /** Estimated driving time in minutes. */
  estimatedDriveMinutes: number;
  /** Estimated walking time in minutes. */
  estimatedWalkMinutes: number;
}

/**
 * Generates mock polling station data distributed around the user's current coordinates.
 * Calculations are performed locally to simulate real-world proximity without external API calls.
 * Stations are returned sorted by physical distance (closest first).
 *
 * @param {Object} userCoordinates - The latitude and longitude of the user.
 * @param {number} userCoordinates.latitude - User latitude.
 * @param {number} userCoordinates.longitude - User longitude.
 * @returns {PollingStation[]} List of stations sorted by distance.
 */
export const buildPollingStations = (userCoordinates: { 
  latitude: number; 
  longitude: number 
}): PollingStation[] => {
  const { latitude: userLatitude, longitude: userLongitude } = userCoordinates;

  return POLL_OFFSETS.map((locationOffset) => {
    const calculatedStationLatitude = userLatitude + locationOffset.delta[0];
    const calculatedStationLongitude = userLongitude + locationOffset.delta[1];
    
    const distanceToStationInKm = haversineKm(
      userLatitude, 
      userLongitude, 
      calculatedStationLatitude, 
      calculatedStationLongitude
    );

    return {
      id: locationOffset.id,
      stationName: locationOffset.name,
      stationType: locationOffset.type,
      latitude: calculatedStationLatitude,
      longitude: calculatedStationLongitude,
      distanceInKilometers: distanceToStationInKm,
      estimatedDriveMinutes: estimateDriveMinutes(distanceToStationInKm),
      estimatedWalkMinutes: estimateWalkMinutes(distanceToStationInKm),
    };
  }).sort((firstStation, secondStation) => firstStation.distanceInKilometers - secondStation.distanceInKilometers);
};


