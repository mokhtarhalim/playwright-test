class AccountDetailPage {
  constructor(page) {
    this.page = page;

    // Get field value by label from the detail page
    this.getFieldValue = (label) =>
      page
        .locator("records-record-layout-item, force-record-layout-item")
        .filter({ hasText: label })
        .locator(
          "lightning-formatted-text, lightning-formatted-phone, lightning-formatted-url, span.slds-form-element__static",
        )
        .first();

    // Record title in the page header (primary field)
    this.recordTitle = page.locator(
      'lightning-formatted-text[slot="primaryField"]',
    );
  }
}

export default AccountDetailPage;
