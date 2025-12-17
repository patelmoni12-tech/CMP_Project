// pages/forgot_password_page.js
import { BasePage } from './base_page.js';
import { expect } from '@playwright/test';

export class ForgotPasswordPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    this.emailInput = page.getByPlaceholder(/email/i);
    this.resetButton = page.getByRole('button', { name: /reset/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });

    // Robust locators (CSS only, no regex)
    this.toastMessage = page.locator('.toast, .Toastify__toast, [role="alert"]');
    this.inlineError = page.locator('[role="alert"], .error-message');
  }

  // ---------------- ACTIONS ----------------
  async resetPassword(email) {
    console.log(`Filling email: "${email}"`);
    await this.emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.emailInput.fill(email);
    await this.emailInput.blur(); // triggers validation
    console.log('Clicking Reset button...');
    await this.resetButton.click();
  }

  async cancelAndReturnToLogin() {
    await this.cancelButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.cancelButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    console.log('Returned to login page.');
  }

  // ---------------- GET MESSAGES ----------------
  async getToastMessageText(timeout = 8000, pollInterval = 100) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const count = await this.toastMessage.count();
      if (count > 0) {
        const text = await this.toastMessage.first().textContent();
        if (text && /reset|success/i.test(text)) {
          console.log(`Captured Toast Message: "${text}"`);
          return text;
        }
      }
      await this.page.waitForTimeout(pollInterval);
    }
    console.log('Toast message not captured.');
    return null;
  }

  async getInlineErrorText(timeout = 8000, pollInterval = 100) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const count = await this.inlineError.count();
      if (count > 0) {
        const text = await this.inlineError.first().textContent();
        if (text && /required|invalid|email/i.test(text)) {
          console.log(`Captured Inline Error: "${text}"`);
          return text;
        }
      }
      await this.page.waitForTimeout(pollInterval);
    }
    console.log('Inline error message not captured.');
    return null;
  }

  // ---------------- SHORTCUTS ----------------
  async resetWithEmptyEmail() {
    await this.resetPassword('');
  }

  async resetWithInvalidEmail(email) {
    await this.resetPassword(email);
  }
}
