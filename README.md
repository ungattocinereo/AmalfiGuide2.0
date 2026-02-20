# Amalfi.Day Guide

A curated travel guide for the Amalfi Coast — walks, hidden gems, restaurants, and hiking trails with offline maps in 6 languages.

**Live:** [guide.amalfi.day](https://guide.amalfi.day)

---

## What Is This

A Progressive Web App that serves as a pocket travel companion for visitors to the Amalfi Coast. Users can browse curated places, get directions, and switch between 6 languages instantly — all without an internet connection after the first visit.

### Features

- **30+ curated places** — restaurants, beaches, hiking trails, viewpoints, hidden gems
- **6 languages** — English, Italian, Spanish, French, German, Russian
- **Instant language switching** — no reload, no API calls, all content preloaded
- **Offline-first PWA** — installable on any device, works without internet
- **Dark mode** — auto-detects system preference, manual toggle available
- **Embedded maps** — Google Maps directions for every location
- **Static generation** — zero server runtime, served entirely from CDN

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, static export) |
| Styling | **Tailwind CSS v4** |
| Animations | **Framer Motion** (shared layout transitions, spring physics, staggered grids) |
| Icons | **Phosphor Icons** |
| Fonts | **Merriweather** (serif, via `next/font`) |
| PWA | **@ducanh2912/next-pwa** (service worker, offline caching) |
| Deployment | **Vercel** via GitHub Actions |
| Language | **TypeScript** |

---

## Architecture

### Static-First Data Flow

All content lives in Markdown files and is parsed at build time:

```
src/data/content/texts.{lang}.md   (6 files, one per language)
        |
        v
src/lib/markdown-parser.ts         (custom parser -> CategorySection[])
        |
        v
src/app/page.tsx                   (static generation, loads all 6 languages)
        |
        v
MainContent (client component)     (instant language switching at runtime)
```

No database. No API. No server. The entire app is a set of static HTML/JS/CSS files served from a CDN.

### Component Architecture

```
RootLayout
├── ThemeProvider (dark mode via next-themes)
├── LanguageProvider (language state + UI translations)
├── LayoutProvider (expand/collapse sections)
│   └── MainContent
│       ├── Navbar (glassmorphic, fixed)
│       ├── Hero (full-viewport, orange branded)
│       ├── SectionGrid[] (category sections with adaptive layouts)
│       │   └── PlaceCard[] (image cards with category pills)
│       ├── PlaceDetails (modal with browser-back support)
│       └── Footer
└── EnvironmentBadge (dev/stage indicator)
```

### Multilingual System

Two translation layers:

1. **Content** — `src/data/content/texts.{lang}.md` — place descriptions in Markdown, parsed into structured data
2. **UI strings** — `public/translations/ui.{lang}.json` — buttons, labels, navigation text, accessed via `t('key')`

Language detection priority: URL hash parameter -> localStorage -> browser locale -> English fallback.

---

## Deployment Pipeline

Three-tier deployment via GitHub Actions + Vercel CLI:

```
feature branch push  ->  Dev preview     (*.vercel.app)
main push            ->  Stage preview   (*.vercel.app)
GitHub Release       ->  Production      (guide.amalfi.day)
```

| Environment | Trigger | Checks | Domain |
|-------------|---------|--------|--------|
| **Dev** | Push to any branch except `main` | Build | Auto-generated `*.vercel.app` |
| **Stage** | Push to `main` | Lint + Build | Auto-generated `*.vercel.app` |
| **Production** | GitHub Release published | Lint + Build | `guide.amalfi.day` |

- Dev environments are **ephemeral** — created per branch, auto-deleted when branch is removed
- Stage is **persistent** — always reflects the latest `main`
- Production **only changes on explicit release**

### Creating a Release

```bash
gh release create v1.0.0 --target main --title "Release title" --notes "What changed"
```

---

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone git@github.com:ungattocinereo/AmalfiGuide2.0.git
cd AmalfiGuide2.0
npm install
```

### Commands

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build (validates all content)
npm run lint     # ESLint
npm start        # Serve production build locally
```

> **Note:** The `--webpack` flag is required for Next.js and is already configured in `package.json`. Do not remove it.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, metadata, structured data
│   ├── page.tsx                # Main page (static generation)
│   └── globals.css             # Tailwind + custom styles
├── components/
│   ├── main-content.tsx        # Primary client component (modal state)
│   ├── navbar.tsx              # Fixed navigation bar
│   ├── hero.tsx                # Full-viewport hero section
│   ├── section-grid.tsx        # Adaptive category grid layouts
│   ├── place-card.tsx          # Individual place cards
│   ├── place-details.tsx       # Place detail modal
│   ├── language-context.tsx    # Language state provider
│   ├── layout-context.tsx      # Expand/collapse state provider
│   ├── environment-badge.tsx   # Dev/Stage environment indicator
│   └── footer.tsx
├── data/content/
│   ├── texts.en.md             # English content
│   ├── texts.it.md             # Italian content
│   ├── texts.es.md             # Spanish content
│   ├── texts.fr.md             # French content
│   ├── texts.de.md             # German content
│   └── texts.ru.md             # Russian content
└── lib/
    ├── markdown-parser.ts      # Markdown -> structured data
    ├── place-images.ts         # Image + map URL mappings
    ├── i18n/types.ts           # Language types and config
    └── blur-data.generated.ts  # Auto-generated blur placeholders

public/
├── guide-webp/                 # Place images (WebP)
├── translations/               # UI string files (6 languages)
├── manifest.json               # PWA manifest
└── images/                     # Hero, social, icons

.github/workflows/
├── deploy-dev.yml              # Feature branch -> Vercel preview
├── deploy-stage.yml            # main -> Vercel stage
└── deploy-prod.yml             # GitHub Release -> Vercel production
```

---

## Adding Content

### New Place

1. Add to **all 6** `texts.{lang}.md` files:
   ```markdown
   ### Place Name
   **Category**: Category Type
   **Tagline**: Short tagline
   **Short info:**
   Description shown on the card
   **The Details:**
   Full description shown in the modal
   > [!info] Key Links
   > - **Google Maps**: [View Location](url)
   ---
   ```
2. Add image to `public/guide-webp/` (WebP format)
3. Map the image in `src/lib/place-images.ts` with multilingual keywords
4. Run `npm run build` to verify

### New UI String

Add the key to all 6 `public/translations/ui.{lang}.json` files, then use via `t('key')` from `useLanguage()`.

---

## Design System

- **Primary color:** Orange `#E54800`
- **Glass effect:** `bg-white/70 backdrop-blur-2xl` (navbar, overlays)
- **Typography:** Merriweather serif for all text
- **Dark mode:** Full support via CSS class strategy (`next-themes`)
- **Animations:** Spring physics, staggered reveals, shared layout transitions
- **Modal:** Uses `history.pushState` so browser/Android back button closes it naturally

---

## License

Private project by [CristallPont S.R.L.](https://amalfi.day)
