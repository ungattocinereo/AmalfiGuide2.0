# Remove Guide Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove search, category filtering, and the “open now” mode so the guide always renders every section and place.

**Architecture:** Simplify `MainContent` back to a presentation and modal-navigation component. Delete the now-unused discovery UI and filtering utility, remove their localized copy, and replace the search-driven browser test with assertions that old query parameters have no effect.

**Tech Stack:** Next.js 16, React 19, next-intl, Vitest, Playwright.

## Global Constraints

- Place-card links and accessible modal behavior must remain unchanged.
- Opening-hours display remains; only discovery filtering is removed.
- Locale routes, offline support, accessibility, and performance improvements remain unchanged.

---

### Task 1: Remove discovery behavior and dead code

**Files:**
- Modify: `tests/e2e/guide.spec.ts`
- Modify: `src/components/main-content.tsx`
- Delete: `src/components/guide-discovery.tsx`
- Delete: `src/lib/guide-filter.ts`
- Delete: `src/lib/guide-filter.test.ts`
- Modify: `messages/en.json`
- Modify: `messages/it.json`
- Modify: `messages/es.json`
- Modify: `messages/fr.json`
- Modify: `messages/de.json`
- Modify: `messages/ru.json`

**Interfaces:**
- Consumes: `MainContent({content}: {content: CategorySection[]})` and existing `SectionGrid`/`PlaceDetails` APIs.
- Produces: A guide that renders `content` directly and ignores `q`, `section`, and `open` query parameters.

- [ ] **Step 1: Write the failing browser test**

Replace the search test with a test that visits `/?q=lemon&section=2&open=1`, asserts that no `guide-search`, `guide-section`, or `guide-open-now` controls exist, and verifies that links from multiple sections remain present:

```ts
test("discovery controls are removed and legacy query parameters do not filter content", async ({ page }) => {
  await page.goto("/?q=lemon&section=2&open=1");

  await expect(page.locator('[name="guide-search"]')).toHaveCount(0);
  await expect(page.locator('[name="guide-section"]')).toHaveCount(0);
  await expect(page.locator('[name="guide-open-now"]')).toHaveCount(0);
  await expect(page.locator('a[href="/place/the-lemon-path-sentiero-dei-limoni"]')).toHaveCount(1);
  await expect(page.locator('a[href="/place/church-of-saint-mary-magdalene"]')).toHaveCount(1);
});
```

Update the modal test to open `/`, use the church link, and expect Escape to restore `/`.

- [ ] **Step 2: Run the new test and verify RED**

Run: `npx playwright test tests/e2e/guide.spec.ts --project=desktop --grep="discovery controls"`

Expected: FAIL because the three discovery controls still exist and the query parameters still filter the page.

- [ ] **Step 3: Remove filtering from `MainContent`**

Remove the `GuideDiscovery`, filter utility, and `useLanguage` imports; remove filter state, URL synchronization, filtered-content calculations, result count, and empty-state UI. Map `content` directly while retaining stable section numbering:

```ts
const numberedContent: Array<CategorySection & { sectionNumber?: number }> = content.map((section) => ({
  ...section,
  sectionNumber: sectionNumbers.get(section.title),
}));
```

Render each `SectionGrid` without `forceExpanded`, leaving modal history logic untouched.

- [ ] **Step 4: Delete discovery-only files and translations**

Delete `src/components/guide-discovery.tsx`, `src/lib/guide-filter.ts`, and `src/lib/guide-filter.test.ts`. Remove the complete top-level `discovery` object from each of the six message JSON files without changing adjacent message groups.

- [ ] **Step 5: Verify GREEN and the full application**

Run: `npx playwright test tests/e2e/guide.spec.ts --project=desktop --grep="discovery controls"`

Expected: PASS.

Run: `npm run lint`, `npm test`, `npm run build`, and `npm run test:e2e`.

Expected: lint and build exit 0; all remaining unit tests and desktop/mobile end-to-end tests pass, with only the intentional mobile offline test skipped.

- [ ] **Step 6: Commit and publish**

```bash
git add -A
git commit -m "Remove guide discovery controls"
git push origin dev
```

Verify `dev`, `origin/dev`, and `HEAD` resolve to the same commit.
