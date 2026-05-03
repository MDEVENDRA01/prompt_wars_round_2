/**
 * @file questions.ts
 * @description Static collection of quiz questions, options, and feedback for the election knowledge check.
 */

/**
 * Interface representing a single quiz question and its metadata.
 */
export interface QuizQuestionData {
  /** The text of the question. */
  questionTitle: string;
  /** Array of strings representing the multiple choice options. */
  possibleAnswerOptions: string[];
  /** The zero-based index of the correct answer in the possibleAnswerOptions array. */
  correctAnswerIndex: number;
  /** Feedback provided to the user when they select the correct answer. */
  positiveReinforcementMessage: string;
  /** Feedback provided to the user when they select an incorrect answer. */
  educationalCorrectionMessage: string;
}

/**
 * The collection of questions used in the knowledge check quiz.
 */
export const questions: QuizQuestionData[] = [
  {
    questionTitle: 'What is the first legal step a person must take before running for public office?',
    possibleAnswerOptions: [
      'Campaign on social media',
      'Formally declare candidacy and file with election authorities',
      'Win a primary election',
      'Raise campaign funds',
    ],
    correctAnswerIndex: 1,
    positiveReinforcementMessage:
      'Correct! Candidates must formally declare their intent and file official paperwork with the relevant election authority before anything else.',
    educationalCorrectionMessage:
      'Not quite. Before campaigning or raising funds, candidates must formally declare their candidacy and file with election authorities.',
  },
  {
    questionTitle: 'What is the purpose of a primary election?',
    possibleAnswerOptions: [
      'To certify the final election results',
      'To count mail-in ballots',
      'To allow a political party to select its nominee for the general election',
      'To register new voters',
    ],
    correctAnswerIndex: 2,
    positiveReinforcementMessage:
      'Correct! A primary election is how political parties select the single candidate who will represent them in the general election.',
    educationalCorrectionMessage:
      'Not quite. A primary election is used by political parties to narrow their field down to one nominee for the general election.',
  },
  {
    questionTitle: 'What is a provisional ballot?',
    possibleAnswerOptions: [
      'A ballot cast by a government official',
      'A ballot set aside when there is a question about voter eligibility',
      'A test ballot used for training',
      'A ballot used only in primary elections',
    ],
    correctAnswerIndex: 1,
    positiveReinforcementMessage:
      "Correct! A provisional ballot is set aside when a voter's eligibility is in question, and counted only after eligibility is confirmed.",
    educationalCorrectionMessage:
      "Not quite. A provisional ballot is cast when there's a question about eligibility — it's set aside and counted only after verification.",
  },
  {
    questionTitle: 'What happens during the "certification" phase of an election?',
    possibleAnswerOptions: [
      'Candidates register to run',
      'Polling stations open to voters',
      'Results are officially confirmed as final by election authorities',
      'Campaign advertisements are reviewed',
    ],
    correctAnswerIndex: 2,
    positiveReinforcementMessage:
      'Correct! Certification is the formal process by which election authorities audit the count and officially declare the results final.',
    educationalCorrectionMessage:
      'Not quite. Certification is when authorities officially audit and confirm the vote count, declaring the results final.',
  },
  {
    questionTitle: 'Which of the following best describes why voter registration exists?',
    possibleAnswerOptions: [
      'To limit who can vote to wealthy citizens',
      'To allow election officials to prepare accurate voter rolls and verify eligibility',
      'To generate revenue for the government',
      'To ensure only one party wins',
    ],
    correctAnswerIndex: 1,
    positiveReinforcementMessage:
      'Correct! Registration allows officials to verify eligibility and maintain accurate voter rolls, which supports a fair and organised election.',
    educationalCorrectionMessage:
      'Not quite. Registration exists so officials can verify eligibility and maintain accurate voter rolls for an organised, fair election.',
  },
];


