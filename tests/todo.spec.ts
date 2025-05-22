import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {

    test.beforeEach(async ({ page }) => {

        await page.goto('/');

    });

 test('should display the correct title', async ({ page }) => {

    // Here, the test tests that the title header 'Todo list' exists in the document

    await expect(page.locator('h1')).toHaveText('Todo List');

 });

 test('should add a new todo', async ({ page }) => {

    // In this test, we will fill the new todo input and submit the for,

    // this creates a new todo in the list

    //The test will check and confirm that a new todo with the text entered above has

    //be added to the list of todos

    await page.fill('input[type="text"]', 'New Todo');

    await page.click('button[type="submit"]');

    await expect(page.locator('li')).toContainText('New Todo');

 });

 test('should toggle a todo', async ({ page }) => {

    // This test shows that whenever we click on a todo items checkbox

    // the state of the todo will change its state from active to completed

    // We will confirm the completed state by checking if the checkbox is checked

    // A second test is done by clicking on the checked checkbox again to move its

    // state from completed to active, and the next test will confirm that now

    // the checkbox is no longer checked

    await page.fill('input[type="text"]', 'Toggle Todo');

    await page.click('button[type="submit"]');

    const todoItem = page.locator('li').filter({ hasText: 'Toggle Todo' });

    const checkbox = todoItem.locator('input[type="checkbox"]');

    await checkbox.check();

    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();

    await expect(checkbox).not.toBeChecked();

 });

 test('should delete a todo', async ({ page }) => {

    // This test tests that when we click the text of 'Delete Todo' next to a

    // todo item that todo will no longer be shown in the list by default

    // because it is deleted

    await page.fill('input[type="text"]', 'Delete Todo');

    await page.click('button[type="submit"]');

    const todoItem = page.locator('li').filter({ hasText: 'Delete Todo' });

    await todoItem.locator('button').click();

    await expect(todoItem).toHaveCount(0);

 });

 test('should filter todos', async ({ page }) => {

    // This tests that when we list todos, an active to and another one in progress

    // When we click the 'Completed Todo' button

    // Only the todo item which is completed is shown

    // When we click the button with 'Active Todo'

    // Only incomplete todos are shown

    // Finally, we wil click the All button and both completed and active todos will be shown

    // All actions adescribed show that the filter is working

    await page.fill('input[type="text"]', 'Completed Todo');

    await page.click('button[type="submit"]');

    await page.locator('li').filter({ hasText: 'Completed Todo' }).locator('input[type="checkbox"]').check();

    await page.fill('input[type="text"]', 'Active Todo');

    await page.click('button[type="submit"]');

    await page.click('button:has-text("Completed")');

    await expect(page.locator('li')).toHaveCount(1);

    await expect(page.locator('li')).toContainText('Completed Todo');

    await page.click('button:has-text("Active")');

    await expect(page.locator('li')).toHaveCount(1);

    await expect(page.locator('li')).toContainText('Active Todo');

    await page.click('button:has-text("All")');

    await expect(page.locator('li')).toHaveCount(2);

 });

});