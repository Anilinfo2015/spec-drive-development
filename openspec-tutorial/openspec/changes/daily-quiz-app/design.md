## Context

Building a viral daily quiz platform inspired by Wordle's success. The application must be:
- **Static-first**: No backend servers, deploy to CDN/GitHub Pages
- **Content-driven**: Quiz content managed via YAML files in `/input` folder
- **Mobile-optimized**: Thumb-friendly, fast-loading, works on any device
- **Zero-friction**: No login required, localStorage for persistence
- **Shareable**: Wordle-style emoji grids for social sharing

Current state: Greenfield project with no existing codebase.

Key constraints:
- Must work offline after initial load
- Content updates require rebuild (acceptable for daily cadence)
- No user accounts or backend database
- Target < 1 second initial load time

## Goals / Non-Goals

**Goals:**
- Static site that builds from YAML quiz definitions
- Mobile-first responsive UI with smooth animations and dark mode
- Wordle-style shareable results (emoji grids, no spoilers)
- Daily streak tracking via localStorage
- Educational value through answer explanations
- Community-friendly content contribution via YAML files
- SEO-optimized for social sharing (Open Graph, Twitter cards)

**Non-Goals:**
- Real-time multiplayer or live leaderboards (would require backend)
- User authentication or profiles
- Quiz analytics or tracking (privacy-first approach)
- Dynamic quiz generation or AI-powered questions
- Native mobile apps (PWA is sufficient)
- Server-side rendering or API endpoints

## Decisions

### 1. Static Site Generator: **Astro**

**Decision:** Use Astro for static site generation.

**Rationale:**
- **Performance-first**: Ships zero JavaScript by default, perfect for fast load times
- **Content-focused**: Excellent for YAML/markdown content collections
- **Framework-agnostic**: Can use React/Vue/Svelte components if needed
- **Built-in optimizations**: Image optimization, CSS bundling, asset handling
- **Easy deployment**: Static output works with any CDN or GitHub Pages

**Alternatives considered:**
- *Next.js static export*: Heavier bundle, more complex than needed
- *Vite + vanilla*: More manual setup, less content tooling
- *11ty*: Good but less modern DX and component support

### 2. YAML Schema Structure

**Decision:** Hierarchical YAML structure with metadata and questions array.

```yaml
# input/quizzes/2024-02-17-ai-basics.yaml
meta:
  id: quiz-127
  date: 2024-02-17
  topic: "AI & Machine Learning"
  category: tech
  difficulty: medium

questions:
  - id: q1
    text: "What does GPT stand for?"
    options:
      - text: "General Purpose Transformer"
        correct: false
      - text: "Generative Pre-trained Transformer"
        correct: true
      - text: "Global Processing Technology"
        correct: false
      - text: "Graphical Prompt Tool"
        correct: false
    explanation: "GPT uses transformer architecture pre-trained on massive datasets..."
    points: 100
```

**Rationale:**
- Self-documenting and human-readable
- Easy for non-developers to contribute
- Git-friendly for version control and PRs
- Validates at build time preventing bad deploys

### 3. State Management: **localStorage + Context**

**Decision:** Use localStorage for persistence with context/composables for state.

**Rationale:**
- No external dependencies needed
- Persists across sessions
- Synchronous API (simpler than IndexedDB)
- Sufficient capacity (5-10MB) for streaks and results

**Storage schema:**
```json
{
  "dailyQuiz": {
    "currentStreak": 5,
    "longestStreak": 12,
    "lastPlayed": "2024-02-17",
    "totalPlayed": 47,
    "results": {
      "quiz-127": {
        "score": 5,
        "total": 5,
        "timeSeconds": 154,
        "completedAt": "2024-02-17T10:30:00Z"
      }
    }
  }
}
```

### 4. UI Framework: **Tailwind CSS + CSS Animations**

**Decision:** Tailwind CSS for styling with native CSS animations.

**Rationale:**
- **Tailwind**: Utility-first, mobile-first, tree-shakeable (small bundle)
- **CSS animations**: Native performance, no JS library overhead
- **Dark mode**: Built into Tailwind with `dark:` variants
- **Responsive**: Mobile-first breakpoints out of the box

**Alternatives considered:**
- *Styled-components*: Adds runtime overhead
- *CSS Modules*: More verbose than Tailwind
- *Framer Motion*: Too heavy for simple animations

### 5. Share Results: **Canvas API + Clipboard**

**Decision:** Generate emoji grids with Canvas API for rich image sharing.

**Rationale:**
- Text emoji grid (Wordle-style): ⬛🟩🟩⬛🟩
- Canvas for rich cards: Include stats, branding, QR code
- Clipboard API for easy copying
- Pre-rendered social meta tags for link previews

**Format:**
```
Daily Quiz #127 🎯
Topic: AI & Machine Learning

⬛🟩🟩⬛🟩

5/5 in 2:34 ⏱️
Streak: 🔥 5 days

[Play now] quiz.app
```

### 6. Build Process & Content Loading

**Decision:** Build-time quiz compilation with client-side date matching.

**Workflow:**
1. Build reads all YAML files from `/input/quizzes/`
2. Validates schema and generates static pages
3. Client-side script determines today's quiz by date
4. Quiz data embedded in page (no runtime fetch)

**Rationale:**
- Content validation at build time (fail fast)
- No runtime dependencies or API calls
- Works offline after initial load
- Cacheable static assets

### 7. Deployment Strategy

**Decision:** GitHub Pages with GitHub Actions for automated builds.

**Pipeline:**
1. Push YAML to `/input/quizzes/` on main branch
2. GitHub Actions runs Astro build
3. Deploys to `gh-pages` branch
4. Cloudflare/GitHub Pages CDN serves static files

**Rationale:**
- Free hosting for open source
- Automatic HTTPS
- Global CDN distribution
- Community can contribute via PRs

## Risks / Trade-offs

### Risk: localStorage can be cleared by users
**Mitigation:**
- Accept data loss as acceptable for free product
- Show prompt to remind users not to clear browser data
- Consider future cloud sync as premium feature

### Risk: Static site requires rebuild for new quizzes
**Mitigation:**
- Daily cadence makes this acceptable (1 build/day)
- Automated GitHub Actions pipeline
- Build time < 1 minute for fast updates
- Pre-schedule quizzes weeks in advance

### Risk: No backend limits social features
**Mitigation:**
- Phase 1: Focus on individual experience and share features
- Client-side features sufficient for MVP (streaks, scores)
- Future: Consider optional backend for leaderboards

### Risk: Mobile keyboard covering UI
**Mitigation:**
- Large tap targets (min 44x44px)
- Fixed positioning for quiz progress
- Test on various device sizes
- Use `viewport-fit=cover` for safe areas

### Trade-off: Performance vs. Rich Animations
**Decision:** Prioritize performance, use subtle CSS animations only.
- Animations under 300ms
- `will-change` hints for smooth 60fps
- Reduce motion for accessibility

### Trade-off: SEO vs. Client-side Routing
**Decision:** Static pages with no client routing.
- Each quiz date is a separate static page
- Better SEO and social sharing
- Simpler architecture

## Migration Plan

### Phase 1: MVP Launch
1. Create base Astro project structure
2. Implement YAML schema and build pipeline
3. Build core quiz engine and UI components
4. Add localStorage streak tracking
5. Implement share functionality
6. Deploy to GitHub Pages

### Phase 2: Content Scaling
1. Create 30 days of quiz content
2. Set up contribution guidelines
3. Automate build on content PRs
4. Monitor build times and optimize

### Phase 3: Growth Features
1. Add quiz categories/filters
2. Achievement badges system
3. Historical quiz archive
4. PWA manifest for "install" prompt

### Rollback Strategy
- Git revert for bad content
- Static site = instant rollback (no DB migrations)
- Cloudflare cache purge if needed

## Open Questions

1. **Quiz difficulty calibration**: How to balance easy/hard questions? Start medium and adjust based on completion rates.

2. **Quiz length**: 5 questions (2-3 min) or 10 questions (5 min)? Recommend 5 for MVP to reduce friction.

3. **Timer**: Should quiz be timed for bonus points? Optional: implement for competitive feel but make optional.

4. **Multiple quizzes per day**: Support different categories? Start with one/day, expand if popular.

5. **Monetization**: Ads, premium, donations? Defer until product-market fit achieved.
