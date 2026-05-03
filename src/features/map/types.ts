/**
 * @file types.ts
 * @description TypeScript interface definitions for the Map feature components and services.
 */

/**
 * Real-time weather data retrieved from the weather service.
 */
export interface WeatherData {
  /** Current temperature in Celsius. */
  temperature: number;
  /** WMO weather interpretation code. */
  weatherConditionCode: number;
  /** Current wind speed in km/h. */
  windSpeedVelocity: number;
}

/**
 * Representation of a polling station with location and travel metadata.
 */
export interface PollingStation {
  /** Unique identifier for the station. */
  id: string;
  /** Display name of the polling station. */
  stationName: string;
  /** Category of the station (e.g., "Library", "School"). */
  stationType: string;
  /** Latitude coordinate. */
  latitude: number;
  /** Longitude coordinate. */
  longitude: number;
  /** Great-circle distance from the user in kilometers. */
  distanceInKilometers: number;
  /** Estimated driving time in minutes. */
  estimatedDriveMinutes: number;
  /** Estimated walking time in minutes. */
  estimatedWalkMinutes: number;
}

/**
 * Properties for the WeatherCard component.
 */
export interface WeatherCardProps {
  /** Current weather data object. */
  currentWeatherData: WeatherData | null;
  /** Display name for the resolved location. */
  locationDisplayName: string;
}

/**
 * Properties for a single item in the polling station list.
 */
export interface StationItemProps {
  /** The polling station data to display. */
  stationData: PollingStation;
  /** Whether this station is currently highlighted. */
  isCurrentlySelected: boolean;
  /** Callback triggered when the user selects this station. */
  onStationSelection: (selectedStation: PollingStation) => void;
}

/**
 * Properties for the list container of polling stations.
 */
export interface StationListProps {
  /** Array of nearby polling stations. */
  pollingStations: PollingStation[];
  /** ID of the station currently selected by the user. */
  activeStationId: string | null;
  /** Callback triggered when any station in the list is selected. */
  onStationSelection: (selectedStation: PollingStation) => void;
}

/**
 * Properties for the trip information card.
 */
export interface TripCardProps {
  /** The polling station targeted for the trip. */
  targetStation: PollingStation;
}

/**
 * Properties for the fallback map placeholder.
 */
export interface MapPlaceholderProps {
  /** Coordinates of the user to center the placeholder map. */
  currentUserCoordinates: { latitude: number; longitude: number } | null;
}

