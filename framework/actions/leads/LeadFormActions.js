class LeadFormActions {
  constructor(leadsPage, leadFormPage, leadDetailPage, leadConvertPage) {
    this.leadsPage = leadsPage;
    this.leadFormPage = leadFormPage;
    this.leadDetailPage = leadDetailPage;
    this.leadConvertPage = leadConvertPage;
  }

  // Open the New Lead modal from the list view
  async openNewLeadForm() {
    await this.leadsPage.newButton.click();
    await this.leadFormPage.lastNameInput.waitFor({ state: "visible" });
  }

  // Search for a lead by name in the Leads list view
  async searchLeadByName(leadName) {
    console.log(`Searching for lead: ${leadName}`);
    await this.leadsPage.page.waitForTimeout(10000);

    const leadLink = this.leadsPage.leadListItem(leadName);
    let count = await leadLink.count();

    if (count > 0) {
      console.log(`Lead "${leadName}" found in current view`);
      await leadLink.click();
      await this.leadDetailPage.recordTitle.waitFor({ state: "visible", timeout: 10000 });
      return true;
    }

    console.log('Lead not in current view, trying list search...');
    const searchInput = this.leadsPage.listViewSearchInput;

    try {
      await searchInput.waitFor({ state: "visible", timeout: 10000 });
      await searchInput.click();
      await searchInput.fill(leadName);
      await searchInput.press("Enter");

      await this.leadsPage.page.waitForTimeout(10000);
      count = await leadLink.count();
      if (count > 0) {
        console.log(`Lead "${leadName}" found after search`);
        await leadLink.click();
        await this.leadDetailPage.recordTitle.waitFor({ state: "visible", timeout: 10000 });
        return true;
      }
    } catch (error) {
      console.log('List view search failed:', error.message);
    }

    console.log(`Lead "${leadName}" not found`);
    return false;
  }

  // ── Edit ─────────────────────────────────────────────────────
  async openEditLeadForm() {
    await this.leadDetailPage.actionsMenuButton.click();
    await this.leadDetailPage.editButton.waitFor({ state: "visible" });
    await this.leadDetailPage.editButton.click();
    await this.leadFormPage.lastNameInput.waitFor({ state: "visible" });
  }

  // ── Delete ───────────────────────────────────────────────────
  async deleteLead() {
    await this.leadDetailPage.actionsMenuButton.click();
    await this.leadDetailPage.deleteButton.waitFor({ state: 'visible' });
    await this.leadDetailPage.deleteButton.click();

    await this.leadDetailPage.deleteConfirmDialog.waitFor({ state: 'visible' });
    await this.leadDetailPage.deleteConfirmButton.click();
    console.log('Delete confirmed');
  }

  async validateDeletion() {
    const deletionToast = this.leadDetailPage.toastDeletion;
    const fallbackToast = this.leadDetailPage.toastStatus;
    const effectiveToast = (await deletionToast.count()) > 0 ? deletionToast : fallbackToast;

    await effectiveToast.waitFor({ state: 'visible', timeout: 10000 });
    const text = (await effectiveToast.innerText()).trim();
    if (!text) {
      throw new Error('Deletion toast appeared but had empty text');
    }

    console.log('Toast deletion message displayed after lead deletion');
  }

  // ── Convert ──────────────────────────────────────────────────
  async openConvertLeadModal() {
    await this.leadDetailPage.actionsMenuButton.click();
    await this.leadDetailPage.convertMenuItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.leadDetailPage.convertMenuItem.click();
    await this.leadConvertPage.convertButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  async convertLead({ accountName, opportunityName, contactRole, createOpportunity = true }) {
    await this.openConvertLeadModal();

    const dialog = this.leadConvertPage.dialog;
    if (accountName && (await this.leadConvertPage.accountNameInput.count()) > 0) {
      await this.leadConvertPage.accountNameInput.fill(accountName);
      await this.leadFormPage.page.keyboard.press('Enter');
    }

    if (opportunityName && (await this.leadConvertPage.opportunityNameInput.count()) > 0) {
      await this.leadConvertPage.opportunityNameInput.fill(opportunityName);
    }

    if (contactRole && (await this.leadConvertPage.contactRoleButton.count()) > 0) {
      await this.selectPicklist(this.leadConvertPage.contactRoleButton, contactRole);
    }

    if (!createOpportunity && (await this.leadConvertPage.createOpportunityCheckbox.count()) > 0) {
      const checked = await this.leadConvertPage.createOpportunityCheckbox.isChecked();
      if (checked) {
        await this.leadConvertPage.createOpportunityCheckbox.click();
      }
    }

    // Allow Salesforce auto-populated convert fields to settle before submitting.
    await this.leadFormPage.page.waitForTimeout(1000);
    await this.leadConvertPage.convertButton.click();
    await this.leadConvertPage.conversionSuccessTitle.waitFor({
      state: 'visible',
      timeout: 20000,
    });
    await this.leadConvertPage.goToLeadsButton.waitFor({
      state: 'visible',
      timeout: 20000,
    });
    await this.leadConvertPage.goToLeadsButton.click();
    console.log('Lead conversion completed and navigated to leads');
  }

  // ── Shared ───────────────────────────────────────────────────
  async selectPicklist(buttonLocator, value) {
    await buttonLocator.scrollIntoViewIfNeeded();
    await buttonLocator.focus();
    await buttonLocator.click({ force: true });
    await this.leadFormPage.page.waitForTimeout(500);

    const option = this.leadFormPage.page.getByRole("option", {
      name: value,
      exact: true,
    });
    const count = await option.count();

    if (count === 0) {
      console.log(`No option "${value}" found — skipping`);
      await this.leadFormPage.page.keyboard.press("Escape");
      return;
    }

    await option.first().click();
  }

  async fillForm(data) {
    const form = this.leadFormPage;
    if (data.lastName) await form.lastNameInput.fill(data.lastName);
    if (data.company) await form.companyInput.fill(data.company);
    if (data.firstName) await form.firstNameInput.fill(data.firstName);
    if (data.title) await form.titleInput.fill(data.title);
    if (data.email) await form.emailInput.fill(data.email);
    if (data.phone) await form.phoneInput.fill(data.phone);
    if (data.mobile) await form.mobileInput.fill(data.mobile);
    if (data.website) await form.websiteInput.fill(data.website);

    if (data.industry) await this.selectPicklist(form.industryButton, data.industry);
    if (data.rating) await this.selectPicklist(form.ratingButton, data.rating);
    if (data.leadSource) await this.selectPicklist(form.leadSourceButton, data.leadSource);
    if (data.leadStatus) await this.selectPicklist(form.leadStatusButton, data.leadStatus);

    if (data.mailingStreet) await form.mailingStreetInput.fill(data.mailingStreet);
    if (data.mailingCity) await form.mailingCityInput.fill(data.mailingCity);
    if (data.mailingState) await this.selectPicklist(form.mailingStateInput, data.mailingState);
    if (data.mailingPostal) await form.mailingPostalInput.fill(data.mailingPostal);
    if (data.mailingCountry) await this.selectPicklist(form.mailingCountryInput, data.mailingCountry);
  }

  async clearAndFill(locator, value) {
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
    (await locator.selectAll?.()) ?? (await locator.press("Control+a"));
    await locator.fill(value);
  }

  async fillUpdateForm(data) {
    const form = this.leadFormPage;
    if (data.lastName) await this.clearAndFill(form.lastNameInput, data.lastName);
    if (data.company) await this.clearAndFill(form.companyInput, data.company);
    if (data.phone) await this.clearAndFill(form.phoneInput, data.phone);
    if (data.email) await this.clearAndFill(form.emailInput, data.email);
    if (data.website) await this.clearAndFill(form.websiteInput, data.website);
    if (data.industry) await this.selectPicklist(form.industryButton, data.industry);
    if (data.rating) await this.selectPicklist(form.ratingButton, data.rating);
  }

  async saveForm() {
    await this.leadFormPage.saveButton.click();
    console.log("Save button clicked");
  }

  async saveFormAndReload() {
    await this.leadFormPage.saveButton.click();
    console.log("Save button clicked");
    await this.leadFormPage.page.waitForTimeout(1000);
    await this.leadFormPage.page.reload({ waitUntil: "domcontentloaded" });
    console.log("Page reloaded");
  }

  async validateRecordCreated(expectedName) {
    await this.leadDetailPage.recordTitle.waitFor({ state: "visible", timeout: 10000 });
    const actualName = await this.leadDetailPage.recordTitle.innerText();
    console.log(`Record title: expected="${expectedName}" | actual="${actualName}"`);
    return actualName.trim();
  }

  async validateFieldValue(apiName, expectedValue) {
    const field = this.leadDetailPage.getFieldValue(apiName);
    await field.waitFor({ state: "visible", timeout: 10000 });
    const actualValue = await field.innerText();
    console.log(`[${apiName}]: expected="${expectedValue}" | actual="${actualValue}"`);
    return actualValue.trim();
  }
}

export default LeadFormActions;
