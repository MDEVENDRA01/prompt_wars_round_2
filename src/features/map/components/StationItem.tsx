/**
 * @file StationItem.tsx
 * @description Single interactive list item representing a polling station in the sidebar.
 */

import { memo } from 'react';
import { formatDistance } from '@/utils/geo';
import { StationItemProps } from '../types';

/** 
 * Single polling station row in the station list sidebar.
 * Optimized with React.memo to prevent re-renders when other stations are interacted with.
 * 
 * @param {StationItemProps} props - Component props.
 * @returns {JSX.Element} The rendered station item button.
 */
const PollingStationListRow = ({ 
  stationData, 
  isCurrentlySelected, 
  onStationSelection 
}: StationItemProps) => {
  const formattedDistanceString = formatDistance(stationData.distanceInKilometers);

  return (
    <button
      className={`station-item${isCurrentlySelected ? ' selected' : ''}`}
      onClick={() => onStationSelection(stationData)}
      aria-label={`${stationData.stationName} — ${stationData.stationType} — ${formattedDistanceString} away — ${stationData.estimatedDriveMinutes} min drive`}
      aria-pressed={isCurrentlySelected}
    >
      <div className="station-item-left">
        <div className="station-dot" aria-hidden="true" />
        <div>
          <div className="station-name">{stationData.stationName}</div>
          <div className="station-type">{stationData.stationType}</div>
        </div>
      </div>
      <div className="station-times">
        <div className="station-time">🚗 {stationData.estimatedDriveMinutes} min</div>
        <div className="station-time station-walk">🚶 {stationData.estimatedWalkMinutes} min</div>
        <div className="station-dist">{formattedDistanceString}</div>
      </div>
    </button>
  );
};

export const StationItem = memo(PollingStationListRow);

