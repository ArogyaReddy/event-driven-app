const { test, expect } = require('@playwright/test');

test.describe('AROG Documentation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/AROG/);
    await expect(page.locator('h1')).toContainText('AROG');
  });

  test('should display 10 automation cards', async ({ page }) => {
    await page.goto('/');
    
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(10);
  });

  test('should show active status badges', async ({ page }) => {
    await page.goto('/');
    
    const badges = page.locator('.status-badge');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    const ctaButtons = page.locator('.cta-button');
    await expect(ctaButtons.first()).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();
  });
});
