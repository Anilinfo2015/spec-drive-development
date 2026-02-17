/**
 * Quiz type definitions
 */

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export type QuizCategory =
  | 'tech'
  | 'science'
  | 'history'
  | 'pop-culture'
  | 'sports'
  | 'general';

export interface QuizMetadata {
  id: string;
  date: string; // ISO 8601 format: YYYY-MM-DD
  topic: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
}

export interface AnswerOption {
  text: string;
  correct: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
  explanation: string;
  points: number;
}

export interface Quiz {
  meta: QuizMetadata;
  questions: Question[];
}

/**
 * Runtime quiz state types
 */
export interface QuizAnswer {
  questionId: string;
  selectedOptionIndex: number;
  correct: boolean;
  points: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalPoints: number;
  timeSeconds: number;
  answers: QuizAnswer[];
  completedAt: string;
}

export interface QuizProgress {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  score: number;
  startTime: number;
  isComplete: boolean;
}
