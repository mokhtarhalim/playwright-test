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

  // Helper for all Lightning picklists (Type, Industry, Rating, Country, State)
  async selectPicklist(buttonLocator, value) {
    await buttonLocator.scrollIntoViewIfNeeded();
    await buttonLocator.focus();
    await buttonLocator.click({ force: true });
    await this.accountFormPage.page.waitForTimeout(500);

    const option = this.accountFormPage.page.getByRole("option", {
      name: value,
      exact: true,
    });
    const count = await option.count();

    if (count === 0) {
      console.log(`⚠️ No option "${value}" found — skipping`);
      await this.accountFormPage.page.keyboard.press("Escape");
      return;
    }

    await option.first().click();
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
    if (data.billingCountry)
      await this.selectPicklist(form.billingCountryInput, data.billingCountry);
    if (data.billingState)
      await this.selectPicklist(form.billingStateInput, data.billingState);
    if (data.billingPostal)
      await form.billingPostalInput.fill(data.billingPostal);

    // ── Shipping Address ─────────────────────────────────────────
    if (data.shippingStreet)
      await form.shippingStreetInput.fill(data.shippingStreet);
    if (data.shippingCity) await form.shippingCityInput.fill(data.shippingCity);
    if (data.shippingCountry)
      await this.selectPicklist(
        form.shippingCountryInput,
        data.shippingCountry,
      );
    if (data.shippingState)
      await this.selectPicklist(form.shippingStateInput, data.shippingState);
    if (data.shippingPostal)
      await form.shippingPostalInput.fill(data.shippingPostal);
  }

  // Submit the form
  async saveForm() {
    await this.accountFormPage.saveButton.click();
  }

  // Validate the record was created by checking the page header title
  async validateRecordCreated(expectedName) {
    await this.accountDetailPage.recordTitle.waitFor({
      state: "visible",
      timeout: 10000,
    });
    const actualName = await this.accountDetailPage.recordTitle.innerText();
    console.log(
      `🔍 Record title: expected="${expectedName}" | actual="${actualName}"`,
    );
    return actualName.trim();
  }

  // Validate a specific field value on the detail page
  async validateFieldValue(label, expectedValue) {
    // Debug: screenshot to see what's on the page
    await this.accountDetailPage.page.screenshot({
      path: `debug-detail-${label}.png`,
    });

    // Debug: print all text content on the page
    const allText = await this.accountDetailPage.page
      .locator("records-record-layout-item, force-record-layout-item")
      .all();
    console.log(`Found ${allText.length} layout items`);
    for (const item of allText) {
      const text = await item.innerText().catch(() => "N/A");
      console.log(` - "${text}"`);
    }

    const field = this.accountDetailPage.getFieldValue(label);
    await field.waitFor({ state: "visible", timeout: 10000 });
    const actualValue = await field.innerText();
    console.log(
      `🔍 [${label}]: expected="${expectedValue}" | actual="${actualValue}"`,
    );
    return actualValue.trim();
  }
}

export default AccountFormActions;
