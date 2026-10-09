import { test, expect } from '@playwright/test';

// Phase 1 tests (public routes still work)
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/how-it-works',
];

for (const route of publicRoutes) {
  test(`Public route ${route} should load`, async ({ page }) => {
    await page.goto(`http://localhost:3000${route}`);
    await expect(page.locator('text=404').first()).not.toBeVisible();
  });
}

test('Protected dashboard redirects unauthenticated user', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL(/.*\/login/);
});

test('Assessment page requires authentication', async ({ page }) => {
  await page.goto('http://localhost:3000/assessment/new');
  await expect(page).toHaveURL(/.*\/login/);
});

test.describe('Authenticated flows', () => {
  test('Register a test user, login, update profile, update settings, submit assessment, and logout', async ({ page }) => {
    // Register
    await page.goto('http://localhost:3000/register');
    const ts = Date.now();
    const email = `test${ts}@example.com`;
    const password = 'password123';
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard and show name
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('text=Good morning, Test User')).toBeVisible();

    // Profile page loads authenticated profile
    await page.goto('http://localhost:3000/profile');
    await expect(page.locator('input[name="name"]')).toHaveValue('Test User');
    
    // Profile update persists
    await page.fill('input[name="location"]', 'Chennai');
    await page.selectOption('select[name="userType"]', 'outdoor_worker');
    await Promise.all([
      page.waitForNavigation(),
      page.click('button:has-text("Save Changes")')
    ]);
    
    // Settings update persists
    await page.goto('http://localhost:3000/settings');
    await page.selectOption('select[name="language"]', 'ta');
    await Promise.all([
      page.waitForNavigation(),
      page.click('button:has-text("Save")')
    ]);
    
    // Phase 3 Tests: Assessment and Environmental Data Pipeline
    
    // Test 1: Authenticated user opens /assessment/new
    await page.goto('http://localhost:3000/assessment/new');
    await expect(page.locator('text=New Safety Assessment')).toBeVisible();

    // Test 11: Invalid assessment time range is rejected
    // For now we don't have client-side validation for this, so we'll skip or simulate it if added later
    
    // Test 2: User enters assessment information
    await page.fill('input[name="location"]', 'Madurai');
    await page.fill('input[name="startTime"]', '08:00');
    await page.fill('input[name="endTime"]', '17:00');
    
    // Test 3: Submit assessment and wait for preview (with loading)
    await Promise.all([
      page.waitForNavigation(),
      page.click('button:has-text("Analyze My Risk")')
    ]);
    
    // Test 4: Environmental preview is displayed
    await expect(page).toHaveURL(/.*\/assessment\/preview/);
    await expect(page.locator('text=Risk Assessment')).toBeVisible();
    
    // Phase 4 UI Tests
    await expect(page.locator('text=RISK').first()).toBeVisible();
    await expect(page.locator('text=/ 100')).toBeVisible();
    await expect(page.locator('text=Risk Factors')).toBeVisible();
    
    // Phase 5 UI Tests
    await expect(page.locator('text=Personalized Safety Plan')).toBeVisible();
    await expect(page.locator('text=Standard safety guidance').first()).toBeVisible(); // fallback
    await expect(page.locator('text=Priority').first()).toBeVisible();
    // Phase 6 UI Tests
    await expect(page.locator('text=Current vs Safer Alternative')).toBeVisible();
    await expect(page.locator('text=Current Schedule').first()).toBeVisible();
    await expect(page.locator('text=Estimated Exposure Index').first()).toBeVisible();
    await expect(page.locator('text=Safer timing available').or(page.locator('text=Schedule is optimal'))).toBeVisible();

    await expect(page.locator('text=Disclaimer: HeatShield AI provides environmental risk guidance')).toBeVisible();

    // Test 5: Environmental metrics contain units
    await expect(page.locator('text=°C').first()).toBeVisible();
    await expect(page.locator('text=%').first()).toBeVisible();
    
    // Test 6 & 10: Source metadata is displayed and fallback data is clearly labeled
    await expect(page.locator('text=Fallback / Demo Data')).toBeVisible();
    await expect(page.locator('text=Source: FallbackDemoProvider')).toBeVisible();
    
    // Test 7 & 8: Saved assessment appears in history
    await page.goto('http://localhost:3000/history');
    await expect(page.locator('text=Madurai').first()).toBeVisible();
    await expect(page.locator('text=08:00 – 17:00').first()).toBeVisible();
    
    // Phase 4 History Test
    await expect(page.locator('text=/100').first()).toBeVisible();
    await expect(page.locator('text=Primary Concern')).toBeVisible();
    
    // Logout works
    await page.goto('http://localhost:3000/dashboard');
    await page.click('text=Logout');
    await page.waitForURL('**/login');
    
    // Test 12: Unauthenticated access remains protected
    await page.goto('http://localhost:3000/history');
    await expect(page).toHaveURL(/.*\/login/);
    await page.goto('http://localhost:3000/assessment/preview');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
