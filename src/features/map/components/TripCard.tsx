/**
 * @file TripCard.tsx
 * @description Card component displaying specific travel estimates and details for a selected polling station.
 */

import { formatDistance } from '@/utils/geo';
import { TripCardProps } from '../types';

/** 
 * Displays travel times (driving, walking) and distance for a selected polling station.
 * 
 * @param {TripCardProps} props - Component props.
 * @returns {JSX.Element} The rendered trip detail card.
 */
export const TripCard = ({ targetStation }: TripCardProps) => {
  const formattedDistance = formatDistance(targetStation.distanceInKilometers);

  return (
    <div 
      className="trip-card" 
      aria-label={`Travel details for ${targetStation.stationName}`}
    >
      <div className="trip-card-title">📌 Selected Station</div>
      <div className="trip-name">{targetStation.stationName}</div>
      <div className="trip-type">{targetStation.stationType}</div>
      
      <div className="trip-modes">
        <div className="trip-mode">
          <span className="trip-mode-icon" aria-hidden="true">🚗</span>
          <div>
            <div className="trip-mode-time">{targetStation.estimatedDriveMinutes} min</div>
            <div className="trip-mode-label">Driving</div>
          </div>
        </div>
        
        <div className="trip-divider" aria-hidden="true" />
        
        <div className="trip-mode">
          <span className="trip-mode-icon" aria-hidden="true">🚶</span>
          <div>
            <div className="trip-mode-time">{targetStation.estimatedWalkMinutes} min</div>
            <div className="trip-mode-label">Walking</div>
          </div>
        </div>
        
        <div className="trip-divider" aria-hidden="true" />
        
        <div className="trip-mode">
          <span className="trip-mode-icon" aria-hidden="true">📏</span>
          <div>
            <div className="trip-mode-time">{formattedDistance}</div>
            <div className="trip-mode-label">Distance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

