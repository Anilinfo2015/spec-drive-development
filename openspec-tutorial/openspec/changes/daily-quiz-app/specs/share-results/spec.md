## ADDED Requirements

### Requirement: Emoji Grid Generation
The system SHALL generate Wordle-style emoji grids representing quiz results without spoiling answers.

#### Scenario: Correct answer representation
- **WHEN** a question was answered correctly
- **THEN** the grid shows a green square emoji (🟩)

#### Scenario: Incorrect answer representation
- **WHEN** a question was answered incorrectly
- **THEN** the grid shows a black/gray square emoji (⬛)

#### Scenario: Grid format
- **WHEN** quiz is completed
- **THEN** emoji grid displays all answers in a single row or multiple rows

#### Scenario: No spoilers
- **WHEN** sharing results
- **THEN** the grid reveals correct/incorrect pattern but not specific questions or answers

### Requirement: Text Result Summary
The system SHALL generate a formatted text summary of quiz results for easy sharing.

#### Scenario: Result text format
- **WHEN** user completes a quiz
- **THEN** a formatted text block is generated with quiz number, topic, emoji grid, score, time, and streak

#### Scenario: Result text example
- **WHEN** generating share text
- **THEN** format follows: "Daily Quiz #127 🎯\nTopic: AI & Machine Learning\n\n⬛🟩🟩⬛🟩\n\n5/5 in 2:34 ⏱️\nStreak: 🔥 5 days\n\n[Play now] quiz.app"

### Requirement: Clipboard Copy Functionality
The system SHALL enable one-tap copying of results to the clipboard.

#### Scenario: Copy button availability
- **WHEN** quiz is completed
- **THEN** a "Copy Results" button is prominently displayed

#### Scenario: Successful copy
- **WHEN** user taps the copy button
- **THEN** formatted results are copied to clipboard and user receives confirmation feedback

#### Scenario: Copy confirmation
- **WHEN** results are copied successfully
- **THEN** button text changes to "Copied! ✓" for 2 seconds before reverting

#### Scenario: Copy failure handling
- **WHEN** clipboard API is not available or fails
- **THEN** results are displayed in a text area for manual selection

### Requirement: Rich Social Cards
The system SHALL generate visually appealing image cards for social media sharing.

#### Scenario: Canvas-based card generation
- **WHEN** user requests to share as image
- **THEN** system generates a card using Canvas API with quiz details, emoji grid, and branding

#### Scenario: Card content
- **WHEN** generating social card
- **THEN** card includes quiz number, topic, emoji grid, score, time, streak, and site URL/QR code

#### Scenario: Card dimensions
- **WHEN** card is generated
- **THEN** image uses optimal social media dimensions (1200x630px for Open Graph)

### Requirement: Social Media Meta Tags
The system SHALL include proper Open Graph and Twitter Card meta tags for link sharing.

#### Scenario: Open Graph tags
- **WHEN** quiz URL is shared on Facebook or LinkedIn
- **THEN** preview shows quiz title, description, and generated card image

#### Scenario: Twitter Card tags
- **WHEN** quiz URL is shared on Twitter/X
- **THEN** preview shows large image card with quiz details

#### Scenario: Dynamic meta tags
- **WHEN** different quiz dates are shared
- **THEN** meta tags reflect the specific quiz's topic and date

### Requirement: Share Call-to-Action
The system SHALL include compelling messaging to encourage sharing.

#### Scenario: Share prompt
- **WHEN** user completes quiz with good score (4/5 or 5/5)
- **THEN** message encourages sharing: "Great job! Share your results and challenge your friends!"

#### Scenario: Challenge messaging
- **WHEN** generating share text
- **THEN** includes call-to-action like "Can you beat my score?" or "Try today's quiz!"
