import { expect } from "@playwright/test";

class AccountSteps {
  constructor(topMenuActions, accountFormActions) {
    this.topMenuActions = topMenuActions;
    this.accountFormActions = accountFormActions;
  }

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
  }
}

export default AccountSteps;
