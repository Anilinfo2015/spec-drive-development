# Daily Quiz App 🎯

A viral daily quiz platform inspired by Wordle, built with Astro, TypeScript, and Tailwind CSS. Test your knowledge, build streaks, and share your results!

## Features

- 📱 **Mobile-First Design** - Optimized for all devices
- 🌙 **Dark Mode** - Automatic theme based on system preferences
- 🔥 **Streak Tracking** - Build daily habits and earn badges
- 📤 **Wordle-Style Sharing** - Share results without spoilers
- 📚 **Educational** - Learn with detailed explanations
- 🚀 **Lightning Fast** - Static site, < 1 second load time
- 🎨 **Rich UI** - Smooth animations and modern design
- 📖 **Open Source** - Community-driven content

## Quiz Content Schema

Quizzes are defined in YAML files located in `input/quizzes/` directory.

### Filename Convention

```
YYYY-MM-DD-topic-slug.yaml
```

Example: `2024-03-15-ai-basics.yaml`

**Rules:**
- Date must be in ISO 8601 format (YYYY-MM-DD)
- Topic slug must be kebab-case (lowercase, numbers, hyphens only)
- Use `.yaml` or `.yml` extension

### YAML Structure

```yaml
meta:
  id: string              # Unique quiz identifier
  date: YYYY-MM-DD        # Must match filename date
  topic: string           # Quiz title/topic
  category: string        # See categories below
  difficulty: string      # easy | medium | hard

questions:
  - id: string            # Unique within quiz
    text: string          # Question text (max 300 chars)
    options:              # Exactly 4 options required
      - text: string      # Option text (max 150 chars)
        correct: boolean  # Exactly one must be true
    explanation: string   # Educational text (20-500 chars)
    points: number        # Points (1-1000, default: 100)
```

### Valid Categories

- `tech` - Technology and programming
- `science` - Scientific knowledge
- `history` - Historical events and figures
- `pop-culture` - Movies, music, entertainment
- `sports` - Sports and athletics
- `general` - General knowledge

### Valid Difficulty Levels

- `easy` - Beginner-friendly questions
- `medium` - Moderate challenge
- `hard` - Advanced knowledge required

### Validation Rules

1. **Metadata**
   - All fields required
   - Date must be ISO 8601 format
   - Category must be from valid list
   - Difficulty must be easy/medium/hard

2. **Questions**
   - At least 1 question required
   - Each question ID must be unique within quiz
   - Question text: 1-300 characters
   - Exactly 4 options per question
   - Exactly 1 option must be correct
   - Option text: 1-150 characters

3. **Explanations**
   - Required for every question
   - Length: 20-500 characters
   - Should explain why the answer is correct

4. **Points**
   - Range: 1-1000
   - Default: 100 if omitted

### Example Quiz

See `input/quizzes/example.yaml` for a complete, annotated example.

## Development

### Prerequisites

- Node.js 20.19.0 or higher
- npm 10.8.2 or higher

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
daily-quiz-app/
├── input/
│   └── quizzes/          # Quiz YAML files
├── src/
│   ├── components/       # Astro/React components
│   ├── layouts/          # Page layouts
│   ├── lib/              # Utilities and helpers
│   ├── types/            # TypeScript type definitions
│   └── styles/           # Global styles
├── public/               # Static assets
└── astro.config.mjs      # Astro configuration
```

### Adding a New Quiz

1. Create a YAML file in `input/quizzes/` following the naming convention
2. Fill in the quiz structure (use `example.yaml` as reference)
3. Run the build to validate: `npm run build`
4. If validation passes, the quiz will be included in the site
5. Submit a pull request with your quiz

### Build-Time Validation

All quizzes are validated during the build process. If any quiz fails validation:
- Build will stop with detailed error message
- Error shows filename, field, and specific issue
- Fix the issue and rebuild

Common validation errors:
- Mismatched filename and meta.date
- Invalid category or difficulty
- Wrong number of options (must be 4)
- Multiple correct answers (must be exactly 1)
- Explanation too short or too long
- Duplicate question IDs

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML parsing
- [date-fns](https://date-fns.org/) - Date handling

---

Built with spec-driven development
