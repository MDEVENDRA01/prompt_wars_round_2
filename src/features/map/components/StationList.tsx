/**
 * @file StationList.tsx
 * @description Sidebar list container for displaying multiple nearby polling stations.
 */

import { memo } from 'react';
import { StationItem } from './StationItem';
import { StationListProps } from '../types';

/** 
 * Sidebar list container for displaying multiple nearby polling stations.
 * 
 * @param {StationListProps} props - Component props.
 * @returns {JSX.Element} The rendered station list.
 */
const PollingStationsSidebarList = ({ 
  pollingStations, 
  activeStationId, 
  onStationSelection 
}: StationListProps) => {
  return (
    <div className="station-list" aria-label="Nearby polling stations selection list">
      <div className="station-list-title">🗳️ Nearby Polling Stations</div>
      {pollingStations.map((stationItemData) => (
        <StationItem
          key={stationItemData.id}
          stationData={stationItemData}
          isCurrentlySelected={activeStationId === stationItemData.id}
          onStationSelection={onStationSelection}
        />
      ))}
    </div>
  );
};

export const StationList = memo(PollingStationsSidebarList);

