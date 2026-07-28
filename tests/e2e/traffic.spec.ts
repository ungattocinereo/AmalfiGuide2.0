import { expect, test } from "@playwright/test";

test("passive scrolling does not prefetch detail images or place RSC payloads", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("cookie-consent", "declined"));
  const detailImageRequests: string[] = [];
  const placePrefetchRequests: string[] = [];

  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      url.pathname === "/_next/image"
      && url.searchParams.get("w") === "1200"
      && url.searchParams.get("url")?.startsWith("/guide-webp/")
    ) {
      detailImageRequests.push(url.href);
    }
    if (
      url.pathname.includes("/place/")
      && request.headers().rsc === "1"
    ) {
      placePrefetchRequests.push(url.href);
    }
  });

  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(320, window.innerHeight * 0.75)) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForTimeout(500);

  expect(detailImageRequests, `unexpected detail image preloads:\n${detailImageRequests.join("\n")}`).toEqual([]);
  expect(placePrefetchRequests, `unexpected place RSC prefetches:\n${placePrefetchRequests.join("\n")}`).toEqual([]);
});

test("card intent still prewarms the detail image", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Hover intent is a desktop behavior");
  await page.addInitScript(() => localStorage.setItem("cookie-consent", "declined"));
  const detailImageRequests: string[] = [];

  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      url.pathname === "/_next/image"
      && url.searchParams.get("w") === "1200"
      && url.searchParams.get("url")?.startsWith("/guide-webp/")
    ) {
      detailImageRequests.push(url.href);
    }
  });

  await page.goto("/", { waitUntil: "networkidle" });
  detailImageRequests.length = 0;
  await page.locator('a[href="/place/church-of-saint-mary-magdalene"]').hover();

  await expect.poll(() => detailImageRequests.length).toBeGreaterThan(0);
});
