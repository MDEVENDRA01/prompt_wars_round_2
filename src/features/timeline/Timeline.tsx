/**
 * @file Timeline.tsx
 * @description Interactive election timeline component that explains different phases of the election process.
 */

import { useState, useRef, memo, useCallback, KeyboardEvent, RefObject } from 'react';
import { phases } from '@/data/phases';

/**
 * Represents a single phase in the election timeline.
 */
interface ElectionPhase {
  /** Emoji icon representing the phase. */
  phaseIcon: string;
  /** Formal title of the phase. */
  phaseTitle: string;
  /** Short summary description. */
  shortDescription: string;
  /** Detailed explanation of the phase. */
  detailedInformation: string;
  /** Associated keywords or topics. */
  tags: string[];
}

/**
 * Props for the TimelineListItem component.
 */
interface TimelineListItemProps {
  /** The phase data to display. */
  phaseData: ElectionPhase;
  /** The zero-based index of this phase in the timeline. */
  phaseIndex: number;
  /** Whether this phase is currently selected. */
  isCurrentlyActive: boolean;
  /** Callback function when this phase is selected. */
  onSelectPhase: (index: number) => void;
}

/**
 * Props for the PhaseDetailPanel component.
 */
interface PhaseDetailPanelProps {
  /** The phase data to display in detail. */
  activePhaseData: ElectionPhase;
  /** Ref for the panel element to manage focus. */
  detailPanelRef: RefObject<HTMLDivElement>;
}

/**
 * A single election phase row in the timeline list.
 * Optimized with React.memo to prevent unnecessary re-renders.
 */
const TimelineListItem = memo(({ 
  phaseData, 
  phaseIndex, 
  isCurrentlyActive, 
  onSelectPhase 
}: TimelineListItemProps) => {
  /**
   * Handles keyboard interaction for the timeline item (Enter, Space, Arrows).
   */
  const handleItemKeyDown = useCallback((keyboardEvent: KeyboardEvent<HTMLDivElement>) => {
    switch (keyboardEvent.key) {
      case 'Enter':
      case ' ':
        keyboardEvent.preventDefault();
        onSelectPhase(phaseIndex);
        break;
      case 'ArrowDown':
        keyboardEvent.preventDefault();
        onSelectPhase(Math.min(phaseIndex + 1, phases.length - 1));
        break;
      case 'ArrowUp':
        keyboardEvent.preventDefault();
        onSelectPhase(Math.max(phaseIndex - 1, 0));
        break;
      default:
        break;
    }
  }, [phaseIndex, onSelectPhase]);

  return (
    <div
      className={`tl-item${isCurrentlyActive ? ' active' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={isCurrentlyActive}
      aria-label={`Phase ${phaseIndex + 1}: ${phaseData.phaseTitle}`}
      onClick={() => onSelectPhase(phaseIndex)}
      onKeyDown={handleItemKeyDown}
    >
      <div className="tl-num" aria-hidden="true">
        {String(phaseIndex + 1).padStart(2, '0')}
      </div>
      <div className="tl-content">
        <h3>{phaseData.phaseTitle}</h3>
        <p>{phaseData.shortDescription}</p>
      </div>
    </div>
  );
});

TimelineListItem.displayName = 'TimelineListItem';

/**
 * Detail panel for the currently selected election phase.
 * Displays icons, full details, and associated tags.
 */
const PhaseDetailPanel = memo(({ activePhaseData, detailPanelRef }: PhaseDetailPanelProps) => {
  return (
    <div
      className="tl-panel reveal"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Election phase details"
      id="tl-panel-display"
      tabIndex={-1}
      ref={detailPanelRef}
    >
      <div className="tl-panel-icon" aria-hidden="true">
        {activePhaseData.phaseIcon}
      </div>
      <h2>{activePhaseData.phaseTitle}</h2>
      <p>{activePhaseData.detailedInformation}</p>
      <div className="tl-tags" aria-label="Related keywords">
        {activePhaseData.tags.map((topicTag) => (
          <span key={topicTag} className="tl-tag">
            {topicTag}
          </span>
        ))}
      </div>
    </div>
  );
});

PhaseDetailPanel.displayName = 'PhaseDetailPanel';

/**
 * Interactive election timeline component.
 * Allows users to browse through election phases and view detailed information.
 * 
 * @returns {JSX.Element} The rendered timeline section.
 */
export const Timeline = () => {
  const [currentSelectedPhaseIndex, setCurrentSelectedPhaseIndex] = useState<number>(0);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  /**
   * Updates the active phase and moves focus to the detail panel for accessibility.
   */
  const updateSelectedElectionPhase = useCallback((newPhaseIndex: number) => {
    setCurrentSelectedPhaseIndex(newPhaseIndex);
    
    // Defer focus to allow React to update the DOM
    window.setTimeout(() => {
      detailPanelRef.current?.focus();
    }, 50);
  }, []);

  const selectedPhaseData = phases[currentSelectedPhaseIndex] as ElectionPhase;

  return (
    <section id="timeline" aria-labelledby="timeline-heading">
      <div className="section-inner">
        <p className="section-label reveal">The Election Timeline</p>
        <h2 className="section-title reveal" id="timeline-heading">
          From Candidacy to <em>Certification</em>
        </h2>
        <p className="section-desc reveal">
          Every election follows a structured timeline. Click each phase to learn more about what
          happens and why it matters.
        </p>

        <div className="timeline-wrap reveal-stagger">
          <div
            className="timeline-list reveal"
            role="list"
            aria-label="Election phases list"
            id="tl-list-container"
          >
            {phases.map((phaseItem, itemIndex) => (
              <TimelineListItem
                key={phaseItem.phaseTitle}
                phaseData={phaseItem as ElectionPhase}
                phaseIndex={itemIndex}
                isCurrentlyActive={itemIndex === currentSelectedPhaseIndex}
                onSelectPhase={updateSelectedElectionPhase}
              />
            ))}
          </div>

          <PhaseDetailPanel 
            activePhaseData={selectedPhaseData} 
            detailPanelRef={detailPanelRef} 
          />
        </div>
      </div>
    </section>
  );
};


