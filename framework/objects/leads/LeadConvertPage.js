// Locators for the Lead conversion modal dialog
class LeadConvertPage {
  constructor(page) {
    this.page = page;

    this.dialog = page.locator('//dialog[@role="dialog"] | //div[@role="dialog"]');

    this.accountNameInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.AccountId"]//input[@type="text"] | //input[@name="AccountName"]',
    );

    this.opportunityNameInput = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.OpportunityName"]//input[@type="text"] | //input[@name="OpportunityName"]',
    );

    this.contactRoleButton = page.locator(
      '//div[@data-target-selection-name="sfdc:RecordField.Lead.ContactRole"]//button[@role="combobox"] | //button[contains(@name,"ContactRole")]',
    );

    this.createOpportunityCheckbox = page.locator(
      '//div[@role="dialog"]//input[@type="checkbox"]',
    );

    this.convertButton = page.locator(
      'div[role="dialog"] button.slds-button_brand',
    );

    this.cancelButton = page.locator(
      'div[role="dialog"] button.slds-button_neutral',
    );

    this.conversionSuccessTitle = page.locator(
      '//div[@role="dialog"]//div[contains(@class,"title")]//h2[@tabindex="-1"]',
    );

    this.goToLeadsButton = this.conversionSuccessTitle.locator(
      'xpath=ancestor::div[@role="dialog"]//div[contains(@class,"modal-footer")]//button[contains(@class,"slds-button_brand")]',
    );
  }
}

export default LeadConvertPage;
