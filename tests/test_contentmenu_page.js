// tests/content_video.test.js
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard_page.js';
import { MenuPage } from '../pages/menu_page.js';
import { VideosPage } from '../pages/content_video_page.js';

test('Select VIDEOS submenu under CONTENTS', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  const menu = new MenuPage(page);
  const videos = new VideosPage(page);

  // 1 - Dashboard loaded
  const isLoaded = await dashboard.isDashboardLoaded();
  expect(isLoaded).toBe(true);

  // 2 - Select workspace
  await dashboard.selectWorkspace(17);

  // 3 - Select application
  await dashboard.selectApp(3);

  // 4 - Open CONTENTS menu
  await menu.expandMenu('CONTENTS');

  // 5 - Click VIDEOS submenu
  await menu.selectSubmenu('VIDEOS');

  // 6 - Validate Videos Page Loaded
  const isVideosPageLoaded = await videos.isVideosPageLoaded();
  expect(isVideosPageLoaded).toBe(true);

  // 7 - Validate video listing
  const isVideoListDisplayed = await videos.isVideoListDisplayed();
  expect(isVideoListDisplayed).toBe(true);

  console.log('✔ Videos page loaded and listing displayed successfully');
});
