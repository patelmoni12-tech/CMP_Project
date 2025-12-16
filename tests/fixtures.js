// tests/dashboard.fixture.js

import { test } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { LoginPage } from '../pages/login_page';
import { DashboardPage } from '../pages/dashboard_page';

// ------------------ ENV LOADING ------------------

const ROOT_DIR = path.resolve();
const ENV_PATH = path.join(ROOT_DIR, '.env');

console.log('✅ Loading .env from:', ENV_PATH);

if (!fs.existsSync(ENV_PATH)) {
  throw new Error(`.env file NOT FOUND at ${ENV_PATH}`);
}

dotenv.config({ path: ENV_PATH });

const EMAIL = process.env.LOGIN_EMAIL;
const PASSWORD = process.env.LOGIN_PASSWORD;
const BASE_URL = process.env.BASE_URL;

console.log('✅ EMAIL FROM ENV:', EMAIL);
console.log('✅ PASSWORD FROM ENV:', PASSWORD);
console.log('✅ BASE URL FROM ENV:', BASE_URL);

if (!EMAIL || !PASSWORD || !BASE_URL) {
  throw new Error('❌ LOGIN_EMAIL, LOGIN_PASSWORD, or BASE_URL missing in .env');
}

console.log('✅ .env file loaded successfully');

// ------------------ DASHBOARD FIXTURE ------------------

test.extend({
  loggedInDashboard: async ({ page }, use) => {
    await page.goto(BASE_URL);

    const loginPage = new LoginPage(page);
    await loginPage.login(EMAIL, PASSWORD);

    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});
