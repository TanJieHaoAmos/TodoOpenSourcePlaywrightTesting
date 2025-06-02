import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Given("I open the ToDo web app", async function () {
  this.serverUrl = "http://localhost:5173";
});

When("I visit the homepage", async function () {
  await this.page.goto(this.serverUrl, {
    waitUntil: "load",
  });
  this.apiResponse = await this.apiContext.get(this.serverUrl);
});

Then("I should see {string}", async function (title: string) {
  await expect(this.page.locator("//h1")).toHaveText(title);
});


Then(
  "the page should load successfully",
  async function () {
    if (this.apiResponse) {
      const expectedStatusCode = 200;
      const actualStatusCode = this.apiResponse.status();
      console.log(
        `Expected status: ${expectedStatusCode}, Actual status: ${actualStatusCode}`
      );
      expect(actualStatusCode).toBe(expectedStatusCode);
    }
  }
);
