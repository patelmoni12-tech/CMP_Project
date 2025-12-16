// tests/login.test.js
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/login_page.js';

dotenv.config(); // Load environment variables once
console.log('[HOOK] .env loaded');

const LOGIN_USERNAME = process.env.LOGIN_USERNAME;
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
const BASE_URL = process.env.BASE_URL;

if (!LOGIN_USERNAME || !LOGIN_PASSWORD || !BASE_URL) {
  throw new Error('LOGIN_USERNAME, LOGIN_PASSWORD, or BASE_URL is undefined in .env');
}

test.describe('Login Tests', () => {

  // ---------------- HOOK: beforeEach ----------------
  test.beforeEach(async ({ page }) => {
    console.log('[HOOK] Navigating to login page before test');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  });

  // ---------------- HOOK: afterEach ----------------
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = `screenshots/${testInfo.title.replace(/\s+/g, '_')}.png`;
      await page.screenshot({ path: screenshotPath });
      console.log(`[HOOK] Screenshot captured for failed test: ${screenshotPath}`);
    }
  });

  // ---------------- HOOK: afterAll ----------------
  test.afterAll(() => {
    console.log('[HOOK] All login tests finished.');
  });

  // ---------------- TESTS ----------------

  test('Successful login navigates to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openPage();

    const dashboard = await loginPage.login(LOGIN_USERNAME, LOGIN_PASSWORD);
    expect(dashboard).not.toBe(false);

    const isLoaded = await dashboard.isDashboardLoaded();
    expect(isLoaded).toBe(true);

    console.log('[PASS] Successfully navigated to Dashboard page after login.');
  });

  test('Login fails with both fields empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openPage();

    const result = await loginPage.login('', '', false);
    expect(result).toBe(false);

    // Check login form is still visible
    const emailVisible = await loginPage.isElementVisibleByPlaceholder(loginPage.emailPlaceholder);
    const passwordVisible = await loginPage.isElementVisibleByPlaceholder(loginPage.passwordPlaceholder);
    expect(emailVisible).toBe(true);
    expect(passwordVisible).toBe(true);

    console.log('[PASS] Stayed on login page for empty fields.');
  });

  test('Login fails with only username filled', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openPage();

    const result = await loginPage.login(LOGIN_USERNAME, '', false);
    expect(result).toBe(false);

    // Check login form is still visible
    const emailVisible = await loginPage.isElementVisibleByPlaceholder(loginPage.emailPlaceholder);
    const passwordVisible = await loginPage.isElementVisibleByPlaceholder(loginPage.passwordPlaceholder);
    expect(emailVisible).toBe(true);
    expect(passwordVisible).toBe(true);

    console.log('[PASS] Stayed on login page when only username was filled.');
  });

  test('Login fails with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openPage();

    const result = await loginPage.login('wrong@example.com', 'wrongpass123', false);
    expect(result).toBe(false);

    const emailVisible = await loginPage.isElementVisibleByPlaceholder(loginPage.emailPlaceholder);
    const passwordVisible = await loginPage.isElementVisibleByPlaceholder(loginPage.passwordPlaceholder);
    expect(emailVisible).toBe(true);
    expect(passwordVisible).toBe(true);

    console.log('[PASS] Stayed on login page with invalid credentials.');
  });

  test('Login fails with invalid email format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openPage();

    const invalidEmail = 'invalid-email-format';
    const result = await loginPage.login(invalidEmail, LOGIN_PASSWORD, false);
    expect(result).toBe(false);

    const emailVisible = await loginPage.isElementVisibleByPlaceholder(loginPage.emailPlaceholder);
    const passwordVisible = await loginPage.isElementVisibleByPlaceholder(loginPage.passwordPlaceholder);
    expect(emailVisible).toBe(true);
    expect(passwordVisible).toBe(true);

    console.log('[PASS] Login failed with invalid email format as expected.');
  });

});
