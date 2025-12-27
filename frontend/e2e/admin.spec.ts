import { test, expect } from '@playwright/test';

test.describe('Admin Login Flow', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
        // Navigate to login page
        await page.goto('/login');

        // Fill in credentials
        await page.fill('input[name="username"]', 'admin');
        await page.fill('input[name="password"]', 'admin123');

        // Click login button
        await page.click('button[type="submit"]');

        // Wait for navigation to dashboard
        await page.waitForURL('/admin');

        // Verify we're on the dashboard
        await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[name="username"]', 'wronguser');
        await page.fill('input[name="password"]', 'wrongpass');

        await page.click('button[type="submit"]');

        // Should show error message
        await expect(page.locator('text=/invalid|error/i')).toBeVisible();
    });
});

test.describe('Campaign Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login');
        await page.fill('input[name="username"]', 'admin');
        await page.fill('input[name="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin');
    });

    test('should create a new campaign', async ({ page }) => {
        // Navigate to campaigns
        await page.goto('/admin/campaigns/new');

        // Fill in campaign details
        await page.fill('input[name="title"]', 'E2E Test Campaign');
        await page.fill('input[name="subject"]', 'Test Subject');
        await page.fill('textarea[name="message"]', 'Test message content');
        await page.selectOption('select[name="segment"]', 'all');

        // Submit form
        await page.click('button:has-text("Create Campaign")');

        // Verify success (adjust based on your UI)
        await expect(page.locator('text=/created|success/i')).toBeVisible({ timeout: 10000 });
    });

    test('should list existing campaigns', async ({ page }) => {
        await page.goto('/admin/campaigns');

        // Should show campaigns table or list
        await expect(page.locator('table, .campaign-list')).toBeVisible();
    });
});

test.describe('Analytics Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="username"]', 'admin');
        await page.fill('input[name="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin');
    });

    test('should display analytics charts', async ({ page }) => {
        await page.goto('/admin/analytics');

        // Wait for charts to load
        await page.waitForSelector('canvas, svg', { timeout: 10000 });

        // Verify charts are present
        const charts = await page.locator('canvas, svg').count();
        expect(charts).toBeGreaterThan(0);
    });

    test('should show metrics cards', async ({ page }) => {
        await page.goto('/admin/analytics');

        // Check for metric cards
        await expect(page.locator('text=/total users|active users/i')).toBeVisible();
    });
});

test.describe('User Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="username"]', 'admin');
        await page.fill('input[name="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin');
    });

    test('should display user list', async ({ page }) => {
        await page.goto('/admin/users');

        // Should show users table
        await expect(page.locator('table')).toBeVisible();
    });

    test('should filter users', async ({ page }) => {
        await page.goto('/admin/users');

        // Use search/filter
        await page.fill('input[placeholder*="Search"]', 'admin');

        // Wait for filtered results
        await page.waitForTimeout(500);

        // Verify filtering worked
        const rows = await page.locator('tbody tr').count();
        expect(rows).toBeGreaterThan(0);
    });
});
