## ADDED Requirements

### Requirement: Quiz YAML Parsing
The system SHALL parse quiz content from YAML files and validate the schema structure.

#### Scenario: Valid YAML loads successfully
- **WHEN** a valid YAML quiz file is provided at build time
- **THEN** the system parses all questions, options, and metadata without errors

#### Scenario: Invalid YAML fails build
- **WHEN** a YAML file has schema violations (missing required fields, invalid structure)
- **THEN** the build process fails with clear error messages indicating the validation issues

### Requirement: Question Flow Management
The system SHALL present quiz questions sequentially and track user progress through the quiz.

#### Scenario: Questions display in order
- **WHEN** user starts a quiz
- **THEN** questions are presented one at a time in the order defined in the YAML

#### Scenario: Navigation restrictions
- **WHEN** user is on question N
- **THEN** user cannot skip ahead to question N+1 without answering question N

### Requirement: Answer Selection and Validation
The system SHALL allow users to select answers and validate correctness.

#### Scenario: Single answer selection
- **WHEN** user taps an answer option
- **THEN** that option is highlighted and any previous selection is cleared

#### Scenario: Answer validation
- **WHEN** user confirms their answer
- **THEN** system immediately shows whether the answer is correct or incorrect

#### Scenario: Answer locking
- **WHEN** user confirms an answer
- **THEN** the answer cannot be changed and is locked for that question

### Requirement: Scoring System
The system SHALL calculate and display quiz scores based on correct answers.

#### Scenario: Points per correct answer
- **WHEN** user answers a question correctly
- **THEN** the configured points for that question are added to the total score

#### Scenario: Zero points for incorrect
- **WHEN** user answers a question incorrectly
- **THEN** zero points are awarded for that question

#### Scenario: Final score calculation
- **WHEN** all questions are answered
- **THEN** system displays total score out of maximum possible points

### Requirement: Quiz Timer
The system SHALL track the time taken to complete the quiz.

#### Scenario: Timer starts on first question
- **WHEN** user views the first question
- **THEN** a timer starts counting elapsed time

#### Scenario: Timer stops on completion
- **WHEN** user answers the final question
- **THEN** the timer stops and total elapsed time is recorded

#### Scenario: Timer display format
- **WHEN** displaying elapsed time
- **THEN** time is shown in minutes and seconds format (MM:SS)

### Requirement: Educational Explanations
The system SHALL display educational explanations after each answer is confirmed.

#### Scenario: Explanation display
- **WHEN** user confirms an answer (correct or incorrect)
- **THEN** the explanation text from the YAML is displayed below the question

#### Scenario: Explanation content
- **WHEN** explanation is shown
- **THEN** it includes the reason why the correct answer is correct
