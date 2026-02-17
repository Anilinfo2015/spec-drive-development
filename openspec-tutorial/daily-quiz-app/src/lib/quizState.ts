import type { Quiz, QuizProgress, QuizAnswer, QuizResult } from '@types/quiz';

/**
 * Quiz state manager for handling quiz flow and progress
 */
export class QuizState {
  private quiz: Quiz;
  private progress: QuizProgress;
  private listeners: Set<() => void> = new Set();

  constructor(quiz: Quiz) {
    this.quiz = quiz;
    this.progress = {
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      startTime: Date.now(),
      isComplete: false,
    };
  }

  /**
   * Get current quiz data
   */
  getQuiz(): Quiz {
    return this.quiz;
  }

  /**
   * Get current progress
   */
  getProgress(): QuizProgress {
    return { ...this.progress };
  }

  /**
   * Get current question
   */
  getCurrentQuestion() {
    return this.quiz.questions[this.progress.currentQuestionIndex];
  }

  /**
   * Get current question index (0-based)
   */
  getCurrentQuestionIndex(): number {
    return this.progress.currentQuestionIndex;
  }

  /**
   * Get current question number (1-based)
   */
  getCurrentQuestionNumber(): number {
    return this.progress.currentQuestionIndex + 1;
  }

  /**
   * Get total number of questions
   */
  getTotalQuestions(): number {
    return this.quiz.questions.length;
  }

  /**
   * Check if this is the last question
   */
  isLastQuestion(): boolean {
    return this.progress.currentQuestionIndex === this.quiz.questions.length - 1;
  }

  /**
   * Check if quiz is complete
   */
  isComplete(): boolean {
    return this.progress.isComplete;
  }

  /**
   * Get current score
   */
  getScore(): number {
    return this.progress.score;
  }

  /**
   * Get maximum possible score
   */
  getMaxScore(): number {
    return this.quiz.questions.reduce((sum, q) => sum + (q.points || 100), 0);
  }

  /**
   * Get elapsed time in seconds
   */
  getElapsedSeconds(): number {
    return Math.floor((Date.now() - this.progress.startTime) / 1000);
  }

  /**
   * Get answer for current question (if exists)
   */
  getCurrentAnswer(): QuizAnswer | undefined {
    return this.progress.answers[this.progress.currentQuestionIndex];
  }

  /**
   * Check if current question is answered
   */
  isCurrentQuestionAnswered(): boolean {
    return !!this.getCurrentAnswer();
  }

  /**
   * Submit answer for current question
   */
  submitAnswer(selectedOptionIndex: number): QuizAnswer {
    const question = this.getCurrentQuestion();
    const selectedOption = question.options[selectedOptionIndex];
    const isCorrect = selectedOption.correct;
    const points = isCorrect ? (question.points || 100) : 0;

    const answer: QuizAnswer = {
      questionId: question.id,
      selectedOptionIndex,
      correct: isCorrect,
      points,
    };

    // Save answer
    this.progress.answers[this.progress.currentQuestionIndex] = answer;

    // Update score
    this.progress.score += points;

    // Notify listeners
    this.notifyListeners();

    return answer;
  }

  /**
   * Move to next question
   */
  nextQuestion(): boolean {
    if (this.isLastQuestion()) {
      this.completeQuiz();
      return false;
    }

    this.progress.currentQuestionIndex++;
    this.notifyListeners();
    return true;
  }

  /**
   * Complete the quiz
   */
  completeQuiz(): void {
    this.progress.isComplete = true;
    this.notifyListeners();
  }

  /**
   * Get quiz results
   */
  getResults(): QuizResult {
    return {
      quizId: this.quiz.meta.id,
      score: this.progress.score,
      totalPoints: this.getMaxScore(),
      timeSeconds: this.getElapsedSeconds(),
      answers: this.progress.answers,
      completedAt: new Date().toISOString(),
    };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback());
  }

  /**
   * Reset quiz to beginning
   */
  reset(): void {
    this.progress = {
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      startTime: Date.now(),
      isComplete: false,
    };
    this.notifyListeners();
  }
}

/**
 * Create a new quiz state instance
 */
export function createQuizState(quiz: Quiz): QuizState {
  return new QuizState(quiz);
}
