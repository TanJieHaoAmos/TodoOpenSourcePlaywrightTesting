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
    // Store the video path to access it in the After hook
    videoPath?: string;
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
  this.browser = await browserType.launch({
    headless: false, // Set to true for CI/CD, false to see the browser
    slowMo: 1000, // Slow down by 1000 milliseconds (1 second)
  });
  this.context = await this.browser.newContext({
    ...contextOptions,
    recordVideo: { dir: videosDir }, // Configure video recording to the 'videosDir'
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
  // Generate timestamp and status prefix for consistent naming
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  const statusPrefix = scenario.result?.status === Status.FAILED ? "FAILED" : "PASSED";
  const baseFileName = `${scenario.pickle.name.replace(/\s+/g, "_")}_${this.browserName}_${statusPrefix}_${formattedDateTime}`;

  // --- Capture Screenshot ---
  if (this.page) {
    const screenshotFileName = `${baseFileName}.png`;
    const screenshotPath = path.join(screenshotsDir, screenshotFileName);

    try {
      const screenshotBuffer = await this.page.screenshot({
        path: screenshotPath,
        fullPage: true, // Take a full-page screenshot
      });
      this.attach(screenshotBuffer, "image/png"); // Attach to Cucumber report
      console.log(`Screenshot saved to: ${screenshotPath}`);
    } catch (error) {
      console.error(`Failed to take screenshot for scenario "${scenario.pickle.name}":`, error);
    }
  }

  // --- Handle Video Recording and Renaming ---
  let originalVideoPath: string | null = null;
  if (this.page && this.context) {
    // Get the temporary video path BEFORE closing the context/page
    originalVideoPath = (await this.page.video()?.path()) || null;
  }

  // Close context and browser
  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close(); // Closing context ensures video is saved and finalized

    // Now that the context is closed, the video file should be finalized.
    // If an original video path was obtained, rename it.
    if (originalVideoPath && fs.existsSync(originalVideoPath)) {
      const videoFileName = `${baseFileName}.webm`; // Playwright records in webm format
      const newVideoPath = path.join(videosDir, videoFileName);

      try {
        fs.renameSync(originalVideoPath, newVideoPath); // Rename the video file
        const videoBuffer = fs.readFileSync(newVideoPath);
        this.attach(videoBuffer, "video/webm"); // Attach renamed video to Cucumber report
        console.log(`Video saved and attached for scenario: ${newVideoPath}`);
      } catch (error) {
        console.error(`Failed to rename or attach video from ${originalVideoPath}:`, error);
      }
    } else if (originalVideoPath) {
      console.warn(`Video file not found at expected path after context close: ${originalVideoPath}`);
    } else {
      console.log('No video path was available for this scenario.');
    }
  }
  if (this.browser) {
    await this.browser.close();
  }
});