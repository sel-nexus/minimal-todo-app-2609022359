import { expect, test } from '@playwright/test';

test('user completes the deterministic task lifecycle without browser errors', async ({ page }) => {
  const browserErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      browserErrors.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => browserErrors.push(`pageerror: ${error.message}`));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
  await expect(page.getByTestId('empty-state')).toHaveText('No tasks yet.');

  const emptyAccessibilityTree = await page.locator('main').ariaSnapshot();
  const emptyComputedStyles = await page.evaluate(() => ({
    fontFamily: getComputedStyle(document.body).fontFamily,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
  }));
  const emptyRenderedHtml = await page.content();
  expect(emptyAccessibilityTree).toContain('Todo App');
  expect(emptyComputedStyles.fontFamily).toBeTruthy();
  expect(emptyRenderedHtml).toContain('data-testid="empty-state"');
  await page.screenshot({ path: 'test-results/todo-empty-state.png', fullPage: true });

  await page.getByTestId('todo-input').fill('Buy milk');
  await page.getByTestId('add-button').click();
  await expect(page.getByTestId('todo-item-1')).toContainText('Buy milk');
  await expect(page.getByTestId('todo-input')).toHaveValue('');
  await expect(page.getByTestId('empty-state')).toHaveCount(0);

  await page.getByTestId('todo-input').fill('Walk dog');
  await page.getByTestId('todo-input').press('Enter');
  await expect(page.getByTestId('todo-item-2')).toContainText('Walk dog');
  await expect(page.getByTestId('todo-input')).toHaveValue('');
  await expect(page.getByTestId('todo-list').locator('li')).toHaveCount(2);
  const orderedTaskIds = await page.getByTestId('todo-list').locator('li')
    .evaluateAll((items) => items.map((item) => item.dataset.testid));
  expect(orderedTaskIds).toEqual(['todo-item-1', 'todo-item-2']);
  await expect(page.getByTestId('todo-item-1').getByRole('button', { name: 'Delete Buy milk' }))
    .toHaveText('Delete');
  await expect(page.getByTestId('todo-item-1').getByRole('checkbox', { name: 'Mark Buy milk as complete' }))
    .toBeVisible();

  const populatedAccessibilityTree = await page.locator('main').ariaSnapshot();
  const populatedComputedStyles = await page.evaluate(() => ({
    fontFamily: getComputedStyle(document.body).fontFamily,
    titleColor: getComputedStyle(document.querySelector('[data-testid="todo-title-1"]')).color,
  }));
  const populatedRenderedHtml = await page.content();
  expect(populatedAccessibilityTree).toContain('Buy milk');
  expect(populatedComputedStyles.fontFamily).toBeTruthy();
  expect(populatedRenderedHtml).toContain('data-testid="todo-item-2"');
  await page.screenshot({ path: 'test-results/todo-populated-state.png', fullPage: true });

  await page.getByTestId('todo-input').fill('   ');
  await page.getByTestId('add-button').click();
  await expect(page.getByTestId('todo-list').locator('li')).toHaveCount(2);
  await expect(page.getByTestId('todo-item-3')).toHaveCount(0);
  await expect(page.getByRole('alert')).toHaveCount(0);

  await page.getByTestId('todo-checkbox-1').check();
  await expect(page.getByTestId('todo-title-1')).toHaveCSS('text-decoration-line', 'line-through');
  await expect(page.getByTestId('todo-checkbox-2')).not.toBeChecked();
  await page.getByTestId('todo-checkbox-1').uncheck();
  await expect(page.getByTestId('todo-title-1')).toHaveCSS('text-decoration-line', 'none');

  await page.getByTestId('todo-delete-1').click();
  await expect(page.getByTestId('todo-item-1')).toHaveCount(0);
  await expect(page.getByTestId('todo-item-2')).toContainText('Walk dog');
  await expect(page.getByTestId('todo-checkbox-2')).not.toBeChecked();
  await page.getByTestId('todo-delete-2').click();
  await expect(page.getByTestId('empty-state')).toHaveText('No tasks yet.');
  await expect(page.getByTestId('todo-list').locator('li')).toHaveCount(0);

  expect(browserErrors).toEqual([]);
});
