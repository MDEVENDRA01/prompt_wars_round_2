/**
 * @file WeatherCard.tsx
 * @description Displays real-time weather information for the user's current geographic location.
 */

import { memo } from 'react';
import { WEATHER_CODE_MAP } from '@/constants';
import { WeatherCardProps } from '../types';

/**
 * Maps a WMO weather code to a human-readable label and an appropriate emoji icon.
 * 
 * @param {number} weatherCode - The WMO weather interpretation code.
 * @returns {Object} Metadata containing a label and icon.
 */
const resolveWeatherMetadataFromCode = (weatherCode: number) => {
  // Cast the constant map to allow numeric indexing
  const weatherMetadataMap = WEATHER_CODE_MAP as Record<number, { label: string; icon: string }>;
  return weatherMetadataMap[weatherCode] ?? { label: 'Unknown', icon: '🌡️' };
};

/** 
 * Displays current weather conditions (temperature, wind, status) at the user's location.
 * Optimized with React.memo to prevent unnecessary re-renders when map markers change.
 * 
 * @param {WeatherCardProps} props - Component props.
 * @returns {JSX.Element} The rendered weather card.
 */
const LocationWeatherStatusCard = ({ 
  currentWeatherData, 
  locationDisplayName 
}: WeatherCardProps) => {
  if (!currentWeatherData) {
    return (
      <div className="wx-loading" aria-label="Fetching real-time weather data">
        Fetching weather…
      </div>
    );
  }

  const { 
    label: weatherConditionLabel, 
    icon: weatherVisualIcon 
  } = resolveWeatherMetadataFromCode(currentWeatherData.weatherConditionCode);

  const roundedTemperatureCelsius = Math.round(currentWeatherData.temperature);

  return (
    <div 
      className="wx-card" 
      aria-label={`Weather at ${locationDisplayName}: ${weatherConditionLabel}, ${roundedTemperatureCelsius}°C`}
    >
      <div className="wx-top">
        <div className="wx-icon" aria-hidden="true">
          {weatherVisualIcon}
        </div>
        <div>
          <div className="wx-temp">{roundedTemperatureCelsius}°C</div>
          <div className="wx-label">{weatherConditionLabel}</div>
        </div>
      </div>
      
      <div className="wx-location">
        📍 {locationDisplayName || 'Your Location'}
      </div>
      
      <div className="wx-details">
        <div className="wx-detail">
          <span className="wx-detail-icon" aria-hidden="true">💨</span>
          <span>{Math.round(currentWeatherData.windSpeedVelocity)} km/h wind</span>
        </div>
        <div className="wx-detail">
          <span className="wx-detail-icon" aria-hidden="true">🌡️</span>
          <span>{weatherConditionLabel}</span>
        </div>
      </div>
    </div>
  );
};

export const WeatherCard = memo(LocationWeatherStatusCard);

