import 'dotenv/config';             // Load .env automatically
import { defineConfig } from '@playwright/test';

const timestamp = new Date().toISOString().replace(/:/g, '-');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,

  use: {
    baseURL: BASE_URL,            // Base URL for page.goto('/')
    headless: process.env.CI === 'true',   // Headless in CI, headed locally
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: `reports/html-report-${timestamp}`, open: 'never' }],
  ],
});
