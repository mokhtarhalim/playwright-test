class AccountFormActions {
  constructor(accountsPage, accountFormPage, accountDetailPage) {
    this.accountsPage = accountsPage;
    this.accountFormPage = accountFormPage;
    this.accountDetailPage = accountDetailPage;
  }

  // Open the New Account modal from the list view
  async openNewAccountForm() {
    await this.accountsPage.newButton.click();
    await this.accountFormPage.accountNameInput.waitFor({ state: "visible" });
  }

  // Helper to interact with any Salesforce Lightning picklist
  /*async selectPicklist(buttonLocator, value) {
    await buttonLocator.click();
    await this.accountFormPage.page
      .getByRole("option", { name: value, exact: true })
      .click();
  }*/

  async selectPicklist(buttonLocator, value) {
    await buttonLocator.scrollIntoViewIfNeeded();
    await buttonLocator.focus();
    await buttonLocator.click();
    await this.accountFormPage.page.waitForTimeout(1000);

    await this.accountFormPage.page
      .getByRole("option", { name: value, exact: true })
      .click();
  }

  // Fill all form fields from a data object (only fills fields that are provided)
  async fillForm(data) {
    const form = this.accountFormPage;

    // ── Basic Info ──────────────────────────────────────────────
    if (data.accountName) await form.accountNameInput.fill(data.accountName);
    if (data.accountNumber)
      await form.accountNumberInput.fill(data.accountNumber);
    if (data.accountSite) await form.accountSiteInput.fill(data.accountSite);
    if (data.phone) await form.phoneInput.fill(data.phone);
    if (data.fax) await form.faxInput.fill(data.fax);
    if (data.website) await form.websiteInput.fill(data.website);

    // ── Picklists ────────────────────────────────────────────────
    if (data.type) await this.selectPicklist(form.typeButton, data.type);
    if (data.industry)
      await this.selectPicklist(form.industryButton, data.industry);
    if (data.rating) await this.selectPicklist(form.ratingButton, data.rating);

    // ── Billing Address ──────────────────────────────────────────
    if (data.billingStreet)
      await form.billingStreetInput.fill(data.billingStreet);
    if (data.billingCity) await form.billingCityInput.fill(data.billingCity);
    if (data.billingState) await form.billingStateInput.fill(data.billingState);
    if (data.billingPostal)
      await form.billingPostalInput.fill(data.billingPostal);
    if (data.billingCountry)
      await form.billingCountryInput.fill(data.billingCountry);

    // ── Shipping Address ─────────────────────────────────────────
    if (data.shippingStreet)
      await form.shippingStreetInput.fill(data.shippingStreet);
    if (data.shippingCity) await form.shippingCityInput.fill(data.shippingCity);
    if (data.shippingState)
      await form.shippingStateInput.fill(data.shippingState);
    if (data.shippingPostal)
      await form.shippingPostalInput.fill(data.shippingPostal);
    if (data.shippingCountry)
      await form.shippingCountryInput.fill(data.shippingCountry);
  }

  // Submit the form
  async saveForm() {
    await this.accountFormPage.saveButton.click();
  }

  // Validate toast success message appears
  async validateToastSuccess() {
    await this.accountDetailPage.toastSuccess.waitFor({
      state: "visible",
      timeout: 10000,
    });
    console.log("Toast success message displayed");
  }

  // Validate a specific field value on the detail page
  async validateFieldValue(label, expectedValue) {
    const field = this.accountDetailPage.getFieldValue(label);
    await field.waitFor({ state: "visible", timeout: 10000 });
    const actualValue = await field.innerText();
    console.log(
      `[${label}]: expected="${expectedValue}" | actual="${actualValue}"`,
    );
    return actualValue.trim();
  }
}

export default AccountFormActions;
