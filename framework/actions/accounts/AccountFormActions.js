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

  // ── Edit ─────────────────────────────────────────────────────
  // Open edit mode from the detail page
  async openEditAccountForm() {
    await this.accountDetailPage.actionsMenuButton.click();
    await this.accountDetailPage.editButton.waitFor({ state: "visible" });
    await this.accountDetailPage.editButton.click();
    await this.accountFormPage.accountNameInput.waitFor({ state: "visible" });
  }

  // ── Delete ───────────────────────────────────────────────────
  async deleteAccount() {
    // Open actions menu and click Delete
    await this.accountDetailPage.actionsMenuButton.click();
    await this.accountDetailPage.deleteButton.waitFor({ state: 'visible' });
    await this.accountDetailPage.deleteButton.click();

    // Wait for confirmation dialog and confirm
    await this.accountDetailPage.deleteConfirmDialog.waitFor({ state: 'visible' });
    await this.accountDetailPage.deleteConfirmButton.click();
    console.log('Delete confirmed');
  }

  async validateDeletion() {
    // Validate toast deletion appears in either English or French (i18n strategy)
    const deletionToast = this.accountDetailPage.toastDeletion;
    const fallbackToast = this.accountDetailPage.toastStatus;

    const effectiveToast = (await deletionToast.count()) > 0 ? deletionToast : fallbackToast;

    await effectiveToast.waitFor({ state: 'visible', timeout: 15000 });

    const text = (await effectiveToast.innerText()).trim();
    if (!text) {
      throw new Error('Deletion toast appeared but had empty text');
    }

    console.log('Toast deletion message displayed after account deletion');
  }

  // ── Shared ───────────────────────────────────────────────────
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
      console.log(`No option "${value}" found — skipping`);
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

  // Clear a field then fill with new value (used for updates)
  async clearAndFill(locator, value) {
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
    (await locator.selectAll?.()) ?? (await locator.press("Control+a"));
    await locator.fill(value);
  }

  // Fill only the fields being updated (clears before filling)
  async fillUpdateForm(data) {
    const form = this.accountFormPage;
    if (data.accountName)
      await this.clearAndFill(form.accountNameInput, data.accountName);
    if (data.phone) await this.clearAndFill(form.phoneInput, data.phone);
    if (data.website) await this.clearAndFill(form.websiteInput, data.website);
    if (data.industry)
      await this.selectPicklist(form.industryButton, data.industry);
  }

  // Submit the form (creation)
  async saveForm() {
    await this.accountFormPage.saveButton.click();
    console.log("Save button clicked");
  }

  // Submit the form and reload (edit)
  async saveFormAndReload() {
    await this.accountFormPage.saveButton.click();
    console.log("Save button clicked");
    await this.accountFormPage.page.waitForTimeout(1000);
    await this.accountFormPage.page.reload({ waitUntil: "domcontentloaded" });
    console.log("Page reloaded");
  }

  // Validate the record was created by checking the page header title
  async validateRecordCreated(expectedName) {
    await this.accountDetailPage.recordTitle.waitFor({
      state: "visible",
      timeout: 10000,
    });
    const actualName = await this.accountDetailPage.recordTitle.innerText();
    console.log(
      `Record title: expected="${expectedName}" | actual="${actualName}"`,
    );
    return actualName.trim();
  }

  // Validate a specific field value on the detail page using Salesforce API field name
  async validateFieldValue(apiName, expectedValue) {
    const field = this.accountDetailPage.getFieldValue(apiName);
    await field.waitFor({ state: "visible", timeout: 10000 });
    const actualValue = await field.innerText();
    console.log(
      `[${apiName}]: expected="${expectedValue}" | actual="${actualValue}"`,
    );

    return actualValue.trim();
  }
}

export default AccountFormActions;
