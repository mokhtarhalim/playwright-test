// Locators for the Account detail page (after creation/edition)
class AccountDetailPage {
  constructor(page) {
    this.page = page;

    // get any field value by its label on the detail page
    this.getFieldValue = (label) =>
      page
        .locator("records-record-layout-item, force-record-layout-item")
        .filter({ hasText: label })
        .locator(
          ".slds-form-element__static, lightning-formatted-text, lightning-formatted-phone, lightning-formatted-url",
        )
        .first();

    // Toast
    this.toastSuccess = page.locator(".slds-theme_success");
    this.toastMessage = page.locator(".toastMessage");
  }
}

export default AccountDetailPage;
