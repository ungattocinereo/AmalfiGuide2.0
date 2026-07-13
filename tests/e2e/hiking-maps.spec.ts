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
