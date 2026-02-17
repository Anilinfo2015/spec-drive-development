import { getCollection } from 'astro:content';
import type { Quiz } from '@types/quiz';
import { validateQuiz, validateFilename } from './validation';

/**
 * Load and validate all quiz content
 */
export async function getAllQuizzes() {
  const quizzes = await getCollection('quizzes');

  // Sort by date (newest first)
  return quizzes.sort((a, b) => {
    return new Date(b.data.meta.date).getTime() - new Date(a.data.meta.date).getTime();
  });
}

/**
 * Get quiz by date
 */
export async function getQuizByDate(date: string) {
  const quizzes = await getCollection('quizzes');
  return quizzes.find(quiz => quiz.data.meta.date === date);
}

/**
 * Get today's quiz
 */
export async function getTodaysQuiz() {
  const today = new Date().toISOString().split('T')[0];
  return getQuizByDate(today);
}

/**
 * Get quizzes by category
 */
export async function getQuizzesByCategory(category: string) {
  const quizzes = await getCollection('quizzes');
  return quizzes
    .filter(quiz => quiz.data.meta.category === category)
    .sort((a, b) => {
      return new Date(b.data.meta.date).getTime() - new Date(a.data.meta.date).getTime();
    });
}

/**
 * Validate quiz with additional custom rules
 */
export function validateQuizData(quiz: Quiz, filename: string): void {
  // Run our comprehensive validation
  validateQuiz(quiz, filename);

  // Validate filename matches date
  validateFilename(filename, quiz.meta.date);

  // Additional validation: ensure exactly one correct answer per question
  quiz.questions.forEach((question, index) => {
    const correctCount = question.options.filter(opt => opt.correct).length;
    if (correctCount !== 1) {
      throw new Error(
        `Question ${index + 1} (${question.id}) must have exactly one correct answer, found ${correctCount}`
      );
    }
  });
}
