// pages/content_video_page.js
import { BasePage } from './base_page.js';

export class VideosPage extends BasePage {
  constructor(page) {
    super(page);
    this.VIDEO_ROW_TEXT = 'Edit';       // Text present in video rows
    this.EMPTY_TEXT = 'No videos';      // Text for empty state
  }

  async _getIframe() {
    // Locate the iframe containing the videos table
    for (const frame of this.page.frames()) {
      if (frame.url().includes('contents/videos')) {
        console.log('[INFO] Using iframe:', frame.url());
        return frame;
      }
    }
    throw new Error('❌ Videos iframe not found');
  }

  async waitUntilVideosLoaded() {
    const frame = await this._getIframe();
    console.log('[INFO] Waiting for table or empty state...');

    // Wait for table container or empty description
    await frame.waitForFunction(() =>
      document.querySelector('div.ant-table-body') ||
      document.querySelector('div.ant-empty-description')
    , { timeout: 60000 });

    // Check empty state
    const emptyCount = await frame.evaluate(
      () => document.querySelectorAll('div.ant-empty-description').length
    );
    if (emptyCount > 0) {
      console.log('[INFO] Empty state detected. No videos to load.');
      return;
    }

    // Scroll until no new rows are rendered
    console.log('[INFO] Scrolling table to load all rows...');
    let previousCount = -1;
    let stableCycles = 0;

    while (stableCycles < 3) {
      const currentCount = await frame.evaluate(() =>
        Array.from(document.querySelectorAll('td'))
          .filter(td => td.innerText.includes('Edit')).length
      );

      if (currentCount === previousCount) {
        stableCycles++;
      } else {
        stableCycles = 0;
        previousCount = currentCount;
      }

      // Scroll table using JS
      await frame.evaluate(() => {
        const container = document.querySelector('div.ant-table-body');
        if (container) container.scrollTop = container.scrollHeight;
      });

      await frame.waitForTimeout(500); // wait 500ms for new rows
    }

    console.log(`[INFO] Finished scrolling. Total rows detected: ${previousCount}`);
  }

  async verifyVideosListLoaded() {
    const frame = await this._getIframe();
    await this.waitUntilVideosLoaded();

    const videoCount = await frame.evaluate(() =>
      Array.from(document.querySelectorAll('td'))
        .filter(td => td.innerText.includes('Edit')).length
    );

    const emptyCount = await frame.evaluate(() =>
      document.querySelectorAll('div.ant-empty-description').length
    );

    console.log(`[INFO] FINAL Video Count: ${videoCount}`);
    console.log(`[INFO] FINAL Empty Count: ${emptyCount}`);

    if (videoCount <= 0 && emptyCount <= 0) {
      throw new Error('❌ Videos page did not render any rows or empty state.');
    }

    if (videoCount > 0) {
      console.log(`[PASS] ${videoCount} videos successfully detected.`);
    } else {
      console.log('[INFO] No videos present – empty state shown.');
    }

    return true;
  }

  async isVideosPageLoaded() {
    // Shortcut for tests
    await this.waitUntilVideosLoaded();
    return true;
  }

  async isVideoListDisplayed() {
    return await this.verifyVideosListLoaded();
  }
}
