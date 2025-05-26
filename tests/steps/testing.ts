import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Given("I have a web server URL {string}", async function (url) {
  this.serverUrl = url;
});

When("I attempt to access the web server", async function () {
  await this.page.goto(this.serverUrl, {
    waitUntil: "load",
  });
  this.apiResponse = await this.apiContext.get(this.serverUrl);
});

Then("I should see ToDo", async function () {
  await expect(this.page.locator("//h1")).toHaveText("Todo List");
});

Then(
  "the response status code should be {int}",
  async function (expectedStatusCode: number) {
    if (this.apiResponse) {
      const actualStatusCode = this.apiResponse.status();
      console.log(
        `Expected status: ${expectedStatusCode}, Actual status: ${actualStatusCode}`
      );
      expect(actualStatusCode).toBe(expectedStatusCode);
    }
  }
);
