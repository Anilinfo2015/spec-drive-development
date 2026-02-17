## ADDED Requirements

### Requirement: YAML File Discovery
The system SHALL automatically discover and load all quiz files from the input directory.

#### Scenario: Input directory scanning
- **WHEN** build process runs
- **THEN** system scans input/quizzes/ directory for all .yaml files

#### Scenario: Recursive directory support
- **WHEN** quiz files are organized in subdirectories
- **THEN** system discovers files in nested folders (e.g., input/quizzes/2024/february/)

#### Scenario: File filtering
- **WHEN** scanning directories
- **THEN** only files with .yaml or .yml extensions are processed

### Requirement: Quiz Compilation
The system SHALL compile quiz data into static site assets during build.

#### Scenario: Build-time processing
- **WHEN** static site build runs
- **THEN** all discovered quiz files are parsed and compiled into optimized JavaScript/JSON

#### Scenario: Quiz data embedding
- **WHEN** generating quiz pages
- **THEN** quiz data is embedded inline in HTML for instant loading (no runtime fetch)

#### Scenario: Build output structure
- **WHEN** build completes
- **THEN** each quiz has a static HTML page at /quiz/YYYY-MM-DD/

### Requirement: Date-Based Quiz Selection
The system SHALL determine which quiz to display based on current date.

#### Scenario: Current date matching
- **WHEN** user visits the site
- **THEN** system displays quiz matching today's date in user's local timezone

#### Scenario: Future quiz unavailability
- **WHEN** no quiz exists for current date
- **THEN** system shows "Come back tomorrow!" message with countdown timer

#### Scenario: Past quiz access
- **WHEN** user navigates to a past date's URL
- **THEN** archived quiz is displayed with indication it's from a previous day

### Requirement: Quiz Index Generation
The system SHALL generate an index of all available quizzes for navigation.

#### Scenario: Index page creation
- **WHEN** build runs
- **THEN** an index page listing all quizzes by date is generated

#### Scenario: Index sorting
- **WHEN** displaying quiz index
- **THEN** quizzes are sorted by date in descending order (newest first)

#### Scenario: Index metadata
- **WHEN** showing quiz in index
- **THEN** displays date, topic, category, difficulty, and completion status

### Requirement: Static Asset Optimization
The system SHALL optimize quiz assets for fast loading.

#### Scenario: Asset minification
- **WHEN** build generates quiz assets
- **THEN** HTML, CSS, and JavaScript are minified

#### Scenario: Image optimization
- **WHEN** quiz includes images
- **THEN** images are compressed and converted to modern formats (WebP, AVIF)

#### Scenario: Bundle splitting
- **WHEN** generating JavaScript bundles
- **THEN** common code is extracted to shared chunk for better caching

### Requirement: Build Performance
The system SHALL optimize build process for fast iteration and CI/CD.

#### Scenario: Incremental builds
- **WHEN** only one quiz file changes
- **THEN** build only processes changed files (when supported by framework)

#### Scenario: Build time target
- **WHEN** building site with 365 quizzes (full year)
- **THEN** build completes in under 2 minutes

#### Scenario: Parallel processing
- **WHEN** multiple quiz files are processed
- **THEN** processing happens in parallel when possible

### Requirement: Content Caching Strategy
The system SHALL implement effective caching for static assets.

#### Scenario: Cache headers
- **WHEN** static assets are served
- **THEN** appropriate cache-control headers are set (long cache for versioned assets)

#### Scenario: Quiz data versioning
- **WHEN** quiz content changes
- **THEN** asset URLs include content hash to bust cache

#### Scenario: Service worker caching
- **WHEN** user visits site
- **THEN** service worker caches quiz assets for offline access

### Requirement: Hot Reload Development
The system SHALL provide fast development experience with hot reloading.

#### Scenario: Dev server startup
- **WHEN** development server starts
- **THEN** initial load completes in under 10 seconds

#### Scenario: File change detection
- **WHEN** a quiz YAML file is edited
- **THEN** changes are reflected in browser within 2 seconds without full page reload

#### Scenario: Error overlay
- **WHEN** quiz file has validation error in development
- **THEN** error overlay shows detailed message in browser

### Requirement: Multi-Quiz Support
The system SHALL support managing and displaying multiple quiz tracks or categories.

#### Scenario: Category filtering
- **WHEN** user wants to filter by category
- **THEN** index page allows filtering quizzes by topic category

#### Scenario: Category-specific URLs
- **WHEN** building site
- **THEN** category pages are generated at /category/tech/, /category/science/, etc.

#### Scenario: Cross-category navigation
- **WHEN** user completes a quiz
- **THEN** system suggests other quizzes from same category
