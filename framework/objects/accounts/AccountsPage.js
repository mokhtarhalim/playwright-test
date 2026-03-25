class AccountsPage {
  constructor(page) {
    this.page = page;

    // New button
    this.newButton = page.locator(
      '//li[@data-target-selection-name="sfdc:StandardButton.Account.New"]//a[@role="button"]',
    );

    // List view search input
    this.listViewSearchInput = page.locator(
      "//div[@part='input-container']//input[@part='input' and @type='search']",
    );

    // Account list items - dynamic locator for account names in list view
    this.accountListItem = (accountName) =>
      page
        .locator(
          `//a[contains(text(), "${accountName}") or @title="${accountName}"]`,
        )
        .first();

    // Alternative: Account name in table row
    this.accountRow = (accountName) =>
      page
        .locator(
          `//tr[.//a[contains(text(), "${accountName}") or @title="${accountName}"]]`,
        )
        .first();
  }
}

export default AccountsPage;
