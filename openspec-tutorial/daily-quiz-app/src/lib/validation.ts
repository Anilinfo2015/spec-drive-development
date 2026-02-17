import type { Quiz, QuizCategory, QuizDifficulty } from '@types/quiz';

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

const VALID_CATEGORIES: QuizCategory[] = [
  'tech',
  'science',
  'history',
  'pop-culture',
  'sports',
  'general',
];

const VALID_DIFFICULTIES: QuizDifficulty[] = ['easy', 'medium', 'hard'];

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validateQuiz(data: unknown, filename?: string): Quiz {
  const prefix = filename ? `[${filename}] ` : '';

  if (!data || typeof data !== 'object') {
    throw new ValidationError(`${prefix}Quiz data must be an object`);
  }

  const quiz = data as Record<string, unknown>;

  // Validate meta
  if (!quiz.meta || typeof quiz.meta !== 'object') {
    throw new ValidationError(`${prefix}Missing or invalid 'meta' field`);
  }

  const meta = quiz.meta as Record<string, unknown>;

  // Validate meta.id
  if (!meta.id || typeof meta.id !== 'string' || meta.id.trim() === '') {
    throw new ValidationError(
      `${prefix}meta.id must be a non-empty string`,
      'meta.id',
      meta.id
    );
  }

  // Validate meta.date
  if (!meta.date || typeof meta.date !== 'string') {
    throw new ValidationError(
      `${prefix}meta.date must be a string`,
      'meta.date',
      meta.date
    );
  }
  if (!ISO_DATE_REGEX.test(meta.date)) {
    throw new ValidationError(
      `${prefix}meta.date must be in ISO 8601 format (YYYY-MM-DD)`,
      'meta.date',
      meta.date
    );
  }

  // Validate meta.topic
  if (!meta.topic || typeof meta.topic !== 'string' || meta.topic.trim() === '') {
    throw new ValidationError(
      `${prefix}meta.topic must be a non-empty string`,
      'meta.topic',
      meta.topic
    );
  }

  // Validate meta.category
  if (!meta.category || !VALID_CATEGORIES.includes(meta.category as QuizCategory)) {
    throw new ValidationError(
      `${prefix}meta.category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      'meta.category',
      meta.category
    );
  }

  // Validate meta.difficulty
  if (
    !meta.difficulty ||
    !VALID_DIFFICULTIES.includes(meta.difficulty as QuizDifficulty)
  ) {
    throw new ValidationError(
      `${prefix}meta.difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`,
      'meta.difficulty',
      meta.difficulty
    );
  }

  // Validate questions
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    throw new ValidationError(
      `${prefix}questions must be a non-empty array`,
      'questions'
    );
  }

  const questions = quiz.questions;
  const questionIds = new Set<string>();

  questions.forEach((q, index) => {
    const qPrefix = `${prefix}questions[${index}]`;

    if (!q || typeof q !== 'object') {
      throw new ValidationError(`${qPrefix} must be an object`);
    }

    const question = q as Record<string, unknown>;

    // Validate question.id
    if (!question.id || typeof question.id !== 'string') {
      throw new ValidationError(
        `${qPrefix}.id must be a non-empty string`,
        `questions[${index}].id`,
        question.id
      );
    }
    if (questionIds.has(question.id)) {
      throw new ValidationError(
        `${qPrefix}.id "${question.id}" is not unique`,
        `questions[${index}].id`,
        question.id
      );
    }
    questionIds.add(question.id);

    // Validate question.text
    if (!question.text || typeof question.text !== 'string') {
      throw new ValidationError(
        `${qPrefix}.text must be a non-empty string`,
        `questions[${index}].text`,
        question.text
      );
    }
    if (question.text.length > 300) {
      throw new ValidationError(
        `${qPrefix}.text must be 300 characters or less (got ${question.text.length})`,
        `questions[${index}].text`,
        question.text
      );
    }

    // Validate question.options
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new ValidationError(
        `${qPrefix}.options must be an array with exactly 4 options`,
        `questions[${index}].options`,
        question.options
      );
    }

    let correctCount = 0;
    question.options.forEach((opt, optIndex) => {
      const optPrefix = `${qPrefix}.options[${optIndex}]`;

      if (!opt || typeof opt !== 'object') {
        throw new ValidationError(`${optPrefix} must be an object`);
      }

      const option = opt as Record<string, unknown>;

      if (!option.text || typeof option.text !== 'string') {
        throw new ValidationError(
          `${optPrefix}.text must be a non-empty string`,
          `questions[${index}].options[${optIndex}].text`,
          option.text
        );
      }
      if (option.text.length > 150) {
        throw new ValidationError(
          `${optPrefix}.text must be 150 characters or less`,
          `questions[${index}].options[${optIndex}].text`,
          option.text
        );
      }

      if (typeof option.correct !== 'boolean') {
        throw new ValidationError(
          `${optPrefix}.correct must be a boolean`,
          `questions[${index}].options[${optIndex}].correct`,
          option.correct
        );
      }

      if (option.correct) correctCount++;
    });

    if (correctCount !== 1) {
      throw new ValidationError(
        `${qPrefix} must have exactly one correct option (found ${correctCount})`,
        `questions[${index}].options`
      );
    }

    // Validate question.explanation
    if (!question.explanation || typeof question.explanation !== 'string') {
      throw new ValidationError(
        `${qPrefix}.explanation must be a non-empty string`,
        `questions[${index}].explanation`,
        question.explanation
      );
    }
    if (
      question.explanation.length < 20 ||
      question.explanation.length > 500
    ) {
      throw new ValidationError(
        `${qPrefix}.explanation must be between 20 and 500 characters (got ${question.explanation.length})`,
        `questions[${index}].explanation`,
        question.explanation
      );
    }

    // Validate question.points
    const points = question.points ?? 100;
    if (typeof points !== 'number' || points < 1 || points > 1000) {
      throw new ValidationError(
        `${qPrefix}.points must be a number between 1 and 1000`,
        `questions[${index}].points`,
        points
      );
    }
  });

  return quiz as Quiz;
}

export function validateFilename(filename: string, date: string): void {
  const filenameRegex = /^(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)\.ya?ml$/;
  const match = filename.match(filenameRegex);

  if (!match) {
    throw new ValidationError(
      `Filename must match pattern: YYYY-MM-DD-topic-slug.yaml (got: ${filename})`,
      'filename',
      filename
    );
  }

  const [, fileDate, slug] = match;

  if (fileDate !== date) {
    throw new ValidationError(
      `Filename date (${fileDate}) must match meta.date (${date})`,
      'filename',
      filename
    );
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new ValidationError(
      `Topic slug must be kebab-case (lowercase, numbers, hyphens only)`,
      'filename',
      slug
    );
  }
}
