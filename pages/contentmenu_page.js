// pages/menu_page.js
import { BasePage } from './base_page.js';

export class MenuPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async expandMenu(menuName) {
    const locator = this.page.locator(
      `//span[contains(@class,'ant-menu-title-content') and contains(translate(normalize-space(), 'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'), '${menuName.toUpperCase()}')]`
    );
    await locator.click();
  }

  async selectSubmenu(submenuName) {
    const locator = this.page.locator(
      `//span[contains(@class,'ant-menu-title-content') and contains(translate(normalize-space(), 'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'), '${submenuName.toUpperCase()}')]`
    );
    await locator.waitFor({ timeout: 20000 });
    await locator.click();
  }
}
