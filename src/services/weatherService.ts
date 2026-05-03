/**
 * @file weatherService.ts
 * @description Service for fetching current weather data using the Open-Meteo API.
 */

import { WEATHER_API_BASE } from '../constants';

/**
 * Represents the structured weather data returned by the service.
 */
export interface CurrentWeatherDetails {
  /** Current temperature in Celsius. */
  temperature: number;
  /** WMO Weather interpretation code. */
  weatherConditionCode: number;
  /** Wind speed in km/h. */
  windSpeedVelocity: number;
  /** ISO8601 timestamp of the measurement. */
  observationTimestamp: string;
}

/**
 * Fetches current weather data from the Open-Meteo free API.
 * No API key is required for this service.
 *
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @returns {Promise<CurrentWeatherDetails>} The current weather information.
 * @throws {Error} Thrown if the API request fails or returns invalid data.
 */
export const fetchWeather = async (
  latitude: number, 
  longitude: number
): Promise<CurrentWeatherDetails> => {
  const weatherRequestUrl = new URL(WEATHER_API_BASE);
  weatherRequestUrl.searchParams.set('latitude', String(latitude));
  weatherRequestUrl.searchParams.set('longitude', String(longitude));
  weatherRequestUrl.searchParams.set('current_weather', 'true');
  weatherRequestUrl.searchParams.set('timezone', 'auto');

  const apiResponse = await fetch(weatherRequestUrl.href);
  
  if (!apiResponse.ok) {
    throw new Error(`Weather API error: ${apiResponse.status} ${apiResponse.statusText}`);
  }

  const rawWeatherApiResponse = await apiResponse.json();
  
  if (!rawWeatherApiResponse.current_weather) {
    throw new Error('Invalid response format from Weather API: missing current_weather field');
  }

  const {
    temperature,
    weathercode,
    windspeed,
    time
  } = rawWeatherApiResponse.current_weather;

  return {
    temperature,
    weatherConditionCode: weathercode,
    windSpeedVelocity: windspeed,
    observationTimestamp: time
  };
};


