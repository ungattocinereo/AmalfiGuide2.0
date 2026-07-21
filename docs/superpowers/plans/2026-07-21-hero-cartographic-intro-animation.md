# Hero Cartographic Intro Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the simple Hero circles and dots with a finite 1.8-second cartographic reveal that settles into a static, responsive composition behind the watercolor illustration.

**Architecture:** Add a focused `HeroCartographicIntro` component for all decorative SVG and glow layers, plus a small timing configuration module that can be unit-tested without rendering React. The existing `Hero` remains responsible for layout and theme state, passing only `isDark` into the animation component.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion 12, Vitest 4, Playwright 1.61.

## Global Constraints

- The sequence runs once per expanded Hero mount and never loops.
- The complete animation finishes in at most 1.8 seconds.
- The watercolor illustration keeps its current size, position, `filter: none`, and `background-image: none`.
- All decorative content is `pointer-events: none`, `aria-hidden`, and excluded from layout.
- Desktop renders three contours, a full route, three signals, two crosshairs, and coordinate ticks.
- Mobile renders two contours, a shortened route, two signals, and one crosshair.
- Reduced-motion users see the final settled state immediately.
- No canvas, WebGL, timers, scroll listeners, requestAnimationFrame loops, infinite transitions, image shadows, or blur placeholders.

---

### Task 1: Define and test the finite animation timeline

**Files:**
- Create: `src/components/hero-cartographic-intro.config.ts`
- Create: `src/components/hero-cartographic-intro.config.test.ts`

**Interfaces:**
- Produces: `HERO_INTRO_DURATION_SECONDS: number`.
- Produces: `HERO_INTRO_TIMINGS: Record<HeroIntroPhase, HeroIntroTiming>` where each timing has `delay`, `duration`, and `repeat`.
- Consumed by: `HeroCartographicIntro` in Task 2.

- [ ] **Step 1: Write the failing timing-contract test**

Create `src/components/hero-cartographic-intro.config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  HERO_INTRO_DURATION_SECONDS,
  HERO_INTRO_TIMINGS,
} from "./hero-cartographic-intro.config";

describe("Hero cartographic intro timing", () => {
  it("uses finite phases that finish within the intro duration", () => {
    for (const timing of Object.values(HERO_INTRO_TIMINGS)) {
      expect(Number.isFinite(timing.delay)).toBe(true);
      expect(Number.isFinite(timing.duration)).toBe(true);
      expect(timing.delay).toBeGreaterThanOrEqual(0);
      expect(timing.duration).toBeGreaterThan(0);
      expect(timing.delay + timing.duration).toBeLessThanOrEqual(
        HERO_INTRO_DURATION_SECONDS,
      );
      expect(timing.repeat).toBe(0);
    }
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npm test -- --run src/components/hero-cartographic-intro.config.test.ts
```

Expected: FAIL because `hero-cartographic-intro.config.ts` does not exist.

- [ ] **Step 3: Add the timeline configuration**

Create `src/components/hero-cartographic-intro.config.ts`:

```ts
export const HERO_INTRO_DURATION_SECONDS = 1.8;

export const HERO_INTRO_TIMINGS = {
  atmosphere: { delay: 0, duration: 0.45, repeat: 0 },
  contours: { delay: 0.15, duration: 1, repeat: 0 },
  route: { delay: 0.45, duration: 0.95, repeat: 0 },
  signals: { delay: 0.55, duration: 0.95, repeat: 0 },
  settle: { delay: 1.35, duration: 0.45, repeat: 0 },
} as const;

export type HeroIntroPhase = keyof typeof HERO_INTRO_TIMINGS;
export type HeroIntroTiming = (typeof HERO_INTRO_TIMINGS)[HeroIntroPhase];
```

- [ ] **Step 4: Run the test and verify GREEN**

Run:

```bash
npm test -- --run src/components/hero-cartographic-intro.config.test.ts
```

Expected: 1 test file and 1 test pass.

- [ ] **Step 5: Commit the timing contract**

```bash
git add src/components/hero-cartographic-intro.config.ts src/components/hero-cartographic-intro.config.test.ts
git commit -m "Define Hero intro timing"
```

---

### Task 2: Build and integrate the responsive cartographic reveal

**Files:**
- Create: `src/components/hero-cartographic-intro.tsx`
- Modify: `src/components/hero.tsx:280-355`
- Modify: `tests/e2e/guide.spec.ts:13-45`

**Interfaces:**
- Consumes: `HERO_INTRO_TIMINGS` from Task 1.
- Produces: `HeroCartographicIntro({ isDark }: { isDark: boolean })`.
- Produces: DOM contract `data-testid="hero-cartographic-intro"`, `data-motion="full|reduced"`, and `aria-hidden="true"`.

- [ ] **Step 1: Write the failing browser test for the decorative layer**

Add to `tests/e2e/guide.spec.ts` after the existing Hero shadow test:

```ts
test("Hero includes a finite cartographic intro behind the illustration", async ({ page }) => {
  await page.goto("/");
  const intro = page.getByTestId("hero-cartographic-intro");

  await expect(intro).toBeVisible();
  await expect(intro).toHaveAttribute("aria-hidden", "true");
  await expect(intro).toHaveAttribute("data-motion", "full");
  await expect(intro.locator('[data-detail="contour"]')).toHaveCount(3);
  await expect(intro.locator('[data-detail="signal"]')).toHaveCount(3);
});

test("Hero cartographic intro settles immediately for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const intro = page.getByTestId("hero-cartographic-intro");
  await expect(intro).toHaveAttribute("data-motion", "reduced");
  await expect(intro.locator('[data-detail="highlight"]')).toHaveCSS("opacity", "0");
});
```

- [ ] **Step 2: Run the browser test and verify RED**

Run:

```bash
npx playwright test tests/e2e/guide.spec.ts --grep "cartographic intro" --project=desktop --reporter=line
```

Expected: both tests FAIL because `data-testid="hero-cartographic-intro"` is absent.

- [ ] **Step 3: Create the cartographic component**

Create `src/components/hero-cartographic-intro.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HERO_INTRO_TIMINGS } from "@/components/hero-cartographic-intro.config";

type HeroCartographicIntroProps = {
  isDark: boolean;
};

const contours = [
  { d: "M 118 470 A 254 254 0 1 1 606 410", desktopOnly: false },
  { d: "M 94 430 A 292 292 0 0 1 646 216", desktopOnly: false },
  { d: "M 164 514 A 220 220 0 0 0 532 130", desktopOnly: true },
] as const;

const transition = (phase: keyof typeof HERO_INTRO_TIMINGS, delayOffset = 0) => ({
  ...HERO_INTRO_TIMINGS[phase],
  delay: HERO_INTRO_TIMINGS[phase].delay + delayOffset,
  ease: [0.16, 1, 0.3, 1] as const,
});

export function HeroCartographicIntro({ isDark }: HeroCartographicIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const isReduced = Boolean(prefersReducedMotion);
  const line = isDark ? "#FF7A4D" : "#A94827";
  const secondaryLine = isDark ? "#F7D7C7" : "#6A3A27";
  const settledOpacity = isDark ? 0.22 : 0.13;
  const phaseTransition = (
    phase: keyof typeof HERO_INTRO_TIMINGS,
    delayOffset = 0,
  ) => (isReduced ? { duration: 0 } : transition(phase, delayOffset));

  return (
    <div
      data-testid="hero-cartographic-intro"
      data-motion={isReduced ? "reduced" : "full"}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <motion.div
        data-detail="glow"
        className="absolute bottom-[4%] left-[20%] h-[48%] w-[62%] rounded-full blur-2xl"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(244,54,0,0.17), transparent 68%)"
            : "radial-gradient(circle, rgba(244,96,45,0.12), transparent 68%)",
        }}
        initial={isReduced ? false : { opacity: 0, scale: 0.72 }}
        animate={
          isReduced
            ? { opacity: 0, scale: 1 }
            : { opacity: [0, 0.62, 0.12], scale: [0.72, 1.06, 1] }
        }
        transition={phaseTransition("atmosphere")}
      />

      <svg
        viewBox="0 0 720 760"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
      >
        <g fill="none" strokeLinecap="round">
          {contours.map((contour, index) => (
            <motion.path
              key={contour.d}
              data-detail="contour"
              d={contour.d}
              className={contour.desktopOnly ? "hidden md:block" : undefined}
              stroke={index === 1 ? secondaryLine : line}
              strokeWidth={index === 0 ? 1.15 : 0.8}
              strokeDasharray={index === 0 ? "10 8" : "5 12"}
              initial={isReduced ? false : { opacity: 0, pathLength: 0 }}
              animate={{ opacity: settledOpacity, pathLength: 1 }}
              transition={phaseTransition("contours", index * 0.08)}
            />
          ))}

          <motion.path
            d="M 70 544 C 176 456 280 530 358 422 C 440 310 532 366 660 242"
            className="hidden md:block"
            stroke={line}
            strokeWidth="1.1"
            strokeDasharray="3 11"
            initial={isReduced ? false : { opacity: 0, pathLength: 0 }}
            animate={{ opacity: isDark ? 0.34 : 0.21, pathLength: 1 }}
            transition={phaseTransition("route")}
          />
          <motion.path
            d="M 82 526 C 178 460 250 512 332 426"
            className="md:hidden"
            stroke={line}
            strokeWidth="1.1"
            strokeDasharray="3 11"
            initial={isReduced ? false : { opacity: 0, pathLength: 0 }}
            animate={{ opacity: isDark ? 0.34 : 0.21, pathLength: 1 }}
            transition={phaseTransition("route")}
          />

          <motion.g
            stroke={secondaryLine}
            initial={isReduced ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: isDark ? 0.28 : 0.17, scale: 1 }}
            transition={phaseTransition("route", 0.12)}
            style={{ transformOrigin: "142px 360px" }}
          >
            <circle cx="142" cy="360" r="11" />
            <path d="M 122 360 H 162 M 142 340 V 380" />
          </motion.g>
          <motion.g
            className="hidden md:block"
            stroke={secondaryLine}
            initial={isReduced ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: isDark ? 0.24 : 0.14, scale: 1 }}
            transition={phaseTransition("route", 0.22)}
            style={{ transformOrigin: "604px 322px" }}
          >
            <circle cx="604" cy="322" r="8" />
            <path d="M 590 322 H 618 M 604 308 V 336" />
          </motion.g>

          <motion.g
            className="hidden md:block"
            stroke={secondaryLine}
            initial={isReduced ? false : { opacity: 0 }}
            animate={{ opacity: isDark ? 0.21 : 0.12 }}
            transition={phaseTransition("route", 0.3)}
          >
            <path d="M 566 174 v 14 M 576 178 v 10 M 586 174 v 14" />
            <path d="M 118 486 h 14 M 122 496 h 10 M 118 506 h 14" />
          </motion.g>

          <motion.path
            d="M 176 448 C 216 414 252 408 286 420"
            stroke={line}
            strokeWidth="2"
            initial={isReduced ? false : { opacity: 0, pathLength: 0 }}
            animate={
              isReduced
                ? { opacity: 0, pathLength: 1 }
                : { opacity: [0, 0.36, 0], pathLength: 1 }
            }
            transition={phaseTransition("signals", 0.08)}
          />
        </g>

        <motion.g
          data-detail="signal"
          initial={isReduced ? false : { opacity: 0, x: -18, y: 12, scale: 0.55 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={phaseTransition("signals")}
          style={{ transformOrigin: "176px 448px" }}
        >
          <circle cx="176" cy="448" r="12" fill="#F43600" opacity="0.12" />
          <circle cx="176" cy="448" r="4.5" fill="#F43600" />
        </motion.g>
        <motion.g
          data-detail="signal"
          initial={isReduced ? false : { opacity: 0, x: 16, y: -10, scale: 0.55 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={phaseTransition("signals", 0.18)}
          style={{ transformOrigin: "566px 286px" }}
        >
          <circle cx="566" cy="286" r="10" fill="#F43600" opacity="0.1" />
          <circle cx="566" cy="286" r="3.5" fill="#F43600" />
        </motion.g>
        <motion.g
          data-detail="signal"
          className="hidden md:block"
          initial={isReduced ? false : { opacity: 0, x: -12, y: -14, scale: 0.55 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={phaseTransition("signals", 0.3)}
          style={{ transformOrigin: "112px 300px" }}
        >
          <circle cx="112" cy="300" r="8" fill="#F43600" opacity="0.1" />
          <circle cx="112" cy="300" r="3" fill="#F43600" />
        </motion.g>
      </svg>

      <motion.div
        data-detail="highlight"
        className="absolute -bottom-[12%] -left-[36%] h-[118%] w-[22%] rotate-[18deg] blur-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,165,120,0.24), transparent)",
        }}
        initial={isReduced ? false : { opacity: 0, x: "0%" }}
        animate={
          isReduced
            ? { opacity: 0, x: "720%" }
            : { opacity: [0, 0.42, 0], x: ["0%", "360%", "720%"] }
        }
        transition={phaseTransition("settle")}
      />
    </div>
  );
}
```

- [ ] **Step 4: Replace the existing circles and dots in Hero**

In `src/components/hero.tsx`, add the import:

```tsx
import { HeroCartographicIntro } from "@/components/hero-cartographic-intro";
```

Delete the current `Decorative circle` block and both `Accent dots` blocks. Insert this after the dark-mode vignette and before the watercolor illustration:

```tsx
<HeroCartographicIntro isDark={isDark} />
```

Keep the watercolor wrapper unchanged:

```tsx
<motion.div
  className="relative z-[2] flex-shrink-0 -mb-[2px]
             w-[70vw] max-w-[340px] md:w-[42vw] md:min-w-[520px] md:max-w-[640px]"
  initial={false}
>
```

- [ ] **Step 5: Run the browser test and verify GREEN**

Run:

```bash
npx playwright test tests/e2e/guide.spec.ts --grep "cartographic intro" --project=desktop --reporter=line
```

Expected: the full-motion and reduced-motion tests pass.

- [ ] **Step 6: Run the existing Hero regression tests**

Run:

```bash
npx playwright test tests/e2e/guide.spec.ts --grep "Hero illustration|server-rendered Hero" --project=desktop --reporter=line
```

Expected: the no-shadow, no-filter, and no-blur-placeholder checks pass.

- [ ] **Step 7: Commit the integrated visual layer**

```bash
git add src/components/hero-cartographic-intro.tsx src/components/hero.tsx tests/e2e/guide.spec.ts
git commit -m "Add Hero cartographic intro"
```

---

### Task 3: Verify the completed Hero animation

**Files:**
- Verify: `src/components/hero-cartographic-intro.tsx`
- Verify: `src/components/hero-cartographic-intro.config.ts`
- Verify: `src/components/hero.tsx`
- Verify: `tests/e2e/guide.spec.ts`

**Interfaces:**
- Verifies all interfaces and constraints produced by Tasks 1–2.

- [ ] **Step 1: Run formatting and static checks**

Run:

```bash
git diff --check
npm run lint
```

Expected: both commands exit 0 with no ESLint errors.

- [ ] **Step 2: Run all unit tests**

Run:

```bash
npm test -- --run
```

Expected: all unit test files pass, including the finite timing contract.

- [ ] **Step 3: Run the production build**

Run:

```bash
npm run build
```

Expected: Next.js compiles successfully, TypeScript passes, and all static pages are generated.

- [ ] **Step 4: Run the complete browser suite**

Run:

```bash
npx playwright test --reporter=dot
```

Expected: all non-skipped desktop and mobile tests pass.

- [ ] **Step 5: Perform visual checks**

Start the production server:

```bash
npm start -- -p 3101
```

Use the in-app browser to inspect `http://127.0.0.1:3101/` at these states:

- desktop light theme;
- desktop dark theme;
- mobile light theme;
- mobile dark theme;
- desktop with reduced motion.

For every state, verify:

- the animation runs once and stops;
- the city illustration remains sharp and stationary;
- no shadow, black flash, blur placeholder, or clipped edge appears;
- desktop detail density matches the spec;
- mobile uses the simplified composition;
- final decorative lines remain subtle enough for the city to dominate.

- [ ] **Step 6: Record final repository state**

Run:

```bash
git status -sb
git log --oneline -5
```

Expected: the worktree is clean and `dev` contains the timing, visual layer, and reduced-motion commits.
