import { defineConfig } from '@playwright/test';

const timestamp = new Date().toISOString().replace(/:/g, '-');

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  use: {
    headless: process.env.CI ? true : false,
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
