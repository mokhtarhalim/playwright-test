// All locators for the Lead creation / edition modal form
class LeadFormPage {
  constructor(page) {
    this.page = page;

    // ── Basic Info ──────────────────────────────────────────────
    this.lastNameInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Name"]//input[@name="lastName"]',
    );
    this.companyInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Company"]//input[@name="Company"]',
    );
    this.firstNameInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Name"]//input[@name="firstName"]',
    );
    this.titleInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Title"]//input[@name="Title"]',
    );
    this.emailInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Email"]//input[@name="Email"]',
    );
    this.phoneInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Phone"]//input[@name="Phone"]',
    );
    this.mobileInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.MobilePhone"]//input[@name="MobilePhone"]',
    );
    this.websiteInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Website"]//input[@name="Website"]',
    );

    // ── Picklists ───────────────────────────────────────────────
    this.industryButton = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Industry"]//button[@role="combobox"]',
    );
    this.ratingButton = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Rating"]//button[@role="combobox"]',
    );
    this.leadSourceButton = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.LeadSource"]//button[@role="combobox"]',
    );
    this.leadStatusButton = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Status"]//button[@role="combobox"]',
    );

    // ── Address ─────────────────────────────────────────────────
    this.mailingCountryInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Address"]//input[@role="combobox" and @name="country"]',
    );
    this.mailingStreetInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Address"]//textarea[@name="street"]',
    );
    this.mailingCityInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Address"]//input[@name="city"]',
    );
    this.mailingStateInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Address"]//input[@role="combobox" and @name="province"]',
    );
    this.mailingPostalInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.Address"]//input[@name="postalCode"]',
    );

    // ── Form Actions ───────────────────────────────────────────
    this.saveButton = page.locator(
      '//records-form-footer//button[@name="SaveEdit"]',
    );
    this.cancelButton = page.locator(
      '//records-form-footer//button[@name="CancelEdit"]',
    );
  }
}

export default LeadFormPage;
