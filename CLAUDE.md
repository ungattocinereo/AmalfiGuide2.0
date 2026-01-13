# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Amalfi.Day** is a Next.js 16 Progressive Web App (PWA) showcasing curated travel content for the Amalfi Coast. Built by Gregory Day, the project serves as an expert guide featuring locations, restaurants, hiking trails, and hidden gems in the Atrani/Amalfi area.

## Development Commands

```bash
# Start development server with webpack (required)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

**Important**: This project requires the `--webpack` flag (already configured in package.json scripts). Do not modify the webpack flag settings.

## Architecture & Key Concepts

### Data Flow Architecture

The application follows a **static content-driven architecture**:

1. **Content Source**: All content lives in `src/data/texts.md` as structured markdown
2. **Parser**: `src/lib/markdown-parser.ts` reads and parses the markdown into typed data structures (`CategorySection[]`)
3. **Static Generation**: Content is parsed at build time (`dynamic = "force-static"` in `src/app/page.tsx`)
4. **Client Rendering**: Parsed data is passed to client components for interactive UI

### Content Structure

The markdown file (`src/data/texts.md`) follows a strict format:

```markdown
# Category Name
Category description text

### Place Name
**Category**: Photo Spot
**Tagline**: Short tagline
**Short info:**
Brief description for card view
**The Details:**
Full description for detail view
> [!info] Key Links
> - **Google Maps**: [View Location](url)
> - **TripAdvisor**: [Rating | Reviews](url)
---
```

Each section has:
- **CategorySection**: title, description, and items array
- **PlaceItem**: name, category, tagline, shortInfo, details, and links

### Component Architecture

**Layout Hierarchy**:
```
RootLayout (layout.tsx)
├── ThemeProvider (next-themes)
├── LayoutProvider (expand/collapse state)
└── MainContent (client component)
    ├── Navbar (sticky navigation)
    ├── Hero (orange background with image)
    ├── SectionGrid[] (one per category)
    │   └── PlaceCard[] (grid items)
    └── PlaceDetails (modal overlay)
```

**State Management**:
- `LayoutProvider` (`src/components/layout-context.tsx`): Global expand/collapse toggle and per-section expansion state
- `MainContent` (`src/components/main-content.tsx`): Selected item state for detail modal

### Image & Map Handling

Images are hardcoded in `src/components/place-card.tsx` using a name-matching function:

```typescript
const getImageForPlace = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("square")) return "/images/atrani_square.png";
  // ... more mappings
  return "/images/hero.webp"; // fallback
}
```

Hiking trails use embedded Google Maps instead of static images:
```typescript
const hikingMapUrls: Record<string, string> = {
  "valle delle ferriere": "https://www.google.com/maps/embed?pb=...",
  // ... more hiking maps
}
```

When adding new places, you must update these mappings manually.

### Styling System

- **CSS Framework**: Tailwind CSS v4 (using @tailwindcss/postcss)
- **Animations**: Framer Motion for transitions and layout animations
- **Theme**: Light/dark mode via `next-themes` with system preference detection
- **Fonts**:
  - Inter (sans-serif, body text)
  - Merriweather (serif, headings)
- **Design Pattern**: Mobile-first with responsive breakpoints

### PWA Configuration

PWA is handled by `@ducanh2912/next-pwa`:
- Service worker generation is **disabled in development**
- Manifest: `public/manifest.json`
- Config: `next.config.ts`

## File Organization

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts & providers
│   ├── page.tsx            # Home page (parses markdown)
│   └── globals.css         # Global styles & Tailwind imports
├── components/
│   ├── hero.tsx            # Hero section with orange background
│   ├── navbar.tsx          # Sticky navigation bar
│   ├── main-content.tsx    # Main content wrapper (client component)
│   ├── section-grid.tsx    # Category section with grid of cards
│   ├── place-card.tsx      # Individual place card
│   ├── place-details.tsx   # Modal detail view
│   ├── layout-context.tsx  # Expand/collapse state provider
│   ├── theme-provider.tsx  # Theme provider wrapper
│   ├── logo.tsx            # SVG logo component
│   └── ui/                 # Radix UI components (Button, DropdownMenu)
├── lib/
│   ├── markdown-parser.ts  # Markdown parsing logic
│   └── utils.ts            # cn() utility for className merging
└── data/
    ├── texts.md            # Main content file (all place data)
    └── structure.md        # Design spec/requirements doc
```

## Path Aliases

TypeScript is configured with `@/*` mapping to `./src/*`:

```typescript
import { parseMarkdownContent } from "@/lib/markdown-parser";
import { Hero } from "@/components/hero";
```

## Working with Content

### Adding New Places

1. Edit `src/data/texts.md` following the exact format above
2. Add image to `public/images/` (or use hiking map embed URL)
3. Update `getImageForPlace()` or `hikingMapUrls` in `src/components/place-card.tsx`
4. Run `npm run build` to verify parsing works

### Adding New Categories

Categories are automatically created from H1 headers (`# Category Name`) in `texts.md`. No code changes needed unless you want special styling.

## Design Requirements

See `src/data/structure.md` for detailed UI/UX specifications including:
- Responsive card layouts (mobile: 2-col 4x5, desktop: 16x9)
- Expand/collapse functionality
- Modal detail view behavior
- Footer content and links
- Future features (motorbike trails, beach reviews, transport timetables)

## Important Notes

- **No Git Repo**: This directory is not a git repository
- **Static Export**: The app uses Next.js static generation (`force-static`)
- **Image Strategy**: Images are not optimized at build time; they're served from `public/images/`
- **TypeScript**: Strict mode enabled
- **Font Loading**: Google Fonts (Inter, Merriweather) loaded via next/font
