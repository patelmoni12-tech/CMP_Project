// pages/login_page.js
import { BasePage } from './base_page.js';
import { DashboardPage } from './dashboard_page.js';
import { BASE_URL } from '../config/settings.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailPlaceholder = 'Enter email';
    this.passwordPlaceholder = 'Enter password';
    this.loginButtonName = 'Login';
    this.forgotPasswordLink = 'text=Forgot Password';
  }

  async openPage() {
    try {
      await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
      console.log('[INFO] Login page opened successfully.');
    } catch (err) {
      console.log(`[ERROR] Failed to open login page: ${err}`);
    }
  }

  // ---------------- Helper: basic email format validation ----------------
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async login(email, password, expectSuccess = true) {
    // ---------------- Validate email and password ----------------
    if (!email || !password) {
      console.log('[INFO] Empty field(s) detected, login expected to fail.');
      return false;
    }

    if (!this.isValidEmail(email)) {
      console.log('[INFO] Invalid email format, login prevented.');
      return false;
    }

    // ---------------- Fill email ----------------
    const emailLocator = this.page.locator(`input[placeholder="${this.emailPlaceholder}"]`);
    const emailVisible = await emailLocator.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
    if (emailVisible) {
      console.log('[INFO] Typing email:', email);
      await emailLocator.fill(email);
    } else {
      console.log('[ERROR] Email field not visible!');
      return false;
    }

    // ---------------- Fill password ----------------
    const passwordLocator = this.page.locator(`input[placeholder="${this.passwordPlaceholder}"]`);
    const passwordVisible = await passwordLocator.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
    if (passwordVisible) {
      console.log('[INFO] Typing password: ******');
      await passwordLocator.fill(password);
    } else {
      console.log('[ERROR] Password field not visible!');
      return false;
    }

    // ---------------- Click login button ----------------
    const loginBtnLocator = this.page.getByRole('button', { name: this.loginButtonName });
    const loginBtnVisible = await loginBtnLocator.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
    if (!loginBtnVisible) {
      console.log('[ERROR] Login button not visible!');
      return false;
    }
    await loginBtnLocator.click();
    console.log('[INFO] Login button clicked.');

    // ---------------- Wait for dashboard ----------------
    if (expectSuccess) {
      const dashboardLocator = this.page.locator('text=Dashboard');
      const dashboardVisible = await dashboardLocator.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);

      if (dashboardVisible) {
        const dashboard = new DashboardPage(this.page);
        await dashboard.waitForDashboardReady();
        console.log('[INFO] Login successful, dashboard ready.');
        return dashboard;
      } else {
        console.log('[ERROR] Dashboard did not load in expected time.');
        return false;
      }
    } else {
      console.log('[INFO] Login expected to fail, stayed on login page.');
      return false;
    }
  }

  async clickForgotPassword() {
    try {
      const link = this.page.locator(this.forgotPasswordLink);
      await link.waitFor({ state: 'visible', timeout: 10000 });
      await link.click();
      console.log('[INFO] Clicked on "Forgot Password" link.');
    } catch (err) {
      console.log(`[ERROR] Failed to click "Forgot Password": ${err}`);
    }
  }

  async isLoginSuccessful() {
    const dashboardLocator = this.page.locator('text=Dashboard');
    return await dashboardLocator.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
  }

  async isElementVisibleByPlaceholder(placeholderText) {
    const locator = this.page.locator(`input[placeholder="${placeholderText}"]`);
    return await locator.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
  }
}
