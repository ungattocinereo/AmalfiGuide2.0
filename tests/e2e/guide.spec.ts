import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("cookie-consent", "declined"));
});

test("footer no longer links to Photo spots", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('footer a[href="https://amalfi.day/photolocations"]')).toHaveCount(0);
});

test("Hero illustration renders without a drop shadow", async ({ page }) => {
  await page.goto("/");
  const illustration = page.getByRole("img", {
    name: "Watercolor illustration of Atrani, Amalfi Coast",
  });

  await expect(illustration).toBeVisible();
  await expect
    .poll(() => illustration.evaluate((image) => getComputedStyle(image.parentElement!).filter))
    .toBe("none");
});

test("server-rendered Hero does not include a blur placeholder", async ({ request }) => {
  const response = await request.get("/");
  const html = await response.text();
  const illustration = html.match(
    /<img[^>]+alt="Watercolor illustration of Atrani, Amalfi Coast"[^>]*>/,
  )?.[0];

  expect(illustration).toBeDefined();
  expect(illustration).not.toContain("background-image");
});

test("discovery controls are removed and legacy query parameters do not filter content", async ({ page }) => {
  await page.goto("/?q=lemon&section=2&open=1");

  await expect(page.locator('[name="guide-search"]')).toHaveCount(0);
  await expect(page.locator('[name="guide-section"]')).toHaveCount(0);
  await expect(page.locator('[name="guide-open-now"]')).toHaveCount(0);
  await expect(page.locator('a[href="/place/the-lemon-path-sentiero-dei-limoni"]')).toHaveCount(1);
  await expect(page.locator('a[href="/place/church-of-saint-mary-magdalene"]')).toHaveCount(1);
});

test("place cards remain real links while primary clicks open an accessible modal", async ({ page }) => {
  await page.goto("/");
  const placeLink = page.locator('a[href="/place/church-of-saint-mary-magdalene"]');

  await expect(placeLink).toHaveCount(1);
  await expect(placeLink).toHaveAttribute("href", "/place/church-of-saint-mary-magdalene");
  await placeLink.click();

  await expect(page).toHaveURL(/\/place\/church-of-saint-mary-magdalene$/);
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("main > div[inert]")).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("button", { name: "Close", exact: true })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("standalone place pages use a single h1", async ({ page }) => {
  await page.goto("/place/church-of-saint-mary-magdalene");

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("Church of Saint Mary Magdalene");
});

test("unknown locale-like paths return a clean 404", async ({ request }) => {
  const response = await request.get("/not-a-locale");

  expect(response.status()).toBe(404);
});

test("homepage has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical")).toEqual([]);
});

test("layout does not overflow the viewport", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

  expect(overflow).toBeLessThanOrEqual(0);
});

test("a visited place remains available offline", async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Service-worker behavior only needs one browser profile");
  await page.goto("/place/le-palme-atrani");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();

  await context.setOffline(true);
  try {
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toContainText("Le Palme");
  } finally {
    await context.setOffline(false);
  }
});
