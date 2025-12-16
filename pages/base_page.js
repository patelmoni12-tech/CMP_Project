// pages/base_page.js
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const ROOT_DIR = path.resolve();
const ENV_PATH = path.join(ROOT_DIR, '.env');

if (!fs.existsSync(ENV_PATH)) {
  throw new Error(`.env file NOT FOUND at ${ENV_PATH}`);
}

dotenv.config({ path: ENV_PATH });

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  throw new Error('BASE_URL missing in .env file');
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
    await this.page.locator(selector).first().waitFor({ timeout });
  }

  async waitForElementVisible(selector, timeout = 10000) {
    try {
      await this.page.locator(selector).first().waitFor({ state: 'visible', timeout });
      return true;
    } catch (err) {
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
    await this.page.goto(BASE_URL);
  }
}
