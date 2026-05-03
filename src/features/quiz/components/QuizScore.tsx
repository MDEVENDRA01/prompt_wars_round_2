/**
 * @file QuizScore.tsx
 * @description Component that displays the user's final score and performance feedback upon quiz completion.
 */

import { useState } from 'react';
import { isFirebaseConfigured } from '@/firebase';
import { QuizScoreProps } from '../types';
import { SaveScoreModal } from './SaveScoreModal';

/**
 * Renders the final results of a quiz session, including a numeric score, percentage, 
 * and qualitative performance feedback. Provides options to retry or save the score.
 * 
 * @param {QuizScoreProps} props - Component props.
 * @returns {JSX.Element} The rendered quiz results UI.
 */
export const QuizScore = ({ 
  correctAnswersCount, 
  totalQuestionsCount, 
  onRestartQuizCallback 
}: QuizScoreProps) => {
  const [isSaveScoreModalVisible, setIsSaveScoreModalVisible] = useState<boolean>(false);
  
  // Calculate the score as a percentage (0-100)
  const userPerformancePercentage = Math.round((correctAnswersCount / totalQuestionsCount) * 100);

  /**
   * Generates a qualitative feedback message based on the user's performance percentage.
   * 
   * @returns {string} Performance feedback text with an emoji.
   */
  const getPerformanceFeedbackMessage = (): string => {
    if (userPerformancePercentage === 100) {
      return 'Perfect! You are an election expert! 🏆';
    }
    if (userPerformancePercentage >= 70) {
      return 'Great job! You have a strong understanding. 🌟';
    }
    if (userPerformancePercentage >= 40) {
      return 'Not bad! Keep learning to improve. 📖';
    }
    return 'Room for improvement. Every bit of knowledge counts! 💪';
  };

  return (
    <div className="quiz-results" aria-live="polite">
      <div className="score-circle">
        <span className="score-num">{correctAnswersCount}</span>
        <span className="score-total">/ {totalQuestionsCount}</span>
      </div>

      <h3 className="score-title">{getPerformanceFeedbackMessage()}</h3>
      <p className="score-subtitle">You scored {userPerformancePercentage}% overall.</p>

      <div 
        className="quiz-actions" 
        style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}
      >
        <button className="btn-primary" onClick={onRestartQuizCallback}>
          Try Again
        </button>
        {isFirebaseConfigured && (
          <button 
            className="btn-outline" 
            onClick={() => setIsSaveScoreModalVisible(true)}
          >
            Save to Leaderboard
          </button>
        )}
      </div>

      {isSaveScoreModalVisible && (
        <div className="modal-overlay">
          <SaveScoreModal
            correctAnswersCount={correctAnswersCount}
            totalQuestionsCount={totalQuestionsCount}
            onDismissModalCallback={() => setIsSaveScoreModalVisible(false)}
          />
        </div>
      )}
    </div>
  );
};
