// tests/forgot_password.test.js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login_page.js';
import { ForgotPasswordPage } from '../pages/forgot_password_page.js';
import { BASE_URL, LOGIN_USERNAME } from '../config/settings.js';

// ---------------- Helper ----------------
async function navigateToForgotPassword(page) {
  console.log(`\n[INFO] Navigating to: ${BASE_URL}`);
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const loginPage = new LoginPage(page);
  await loginPage.clickForgotPassword();
  return new ForgotPasswordPage(page);
}

// ---------------- Tests ----------------
test.describe('Forgot Password Tests', () => {

  test('Reset password with valid email', async ({ page }) => {
    const forgotPage = await navigateToForgotPassword(page);

    await forgotPage.resetPassword(LOGIN_USERNAME);
    const success = await forgotPage.isResetSuccessful();
    expect(success).toBe(true);

    await forgotPage.cancelAndReturnToLogin();
    expect(page.url().toLowerCase()).toContain('login');

    console.log('[PASS] Forgot Password flow completed successfully.');
  });

  test('Reset password with empty email', async ({ page }) => {
    const forgotPage = await navigateToForgotPassword(page);

    await forgotPage.resetWithEmptyEmail();
    console.log('[PASS] Proper validation shown for empty email.');
  });

  test('Reset password with invalid email', async ({ page }) => {
    const forgotPage = await navigateToForgotPassword(page);

    await forgotPage.resetWithInvalidEmail('invalid_email@');
    console.log('[PASS] Proper validation shown for invalid email.');
  });

});
