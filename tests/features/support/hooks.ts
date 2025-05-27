import {
  After,
  Before,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
  World,
  Status, // Import Status to check scenario outcome
} from "@cucumber/cucumber";
import { chromium, firefox, webkit, devices } from "@playwright/test";
import type {
  Page,
  APIRequestContext,
  APIResponse,
  BrowserContextOptions,
  BrowserContext,
  Browser,
} from "@playwright/test";
import * as fs from "fs"; // Import Node.js File System module
import * as path from "path"; // Import Node.js Path module

// Extend the World interface to include `context`
declare module "@cucumber/cucumber" {
  interface World {
    page: Page;
    browser: Browser;
    context: BrowserContext; // Add context to the World
    apiContext: APIRequestContext;
    apiResponse?: APIResponse;
    serverUrl: string;
    browserName: string;
  }
}

setDefaultTimeout(60 * 1000);

// Set up directories for test results
const resultsDir = "./test-results";
const screenshotsDir = path.join(resultsDir, "screenshots");
const videosDir = path.join(resultsDir, "videos");

// Ensure directories exist before tests run
BeforeAll(async function () {
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir);
  if (fs.existsSync(screenshotsDir)) {
    fs.rmSync(screenshotsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(screenshotsDir);
  if (fs.existsSync(videosDir)) {
    fs.rmSync(videosDir, { recursive: true, force: true });
  }
  fs.mkdirSync(videosDir);
});

AfterAll(async function () {
  // Any global teardown logic here, e.g., closing a global API server
});

// Helper function to set up browser context with video recording
async function setupBrowserAndContext(
  this: World,
  browserType: typeof chromium | typeof firefox | typeof webkit,
  contextOptions: BrowserContextOptions = {}
) {
  this.browser = await browserType.launch({ headless: false }); // Set to true for CI/CD
  this.context = await this.browser.newContext({
    ...contextOptions,
    // recordVideo: { dir: videosDir }, // Configure video recording
    locale: "en-US", // Set locale in context options for consistency
  });
  this.page = await this.context.newPage();
  this.apiContext = this.page.context().request;
}

// Helper function for device emulation
async function setupDeviceBrowser(
  this: World,
  browserType: typeof chromium | typeof firefox | typeof webkit,
  deviceName: keyof typeof devices  
) {
  const device = devices[deviceName];
  const contextOptions: BrowserContextOptions = {
    ...device,
  };
  await setupBrowserAndContext.call(this, browserType, contextOptions);
}

// Tagged Before hooks for different browsers
Before({ tags: "@chromium" }, async function (this: World) {
  await setupBrowserAndContext.call(this, chromium);
  this.browserName = "Chromium";
});

Before({ tags: "@firefox" }, async function (this: World) {
  await setupBrowserAndContext.call(this, firefox);
  this.browserName = "FireFox";
});

Before({ tags: "@webkit" }, async function (this: World) {
  await setupBrowserAndContext.call(this, webkit);
  this.browserName = "Safari";
});

// Tagged Before hooks for device emulation
Before({ tags: "@pixel5" }, async function (this: World) {
  await setupDeviceBrowser.call(this, chromium, "Pixel 5");
  this.browserName = "Pixel 5";
});

Before({ tags: "@iphone12" }, async function (this: World) {
  await setupDeviceBrowser.call(this, webkit, "iPhone 12");
  this.browserName = "IPhone 12";
});

// After hook to handle cleanup and attach artifacts
After(async function (scenario) {
  // Only capture screenshots and videos if the scenario failed

  if (scenario.result?.status === Status.PASSED) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    // --- Take Screenshot ---
    if (this.page) {
      // Create a unique filename for the screenshot
      const screenshotFileName = `${scenario.pickle.name.replace(
        /\s+/g,
        "-"
      )}_${this.browserName}_${formattedDateTime}}.png`;
      const screenshotPath = path.join(screenshotsDir, screenshotFileName);
      const screenshotBuffer = await this.page.screenshot({
        path: screenshotPath,
      });
      this.attach(screenshotBuffer, "image/png"); // Attach to Cucumber report
      console.log(`Screenshot saved to: ${screenshotPath}`);
    }
  }
  // --- Clean up browser and context ---
  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    // Close context before browser
    await this.context.close();
  }
  if (this.browser) {
    await this.browser.close();
  }
});
