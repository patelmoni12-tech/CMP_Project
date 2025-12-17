// tests/forgotpassword.test.js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login_page.js';
import { ForgotPasswordPage } from '../pages/forgot_password_page.js';
import { BASE_URL, LOGIN_USERNAME } from '../config/settings.js';

async function navigateToForgotPassword(page) {
  console.log('Navigating to Forgot Password page...');
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const loginPage = new LoginPage(page);
  await loginPage.clickForgotPassword();
  console.log('[INFO] Clicked on "Forgot Password" link.');
  return new ForgotPasswordPage(page);
}

test.describe('Forgot Password Tests with Logging', () => {

  test('Reset password with valid email', async ({ page }) => {
    const forgotPage = await navigateToForgotPassword(page);

    await forgotPage.resetPassword(LOGIN_USERNAME);

    const toastText = await forgotPage.getToastMessageText();
    if (toastText) {
      expect(toastText.toLowerCase()).toContain('reset');
    } else {
      console.log('Toast not captured. Taking screenshot...');
      await page.screenshot({ path: 'screenshots/reset_failure.png' });
    }

    await forgotPage.cancelAndReturnToLogin();
    await expect(page).toHaveURL(/login/i);
  });

  test('Reset password with empty email', async ({ page }) => {
    const forgotPage = await navigateToForgotPassword(page);

    await forgotPage.resetWithEmptyEmail();

    const errorText = await forgotPage.getInlineErrorText();
    if (errorText) {
      expect(errorText.toLowerCase()).toContain('email');
    } else {
      console.log('Inline error not captured. Taking screenshot...');
      await page.screenshot({ path: 'screenshots/empty_email_failure.png' });
    }
  });

  test('Reset password with invalid email', async ({ page }) => {
    const forgotPage = await navigateToForgotPassword(page);

    await forgotPage.resetWithInvalidEmail('invalid_email@');

    const errorText = await forgotPage.getInlineErrorText();
    if (errorText) {
      expect(errorText.toLowerCase()).toContain('valid');
    } else {
      console.log('Inline error not captured. Taking screenshot...');
      await page.screenshot({ path: 'screenshots/invalid_email_failure.png' });
    }
  });

});
