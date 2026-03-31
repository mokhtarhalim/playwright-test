class ContactDetailPage {
  constructor(page) {
    this.page = page;

    this.recordTitle = page.locator(
      '//lightning-formatted-name[@slot="primaryField"]',
    );
  }
}

export default ContactDetailPage;
