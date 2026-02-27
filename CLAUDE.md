# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An elegant digital presentation of the Tao Te Ching (道德经) with Wang Bi's annotations (王弼注). Features full-screen scroll-snap navigation, keyboard controls, and a slide-out annotation drawer.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

No test suite or linting is configured. The project uses Vite's default configuration without a custom `vite.config.js`.

## Architecture

### Component Pattern
Components are functional modules that return DOM elements:

```javascript
// components/chapter.js
export function createChapter(chapter) {
  const section = document.createElement('section');
  // ... build and return DOM element
  return section;
}
```

Components are pure functions that accept data objects and return DOM elements. State is managed via module-level variables (e.g., `drawer.js` tracks `currentChapterId`).

### Scroll-Snap Architecture

The app uses CSS scroll-snap for chapter navigation:
- Each `.section` is `100vh` with `scroll-snap-align: start`
- `#app` has `scroll-snap-type: y mandatory`
- `IntersectionObserver` tracks the active chapter at 50% threshold
- Keyboard navigation (Arrow keys, j/k) scrolls to adjacent sections

### Data Structure

Chapters in `src/data/chapters.js` follow this schema:

```javascript
{
  id: 1,                    // Chapter number (1-81)
  title: "第一章",           // Chapter title
  part: "道经",              // "道经" (1-37) or "德经" (38-81)
  text: "道可道，非常道...",  // Original text with \n line breaks
  annotation: "王弼注文..."   // Wang Bi's commentary
}
```

### CSS Architecture

Organized into logical layers:
- `variables.css` - CSS custom properties for theming
- `base.css` - Reset and base styles
- `layout.css` - Scroll-snap layout, navigation sidebar
- `drawer.css` - Slide-out annotation panel
- `responsive.css` - Mobile breakpoints

Key design tokens:
- Background: `#FAF9F5` (warm off-white)
- Accent: `#8B4513` (saddle brown for active states)
- Navigation width: `36px` with Courier Prime font
- Content max-width: `680px`

### Drawer State Management

The annotation drawer uses a simple module pattern:

```javascript
// components/drawer.js
let currentChapterId = null;
let isOpen = false;

export function openDrawer(chapter) { /* ... */ }
export function closeDrawer() { /* ... */ }
```

Drawer opens when clicking chapter text. Closes via: backdrop click, ✕ button, or ESC key.

### Navigation Features

- Left sidebar lists chapters 1-81, grouped by "道经"/"德经"
- Active chapter highlighted with accent color
- Random chapter button at bottom (dice icon SVG)
- Click scrolls to chapter smoothly; mobile has hamburger toggle

## File Organization

```
src/
├── main.js           # Entry: imports styles, initializes components
├── data/
│   └── chapters.js   # All 81 chapters with Wang Bi annotations
└── components/
    ├── chapter.js    # Chapter section with click handler for drawer
    ├── drawer.js     # Slide-out annotation panel
    ├── navigation.js # Sidebar with chapter list + random jump
    ├── scroll.js     # IntersectionObserver + keyboard nav
    └── title.js      # Title page component
```

## Key Conventions

- Use `white-space: pre-line` for chapter text to respect `\n` line breaks
- Chapter text elements have `cursor: pointer` to indicate clickable annotations
- URL hash updates to `#chapter-N` for shareable links
- Support `prefers-reduced-motion` for accessibility
- Chinese font: Noto Serif SC; Navigation: Courier Prime

## Adding/Modifying Chapters

Edit `src/data/chapters.js`. Each chapter needs all five fields. Line breaks in text use `\n`. Annotations can contain multiple paragraphs separated by `\n\n`.