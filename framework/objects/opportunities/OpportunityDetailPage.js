class OpportunityDetailPage {
  constructor(page) {
    this.page = page;

    this.recordTitle = page.locator(
      '//lightning-formatted-text[@slot="primaryField"]',
    );
  }
}

export default OpportunityDetailPage;
