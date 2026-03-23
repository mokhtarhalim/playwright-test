class MFAPage {
  constructor(page) {
    this.page = page;

    this.mfaInput = page.locator('//div[@class="formArea"]//input[@name="tc"]');
    this.verifyButton = page.locator(
      '//input[@name="save" and @type="submit"]',
    );
  }
}

export default MFAPage;
