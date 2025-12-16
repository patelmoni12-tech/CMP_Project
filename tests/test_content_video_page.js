// tests/videos_page.test.js
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard_page.js';
import { MenuPage } from '../pages/menu_page.js';
import { RightPanelPage } from '../pages/right_panel_page.js';
import { VideosPage } from '../pages/content_video_page.js';

test('Videos page loads correctly', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  const menu = new MenuPage(page);
  const rightPanel = new RightPanelPage(page);
  const videos = new VideosPage(page);

  // 1. Dashboard loaded
  const isDashboardLoaded = await dashboard.isDashboardLoaded();
  expect(isDashboardLoaded).toBe(true);
  console.log('[PASS] Dashboard loaded.');

  // 2. Select workspace
  await dashboard.selectWorkspace(17);

  // 3. Select app
  await dashboard.selectApp(3);

  // 4. Navigate to VIDEOS page
  await menu.expandMenu('Contents');
  await menu.selectSubmenu('Videos');

  // ✅ FINAL ASSERT
  const isVideosLoaded = await videos.verifyVideosListLoaded();
  expect(isVideosLoaded).toBe(true);
  console.log('[PASS] Videos page loaded successfully.');
});
