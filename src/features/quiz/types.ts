/**
 * @file types.ts
 * @description Centralized type definitions for the Quiz feature components and hooks.
 */

import { QuizScore } from '@/types';

/**
 * Properties for the QuizOption component.
 */
export interface QuizOptionProps {
  /** The letter associated with the option (A, B, C, D). */
  letter: string;
  /** The text content to display for the answer option. */
  displayText: string;
  /** Whether this specific option is currently selected by the user. */
  isSelected: boolean;
  /** Whether this option is the verified correct answer. */
  isCorrect: boolean;
  /** Whether this option was incorrectly selected by the user. */
  wasSelectionIncorrect: boolean;
  /** Whether the parent question has already been answered. */
  hasQuestionBeenAnswered: boolean;
  /** Callback triggered when the option is selected. */
  onOptionSelectionCallback: () => void;
}

/**
 * Properties for the QuizQuestion component.
 */
export interface QuizQuestionProps {
  /** The zero-based index of the question being displayed. */
  questionIndex: number;
  /** Callback triggered when an answer result is finalized. */
  onAnswerSubmission: (wasSelectionCorrect: boolean | null) => void;
}

/**
 * Properties for the QuizScore results component.
 */
export interface QuizScoreProps {
  /** The number of correct answers achieved. */
  correctAnswersCount: number;
  /** The total number of questions in the quiz session. */
  totalQuestionsCount: number;
  /** Callback function to restart the quiz session. */
  onRestartQuizCallback: () => void;
}

/**
 * Properties for the SaveScoreModal component.
 */
export interface SaveScoreModalProps {
  /** The final number of correct answers. */
  correctAnswersCount: number;
  /** The total number of questions in the quiz. */
  totalQuestionsCount: number;
  /** Callback function to close the modal. */
  onDismissModalCallback: () => void;
}

/**
 * Structure for a leaderboard entry, extending the base QuizScore.
 */
export interface LeaderboardEntry extends QuizScore {
  /** The name of the participant who achieved the score. */
  participantName: string;
  /** The number of correct answers achieved. */
  correctAnswersCount: number;
  /** The total number of questions in the quiz. */
  totalQuestionsCount: number;
}


