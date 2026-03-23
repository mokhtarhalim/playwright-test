import { expect } from "@playwright/test";

class AccountSteps {
  constructor(topMenuActions, accountFormActions) {
    this.topMenuActions = topMenuActions;
    this.accountFormActions = accountFormActions;
  }

  // ── Create ─────────────────────────────────────────────────────
  async createNewAccount(data) {
    console.log(`Creating account: ${data.accountName}`);
    await this.topMenuActions.navigateTo("Accounts");
    await this.accountFormActions.openNewAccountForm();
    await this.accountFormActions.fillForm(data);
    await this.accountFormActions.saveForm();
    console.log(`Account form submitted`);
  }

  async validateAccountCreation(data) {
    await this.accountFormActions.accountDetailPage.recordTitle.waitFor({
      state: "visible",
      timeout: 10000,
    });

    const titleText =
      await this.accountFormActions.accountDetailPage.recordTitle.innerText();
    console.log(
      `Record title: expected="${data.accountName}" | actual="${titleText}"`,
    );

    expect(titleText.trim()).toBe(data.accountName);
    console.log("Account Name validated successfully");
    /*
    // 2. Validate fields using Salesforce API field names
    const fieldsToValidate = [
      { apiName: 'AccountNumber', value: data.accountNumber },
      { apiName: 'Site',          value: data.accountSite },
      { apiName: 'Phone',         value: data.phone },
      { apiName: 'Fax',           value: data.fax },
      { apiName: 'Website',       value: data.website },
      { apiName: 'Type',          value: data.type },
      { apiName: 'Industry',      value: data.industry },
      { apiName: 'Rating',        value: data.rating },
    ];
    for (const { apiName, value } of fieldsToValidate) {
      const actual = await this.accountFormActions.validateFieldValue(apiName, value);
      expect(actual).toContain(value);
    }
    console.log('All account fields validated on detail page');*/
  }

  // ── Edit ─────────────────────────────────────────────────────
  async editAccount(data) {
    console.log(`✏️ Editing account: ${data.accountName}`);
    await this.accountFormActions.openEditAccountForm();
    await this.accountFormActions.fillUpdateForm(data);
    await this.accountFormActions.saveFormAndReload();
    console.log(`✅ Account updated`);
  }

  async validateAccountUpdate(data) {
    await this.accountFormActions.accountDetailPage.recordTitle.waitFor({
      state: "visible",
      timeout: 10000,
    });
    const titleText =
      await this.accountFormActions.accountDetailPage.recordTitle.innerText();
    console.log(
      `Record title: expected="${data.accountName}" | actual="${titleText}"`,
    );
    expect(titleText.trim()).toBe(data.accountName);
    console.log("Account name validated after update");
  }

  // ── Delete ───────────────────────────────────────────────────
  async deleteAccount() {
    console.log("Deleting account...");
    await this.accountFormActions.deleteAccount();
    console.log("Account deletion confirmed");
  }

  async validateAccountDeletion() {
    await this.accountFormActions.validateDeletion();
    console.log("Account deletion validated via toast");
  }
}

export default AccountSteps;
