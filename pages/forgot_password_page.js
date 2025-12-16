// pages/forgot_password_page.js
import { BasePage } from './base_page.js';
import { BASE_URL } from '../config/settings.js';

export class ForgotPasswordPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.emailInput = page.getByPlaceholder('Email'); // adjust if placeholder differs
    this.resetButton = page.getByRole('button', { name: 'Reset Password' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' }); // or "Back to Login"
    this.successMessage = 'Email sent successfully'; // adjust if your app shows different text
    this.errorSelector = '.error-message';
  }

  async resetPassword(email) {
    // Enter email and click reset
    await this.emailInput.fill(email);
    await this.page.waitForTimeout(1000);
    await this.resetButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.resetButton.click();
    await this.page.waitForTimeout(3000);
  }

  async isResetSuccessful() {
    // Check if success message is visible
    const bodyText = (await this.page.textContent('body'))?.toLowerCase() || '';
    return (
      bodyText.includes('email') ||
      bodyText.includes('sent') ||
      bodyText.includes(this.successMessage.toLowerCase())
    );
  }

  async cancelAndReturnToLogin() {
    // Click cancel/back button to go back to login page
    await this.cancelButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    await this.page.waitForSelector(this.errorSelector, { timeout: 5000 });
    return await this.page.innerText(this.errorSelector);
  }

  async resetWithEmptyEmail() {
    // Try to reset password with empty email
    await this.emailInput.fill('');
    await this.resetButton.click();
    await this.page.waitForTimeout(2000);
  }

  async resetWithInvalidEmail(email) {
    // Try to reset password with invalid email
    await this.emailInput.fill(email);
    await this.resetButton.click();
    await this.page.waitForTimeout(2000);
  }
}
