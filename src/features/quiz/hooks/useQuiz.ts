/**
 * @file useQuiz.ts
 * @description Custom hook for managing the state and logic of the election knowledge quiz.
 */

import { useState, useCallback } from 'react';
import { questions } from '@/data/questions';

/**
 * Custom hook to manage the quiz state, including scoring, progress, and navigation.
 * 
 * @returns {Object} Quiz state and handler functions.
 */
export const useQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userTotalScore, setUserTotalScore] = useState<number>(0);
  const [hasAnswerBeenSubmitted, setHasAnswerBeenSubmitted] = useState<boolean>(false);

  /**
   * Whether the user has completed all questions in the quiz session.
   */
  const isQuizSessionFinished = currentQuestionIndex >= questions.length;

  /**
   * Processes the user's answer submission or advances the quiz to the next question.
   * 
   * @param {boolean | null} wasSelectionCorrect - Whether the user's choice was correct, 
   *                                               or null to advance without scoring.
   */
  const processAnswerSubmission = useCallback((wasSelectionCorrect: boolean | null) => {
    // If wasSelectionCorrect is null, we advance to the next question (typically after feedback display)
    if (wasSelectionCorrect === null) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
      setHasAnswerBeenSubmitted(false);
      return;
    }

    // Mark the current question as answered and update the score if the selection was correct
    setHasAnswerBeenSubmitted(true);
    if (wasSelectionCorrect) {
      setUserTotalScore((previousScore) => previousScore + 1);
    }
  }, []);

  /**
   * Resets the quiz session state to allow the user to try again.
   */
  const resetQuizSession = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserTotalScore(0);
    setHasAnswerBeenSubmitted(false);
  }, []);

  /**
   * Determines the appropriate CSS class for a progress bar pip based on the current quiz state.
   * 
   * @param {number} progressBarPipIndex - The index of the pip being evaluated.
   * @returns {string} The computed CSS class string.
   */
  const calculateProgressPipClassName = useCallback((progressBarPipIndex: number) => {
    if (progressBarPipIndex < currentQuestionIndex) {
      return 'quiz-pip done';
    }
    if (progressBarPipIndex === currentQuestionIndex) {
      return 'quiz-pip current';
    }
    return 'quiz-pip';
  }, [currentQuestionIndex]);

  return {
    currentQuestionIndex,
    userTotalScore,
    hasAnswerBeenSubmitted,
    isQuizSessionFinished,
    processAnswerSubmission,
    resetQuizSession,
    calculateProgressPipClassName,
  };
};



