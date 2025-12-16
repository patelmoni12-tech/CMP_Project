// pages/right_panel_page.js
import { BasePage } from './base_page.js';

export class RightPanelPage extends BasePage {
  constructor(page) {
    super(page);

    this.FORM_SELECTOR = "//main[contains(@class,'ant-layout-content')]";
    this.PAGE_HEADER = "//div[contains(@class,'page-header')]//h1";
    this.BREADCRUMB = "//li[contains(@class,'ant-breadcrumb')]";
    this.ADD_BUTTON = "//button[contains(@class,'add-btn') or contains(., 'Add')]";
  }

  async waitForForm() {
    console.log('[INFO] Waiting for right panel form...');
    await this.waitForElement(this.FORM_SELECTOR, 15000);
  }

  async isFormDisplayed() {
    await this.waitForElement(this.FORM_SELECTOR);
    return true;
  }

  async verifyPageHeader(expectedHeader = null) {
    await this.waitForElement(this.PAGE_HEADER);
    const headerText = await this.page.locator(this.PAGE_HEADER).innerText();
    if (expectedHeader) {
      if (!headerText.includes(expectedHeader)) {
        throw new Error(`[FAIL] Expected header '${expectedHeader}', got '${headerText}'`);
      }
    }
    return headerText;
  }

  async verifyBreadcrumb(expected) {
    const breadcrumb = await this.page.locator(this.BREADCRUMB).innerText();
    if (!breadcrumb.includes(expected)) {
      throw new Error(`[FAIL] Breadcrumb mismatch. Expected '${expected}' but got '${breadcrumb}'`);
    }
  }

  async verifyAddButton() {
    await this.waitForElement(this.ADD_BUTTON);
    const isVisible = await this.page.locator(this.ADD_BUTTON).isVisible();
    if (!isVisible) {
      throw new Error('[FAIL] Add button is not visible.');
    }
  }
}
