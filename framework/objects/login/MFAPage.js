class MFAPage {

  constructor(page) {
    this.page = page;

    this.mfaInput = page.getByLabel('Verification Code');
    this.verifyButton = page.locator('[name="save"]');
  }

}

export default MFAPage;