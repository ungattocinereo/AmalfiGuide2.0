# Hero Alpha Blur Placeholder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the Hero illustration's transparency while its `next/image` blur placeholder is visible, eliminating the transient black matte on reload.

**Architecture:** Keep the existing Hero component and image-loading behavior unchanged. Make the shared build-time blur generator inspect source metadata and emit an 8×8 PNG data URL for alpha-bearing images while retaining the existing JPEG path for opaque images; regenerate the checked-in blur map and verify the real generated artifact.

**Tech Stack:** TypeScript, Sharp 0.34, Vitest 4, Next.js 16, Playwright 1.61

## Global Constraints

- Preserve the current Hero layout, theme backgrounds, preload priority, and animation timings.
- Transparent source images must produce alpha-preserving PNG placeholders.
- Opaque source images must continue to produce JPEG placeholders at quality 40.
- Do not modify unrelated image processing or user-visible copy.

---

### Task 1: Generate alpha-safe blur placeholders

**Files:**
- Create: `src/lib/blur-data.generated.test.ts`
- Modify: `scripts/generate-blur-data.mts`
- Regenerate: `src/lib/blur-data.generated.ts`

**Interfaces:**
- Consumes: `getBlurDataURL(src: string): string | undefined` from `src/lib/blur-data.generated.ts`
- Produces: generated `data:image/png;base64,...` values for alpha-bearing sources and existing `data:image/jpeg;base64,...` values for opaque sources

- [ ] **Step 1: Write the failing generated-artifact test**

Create `src/lib/blur-data.generated.test.ts`:

```ts
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { getBlurDataURL } from "./blur-data.generated";

describe("generated blur placeholders", () => {
  it("preserves the Hero illustration alpha channel", async () => {
    const placeholder = getBlurDataURL("/images/hero.webp");
    expect(placeholder).toBeDefined();
    expect(placeholder).toMatch(/^data:image\/png;base64,/);

    const encoded = placeholder!.split(",", 2)[1];
    const metadata = await sharp(Buffer.from(encoded, "base64")).metadata();
    expect(metadata.hasAlpha).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run:

```bash
npx vitest run src/lib/blur-data.generated.test.ts
```

Expected: FAIL because the current Hero placeholder begins with `data:image/jpeg;base64,` and has no alpha channel.

- [ ] **Step 3: Make the generator alpha-aware**

Replace `generateBlurDataURL` in `scripts/generate-blur-data.mts` with:

```ts
async function generateBlurDataURL(imagePath: string): Promise<string> {
  const metadata = await sharp(imagePath).metadata();
  const resized = sharp(imagePath).resize(8, 8, { fit: "cover" });

  if (metadata.hasAlpha) {
    const buffer = await resized
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();
    return `data:image/png;base64,${buffer.toString("base64")}`;
  }

  const buffer = await resized
    .jpeg({ quality: 40 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}
```

- [ ] **Step 4: Regenerate the checked-in blur map**

Run:

```bash
npm run generate:blur
```

Expected: the command reports the Hero entry and rewrites `src/lib/blur-data.generated.ts`; the Hero value begins with `data:image/png;base64,`.

- [ ] **Step 5: Run the focused test and confirm GREEN**

Run:

```bash
npx vitest run src/lib/blur-data.generated.test.ts
```

Expected: 1 test passes.

- [ ] **Step 6: Verify the full application**

Run:

```bash
npm run lint
npm test -- --run
npx playwright test
```

Expected: lint exits 0, the complete Vitest suite has no failures, and the desktop/mobile Playwright suite has no unexpected failures.

- [ ] **Step 7: Verify the loading frame visually**

Start the production build locally, delay only the optimized `/images/hero.webp` request in Playwright, and capture the Hero while the placeholder is visible. Expected: transparent areas reveal the existing cream or dark Hero panel background; no black rectangle or black matte appears.

- [ ] **Step 8: Commit the implementation**

```bash
git add scripts/generate-blur-data.mts src/lib/blur-data.generated.ts src/lib/blur-data.generated.test.ts
git commit -m "Preserve Hero placeholder transparency"
```
