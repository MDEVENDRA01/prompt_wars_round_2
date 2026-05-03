/**
 * @file QuizOption.tsx
 * @description Individual interactive option component for a multiple-choice quiz question.
 */

import { memo } from 'react';
import { QuizOptionProps } from '../types';

/**
 * Renders a single answer choice as a stylized radio button.
 * Automatically handles visual feedback (correct/incorrect) once an answer is submitted.
 * Optimized with React.memo for high-performance rendering within large lists of options.
 * 
 * @param {QuizOptionProps} props - Component props.
 * @returns {JSX.Element} The rendered option button.
 */
export const QuizOption = memo(({
  letter,
  displayText,
  isSelected,
  isCorrect,
  wasSelectionIncorrect,
  hasQuestionBeenAnswered,
  onOptionSelectionCallback,
}: QuizOptionProps) => {
  /**
   * Determine the semantic status class for the button based on the quiz state.
   */
  const conditionalStatusClassName = hasQuestionBeenAnswered
    ? isCorrect
      ? ' correct'
      : wasSelectionIncorrect
      ? ' wrong'
      : ''
    : '';

  return (
    <button
      className={`quiz-opt${conditionalStatusClassName}`}
      role="radio"
      aria-checked={isSelected}
      aria-label={`${letter}: ${displayText}`}
      disabled={hasQuestionBeenAnswered}
      onClick={onOptionSelectionCallback}
    >
      <span className="opt-letter" aria-hidden="true">
        {letter}
      </span>
      <span>{displayText}</span>
    </button>
  );
});

QuizOption.displayName = 'QuizOption';


