import { Then, When,  } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

When("I mark the task as completed", async function () {
    
    await this.page.fill('input[type="text"]', 'Completed Todo');

    await this.page.click('button[type="submit"]');

    await this.page.locator('li').filter({ hasText: 'Completed Todo' }).locator('input[type="checkbox"]').check();
});

Then("I should see it listed under {string}", async function(tabName: string) {
    const locatorName = 'button:has-text("'+ tabName +'")'
    await this.page.click(locatorName);

    await expect(this.page.locator('li')).toHaveCount(1);

    await expect(this.page.locator('li')).toContainText('Completed Todo');
});