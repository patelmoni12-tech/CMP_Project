// pages/base_page.js
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const ROOT_DIR = path.resolve();
const ENV_PATH = path.join(ROOT_DIR, '.env');

/**
 * Load .env ONLY if it exists (local execution)
 * In CI, environment variables come from GitHub Secrets
 */
if (fs.existsSync(ENV_PATH)) {
  dotenv.config({ path: ENV_PATH });
  console.log('Loaded .env file');
} else {
  console.log('.env file not found — using CI environment variables');
}

// Read environment variables (works for both local & CI)
export const BASE_URL = process.env.BASE_URL;
export const LOGIN_USERNAME = process.env.LOGIN_USERNAME;
export const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;

// Validate only what is absolutely required
if (!BASE_URL) {
  throw new Error(
    'BASE_URL is missing. Set it in .env (local) or GitHub Secrets (CI).'
  );
}

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  // ---------------- BASIC ACTIONS ----------------
  async click(selector) {
    await this.page.locator(selector).first().click();
  }

  async fill(selector, text) {
    await this.page.locator(selector).first().fill(text);
  }

  async getText(selector) {
    return await this.page.locator(selector).first().innerText();
  }

  // ---------------- STATE CHECKS ----------------
  async isVisible(selector) {
    return await this.page.locator(selector).first().isVisible();
  }

  async isEnabled(selector) {
    return await this.page.locator(selector).first().isEnabled();
  }

  // ---------------- WAITS ----------------
  async waitForElement(selector, timeout = 5000) {
    await this.page
      .locator(selector)
      .first()
      .waitFor({ state: 'visible', timeout });
  }

  async waitForElementVisible(selector, timeout = 10000) {
    try {
      await this.page
        .locator(selector)
        .first()
        .waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  // ---------------- ROLE / TEXT HELPERS ----------------
  async fillByPlaceholder(placeholderText, value) {
    await this.page.getByPlaceholder(placeholderText).fill(value);
  }

  async clickByRole(role, name) {
    await this.page.getByRole(role, { name }).click();
  }

  async clickByText(text) {
    await this.page.getByText(text).click();
  }

  // ---------------- NAVIGATION ----------------
  async goToBaseURL() {
    await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  }
}
