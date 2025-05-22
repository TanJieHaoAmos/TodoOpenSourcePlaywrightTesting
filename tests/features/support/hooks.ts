// features/support/hooks.js
import { After, Before, BeforeAll, AfterAll, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, firefox, webkit } from "@playwright/test";
import type { Browser } from "@playwright/test";

// Use 'let' to declare browser and page globally within this hook file
// so they can be accessed by the 'this' context in step definitions.
let browser: Browser;
// let page: Page;

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
  if (browser) { // Ensure browser exists before closing
    await browser.close();
  }
});

// Before hooks for specific browsers
// Crucially, attach 'page' and 'browser' to the Cucumber 'this' context.
// This ensures they are accessible in your step definitions.

Before({ tags: "@chromium" }, async function () {
  browser = await chromium.launch({ headless: false });
  this.page = await browser.newPage(); // Attach to 'this'
  this.browser = browser; // Attach browser to 'this' for potential use in steps
});

Before({ tags: "@firefox" }, async function () {
  browser = await firefox.launch({ headless: false });
  this.page = await browser.newPage(); // Attach to 'this'
  this.browser = browser;
});

Before({ tags: "@webkit" }, async function () {
  browser = await webkit.launch({ headless: false });
  this.page = await browser.newPage(); // Attach to 'this'
  this.browser = browser;
});

// After hook to close the page after each scenario (if it was opened)
After(async function () {
  if (this.page) { // Ensure page exists before closing
    await this.page.close();
  }
});