import {
  After,
  Before,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
  World,
} from "@cucumber/cucumber";
import { chromium, firefox, webkit, devices } from "@playwright/test";
import type {
  Page,
  APIRequestContext,
  APIResponse,
  BrowserContextOptions,
  Browser
} from "@playwright/test";

declare module "@cucumber/cucumber" {
  interface World {
    page: Page;
    browser: Browser; 
    apiContext: APIRequestContext;
    apiResponse?: APIResponse; // '?' makes it optional, as it might not be set in every step
    serverUrl: string;
  }
}

setDefaultTimeout(60 * 1000);

BeforeAll(async function () {});
AfterAll(async function () {});

async function setupChromiumDeviceBrowser(
  this: World,
  deviceName: keyof typeof devices
) {
  // Always launch Chromium for device emulation
  this.browser = await chromium.launch({ headless: false });

  const device = devices[deviceName];

  const contextOptions: BrowserContextOptions = {
    ...device,
    locale: "en-US",
  };

  const context = await this.browser.newContext(contextOptions);

  this.page = await context.newPage();
  this.apiContext = this.page.context().request;
}

Before({ tags: "@chromium" }, async function () {
  this.browser = await chromium.launch({ headless: false });
  this.page = await this.browser.newPage();
  this.apiContext = this.page.context().request;
});

Before({ tags: "@firefox" }, async function () {
  this.browser = await firefox.launch({ headless: false });
  this.page = await this.browser.newPage();
  this.apiContext = this.page.context().request;
});

Before({ tags: "@webkit" }, async function () {
  this.browser = await webkit.launch({ headless: false });
  this.page = await this.browser.newPage();
  this.apiContext = this.page.context().request;
});

Before({ tags: "@pixel5" }, async function (this: World) { 
  await setupChromiumDeviceBrowser.call(this, "Pixel 5");
});

Before({ tags: "@iphone12" }, async function (this: World) {
  await setupChromiumDeviceBrowser.call(this, "iPhone 12");
});

After(async function () {
  if (this.page) {
    await this.page.close();
  }
  if (this.browser) {
    await this.browser.close();
  }
});