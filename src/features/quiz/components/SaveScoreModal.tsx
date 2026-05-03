/**
 * @file SaveScoreModal.tsx
 * @description Modal component that allows users to save their quiz results to the Firebase Firestore leaderboard.
 */

import { useState, useCallback, ChangeEvent, useRef } from 'react';
import { firestore, isFirebaseConfigured } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sanitizeName } from '@/utils/sanitize';
import { SaveScoreModalProps } from '../types';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useAnalytics } from '@/hooks/useAnalytics';

/**
 * Modal for saving a quiz score to the Firebase leaderboard.
 * 
 * @param {SaveScoreModalProps} props - Component props.
 * @returns {JSX.Element | null} The rendered modal or null if Firebase is not configured.
 */
export const SaveScoreModal = ({ 
  correctAnswersCount, 
  totalQuestionsCount, 
  onDismissModalCallback 
}: SaveScoreModalProps) => {
  const [participantDisplayName, setParticipantDisplayName] = useState<string>('');
  const [isCurrentlySaving, setIsCurrentlySaving] = useState<boolean>(false);
  const [hasSuccessfullySaved, setHasSuccessfullySaved] = useState<boolean>(false);
  const [persistenceErrorMessage, setPersistenceErrorMessage] = useState<string>('');
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAnalytics();

  // Trap focus within the modal for accessibility
  useFocusTrap(modalContainerRef, true);

  /**
   * Handles changes to the participant name input field with sanitization.
   * 
   * @param {ChangeEvent<HTMLInputElement>} inputEvent - The change event from the input element.
   */
  const handleNameInputChange = useCallback((inputEvent: ChangeEvent<HTMLInputElement>) => {
    setParticipantDisplayName(sanitizeName(inputEvent.target.value));
  }, []);

  /**
   * Validates the integrity of the score and name data before attempting persistence.
   * 
   * @param {string} nameToValidate - The name to check.
   * @returns {boolean} True if data is valid for submission.
   */
  const verifySubmissionDataIntegrity = (nameToValidate: string): boolean => {
    const MAXIMUM_NAME_CHARACTER_LENGTH = 32;

    if (nameToValidate.length > MAXIMUM_NAME_CHARACTER_LENGTH) {
      setPersistenceErrorMessage(`Name is too long (max ${MAXIMUM_NAME_CHARACTER_LENGTH} characters).`);
      return false;
    }
    
    if (typeof correctAnswersCount !== 'number' || typeof totalQuestionsCount !== 'number') {
      setPersistenceErrorMessage('Invalid score data detected.');
      return false;
    }

    return true;
  };

  /**
   * Core logic for persisting the user score to the Firebase Firestore collection.
   * 
   * @param {string} sanitizedParticipantName - The validated name to associate with the score.
   */
  const persistScoreToLeaderboard = async (sanitizedParticipantName: string) => {
    setIsCurrentlySaving(true);
    setPersistenceErrorMessage('');
    
    try {
      if (!firestore) {
        throw new Error('Firestore instance not available.');
      }

      // Add the score record to the 'quizScores' collection
      await addDoc(collection(firestore, 'quizScores'), {
        participantName: sanitizedParticipantName,
        correctAnswersCount,
        totalQuestionsCount,
        createdAt: serverTimestamp(),
      });
      
      setHasSuccessfullySaved(true);
      
      // Log the success event to analytics
      trackEvent('quiz_score_save', { 
        score: correctAnswersCount, 
        total: totalQuestionsCount 
      });
    } catch (saveOperationError: unknown) {
      console.error('[SaveScoreModal] Leaderboard persistence error:', saveOperationError);
      setPersistenceErrorMessage('Could not save your score. Please check your connection and try again.');
    } finally {
      setIsCurrentlySaving(false);
    }
  };

  /**
   * Orchestrates the high-level score saving process.
   */
  const initiateScoreSaveSequence = useCallback(async () => {
    if (!isFirebaseConfigured || !firestore) {
      return;
    }
    
    const finalParticipantName = participantDisplayName.trim() || 'Anonymous';
    
    if (verifySubmissionDataIntegrity(finalParticipantName)) {
      await persistScoreToLeaderboard(finalParticipantName);
    }
  }, [participantDisplayName, correctAnswersCount, totalQuestionsCount, trackEvent]);

  if (!isFirebaseConfigured) {
    return null;
  }

  return (
    <div 
      className="save-modal" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title-heading"
      ref={modalContainerRef}
    >
      {hasSuccessfullySaved ? (
        <div className="save-success" aria-live="polite">
          <span style={{ fontSize: '2rem' }} aria-hidden="true">✅</span>
          <p id="modal-title-heading" style={{ marginTop: '0.5rem', fontWeight: 600 }}>
            Score saved to leaderboard!
          </p>
          <button 
            className="btn-outline" 
            style={{ marginTop: '1rem' }} 
            onClick={onDismissModalCallback} 
            autoFocus
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <div id="modal-title-heading" className="save-modal-title">📊 Save to Leaderboard</div>
          <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Your result:{' '}
            <strong style={{ color: 'var(--accent)' }}>
              {correctAnswersCount}/{totalQuestionsCount}
            </strong>
          </p>
          
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <label htmlFor="participant-name-input" className="sr-only">
              Enter your name for the leaderboard
            </label>
            <input
              id="participant-name-input"
              className="save-name-input"
              type="text"
              placeholder="Your name (optional)"
              value={participantDisplayName}
              maxLength={24}
              onChange={handleNameInputChange}
            />
          </div>

          {persistenceErrorMessage && (
            <p className="save-error" role="alert" aria-live="assertive">
              {persistenceErrorMessage}
            </p>
          )}
          
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              id="submit-score-btn"
              className="btn-primary"
              onClick={initiateScoreSaveSequence}
              disabled={isCurrentlySaving}
              aria-busy={isCurrentlySaving}
            >
              {isCurrentlySaving ? 'Saving…' : '🔥 Save Score'}
            </button>
            <button className="btn-outline" onClick={onDismissModalCallback}>
              Skip
            </button>
          </div>
        </>
      )}
    </div>
  );
};



