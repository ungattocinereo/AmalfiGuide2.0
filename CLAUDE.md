# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Amalfi.Day** is a Next.js 16 PWA — a curated travel guide for the Amalfi Coast featuring locations, restaurants, hiking trails, and hidden gems. Built with static generation, 6-language support, and instant client-side language switching.

## Development Commands

```bash
npm run dev          # Dev server (requires --webpack flag, already configured)
npm run build        # Production build — also validates markdown parsing
npm start            # Start production server
npm run lint         # ESLint
```

**Critical**: The `--webpack` flag is required. Do not remove it from package.json scripts.

## Architecture

### Data Flow (Build-Time Static)

```
src/data/content/texts.{lang}.md  (6 language files)
  → src/lib/markdown-parser.ts    (parseMarkdownContentForLanguage)
  → CategorySection[] per language
  → src/app/page.tsx              (force-static, loads ALL 6 languages)
  → MainContent                   (client component, switches at runtime)
```

All content is parsed at build time. Language switching is instant — no API calls or page reloads.

### Component Hierarchy

```
RootLayout (layout.tsx)
├── ThemeProvider (next-themes, dark mode)
├── LanguageProvider (language-context.tsx)
└── LayoutProvider (layout-context.tsx, expand/collapse)
    └── MainContent (main-content.tsx, modal state)
        ├── LanguageTransition (full-screen overlay animation)
        ├── Navbar (fixed, glassmorphic)
        ├── Hero (100vh orange background)
        ├── SectionGrid[] (category sections)
        │   └── PlaceCard[] (grid items)
        ├── PlaceDetails (modal with browser back support)
        └── Footer (two-tier)
```

### Three Context Providers

1. **LanguageContext** (`language-context.tsx`): Current language, `setLanguage()`, `t()` for UI translations, transition animation state. Detection priority: URL param → localStorage → browser locale → English.
2. **LayoutContext** (`layout-context.tsx`): Global expand/collapse toggle + per-section overrides. Intro section always expanded.
3. **MainContent state**: Selected place item for detail modal + `history.pushState` integration for browser back button.

### Multilingual System

**6 languages**: EN, IT, ES, FR, DE, RU

Two types of translation files:
- **Content**: `src/data/content/texts.{lang}.md` — place descriptions, parsed by markdown-parser
- **UI strings**: `public/translations/ui.{lang}.json` — navbar, footer, buttons, accessed via `t('key')`

Language config and types live in `src/lib/i18n/types.ts`.

### Image & Map Handling

All mappings are in `src/lib/place-images.ts` (not in place-card.tsx):

- `getImageForPlace(name)` — hardcoded name-to-image mapping with **multilingual keywords** (e.g., "waterfall" | "cascata" | "cascada" | "водопад"). Images served from `/public/guide-webp/`.
- `hikingMapUrls` — Google Maps embed URLs for hiking trails (displayed as iframes instead of images).

### Section-Specific Layouts

`section-grid.tsx` renders categories differently based on type:
- **Expert Guide** (intro): Always expanded, photo left + text right on desktop
- **Gems of Atrani**: Desktop shows text intro in first grid column, then cards
- **Hiking & Nature**: 1-col mobile / 2-col desktop, 4:3 aspect, embedded Google Maps
- **Standard sections**: 2-col mobile (4:5 aspect) / 3-col desktop (4:3 aspect)

## Working with Content

### Adding a New Place

1. Add entry to **all 6** `src/data/content/texts.{lang}.md` files using the exact format:
   ```markdown
   ### Place Name
   **Category**: Category Type
   **Tagline**: Short tagline
   **Short info:**
   Brief description
   **The Details:**
   Full description
   > [!info] Key Links
   > - **Google Maps**: [View Location](url)
   ---
   ```
2. Add image to `public/guide-webp/`
3. Update `getImageForPlace()` in `src/lib/place-images.ts` with multilingual keywords
4. For hiking trails, update `hikingMapUrls` in the same file
5. `npm run build` to verify parsing

### Adding UI Strings

Add to all 6 `public/translations/ui.{lang}.json` files, use via `t('key')` from `useLanguage()`.

### Adding Categories

Categories are auto-created from H1 headers (`# Category Name`) in the markdown files. Special layout behavior is controlled by name-matching in `section-grid.tsx`.

## Key Tech Details

- **Next.js 16** with App Router, `force-static` generation
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **Framer Motion** for animations (`layoutId` shared element transitions, staggered grids, spring physics)
- **Fonts**: Inter (body), Libre Baskerville (headings/taglines) — loaded via `next/font`
- **Icons**: `@phosphor-icons/react`
- **PWA**: `@ducanh2912/next-pwa`, disabled in dev. Manifest at `public/manifest.json`
- **Path alias**: `@/*` maps to `./src/*`
- **Deployment**: Vercel via GitHub Actions (see Deployment Pipeline below)

## Deployment Pipeline

Three-tier deployment via GitHub Actions + Vercel CLI:

| Environment | Trigger | Domain | Workflow |
|-------------|---------|--------|----------|
| **Dev** | Push to any branch except `main` | Auto-generated `*.vercel.app` | `deploy-dev.yml` |
| **Stage** | Push to `main` | Auto-generated `*.vercel.app` | `deploy-stage.yml` |
| **Prod** | GitHub Release published | `guide.amalfi.day` | `deploy-prod.yml` |

### Branch Strategy
- `feature/*` or any non-main branch → Dev preview deployment
- `main` → Stage deployment (lint must pass)
- GitHub Release (tag from main) → Production deployment

### Environment Cleanup
- Deleting a feature branch automatically removes its Vercel deployment
- Stage is overwritten on each push to main
- Production only changes on explicit GitHub Release

### Creating a Release
```bash
gh release create v1.x.x --target main --title "Release title" --notes "Release notes"
```

### Environment Variables
- `NEXT_PUBLIC_DEPLOY_ENV`: Set per workflow — `development`, `staging`, or `production`
- Vercel secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`): In GitHub repo secrets

## Design Patterns

- **Glassmorphism**: `bg-white/70 backdrop-blur-2xl` on navbar and transport bar
- **Primary color**: Orange `#E54800` (hero, theme-color, accents)
- **Modal**: Uses `history.pushState` so Android/browser back button closes it instead of navigating away
- **Language transition**: Full-screen overlay with language name in orange, 300ms total
- **Dark mode**: System preference auto-detection via `next-themes`, manual toggle in navbar
