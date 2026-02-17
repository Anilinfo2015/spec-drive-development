## ADDED Requirements

### Requirement: Daily Streak Calculation
The system SHALL track consecutive days a user completes the daily quiz.

#### Scenario: New user starts at zero
- **WHEN** user completes their first quiz
- **THEN** streak counter is initialized to 1

#### Scenario: Consecutive day completion
- **WHEN** user completes quiz on consecutive calendar days
- **THEN** streak counter increments by 1

#### Scenario: Streak breaks on missed day
- **WHEN** user skips a day (no quiz completed)
- **THEN** current streak resets to 0 and previous streak is saved as "longest streak"

#### Scenario: Same-day replays don't count
- **WHEN** user completes the same quiz multiple times in one day
- **THEN** streak only increments once per calendar day

### Requirement: Longest Streak Tracking
The system SHALL maintain a record of the user's longest streak achieved.

#### Scenario: Initial longest streak
- **WHEN** user first achieves a streak of N days
- **THEN** longest streak is set to N

#### Scenario: New record
- **WHEN** current streak exceeds longest streak
- **THEN** longest streak is updated to match current streak

#### Scenario: Longest streak persists
- **WHEN** current streak breaks
- **THEN** longest streak value remains unchanged

### Requirement: Total Quizzes Completed
The system SHALL count the total number of unique quizzes completed by the user.

#### Scenario: Quiz completion count
- **WHEN** user completes any quiz for the first time
- **THEN** total completed count increments by 1

#### Scenario: Replay doesn't increment
- **WHEN** user replays a previously completed quiz
- **THEN** total completed count does not change

### Requirement: localStorage Persistence
The system SHALL persist streak and statistics data in browser localStorage.

#### Scenario: Data persistence
- **WHEN** user completes a quiz
- **THEN** streak data is immediately saved to localStorage

#### Scenario: Data restoration
- **WHEN** user returns to the site
- **THEN** streak data is loaded from localStorage and displayed

#### Scenario: Storage schema validation
- **WHEN** loading from localStorage
- **THEN** system validates data structure and handles corrupted data gracefully

### Requirement: Streak Display and Feedback
The system SHALL display streak information prominently to encourage engagement.

#### Scenario: Streak badge display
- **WHEN** user has an active streak
- **THEN** streak counter with fire emoji (🔥) is displayed on home screen

#### Scenario: Milestone celebrations
- **WHEN** user reaches streak milestones (7, 30, 100 days)
- **THEN** special congratulatory message and animation are shown

#### Scenario: Streak risk warning
- **WHEN** user hasn't played today and it's late in the day
- **THEN** gentle reminder is shown: "Don't break your N-day streak!"

### Requirement: Achievement Badges
The system SHALL award achievement badges for various milestones.

#### Scenario: First quiz completion
- **WHEN** user completes their first quiz
- **THEN** "Beginner" badge is awarded

#### Scenario: Perfect score badge
- **WHEN** user achieves 5/5 on any quiz
- **THEN** "Perfect Score" badge is awarded

#### Scenario: Week warrior badge
- **WHEN** user maintains 7-day streak
- **THEN** "Week Warrior" badge is awarded

#### Scenario: Speed demon badge
- **WHEN** user completes quiz in under 60 seconds with perfect score
- **THEN** "Speed Demon" badge is awarded

#### Scenario: Badge display
- **WHEN** viewing profile or stats page
- **THEN** all earned badges are displayed with unlock dates

### Requirement: Timezone Handling
The system SHALL handle timezone differences correctly for daily quiz tracking.

#### Scenario: Local timezone usage
- **WHEN** determining if quiz is completed "today"
- **THEN** system uses user's local timezone for date calculations

#### Scenario: Midnight rollover
- **WHEN** local time crosses midnight
- **THEN** new quiz becomes available and previous day's quiz is marked as past

#### Scenario: Travel across timezones
- **WHEN** user changes timezone
- **THEN** streak calculation adapts to new local time without breaking
