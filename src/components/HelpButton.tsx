/**
 * @file HelpButton.tsx
 * @description Floating Action Button (FAB) that provides quick access to emergency services and assistance.
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

/**
 * Data structure for an individual emergency contact option.
 */
interface EmergencyContactDetails {
  /** Unique identifier for the contact option. */
  optionId: string;
  /** Custom CSS class for styling specific emergency types. */
  optionCssClassName: string;
  /** Visual emoji icon representation. */
  optionEmojiIcon: string;
  /** Primary title of the contact option. */
  optionDisplayLabel: string;
  /** Secondary information or description. */
  optionSubtitleText: string;
  /** The phone number to dial when selected. */
  contactPhoneNumber: string;
}

/**
 * Properties for the EmergencyContactOptionItem component.
 */
interface EmergencyContactProps {
  /** The contact details to display. */
  contactDetails: EmergencyContactDetails;
  /** Callback function triggered when the option is selected. */
  onOptionSelectionCallback: (details: EmergencyContactDetails) => void;
}

/**
 * Predefined list of emergency contacts available in the help menu.
 */
const EMERGENCY_CONTACT_LIST: EmergencyContactDetails[] = [
  { 
    optionId: 'police', 
    optionCssClassName: 'hi-police', 
    optionEmojiIcon: '🚔', 
    optionDisplayLabel: 'Call Police', 
    optionSubtitleText: 'Emergency: 911', 
    contactPhoneNumber: '911' 
  },
  { 
    optionId: 'emergency', 
    optionCssClassName: 'hi-emergency', 
    optionEmojiIcon: '🚨', 
    optionDisplayLabel: 'Emergency', 
    optionSubtitleText: 'General emergency line', 
    contactPhoneNumber: '911' 
  },
  { 
    optionId: 'medical', 
    optionCssClassName: 'hi-medical', 
    optionEmojiIcon: '🏥', 
    optionDisplayLabel: 'Medical Support', 
    optionSubtitleText: 'Ambulance: 911', 
    contactPhoneNumber: '911' 
  },
  { 
    optionId: 'ambulance', 
    optionCssClassName: 'hi-ambulance', 
    optionEmojiIcon: '🚑', 
    optionDisplayLabel: 'Ambulance', 
    optionSubtitleText: 'EMS dispatch', 
    contactPhoneNumber: '911' 
  },
  { 
    optionId: 'fire', 
    optionCssClassName: 'hi-fire', 
    optionEmojiIcon: '🔥', 
    optionDisplayLabel: 'Fire Department', 
    optionSubtitleText: 'Fire emergency: 911', 
    contactPhoneNumber: '911' 
  },
  { 
    optionId: 'sos', 
    optionCssClassName: 'hi-sos', 
    optionEmojiIcon: '🆘', 
    optionDisplayLabel: 'SOS', 
    optionSubtitleText: 'International distress', 
    contactPhoneNumber: '112' 
  },
];

/** 
 * Visual representation of a single emergency contact within the help menu.
 * 
 * @param {EmergencyContactProps} props - Component props.
 * @returns {JSX.Element} The rendered contact button.
 */
const EmergencyContactOptionItem = memo(({ 
  contactDetails, 
  onOptionSelectionCallback 
}: EmergencyContactProps) => {
  return (
    <button
      className={`help-item ${contactDetails.optionCssClassName}`}
      aria-label={`${contactDetails.optionDisplayLabel} — ${contactDetails.optionSubtitleText}`}
      onClick={() => onOptionSelectionCallback(contactDetails)}
    >
      <div className="help-item-icon" aria-hidden="true">
        {contactDetails.optionEmojiIcon}
      </div>
      <div className="help-item-text">
        <span className="help-item-label">{contactDetails.optionDisplayLabel}</span>
        <span className="help-item-sub">{contactDetails.optionSubtitleText}</span>
      </div>
    </button>
  );
});

EmergencyContactOptionItem.displayName = 'EmergencyContactOptionItem';

/** 
 * Floating Action Button (FAB) that expands to reveal a menu of emergency contact options.
 * Features accessibility enhancements like focus trapping and keyboard navigation.
 * 
 * @returns {JSX.Element} The rendered FAB component.
 */
export const HelpButton = () => {
  const [isHelpMenuExpanded, setIsHelpMenuExpanded] = useState<boolean>(false);
  const helpMenuContainerRef = useRef<HTMLDivElement | null>(null);

  // Restrict keyboard focus to within the menu when it is expanded
  useFocusTrap(helpMenuContainerRef, isHelpMenuExpanded);

  // Close the menu when clicking outside or pressing the Escape key
  useEffect(() => {
    /**
     * Handles clicks outside the help menu to close it automatically.
     */
    const handleGlobalInteractionClick = (interactionEvent: MouseEvent) => {
      if (
        helpMenuContainerRef.current && 
        !helpMenuContainerRef.current.contains(interactionEvent.target as Node)
      ) {
        setIsHelpMenuExpanded(false);
      }
    };

    /**
     * Handles Escape key presses to close the expanded menu.
     */
    const handleGlobalEscapeKeyPress = (keyboardEvent: globalThis.KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') {
        setIsHelpMenuExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleGlobalInteractionClick);
    document.addEventListener('keydown', handleGlobalEscapeKeyPress);
    
    return () => {
      document.removeEventListener('mousedown', handleGlobalInteractionClick);
      document.removeEventListener('keydown', handleGlobalEscapeKeyPress);
    };
  }, []);

  /**
   * Initiates a phone call to the selected emergency service.
   * 
   * @param {EmergencyContactDetails} contactOption - The selected contact details.
   */
  const initiateEmergencyPhoneCall = useCallback((contactOption: EmergencyContactDetails) => {
    window.location.href = `tel:${contactOption.contactPhoneNumber}`;
    setIsHelpMenuExpanded(false);
  }, []);

  /**
   * Toggles the expanded state of the emergency help menu.
   */
  const toggleHelpMenuVisibility = useCallback(() => {
    setIsHelpMenuExpanded((previousState) => !previousState);
  }, []);

  return (
    <div
      className="help-fab"
      ref={helpMenuContainerRef}
      role="complementary"
      aria-label="Emergency help and assistance"
    >
      {isHelpMenuExpanded && (
        <div
          id="help-options-menu-dialog"
          className="help-menu"
          role="dialog"
          aria-label="Emergency contact options"
          aria-modal="true"
        >
          <div className="help-menu-title" aria-live="polite">
            🆘 Emergency Help Options
          </div>
          {EMERGENCY_CONTACT_LIST.map((contactItem) => (
            <EmergencyContactOptionItem 
              key={contactItem.optionId} 
              contactDetails={contactItem} 
              onOptionSelectionCallback={initiateEmergencyPhoneCall} 
            />
          ))}
        </div>
      )}

      <button
        id="help-menu-toggle-trigger"
        className={`help-trigger${isHelpMenuExpanded ? ' open' : ''}`}
        aria-label={isHelpMenuExpanded ? 'Close emergency menu' : 'Open emergency help menu'}
        aria-expanded={isHelpMenuExpanded}
        aria-controls="help-options-menu-dialog"
        onClick={toggleHelpMenuVisibility}
      >
        {!isHelpMenuExpanded && (
          <span className="help-pulse" aria-hidden="true" />
        )}
        <span aria-hidden="true">
          {isHelpMenuExpanded ? '✕' : '🆘'}
        </span>
      </button>
    </div>
  );
};

