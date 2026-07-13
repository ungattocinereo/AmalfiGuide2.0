import { defineConfig, devices } from "@playwright/test";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "output/playwright",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  use: {
    baseURL: externalBaseUrl ?? "http://127.0.0.1:3100",
    channel: "chrome",
    colorScheme: "light",
    locale: "en-US",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"], channel: "chrome" } },
  ],
  webServer: externalBaseUrl ? undefined : {
    command: "npm run build && npm start -- -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
