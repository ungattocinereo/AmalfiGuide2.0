import { expect, test } from "@playwright/test";

const hikingRoutes = [
  ["/en/place/path-of-the-gods-sentiero-degli-dei", "Path of the Gods"],
  ["/en/place/the-lemon-path-sentiero-dei-limoni", "The Lemon Path"],
  ["/en/place/torre-dello-ziro", "Torre dello Ziro"],
  ["/en/place/valle-delle-ferriere", "Valle delle Ferriere"],
] as const;

for (const [path, mapLabel] of hikingRoutes) {
  test(`${mapLabel} renders its interactive route map`, async ({ page }) => {
    await page.goto(path);

    const map = page.locator(`[aria-label="${mapLabel}"]`);
    await expect(map).toHaveClass(/opacity-100/, { timeout: 15_000 });
    await expect(map.locator("canvas.mapboxgl-canvas")).toBeVisible();
    await page.waitForTimeout(5_000);
    await expect(map).toHaveClass(/opacity-100/);
    await expect(page.getByText("Map unavailable", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Loading route", { exact: true })).toHaveCount(0);
  });
}

test("opens a live map only after a hiking card is selected", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One browser profile is enough for the card interaction");

  await page.goto("/en");
  await page.getByRole("heading", { name: "Hiking & Nature" }).scrollIntoViewIfNeeded();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker?.controller));
  await expect(page.locator("canvas.mapboxgl-canvas")).toHaveCount(0);

  await page.getByRole("link", { name: /The Lemon Path/i }).click();
  const map = page.locator('[aria-label="The Lemon Path"]');
  await expect(page.getByRole("img", { name: "The Lemon Path route map preview" })).toHaveCount(0);
  await expect(map).toHaveClass(/opacity-100/, { timeout: 15_000 });
  await expect(map.locator("canvas.mapboxgl-canvas")).toBeVisible();
});

test("shows the live map canvas during loading instead of a static preview", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One browser profile is enough for the loading state");

  await page.route("https://api.mapbox.com/styles/v1/mapbox/outdoors-v12*", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    await route.continue();
  });
  await page.goto("/en");
  await page.getByRole("heading", { name: "Hiking & Nature" }).scrollIntoViewIfNeeded();
  await page.getByRole("link", { name: /The Lemon Path/i }).click();

  const map = page.locator('[aria-label="The Lemon Path"]');
  await expect(page.getByText("Loading route", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "The Lemon Path route map preview" })).toHaveCount(0);
  await expect(map).toHaveClass(/opacity-100/);
  await expect(map.locator("canvas.mapboxgl-canvas")).toBeVisible();
  await expect(page.getByText("Loading route", { exact: true })).toHaveCount(0, { timeout: 15_000 });
});

test("keeps hiking card previews visible when the browser cannot reach Mapbox directly", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One browser profile is enough for the delivery check");

  await page.route("https://api.mapbox.com/**", (route) => route.abort());
  await page.goto("/");
  await page.getByRole("heading", { name: "Hiking & Nature" }).scrollIntoViewIfNeeded();

  for (const [, mapLabel] of hikingRoutes) {
    const card = page.getByRole("link", { name: new RegExp(mapLabel, "i") });
    const preview = card.locator("img");

    await expect(preview).toBeVisible();
    await expect.poll(() => preview.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    await expect(preview).toHaveAttribute("src", /\/route-previews\/.+-wide-[a-f0-9]{12}\.webp$/);
  }
});

test("shows a retryable error with the static preview when Mapbox cannot initialize", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One browser profile is enough for the fallback");

  let blockMapbox = true;
  await page.context().route("https://api.mapbox.com/**", (route) =>
    blockMapbox ? route.abort() : route.continue(),
  );
  await page.goto("/en/place/the-lemon-path-sentiero-dei-limoni");

  await expect(page.getByRole("img", { name: "The Lemon Path route map preview" })).toBeVisible();
  await expect(page.getByText("Map unavailable", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();

  blockMapbox = false;
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.locator('[aria-label="The Lemon Path"]')).toHaveClass(/opacity-100/, { timeout: 15_000 });
  await expect(page.getByText("Map unavailable", { exact: true })).toHaveCount(0);
});
