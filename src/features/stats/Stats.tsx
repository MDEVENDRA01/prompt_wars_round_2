/**
 * @file Stats.tsx
 * @description Statistic display component using the Compound Component Pattern.
 * Showcases key metrics and features of the ElectED platform.
 */

import { memo, useMemo, ReactNode } from 'react';

/**
 * Properties for an individual statistic item.
 */
interface StatisticItemProps {
  /** The numeric or percentage value to display. */
  displayValue: string;
  /** A short descriptive label for the statistic. */
  displayLabel: string;
  /** Accessible description for screen readers. */
  accessibleAriaLabel: string;
}

/**
 * Properties for the statistic container component.
 */
interface StatisticContainerProps {
  /** Statistic items or other content to render. */
  children: ReactNode;
  /** Optional override for the container's ARIA label. */
  ariaLabelOverride?: string;
}

/**
 * Initial static data for the platform statistics.
 */
const PLATFORM_STATISTICS_DATA: StatisticItemProps[] = [
  { 
    displayValue: '6',    
    displayLabel: 'Election Phases',   
    accessibleAriaLabel: '6 election phases' 
  },
  { 
    displayValue: '10+',  
    displayLabel: 'Key Terms Defined', 
    accessibleAriaLabel: '10 or more key terms defined' 
  },
  { 
    displayValue: '5',    
    displayLabel: 'Quiz Questions',    
    accessibleAriaLabel: '5 quiz questions' 
  },
  { 
    displayValue: '100%', 
    displayLabel: 'Free to Access',   
    accessibleAriaLabel: '100 percent free to access' 
  },
];

/** 
 * Individual statistic item component.
 * Optimized with React.memo to prevent unnecessary re-renders.
 */
const StatisticItem = memo(function StatisticItem({ 
  displayValue, 
  displayLabel, 
  accessibleAriaLabel 
}: StatisticItemProps) {
  return (
    <div className="stat-item reveal" role="listitem">
      <div className="stat-num" aria-label={accessibleAriaLabel}>
        {displayValue}
      </div>
      <div className="stat-label">{displayLabel}</div>
    </div>
  );
});

StatisticItem.displayName = 'Statistic.Item';

/** 
 * Container component for organizing multiple statistic items in a list.
 */
function StatisticListContainer({ 
  children, 
  ariaLabelOverride = "Key statistics about ElectED platform" 
}: StatisticContainerProps) {
  return (
    <div className="stats" role="list" aria-label={ariaLabelOverride}>
      {children}
    </div>
  );
}

// Bind sub-components to create a clean API for the compound component
const Statistic = Object.assign(StatisticListContainer, {
  Item: StatisticItem,
});

/** 
 * Public section component that renders the full statistics list.
 * 
 * @returns {JSX.Element} The rendered statistics section.
 */
export function StatsSection() {
  const applicationStats = useMemo(() => PLATFORM_STATISTICS_DATA, []);

  return (
    <Statistic ariaLabelOverride="Key statistics about ElectED platform">
      {applicationStats.map((stat) => (
        <Statistic.Item 
          key={stat.displayLabel} 
          {...stat} 
        />
      ))}
    </Statistic>
  );
}

export { Statistic as Stats, PLATFORM_STATISTICS_DATA as STATS_DATA };

