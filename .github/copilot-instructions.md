# GitHub Copilot Instructions for osu-recap

## Project Overview
This is a React application built with Vite, designed to create a "Spotify Wrapped" style recap for university students ("ОГУ"). It visualizes student data (attendance, grades, etc.) through a series of interactive, animated "stories".

## Tech Stack
- **Framework:** React 18+ (Vite)
- **Styling:** Tailwind CSS
- **Animation:** `motion/react` (Framer Motion)
- **UI Components:** Radix UI primitives, shadcn/ui patterns
- **Icons:** Lucide React

## Architecture & Core Concepts

### Story Engine (`src/app/App.tsx`)
- **Central Controller:** `App.tsx` manages the global state: current story index, auto-play timer, and navigation logic.
- **Configuration:** The `stories` array in `App.tsx` defines the sequence, component mapping, and duration for each story.
  ```typescript
  const stories = [
    { id: 1, component: Story1Cover, duration: 6000 },
    // ...
  ];
  ```
- **Navigation:** Handles tap-to-advance, tap-back, and long-press-to-pause interactions.

### Story Components (`src/app/components/stories/`)
- **Structure:** Each story is a standalone component wrapped in a `StoryCard`.
- **Naming Convention:** `Story<Index><Description>.tsx` (e.g., `Story1Cover.tsx`, `Story3_5EarliestMorning.tsx`).
- **Layout:** Use `StoryCard` to provide the consistent full-screen background and padding.
  ```tsx
  export function StoryExample() {
    return (
      <StoryCard gradient="from-blue-500 to-purple-600">
        <div className="z-10 text-center">
          {/* Content goes here */}
        </div>
      </StoryCard>
    );
  }
  ```

### Animation Guidelines
- **Library:** Use `motion/react` (formerly `framer-motion`) for all animations.
- **Entrance:** Animate elements in with `initial`, `animate`, and `transition` props. Stagger children for a polished feel.
- **Continuous:** Use `animate` with `repeat: Infinity` for subtle background or emphasis effects (e.g., floating elements, glowing text).
- **Performance:** Prefer animating `opacity` and `transform` properties.

## Styling & UI Patterns
- **Tailwind:** Use utility classes for layout and typography.
- **Class Merging:** Use `cn()` utility (from `src/app/components/ui/utils.ts`) when conditionally applying classes.
- **Gradients:** Stories typically use vibrant background gradients passed to the `StoryCard` `gradient` prop.
- **Typography:** Large, bold headings for stats; readable subtext for context.

## Development Workflow
- **Adding a New Story:**
  1. Create the component in `src/app/components/stories/`.
  2. Import it in `src/app/App.tsx`.
  3. Add it to the `stories` array with an appropriate `duration`.
- **Assets:** Place static assets in `public/` or import them directly if they are small.
- **Icons:** Use `lucide-react` components.

## Common Components
- **`StoryCard`:** The main wrapper for every story screen. Handles the background gradient and container sizing.
- **`ParticleBackground`:** Used for atmospheric effects (falling leaves, floating shapes).
- **`NavigationHints`:** Visual cues for user interaction (rendered by `App.tsx`).
