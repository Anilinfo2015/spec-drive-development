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
      <div class="quiz-question animate-scale-in">
        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <span class="bg-white dark:bg-slate-800 px-4 py-2 rounded-full card-shadow">
              Question ${this.state.getCurrentQuestionNumber()} of ${this.state.getTotalQuestions()}
            </span>
            <span id="timer" class="font-mono bg-white dark:bg-slate-800 px-4 py-2 rounded-full card-shadow">⏱️ 0:00</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden card-shadow">
            <div
              class="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style="width: ${(this.state.getCurrentQuestionNumber() / this.state.getTotalQuestions()) * 100}%"
            ></div>
          </div>
        </div>

        <!-- Score Display -->
        <div class="mb-8 text-center">
          <div class="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 px-6 py-3 rounded-2xl card-shadow-md border border-blue-100 dark:border-slate-600">
            <span class="text-3xl">🎯</span>
            <div class="text-left">
              <div class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${this.state.getScore()}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400 -mt-1">
                of ${this.state.getMaxScore()} points
              </div>
            </div>
          </div>
        </div>

        <!-- Question Card -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-10 card-shadow-xl mb-8 border border-gray-100 dark:border-slate-700">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            ${this.escapeHtml(question.text)}
          </h2>

          <!-- Answer Options -->
          <div class="space-y-4">
            ${question.options
              .map(
                (option, index) => `
              <button
                class="answer-option w-full text-left p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 transform
                  ${
                    isAnswered
                      ? option.correct
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 scale-[1.02]'
                        : answer.selectedOptionIndex === index
                        ? 'border-red-500 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
                        : 'border-gray-200 dark:border-gray-700 opacity-60'
                      : this.selectedOptionIndex === index
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 scale-[1.02] card-shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:scale-[1.01] card-shadow'
                  }
                  ${isAnswered ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'}"
                data-option-index="${index}"
                ${isAnswered ? 'disabled' : ''}
              >
                <div class="flex items-center gap-4">
                  <span class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-all duration-300
                    ${
                      isAnswered && option.correct
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                        : isAnswered && answer.selectedOptionIndex === index
                        ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/50'
                        : this.selectedOptionIndex === index
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }">
                    ${String.fromCharCode(65 + index)}
                  </span>
                  <span class="flex-1 text-base md:text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                    ${this.escapeHtml(option.text)}
                  </span>
                  ${
                    isAnswered && option.correct
                      ? '<span class="text-3xl animate-scale-in">✓</span>'
                      : isAnswered && answer.selectedOptionIndex === index
                      ? '<span class="text-3xl animate-scale-in">✗</span>'
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
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-3xl p-6 md:p-8 mb-8 animate-fade-in card-shadow-lg">
            <div class="flex gap-4">
              <span class="text-3xl flex-shrink-0">💡</span>
              <div class="flex-1">
                <h3 class="font-bold text-xl text-gray-900 dark:text-white mb-3">Explanation</h3>
                <p class="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">${this.escapeHtml(question.explanation)}</p>
              </div>
            </div>
          </div>

          <!-- Next Button -->
          <button
            id="next-btn"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] card-shadow-lg hover:shadow-xl text-lg"
          >
            ${this.state.isLastQuestion() ? '🎉 See Results →' : '➡️ Next Question'}
          </button>
        `
            : `
          <!-- Submit Button -->
          <button
            id="submit-btn"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:from-gray-400 disabled:to-gray-500 card-shadow-lg hover:shadow-xl text-lg"
            ${this.selectedOptionIndex === null ? 'disabled' : ''}
          >
            ✓ Submit Answer
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

        <div class="flex flex-col sm:flex-row gap-4">
          <a
            href="${typeof window !== 'undefined' ? window.location.origin + (document.querySelector('base')?.getAttribute('href') || '/') : '/'}"
            class="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-900 dark:text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02] card-shadow-md text-center"
          >
            ← Back Home
          </a>
          <button
            id="share-btn"
            class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02] card-shadow-md"
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
