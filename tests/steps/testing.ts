import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";


Given("I am on the homepage", async function() {
  await this.page.goto("http://localhost:5173/", { waitUntil: "load" });
  this.apiResponse = await this.apiContext.get("http://localhost:5173/");
});

Then("I should see ToDo", async function() {
  await expect(this.page.locator("//h1")).toHaveText("Todo List");
});

Then('the response status code should be {int}', async function (expectedStatusCode: number) {
  const actualStatusCode = this.apiResponse.status();
  console.log(`Expected status: ${expectedStatusCode}, Actual status: ${actualStatusCode}`);
  expect(actualStatusCode).toBe(expectedStatusCode);
});
