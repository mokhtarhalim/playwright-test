class AccountsPage {
  constructor(page) {
    this.page = page;

    // List view
    this.newButton = page.getByRole("button", { name: "New" });

    // List view headers (for validation)
    this.listViewHeaders = page.locator("thead .slds-cell-fixed, thead th");
  }
}

export default AccountsPage;
