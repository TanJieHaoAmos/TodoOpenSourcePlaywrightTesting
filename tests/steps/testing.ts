import { Given, Then } from "@cucumber/cucumber";
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

Given("I am on the homepage", async function() {
  await this.page.goto("http://localhost:5173/", { waitUntil: "load" });
});

Then("I should see ToDo", async function() {
  await expect(this.page.locator("//h1")).toHaveText("Todo List");
});
