import {
  After,
  Before,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { chromium, firefox, webkit } from "@playwright/test";
import type { Browser, Page, APIRequestContext, APIResponse} from "@playwright/test";

let browser: Browser;

declare module "@cucumber/cucumber" {
  interface World {
    page: Page;
    browser: import("@playwright/test").Browser; // Explicitly type browser if not in scope
    apiContext: APIRequestContext;
    apiResponse?: APIResponse; // '?' makes it optional, as it might not be set in every step
    serverUrl: string;
  }
}

// Set a default timeout for all steps/hooks if not already in cucumber.js
setDefaultTimeout(60 * 1000); // Example: 60 seconds (60000ms) for all steps/hooks

// BeforeAll runs once before all scenarios
BeforeAll(async function () {
  // You might want to launch a default browser here, or
  // let the specific @tag Before hooks handle it.
  // For simplicity, we'll keep browser launch in Before for tagged scenarios.
});

// AfterAll runs once after all scenarios
AfterAll(async function () {
  if (browser) {
    // Ensure browser exists before closing
    await browser.close();
  }
});

// Before hooks for specific browsers
// Crucially, attach 'page' and 'browser' to the Cucumber 'this' context.
// This ensures they are accessible in your step definitions.

Before({ tags: "@chromium" }, async function () {
  browser = await chromium.launch({ headless: false });
  this.page = await browser.newPage();
  this.browser = browser;
  this.apiContext = this.page.context().request;
});

Before({ tags: "@firefox" }, async function () {
  browser = await firefox.launch({ headless: false });
  this.page = await browser.newPage();
  this.browser = browser;
  this.apiContext = this.page.context().request;
});

Before({ tags: "@webkit" }, async function () {
  browser = await webkit.launch({ headless: false });
  this.page = await browser.newPage();
  this.browser = browser;
  this.apiContext = this.page.context().request;
});

After(async function () {
  if (this.page) {
    await this.page.close();
  }
  if (this.browser) {
    await this.browser.close();
  }
});
