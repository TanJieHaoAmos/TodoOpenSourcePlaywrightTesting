import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

When("I add a new task", { timeout: 10000 }, async function() {
  await this.page.fill('//input', "Adding a sample ToDo");
  await this.page.click('button[type="submit"]');
});

Then("I should see the new task appear in my list", { timeout: 10000 }, async function() {
  await expect(this.page.locator('li')).toContainText('Adding a sample ToDo');
});
