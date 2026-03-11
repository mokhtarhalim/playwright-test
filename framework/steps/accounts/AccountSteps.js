import { expect } from '@playwright/test';

class AccountSteps {
  constructor(topMenuActions, accountFormActions) {
    this.topMenuActions    = topMenuActions;
    this.accountFormActions = accountFormActions;
  }

  // Full flow: navigate → open form → fill → save
  async createNewAccount(data) {
    console.log(`Creating account: ${data.accountName}`);

    await this.topMenuActions.navigateTo('Accounts');
    await this.accountFormActions.openNewAccountForm();
    await this.accountFormActions.fillForm(data);
    await this.accountFormActions.saveForm();

    console.log(`Account form submitted`);
  }

  // Validate toast + all key fields on the detail page
  async validateAccountCreation(data) {
    // 1. Toast success
    await this.accountFormActions.validateToastSuccess();

    // 2. Detail page field values
    const fieldsToValidate = [
      { label: 'Account Name',   value: data.accountName },
      { label: 'Account Number', value: data.accountNumber },
      { label: 'Account Site',   value: data.accountSite },
      { label: 'Phone',          value: data.phone },
      { label: 'Fax',            value: data.fax },
      { label: 'Website',        value: data.website },
      { label: 'Type',           value: data.type },
      { label: 'Industry',       value: data.industry },
      { label: 'Rating',         value: data.rating },
    ];

    for (const { label, value } of fieldsToValidate) {
      const actual = await this.accountFormActions.validateFieldValue(label, value);
      expect(actual).toContain(value);
    }

    console.log('All account fields validated on detail page');
  }
}

export default AccountSteps;