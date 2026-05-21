import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3010);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run build && PORT=${PORT} npm run start`,
        url: BASE_URL,
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
      },
  projects: [
    {
      name: "chromium",
      testIgnore: /mobile-landing\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testMatch: /mobile-landing\.spec\.ts/,
      use: { ...devices["Pixel 5"] },
    },
  ],
});
