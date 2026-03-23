class AccountsPage {
  constructor(page) {
    this.page = page;

    // New button
    this.newButton = page.locator('//li[@data-target-selection-name="sfdc:StandardButton.Account.New"]//a[@role="button"]');
  }
}

export default AccountsPage;
