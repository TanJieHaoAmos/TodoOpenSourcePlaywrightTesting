import { Then, When,  } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

When("I complete the ToDo", async function () {
    
    await this.page.fill('input[type="text"]', 'Completed Todo');

    await this.page.click('button[type="submit"]');

    await this.page.locator('li').filter({ hasText: 'Completed Todo' }).locator('input[type="checkbox"]').check();
});

Then("I should see the ToDo under Completed", async function() {
    await this.page.click('button:has-text("Completed")');

    await expect(this.page.locator('li')).toHaveCount(1);

    await expect(this.page.locator('li')).toContainText('Completed Todo');
});