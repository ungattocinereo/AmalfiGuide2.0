# Footer Cleanup and Hiking Maps Production Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the `Photo spots` footer link, prove all four hiking maps work, and release the complete `dev` branch to production as `v1.12.0`.

**Architecture:** Make one narrow footer-data change and remove the now-unused localized key. Strengthen route regression coverage, validate the production build locally, then use the repository's documented GitHub Actions path: `dev` preview, fast-forward `main`, and a GitHub release that deploys Vercel production.

**Tech Stack:** Next.js 16, React 19, Mapbox GL JS, Vitest, Playwright CLI, GitHub Actions, Vercel.

## Global Constraints

- Remove only the footer item whose destination is `https://amalfi.day/photolocations`.
- Preserve the remaining footer links, order, icons, translations, and responsive layout.
- Verify Path of the Gods, The Lemon Path, Torre dello Ziro, and Valle delle Ferriere on desktop and mobile.
- Use release `v1.12.0` and the existing release-triggered production workflow.
- Do not force-push or deploy directly with Vercel CLI.

---

### Task 1: Remove the footer link with regression coverage

**Files:**
- Modify: `tests/e2e/guide.spec.ts`
- Modify: `src/components/footer.tsx`
- Modify: `messages/en.json`
- Modify: `messages/it.json`
- Modify: `messages/es.json`
- Modify: `messages/fr.json`
- Modify: `messages/de.json`
- Modify: `messages/ru.json`

**Interfaces:**
- Consumes: the `footerLinks.info` array rendered by `Footer` and locale messages under `footer.*`.
- Produces: the existing footer without an anchor to `/photolocations` and without the unused `footer.photoSpots` key.

- [ ] **Step 1: Add the failing browser test**

Add this test to `tests/e2e/guide.spec.ts`:

```ts
test("footer no longer links to Photo spots", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('footer a[href="https://amalfi.day/photolocations"]')).toHaveCount(0);
});
```

- [ ] **Step 2: Verify RED**

Run: `npx playwright test tests/e2e/guide.spec.ts --project=desktop --grep="Photo spots" --reporter=list`

Expected: FAIL with one matching footer anchor.

- [ ] **Step 3: Remove the footer entry and messages**

Delete this object from `footerLinks.info`:

```ts
{ label: "footer.photoSpots", href: `${MAIN_SITE}/photolocations` },
```

Delete only the `photoSpots` property from the top-level `footer` object in all six message JSON files.

- [ ] **Step 4: Verify GREEN**

Run: `npx playwright test tests/e2e/guide.spec.ts --project=desktop --grep="Photo spots" --reporter=list`

Expected: PASS.

---

### Task 2: Strengthen hiking route coverage and verify the build

**Files:**
- Modify: `src/lib/place-routes.test.ts`

**Interfaces:**
- Consumes: `routeAssets`, `getRouteForPlace(name)`, and route files in `public/routes/`.
- Produces: regression proof that all four routes and their localized names resolve to complete asset sets.

- [ ] **Step 1: Add the route inventory test**

Extend `src/lib/place-routes.test.ts` to import `existsSync` and `join`, then assert:

```ts
it("defines complete downloadable assets for every hiking route", () => {
  expect(routeAssets.map((route) => route.slug)).toEqual([
    "valle-delle-ferriere",
    "torre-dello-ziro",
    "path-of-the-gods",
    "the-lemon-path",
  ]);

  for (const route of routeAssets) {
    for (const url of [route.geoJsonUrl, route.gpxUrl, route.kmlUrl, route.kmzUrl]) {
      expect(existsSync(join(process.cwd(), "public", url))).toBe(true);
    }
  }
});
```

Also assert translated matching:

```ts
expect(getRouteForPlace("Sentiero degli Dei")?.slug).toBe("path-of-the-gods");
expect(getRouteForPlace("Sentier des Citrons")?.slug).toBe("the-lemon-path");
expect(getRouteForPlace("Тропа богов")?.slug).toBe("path-of-the-gods");
expect(getRouteForPlace("Torre dello Ziro")?.slug).toBe("torre-dello-ziro");
expect(getRouteForPlace("Valle delle Ferriere")?.slug).toBe("valle-delle-ferriere");
```

- [ ] **Step 2: Run route tests**

Run: `npm test -- src/lib/place-routes.test.ts`

Expected: PASS with the static-preview, asset-inventory, and localized-matching tests.

- [ ] **Step 3: Run the complete local verification**

Run: `npm run lint`, `npm test`, `npm audit --omit=dev`, `npm run build`, and `npm run test:e2e`.

Expected: all commands exit 0; the only skipped E2E is the intentional duplicate mobile offline scenario.

- [ ] **Step 4: Verify route files from the production server**

Start: `npm start -- -p 3100`.

Request every `.geojson`, `.gpx`, `.kml`, and `.kmz` URL listed in `routeAssets` and require HTTP 200 with non-empty bodies.

---

### Task 3: Verify dev preview and publish production

**Files:**
- No source files changed.

**Interfaces:**
- Consumes: GitHub Actions workflows `deploy-dev.yml`, `deploy-stage.yml`, and `deploy-prod.yml`.
- Produces: GitHub branches `dev` and `main` at the same verified commit, release tag `v1.12.0`, and a verified `guide.amalfi.day` deployment.

- [ ] **Step 1: Commit and push `dev`**

```bash
git add -A
git commit -m "Remove Photo spots footer link"
git push origin dev
```

Wait for the `Deploy Dev` workflow and obtain its deployment URL from the successful run.

- [ ] **Step 2: Browser-check all maps on dev**

Using Playwright CLI at desktop and mobile widths, open these four English place routes on the dev deployment:

```text
/place/path-of-the-gods
/place/the-lemon-path-sentiero-dei-limoni
/place/torre-dello-ziro
/place/sentiero-basso-della-valle-delle-ferriere
```

For each route require a visible `.mapboxgl-canvas`, no visible `Map unavailable`/`Loading route` status after load, and no console errors from Mapbox or route assets. Verify the homepage has no `/photolocations` anchor.

- [ ] **Step 3: Fast-forward `main` and push stage**

From the main checkout, fetch both branches, confirm `main` is an ancestor of `dev`, then fast-forward:

```bash
git merge --ff-only dev
git push origin main
```

Wait for the `Deploy Stage` workflow to succeed.

- [ ] **Step 4: Publish the production release**

```bash
gh release create v1.12.0 --target main --title "v1.12.0 — Guide performance and map reliability" --notes "Promotes the audited guide improvements, removes the Photo spots footer link, and verifies all Hiking & Nature route maps."
```

Wait for the `Deploy Production` workflow to finish successfully.

- [ ] **Step 5: Verify live production**

Repeat the four-route desktop/mobile Mapbox checks and footer-link check against `https://guide.amalfi.day`. Confirm the live deployment serves the `v1.12.0` commit and report the workflow and release URLs.
