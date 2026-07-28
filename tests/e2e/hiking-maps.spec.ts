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
    await page.waitForTimeout(5_000);
    await expect(map).toHaveClass(/opacity-100/);
    await expect(page.getByText("Map unavailable", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Loading route", { exact: true })).toHaveCount(0);
  });
}

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

test("shows a static route preview when interactive Mapbox cannot initialize", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One browser profile is enough for the fallback");

  await page.route("https://api.mapbox.com/styles/v1/mapbox/outdoors-v12?*", (route) => route.abort());
  await page.goto("/en/place/the-lemon-path-sentiero-dei-limoni");

  await expect(page.getByRole("img", { name: "The Lemon Path route map preview" })).toBeVisible();
  await expect(page.getByText("Map unavailable", { exact: true })).toHaveCount(0);
});
