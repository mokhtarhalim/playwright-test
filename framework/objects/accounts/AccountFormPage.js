// All locators for the Account creation / edition modal form
class AccountFormPage {
  constructor(page) {
    this.page = page;

    // ── Basic Info ──────────────────────────────────────────────
    this.accountNameInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.Name"]//input[@name="Name"]',
    );
    this.accountNumberInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.AccountNumber"]//input[@name="AccountNumber"]',
    );
    this.accountSiteInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.Site"]//input[@name="Site"]',
    );
    this.phoneInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.Phone"]//input[@name="Phone"]',
    );
    this.faxInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.Fax"]//input[@name="Fax"]',
    );
    this.websiteInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.Website"]//input[@name="Website"]',
    );

    // ── Picklists ───────────────────────────────────────────────
    this.typeButton = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.Type"]//button[@role="combobox"]',
    );
    this.industryButton = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.Industry"]//button[@role="combobox"]',
    );
    this.ratingButton = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.Rating"]//button[@role="combobox"]',
    );

    // ── Billing Address ─────────────────────────────────────────
    this.billingStreetInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.BillingAddress"]//textarea[@name="street"]',
    );
    this.billingCityInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.BillingAddress"]//input[@name="city"]',
    );
    this.billingStateInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.BillingAddress"]//input[@role="combobox" and @name="province"]',
    );
    this.billingPostalInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.BillingAddress"]//input[@name="postalCode"]',
    );
    this.billingCountryInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.BillingAddress"]//input[@role="combobox" and @name="country"]',
    );

    // ── Shipping Address ────────────────────────────────────────
    this.shippingStreetInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.ShippingAddress"]//textarea[@name="street"]',
    );
    this.shippingCityInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.ShippingAddress"]//input[@name="city"]',
    );
    this.shippingStateInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.ShippingAddress"]//input[@role="combobox" and @name="province"]',
    );
    this.shippingPostalInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.ShippingAddress"]//input[@name="postalCode"]',
    );
    this.shippingCountryInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Account.ShippingAddress"]//input[@role="combobox" and @name="country"]',
    );

    // ── Form Actions ────────────────────────────────────────────
    this.saveButton = page.locator(
      '//records-form-footer//button[@name="SaveEdit"]',
    );
    this.cancelButton = page.locator(
      '//records-form-footer//button[@name="CancelEdit"]',
    );
  }
}

export default AccountFormPage;
