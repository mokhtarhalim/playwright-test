class OpportunitiesPage {
  constructor(page) {
    this.page = page;

    this.listViewSearchInput = page.locator(
      "//div[@part='input-container']//input[@part='input' and @type='search']",
    );

    this.opportunityListItem = (opportunityName) =>
      page
        .locator(
          `//a[contains(text(), "${opportunityName}") or @title="${opportunityName}"]`,
        )
        .first();
  }
}

export default OpportunitiesPage;
