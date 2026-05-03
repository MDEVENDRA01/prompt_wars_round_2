/**
 * @file Quiz.tsx
 * @description Main container for the election knowledge quiz feature.
 */

import { questions } from '@/data/questions';
import { isFirebaseConfigured } from '@/firebase';
import { useQuiz } from './hooks/useQuiz';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizScore } from './components/QuizScore';

/**
 * Interactive election knowledge quiz with progress indicators and scoring.
 * 
 * @returns {JSX.Element} The rendered quiz section.
 */
export const Quiz = () => {
  const {
    currentQuestionIndex,
    userTotalScore,
    hasAnswerBeenSubmitted,
    isQuizSessionFinished,
    processAnswerSubmission,
    resetQuizSession,
    calculateProgressPipClassName,
  } = useQuiz();

  return (
    <section id="quiz" aria-labelledby="quiz-heading">
      <div className="section-inner">
        <p className="section-label reveal">Knowledge Check</p>
        <h2 className="section-title reveal" id="quiz-heading">
          Test What You've <em>Learned</em>
        </h2>
        <p className="section-desc reveal">
          {questions.length} questions to check your understanding. Scores are saved to our global
          leaderboard{isFirebaseConfigured ? ' via Firebase' : ''}.
        </p>

        <div
          className="quiz-box reveal"
          role="region"
          aria-label={hasAnswerBeenSubmitted ? 'Quiz — answer submitted' : 'Election knowledge quiz'}
        >
          {/* Visual progress bar with individual pips for each question */}
          <div
            className="quiz-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={currentQuestionIndex}
            aria-label="Quiz progress"
          >
            {questions.map((_, progressBarPipIndex) => (
              <div
                key={progressBarPipIndex}
                className={calculateProgressPipClassName(progressBarPipIndex)}
                aria-hidden="true"
              />
            ))}
          </div>

          <div id="quiz-content">
            {isQuizSessionFinished ? (
              <QuizScore
                correctAnswersCount={userTotalScore}
                totalQuestionsCount={questions.length}
                onRestartQuiz={resetQuizSession}
              />
            ) : (
              <QuizQuestion
                key={currentQuestionIndex}
                questionIndex={currentQuestionIndex}
                onAnswerSubmission={processAnswerSubmission}
              />
            )}

          </div>
        </div>
      </div>
    </section>
  );
};


