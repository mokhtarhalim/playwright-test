class ContactsPage {
  constructor(page) {
    this.page = page;

    this.listViewSearchInput = page.locator(
      "//div[@part='input-container']//input[@part='input' and @type='search']",
    );

    this.contactListItem = (contactName) =>
      page
        .locator(
          `//a[contains(text(), "${contactName}") or @title="${contactName}"]`,
        )
        .first();
  }
}

export default ContactsPage;
