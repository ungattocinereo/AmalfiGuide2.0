import { chromium, devices, type BrowserContextOptions } from "@playwright/test";

const baseUrl = new URL(process.env.TRAFFIC_BASE_URL ?? "http://127.0.0.1:3100");
const desktopBudget = Number(process.env.DESKTOP_TRAFFIC_BUDGET ?? 1_350_000);
const mobileBudget = Number(process.env.MOBILE_TRAFFIC_BUDGET ?? 2_500_000);

type RequestRecord = { url: string };

async function measure(
  label: string,
  options: BrowserContextOptions,
  fullScroll: boolean,
): Promise<number> {
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("cookie-consent", "declined"));

  const session = await context.newCDPSession(page);
  const requests = new Map<string, RequestRecord>();
  let encodedBytes = 0;
  await session.send("Network.enable");
  session.on("Network.requestWillBeSent", ({ requestId, request }) => {
    requests.set(requestId, { url: request.url });
  });
  session.on("Network.loadingFinished", ({ requestId, encodedDataLength }) => {
    const request = requests.get(requestId);
    if (request && new URL(request.url).origin === baseUrl.origin) encodedBytes += encodedDataLength;
  });

  await page.goto(baseUrl.href, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    if ("serviceWorker" in navigator) await navigator.serviceWorker.ready;
  });

  if (fullScroll) {
    await page.evaluate(async () => {
      let previousHeight = 0;
      while (previousHeight !== document.documentElement.scrollHeight) {
        previousHeight = document.documentElement.scrollHeight;
        for (let y = 0; y < previousHeight; y += Math.max(320, window.innerHeight * 0.75)) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 120));
        }
        window.scrollTo(0, previousHeight);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    });
  }

  await page.waitForTimeout(1_000);
  await browser.close();
  console.log(`${label}: ${encodedBytes} bytes`);
  return encodedBytes;
}

async function main() {
  const desktopBytes = await measure("Cold desktop", devices["Desktop Chrome"], false);
  const mobileBytes = await measure("Cold mobile full scroll", devices["Pixel 5"], true);

  if (desktopBytes > desktopBudget || mobileBytes > mobileBudget) {
    throw new Error(
      `Traffic budget exceeded (desktop ${desktopBytes}/${desktopBudget}, mobile ${mobileBytes}/${mobileBudget})`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
