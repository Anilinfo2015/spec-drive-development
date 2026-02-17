## ADDED Requirements

### Requirement: Quiz Metadata Schema
The system SHALL define and validate required metadata fields for each quiz.

#### Scenario: Required metadata fields
- **WHEN** a quiz YAML file is parsed
- **THEN** system validates presence of id, date, topic, category, and difficulty fields

#### Scenario: Valid date format
- **WHEN** quiz date field is parsed
- **THEN** date must be in ISO 8601 format (YYYY-MM-DD)

#### Scenario: Quiz ID uniqueness
- **WHEN** multiple quiz files are processed
- **THEN** each quiz must have a unique ID and system fails build on duplicates

#### Scenario: Difficulty levels
- **WHEN** difficulty field is validated
- **THEN** value must be one of: easy, medium, hard

#### Scenario: Category validation
- **WHEN** category field is validated
- **THEN** value must match predefined categories (tech, science, history, pop-culture, sports, general)

### Requirement: Questions Array Schema
The system SHALL define structure for quiz questions with options and explanations.

#### Scenario: Questions array structure
- **WHEN** a quiz is parsed
- **THEN** questions field must be a non-empty array

#### Scenario: Question required fields
- **WHEN** each question is validated
- **THEN** must include id, text, options (array), explanation, and points fields

#### Scenario: Question ID uniqueness
- **WHEN** validating questions within a quiz
- **THEN** each question must have a unique ID within that quiz

#### Scenario: Question text requirements
- **WHEN** question text is validated
- **THEN** text must be non-empty string with max length of 300 characters

### Requirement: Answer Options Schema
The system SHALL define structure for multiple-choice answer options.

#### Scenario: Options array size
- **WHEN** validating question options
- **THEN** must have exactly 4 options (multiple choice)

#### Scenario: Option structure
- **WHEN** each option is validated
- **THEN** must include text (string) and correct (boolean) fields

#### Scenario: Exactly one correct answer
- **WHEN** validating options for a question
- **THEN** exactly one option must have correct: true

#### Scenario: Option text length
- **WHEN** option text is validated
- **THEN** text must be non-empty with max length of 150 characters

### Requirement: Explanation Schema
The system SHALL require educational explanations for each question.

#### Scenario: Explanation presence
- **WHEN** validating a question
- **THEN** explanation field must be non-empty string

#### Scenario: Explanation length
- **WHEN** validating explanation
- **THEN** text must be between 20 and 500 characters

#### Scenario: Explanation quality
- **WHEN** validating explanation content
- **THEN** should explain why the correct answer is correct (enforced via guidelines)

### Requirement: Points Schema
The system SHALL validate point values for questions.

#### Scenario: Points field validation
- **WHEN** validating question points
- **THEN** points must be a positive integer

#### Scenario: Default points value
- **WHEN** points field is omitted
- **THEN** default value of 100 points is used

#### Scenario: Points range
- **WHEN** points value is specified
- **THEN** must be between 1 and 1000

### Requirement: YAML File Naming Convention
The system SHALL enforce naming conventions for quiz files.

#### Scenario: File naming format
- **WHEN** quiz files are discovered
- **THEN** filename must follow pattern: YYYY-MM-DD-topic-slug.yaml

#### Scenario: Date in filename matches metadata
- **WHEN** quiz file is validated
- **THEN** date in filename must match meta.date field

#### Scenario: Valid topic slug
- **WHEN** validating filename
- **THEN** topic slug must be kebab-case with only lowercase letters, numbers, and hyphens

### Requirement: Build-Time Validation
The system SHALL validate all quiz files during the build process.

#### Scenario: Validation on build
- **WHEN** static site build runs
- **THEN** all YAML files in input/quizzes/ are validated

#### Scenario: Build failure on invalid schema
- **WHEN** any quiz file fails validation
- **THEN** build process stops with detailed error message indicating file and validation issue

#### Scenario: Validation error messages
- **WHEN** validation fails
- **THEN** error message includes filename, field path, and specific validation rule violated

#### Scenario: Success confirmation
- **WHEN** all quizzes pass validation
- **THEN** build logs show count of valid quizzes processed

### Requirement: Example Schema Documentation
The system SHALL provide documented example YAML showing correct format.

#### Scenario: Example file presence
- **WHEN** contributor wants to add a quiz
- **THEN** an example.yaml file with complete structure is available in the repository

#### Scenario: Schema documentation
- **WHEN** viewing schema documentation
- **THEN** all required fields, types, constraints, and examples are documented
