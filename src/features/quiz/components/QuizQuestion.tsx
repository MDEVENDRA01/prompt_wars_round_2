/**
 * @file QuizQuestion.tsx
 * @description Component that renders a single quiz question, its options, and feedback after submission.
 */

import { useState, useRef, useCallback } from 'react';
import { questions } from '@/data/questions';
import { QUIZ_LETTERS } from '@/constants';
import { QuizOption } from './QuizOption';
import { QuizQuestionProps } from '../types';
import { useAnalytics } from '@/hooks/useAnalytics';

/**
 * Renders a single quiz question with multiple-choice options and provides feedback after selection.
 * 
 * @param {QuizQuestionProps} props - Component props.
 * @returns {JSX.Element} The rendered quiz question section.
 */
export const QuizQuestion = ({ questionIndex, onAnswerSubmission }: QuizQuestionProps) => {
  const currentQuestionData = questions[questionIndex];
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const nextQuestionButtonRef = useRef<HTMLButtonElement | null>(null);
  const { trackEvent } = useAnalytics();

  const hasUserAnsweredQuestion = selectedOptionIndex !== null;
  const isLastQuestionInQuizSequence = questionIndex === questions.length - 1;

  /**
   * Handles the selection of a quiz option.
   * Logs the event and triggers the onAnswerSubmission callback.
   * 
   * @param {number} answerChoiceIndex - The index of the selected option.
   */
  const handleOptionSelection = useCallback((answerChoiceIndex: number) => {
    if (selectedOptionIndex !== null) {
      return;
    }

    setSelectedOptionIndex(answerChoiceIndex);
    const wasSelectionCorrect = answerChoiceIndex === currentQuestionData.correctAnswerIndex;
    
    // Notify parent component of the result
    onAnswerSubmission(wasSelectionCorrect);
    
    // Track the analytics event for this answer
    trackEvent('quiz_answer', {
      question_index: questionIndex,
      is_correct: wasSelectionCorrect,
    });

    // Auto-focus the next button for keyboard accessibility after a short delay
    setTimeout(() => {
      nextQuestionButtonRef.current?.focus();
    }, 50);
  }, [selectedOptionIndex, currentQuestionData.correctAnswerIndex, onAnswerSubmission, questionIndex, trackEvent]);

  /**
   * Proceeds to the next question by signaling the parent.
   */
  const requestProgressionToNextQuestion = useCallback(() => {
    onAnswerSubmission(null);
  }, [onAnswerSubmission]);

  return (
    <>
      <p
        aria-label={`Question ${questionIndex + 1} of ${questions.length}`}
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
        }}
      >
        Question {questionIndex + 1} of {questions.length}
      </p>

      <p className="quiz-q" id={`q-text-${questionIndex}`}>
        {currentQuestionData.questionTitle}
      </p>

      <div 
        className="quiz-opts" 
        role="radiogroup" 
        aria-labelledby={`q-text-${questionIndex}`}
      >
        {currentQuestionData.possibleAnswerOptions.map((displayText, answerChoiceIndex) => (
          <QuizOption
            key={answerChoiceIndex}
            letter={QUIZ_LETTERS[answerChoiceIndex]}
            displayText={displayText}
            isSelected={selectedOptionIndex === answerChoiceIndex}
            isCorrect={hasUserAnsweredQuestion && answerChoiceIndex === currentQuestionData.correctAnswerIndex}
            wasSelectionIncorrect={hasUserAnsweredQuestion && answerChoiceIndex === selectedOptionIndex && answerChoiceIndex !== currentQuestionData.correctAnswerIndex}
            hasQuestionBeenAnswered={hasUserAnsweredQuestion}
            onOptionSelectionCallback={() => handleOptionSelection(answerChoiceIndex)}
          />
        ))}
      </div>

      {hasUserAnsweredQuestion && (
        <div
          className={`quiz-feedback show ${selectedOptionIndex === currentQuestionData.correctAnswerIndex ? 'correct' : 'wrong'}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {selectedOptionIndex === currentQuestionData.correctAnswerIndex 
            ? currentQuestionData.positiveReinforcementMessage 
            : currentQuestionData.educationalCorrectionMessage
          }
        </div>
      )}

      <div className={`quiz-next${hasUserAnsweredQuestion ? ' show' : ''}`}>
        <button
          id="quiz-next-btn"
          className="btn-primary"
          ref={nextQuestionButtonRef}
          onClick={requestProgressionToNextQuestion}
        >
          {isLastQuestionInQuizSequence ? 'See Results →' : 'Next Question →'}
        </button>
      </div>
    </>
  );
};


