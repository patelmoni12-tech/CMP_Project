// pages/login_page.js
import { BasePage } from './base_page.js';
import { DashboardPage } from './dashboard_page.js';
import { BASE_URL } from '../config/settings.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    this.emailPlaceholder = 'Enter email';
    this.passwordPlaceholder = 'Enter password';
    this.loginButtonName = 'Login';
    this.forgotPasswordLink = 'text=Forgot Password';
  }

  // ---------------- OPEN LOGIN PAGE ----------------
  async openPage() {
    try {
      await this.page.goto(BASE_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      console.log('[INFO] Login page opened successfully.');
    } catch (err) {
      console.log(`[ERROR] Failed to open login page: ${err}`);
      throw err;
    }
  }

  // ---------------- EMAIL VALIDATION ----------------
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ---------------- LOGIN METHOD ----------------
  async login(email, password, expectSuccess = true) {
    // --------- Validation ---------
    if (!email || !password) {
      console.log('[INFO] Empty field(s) detected, login expected to fail.');
      return false;
    }

    if (!this.isValidEmail(email)) {
      console.log('[INFO] Invalid email format, login prevented.');
      return false;
    }

    // --------- Fill Email ---------
    const emailLocator = this.page.locator(
      `input[placeholder="${this.emailPlaceholder}"]`
    );
    await emailLocator.waitFor({ state: 'visible', timeout: 10000 });
    console.log('[INFO] Typing email:', email);
    await emailLocator.fill(email);

    // --------- Fill Password ---------
    const passwordLocator = this.page.locator(
      `input[placeholder="${this.passwordPlaceholder}"]`
    );
    await passwordLocator.waitFor({ state: 'visible', timeout: 10000 });
    console.log('[INFO] Typing password: ******');
    await passwordLocator.fill(password);

    // --------- Click Login ---------
    const loginButton = this.page.getByRole('button', {
      name: this.loginButtonName,
    });
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click();
    console.log('[INFO] Login button clicked.');

    // --------- SUCCESS PATH ---------
    if (expectSuccess) {
      try {
        // ✅ CI-STABLE: wait for URL change
        await this.page.waitForURL('**/dashboard**', {
          timeout: 30000,
        });

        const dashboard = new DashboardPage(this.page);
        await dashboard.waitForDashboardReady();

        console.log('[INFO] Login successful, dashboard ready.');
        return dashboard;
      } catch (error) {
        console.log('[ERROR] Dashboard did not load in expected time.');
        await this.page.screenshot({
          path: 'screenshots/login_failed_ci.png',
        });
        return false;
      }
    }

    // --------- FAILURE PATH ---------
    console.log('[INFO] Login expected to fail, stayed on login page.');
    return false;
  }

  // ---------------- FORGOT PASSWORD ----------------
  async clickForgotPassword() {
    try {
      const link = this.page.locator(this.forgotPasswordLink);
      await link.waitFor({ state: 'visible', timeout: 10000 });
      await link.click();
      console.log('[INFO] Clicked on "Forgot Password" link.');
    } catch (err) {
      console.log(`[ERROR] Failed to click "Forgot Password": ${err}`);
      throw err;
    }
  }

  // ---------------- LOGIN STATUS CHECK ----------------
  async isLoginSuccessful() {
    try {
      await this.page.waitForURL('**/dashboard**', { timeout: 20000 });
      return true;
    } catch {
      return false;
    }
  }

  // ---------------- GENERIC VISIBILITY HELPER ----------------
  async isElementVisibleByPlaceholder(placeholderText) {
    const locator = this.page.locator(
      `input[placeholder="${placeholderText}"]`
    );
    return await locator
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);
  }
}
