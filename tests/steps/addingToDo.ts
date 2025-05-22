import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
// import type { Page, Browser } from "@playwright/test";

// let page: Page;
// let browser: Browser;

// Before({ tags: "@chromium" }, async function () {
//   browser = await chromium.launch({ headless: false });
//   page = await browser.newPage();
// });

// Before({ tags: "@firefox" }, async function () {
//   browser = await firefox.launch({ headless: false });
//   page = await browser.newPage();
// });

// Before({ tags: "@webkit" }, async function () {
//   browser = await webkit.launch({ headless: false });
//   page = await browser.newPage();
// });

// After(async function () {
//   await browser.close();
// });

// Given("I have loaded my homepage", async () => {
//   page = await browser.newPage();
//   await page.goto("http://localhost:5173/", { waitUntil: "load" });
// });

When("I add a ToDo", { timeout: 10000 }, async function() {
  await this.page.fill('//input', "Adding a sample ToDo");
  await this.page.click('button[type="submit"]');
});

Then("I should see ToDo added", { timeout: 10000 }, async function() {
  await expect(this.page.locator('li')).toContainText('Adding a sample ToDo');
});
