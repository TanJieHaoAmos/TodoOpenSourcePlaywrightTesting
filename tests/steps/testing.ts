import { After, Given, Then , Before} from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { Page, Browser } from "@playwright/test";
import { chromium } from "playwright";

let page: Page;
let browser: Browser;


Before({ tags: "@chromium" }, async function () {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
});

After(async function () {
  await browser.close();
});

Given("I am on the homepage", async () => {
  const browser = await chromium.launch({headless:false});
  page = await browser.newPage();
  await page.goto("http://localhost:5173");
});

Then("I should see ToDo", async () => {
  await expect(page.locator("//h1")).toContainText("Todo List");
});
