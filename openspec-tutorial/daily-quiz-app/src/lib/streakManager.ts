import type { QuizResult } from '@types/quiz';

/**
 * Streak data stored in localStorage
 */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  totalCompleted: number;
  results: Record<string, QuizResult>;
  badges: string[];
}

/**
 * Achievement badge types
 */
export type BadgeType =
  | 'beginner'
  | 'perfect-score'
  | 'week-warrior'
  | 'month-master'
  | 'speed-demon'
  | 'century-club';

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const STORAGE_KEY = 'daily-quiz-streak';

/**
 * Streak Manager - Handles daily streaks, stats, and achievements
 */
export class StreakManager {
  private data: StreakData;

  constructor() {
    this.data = this.loadData();
  }

  /**
   * Load streak data from localStorage
   */
  private loadData(): StreakData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Validate data structure
        if (this.isValidData(data)) {
          return data;
        }
      }
    } catch (error) {
      console.error('Failed to load streak data:', error);
    }

    // Return default data
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: null,
      totalCompleted: 0,
      results: {},
      badges: [],
    };
  }

  /**
   * Validate streak data structure
   */
  private isValidData(data: unknown): data is StreakData {
    if (!data || typeof data !== 'object') return false;
    const d = data as Record<string, unknown>;
    return (
      typeof d.currentStreak === 'number' &&
      typeof d.longestStreak === 'number' &&
      (d.lastPlayedDate === null || typeof d.lastPlayedDate === 'string') &&
      typeof d.totalCompleted === 'number' &&
      typeof d.results === 'object' &&
      Array.isArray(d.badges)
    );
  }

  /**
   * Save streak data to localStorage
   */
  private saveData(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save streak data:', error);
    }
  }

  /**
   * Get today's date in YYYY-MM-DD format (local timezone)
   */
  private getTodayDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Check if two dates are consecutive days
   */
  private isConsecutiveDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  /**
   * Record quiz completion and update streaks
   */
  recordCompletion(quizId: string, result: QuizResult): void {
    const today = this.getTodayDate();

    // Check if already played today (prevent double counting)
    if (this.data.results[quizId]) {
      // Update result but don't affect streak
      this.data.results[quizId] = result;
      this.saveData();
      return;
    }

    // Record result
    this.data.results[quizId] = result;
    this.data.totalCompleted++;

    // Update streak
    if (!this.data.lastPlayedDate) {
      // First quiz ever
      this.data.currentStreak = 1;
    } else if (this.data.lastPlayedDate === today) {
      // Already played today (shouldn't happen, but handle it)
      // Don't update streak
    } else if (this.isConsecutiveDay(this.data.lastPlayedDate, today)) {
      // Consecutive day - increment streak
      this.data.currentStreak++;
    } else {
      // Streak broken - reset to 1
      this.data.currentStreak = 1;
    }

    // Update longest streak
    if (this.data.currentStreak > this.data.longestStreak) {
      this.data.longestStreak = this.data.currentStreak;
    }

    // Update last played date
    this.data.lastPlayedDate = today;

    // Check for new badges
    this.checkBadges(result);

    // Save
    this.saveData();
  }

  /**
   * Check and award badges
   */
  private checkBadges(result: QuizResult): void {
    // Beginner - first quiz completed
    if (this.data.totalCompleted === 1) {
      this.awardBadge('beginner');
    }

    // Perfect Score - 100% on any quiz
    if (result.score === result.totalPoints) {
      this.awardBadge('perfect-score');
    }

    // Week Warrior - 7 day streak
    if (this.data.currentStreak >= 7) {
      this.awardBadge('week-warrior');
    }

    // Month Master - 30 day streak
    if (this.data.currentStreak >= 30) {
      this.awardBadge('month-master');
    }

    // Speed Demon - perfect score in under 60 seconds
    if (result.score === result.totalPoints && result.timeSeconds < 60) {
      this.awardBadge('speed-demon');
    }

    // Century Club - 100 quizzes completed
    if (this.data.totalCompleted >= 100) {
      this.awardBadge('century-club');
    }
  }

  /**
   * Award a badge
   */
  private awardBadge(badgeId: BadgeType): void {
    if (!this.data.badges.includes(badgeId)) {
      this.data.badges.push(badgeId);
    }
  }

  /**
   * Get current streak
   */
  getCurrentStreak(): number {
    // Check if streak is still valid (not broken by missing yesterday)
    const today = this.getTodayDate();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (!this.data.lastPlayedDate) {
      return 0;
    }

    if (
      this.data.lastPlayedDate === today ||
      this.data.lastPlayedDate === yesterdayStr
    ) {
      return this.data.currentStreak;
    }

    // Streak is broken
    return 0;
  }

  /**
   * Get longest streak
   */
  getLongestStreak(): number {
    return this.data.longestStreak;
  }

  /**
   * Get total quizzes completed
   */
  getTotalCompleted(): number {
    return this.data.totalCompleted;
  }

  /**
   * Get all results
   */
  getResults(): Record<string, QuizResult> {
    return { ...this.data.results };
  }

  /**
   * Get result for specific quiz
   */
  getResult(quizId: string): QuizResult | null {
    return this.data.results[quizId] || null;
  }

  /**
   * Check if quiz was already completed
   */
  hasCompleted(quizId: string): boolean {
    return !!this.data.results[quizId];
  }

  /**
   * Get all badges with unlock status
   */
  getAllBadges(): Badge[] {
    const badges: Badge[] = [
      {
        id: 'beginner',
        name: 'Beginner',
        description: 'Complete your first quiz',
        emoji: '🎯',
        unlocked: this.data.badges.includes('beginner'),
      },
      {
        id: 'perfect-score',
        name: 'Perfect Score',
        description: 'Get 100% on any quiz',
        emoji: '💯',
        unlocked: this.data.badges.includes('perfect-score'),
      },
      {
        id: 'week-warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        emoji: '🔥',
        unlocked: this.data.badges.includes('week-warrior'),
      },
      {
        id: 'month-master',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        emoji: '👑',
        unlocked: this.data.badges.includes('month-master'),
      },
      {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Perfect score in under 60 seconds',
        emoji: '⚡',
        unlocked: this.data.badges.includes('speed-demon'),
      },
      {
        id: 'century-club',
        name: 'Century Club',
        description: 'Complete 100 quizzes',
        emoji: '💎',
        unlocked: this.data.badges.includes('century-club'),
      },
    ];

    return badges;
  }

  /**
   * Get newly unlocked badges (not yet seen)
   */
  getNewlyUnlockedBadges(): Badge[] {
    const allBadges = this.getAllBadges();
    // For simplicity, return all unlocked badges
    // In a real app, you'd track which ones have been shown
    return allBadges.filter((b) => b.unlocked);
  }

  /**
   * Check if user is at risk of breaking streak
   */
  isStreakAtRisk(): boolean {
    if (this.data.currentStreak === 0) return false;

    const today = this.getTodayDate();
    return this.data.lastPlayedDate !== today;
  }

  /**
   * Get streak statistics
   */
  getStats() {
    return {
      currentStreak: this.getCurrentStreak(),
      longestStreak: this.getLongestStreak(),
      totalCompleted: this.getTotalCompleted(),
      badges: this.getAllBadges(),
      isStreakAtRisk: this.isStreakAtRisk(),
    };
  }

  /**
   * Reset all data (for testing)
   */
  reset(): void {
    this.data = {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: null,
      totalCompleted: 0,
      results: {},
      badges: [],
    };
    this.saveData();
  }
}

/**
 * Global streak manager instance
 */
let streakManagerInstance: StreakManager | null = null;

export function getStreakManager(): StreakManager {
  if (!streakManagerInstance) {
    streakManagerInstance = new StreakManager();
  }
  return streakManagerInstance;
}
