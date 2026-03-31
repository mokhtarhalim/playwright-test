class LeadsPage {
  constructor(page) {
    this.page = page;

    // New button in Leads list view
    this.newButton = page.locator(
      '//li[@data-target-selection-name="sfdc:StandardButton.Lead.New"]//a[@role="button"]',
    );

    // List view search input
    this.listViewSearchInput = page.locator(
      "//div[@part='input-container']//input[@part='input' and @type='search']",
    );

    // Lead list item by visible name
    this.leadListItem = (leadName) =>
      page
        .locator(
          `//a[contains(text(), "${leadName}") or @title="${leadName}"]`,
        )
        .first();

    // Alternative row selector for the lead name
    this.leadRow = (leadName) =>
      page
        .locator(
          `//tr[.//a[contains(text(), "${leadName}") or @title="${leadName}"]]`,
        )
        .first();
  }
}

export default LeadsPage;
