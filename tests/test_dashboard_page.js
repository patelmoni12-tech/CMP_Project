// tests/dashboard.test.js
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard_page.js';

test('Select workspace and app', async ({ page }) => {
  // Assuming the user is already logged in and on the dashboard page
  const dashboard = new DashboardPage(page);

  // Wait until dashboard is loaded
  const isLoaded = await dashboard.isDashboardLoaded();
  expect(isLoaded).toBe(true);
  console.log('[PASS] Dashboard loaded properly.');

  // Select workspace
  await dashboard.selectWorkspace(17);
  console.log('Workspace selection successful.');

  // Select app
  await dashboard.selectApp(3);
  console.log('App selection successful.');
});
