// pages/dashboard_page.js
import { BasePage } from './base_page.js';

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    this.WORKSPACE_DROPDOWN = "//span[@aria-label='search']//*[name()='svg']";
    this.APP_DROPDOWN =
      "//div[contains(@class,'header-select') and contains(@class,'max-w-45') and not(contains(@class,'workspace-select'))]//span[contains(@class,'ant-select-selection-item')]";

    this.DROPDOWN_PANEL =
      "//div[contains(@class,'ant-select-dropdown') and not(contains(@class,'ant-select-dropdown-hidden'))]";
    this.DROPDOWN_OPTION = 'div.ant-select-item-option-content';
  }

  async waitForDashboardReady() {
    await this.waitForElementVisible(this.WORKSPACE_DROPDOWN);
  }

  async isDashboardLoaded() {
    try {
      await this.waitForElementVisible(this.WORKSPACE_DROPDOWN, 10000);
      return true;
    } catch {
      return false;
    }
  }

  async selectFromDropdown(dropdownLocator, index) {
    console.log(`Clicking dropdown: ${dropdownLocator}`);
    await this.page.locator(dropdownLocator).first().click();
    await this.page.waitForTimeout(300);

    const panel = this.page.locator(this.DROPDOWN_PANEL);
    await panel.waitFor({ state: 'visible', timeout: 7000 });

    const items = panel.locator(this.DROPDOWN_OPTION);
    index = parseInt(index);

    for (let i = 0; i < 40; i++) {
      const count = await items.count();
      if (count > index) {
        const item = items.nth(index);
        if (await item.isVisible()) {
          console.log('Clicking:', await item.innerText());
          await item.click({ force: true });
          await this.page.waitForTimeout(500);
          return;
        }
      }

      // scroll dropdown
      const panelHandle = await panel.elementHandle();
      await this.page.evaluate((el) => el.scrollBy(0, 250), panelHandle);
      await this.page.waitForTimeout(200);
    }

    throw new Error(`Option ${index} not found`);
  }

  async selectWorkspace(index) {
    await this.selectFromDropdown(this.WORKSPACE_DROPDOWN, index);
  }

  async selectApp(index) {
    // Wait until App dropdown is visible after workspace selection
    await this.waitForElementVisible(this.APP_DROPDOWN, 5000);
    await this.selectFromDropdown(this.APP_DROPDOWN, index);
  }
}
