import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Given("I am on the homepage", async function() {
  await this.page.goto("http://localhost:5173/", { waitUntil: "load" });
});

Then("I should see ToDo", async function() {
  await expect(this.page.locator("//h1")).toHaveText("Todo List");
});
