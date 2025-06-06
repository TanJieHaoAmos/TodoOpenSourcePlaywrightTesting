import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: "html",

  use: {
    headless: false,

      baseURL: "http://localhost:5173",

    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",

      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",

      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "safari",

      use: { ...devices["Desktop Safari"] },
    },

    {
      name: "edge",

      use: { ...devices["Desktop Edge"] },
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
});
