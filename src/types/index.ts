/**
 * @file index.ts
 * @description Global TypeScript interface definitions for the ElectED platform.
 */

/** 
 * Base interface for any document retrieved from Firebase. 
 */
export interface FirebaseDoc {
  /** Unique document identifier. */
  id: string;
  /** Timestamp when the document was created. */
  createdAt?: any; 
}

/** 
 * Represents a user in the system. 
 */
export interface User extends FirebaseDoc {
  /** Display name of the user. */
  name: string;
  /** Primary contact email. */
  email?: string;
  /** URL to the user's profile picture. */
  photoURL?: string;
}

/** 
 * Represents a polling station or map marker location. 
 */
export interface MapMarker {
  /** Unique marker identifier. */
  id: string;
  /** Latitude coordinate. */
  latitude: number;
  /** Longitude coordinate. */
  longitude: number;
  /** Display title for the location. */
  title: string;
  /** Full physical address. */
  address?: string;
  /** Category of the location. */
  type?: 'polling-station' | 'official-office' | 'drop-box';
}

/** 
 * Represents a specific phase in the election timeline. 
 */
export interface ElectionPhase {
  /** Title of the phase. */
  phaseTitle: string;
  /** Brief summary of the phase. */
  shortDescription: string;
  /** Comprehensive explanation of the phase. */
  detailedInformation: string;
  /** Icon/Emoji representing the phase. */
  phaseIcon: string;
  /** Associated keywords for filtering or context. */
  tags: string[];
}

/** 
 * Represents a single question in the knowledge quiz. 
 */
export interface QuizQuestion {
  /** The text of the question. */
  questionText: string;
  /** List of possible answers. */
  answerOptions: string[];
  /** Index of the correct answer within the options array. */
  correctAnswerIndex: number;
  /** Feedback provided when the user answers correctly. */
  correctAnswerFeedback: string;
  /** Feedback provided when the user answers incorrectly. */
  incorrectAnswerFeedback: string;
}

/** 
 * Represents a score record for the global leaderboard. 
 */
export interface QuizScore extends FirebaseDoc {
  /** Name of the participant. */
  participantName: string;
  /** Number of questions answered correctly. */
  correctAnswersCount: number;
  /** Total number of questions in the quiz. */
  totalQuestionsCount: number;
}

