import type { Quiz } from '../types/quiz';
import { createQuizState, QuizState } from '../lib/quizState';

/**
 * Quiz Application - Client-side interactive quiz
 */
export class QuizApp {
  private state: QuizState;
  private container: HTMLElement;
  private selectedOptionIndex: number | null = null;

  constructor(quiz: Quiz, container: HTMLElement) {
    this.state = createQuizState(quiz);
    this.container = container;
    this.init();
  }

  private init(): void {
    // Subscribe to state changes
    this.state.subscribe(() => this.render());

    // Initial render
    this.render();
  }

  private render(): void {
    if (this.state.isComplete()) {
      this.renderResults();
    } else {
      this.renderQuestion();
    }
  }

  private renderQuestion(): void {
    const question = this.state.getCurrentQuestion();
    const answer = this.state.getCurrentAnswer();
    const isAnswered = !!answer;

    this.container.innerHTML = `
      <div class="quiz-question">
        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Question ${this.state.getCurrentQuestionNumber()}/${this.state.getTotalQuestions()}</span>
            <span id="timer" class="font-mono">0:00</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style="width: ${(this.state.getCurrentQuestionNumber() / this.state.getTotalQuestions()) * 100}%"
            ></div>
          </div>
        </div>

        <!-- Score Display -->
        <div class="mb-6 text-center">
          <div class="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <span class="text-2xl">🎯</span>
            <span class="font-bold text-gray-900 dark:text-white">
              ${this.state.getScore()} / ${this.state.getMaxScore()}
            </span>
          </div>
        </div>

        <!-- Question Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
            ${this.escapeHtml(question.text)}
          </h2>

          <!-- Answer Options -->
          <div class="space-y-3">
            ${question.options
              .map(
                (option, index) => `
              <button
                class="answer-option w-full text-left p-4 rounded-xl border-2 transition-all
                  ${
                    isAnswered
                      ? option.correct
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : answer.selectedOptionIndex === index
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 opacity-50'
                      : this.selectedOptionIndex === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 transform scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                  ${isAnswered ? 'cursor-default' : 'cursor-pointer'}"
                data-option-index="${index}"
                ${isAnswered ? 'disabled' : ''}
              >
                <div class="flex items-center gap-3">
                  <span class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${
                      isAnswered && option.correct
                        ? 'bg-green-500 text-white'
                        : isAnswered && answer.selectedOptionIndex === index
                        ? 'bg-red-500 text-white'
                        : this.selectedOptionIndex === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }">
                    ${String.fromCharCode(65 + index)}
                  </span>
                  <span class="flex-1 text-gray-900 dark:text-white">
                    ${this.escapeHtml(option.text)}
                  </span>
                  ${
                    isAnswered && option.correct
                      ? '<span class="text-2xl">✓</span>'
                      : isAnswered && answer.selectedOptionIndex === index
                      ? '<span class="text-2xl">✗</span>'
                      : ''
                  }
                </div>
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        ${
          isAnswered
            ? `
          <!-- Explanation Panel -->
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6 animate-fade-in">
            <div class="flex gap-3">
              <span class="text-2xl flex-shrink-0">💡</span>
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-2">Explanation</h3>
                <p class="text-gray-700 dark:text-gray-300">${this.escapeHtml(question.explanation)}</p>
              </div>
            </div>
          </div>

          <!-- Next Button -->
          <button
            id="next-btn"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105"
          >
            ${this.state.isLastQuestion() ? 'See Results →' : 'Next Question →'}
          </button>
        `
            : `
          <!-- Submit Button -->
          <button
            id="submit-btn"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            ${this.selectedOptionIndex === null ? 'disabled' : ''}
          >
            Submit Answer
          </button>
        `
        }
      </div>
    `;

    this.attachEventListeners();
    this.startTimer();
  }

  private renderResults(): void {
    const results = this.state.getResults();
    const percentage = Math.round((results.score / results.totalPoints) * 100);
    const minutes = Math.floor(results.timeSeconds / 60);
    const seconds = results.timeSeconds % 60;

    this.container.innerHTML = `
      <div class="results text-center">
        <div class="mb-8">
          <div class="text-6xl mb-4">
            ${percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : percentage >= 40 ? '👍' : '📚'}
          </div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Complete!
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400">
            ${
              percentage >= 80
                ? 'Excellent work!'
                : percentage >= 60
                ? 'Great job!'
                : percentage >= 40
                ? 'Good effort!'
                : 'Keep learning!'
            }
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-6">
          <div class="grid grid-cols-2 gap-6 mb-6">
            <div class="text-center">
              <div class="text-4xl font-bold text-blue-500 mb-1">
                ${results.score}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                out of ${results.totalPoints}
              </div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-purple-500 mb-1">
                ${percentage}%
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                correct
              </div>
            </div>
          </div>

          <div class="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <div class="text-2xl font-mono text-gray-700 dark:text-gray-300">
              ⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              completion time
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <a
            href="/"
            class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-4 px-6 rounded-xl transition"
          >
            ← Back Home
          </a>
          <button
            id="share-btn"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition"
          >
            📤 Share Results
          </button>
        </div>
      </div>
    `;

    this.attachResultsListeners();
  }

  private attachEventListeners(): void {
    // Answer option selection
    const options = this.container.querySelectorAll('.answer-option:not([disabled])');
    options.forEach((option) => {
      option.addEventListener('click', () => {
        const index = parseInt(option.getAttribute('data-option-index') || '0');
        this.selectedOptionIndex = index;
        this.render();
      });
    });

    // Submit button
    const submitBtn = this.container.querySelector('#submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (this.selectedOptionIndex !== null) {
          this.state.submitAnswer(this.selectedOptionIndex);
          this.selectedOptionIndex = null;
        }
      });
    }

    // Next button
    const nextBtn = this.container.querySelector('#next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.state.nextQuestion();
      });
    }
  }

  private attachResultsListeners(): void {
    const shareBtn = this.container.querySelector('#share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.shareResults();
      });
    }
  }

  private startTimer(): void {
    const timerEl = this.container.querySelector('#timer');
    if (!timerEl) return;

    const updateTimer = () => {
      const seconds = this.state.getElapsedSeconds();
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerEl.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    updateTimer();
    const interval = setInterval(() => {
      if (this.state.isComplete()) {
        clearInterval(interval);
      } else {
        updateTimer();
      }
    }, 1000);
  }

  private shareResults(): void {
    const results = this.state.getResults();
    const quiz = this.state.getQuiz();

    // Generate emoji grid
    const grid = results.answers
      .map((answer) => (answer.correct ? '🟩' : '⬛'))
      .join('');

    const shareText = `Daily Quiz 🎯
${quiz.meta.topic}

${grid}

${results.score}/${results.totalPoints} points
⏱️ ${Math.floor(results.timeSeconds / 60)}:${(results.timeSeconds % 60).toString().padStart(2, '0')}

${window.location.origin}`;

    // Try to use native share API
    if (navigator.share) {
      navigator.share({
        title: 'Daily Quiz Results',
        text: shareText,
      }).catch(() => {
        // Fallback to clipboard
        this.copyToClipboard(shareText);
      });
    } else {
      this.copyToClipboard(shareText);
    }
  }

  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        alert('Results copied to clipboard!');
      },
      () => {
        alert('Failed to copy results. Please try again.');
      }
    );
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize quiz app
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('quiz-app');
    const quizData = container?.getAttribute('data-quiz');

    if (container && quizData) {
      try {
        const quiz = JSON.parse(quizData);
        new QuizApp(quiz, container);
      } catch (error) {
        console.error('Failed to initialize quiz:', error);
        container.innerHTML = '<p class="text-red-500">Failed to load quiz. Please refresh the page.</p>';
      }
    }
  });
}
