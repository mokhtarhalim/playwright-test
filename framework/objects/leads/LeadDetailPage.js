// Locators for the Lead detail page
class LeadDetailPage {
  constructor(page) {
    this.page = page;

    // ── Record Title (page header) ───────────────────────────────
    this.recordTitle = page.locator(
      '//lightning-formatted-name[@slot="primaryField"]',
    );

    // ── Actions menu ─────────────────────────────────────────────
    this.actionsMenuButton = page.locator(
      '//lightning-button-menu[contains(@data-target-reveals,"sfdc:StandardButton.Lead.Edit")]//button',
    );
    this.editButton = page.locator(
      '//lightning-menu-item[@data-target-selection-name="sfdc:StandardButton.Lead.Edit"]//a[@role="menuitem"]',
    );
    this.deleteButton = page.locator(
      '//lightning-menu-item[@data-target-selection-name="sfdc:StandardButton.Lead.Delete"]//a[@role="menuitem"]',
    );
    this.convertMenuItem = page.locator(
      '//lightning-menu-item[@data-target-selection-name="sfdc:StandardButton.Lead.Convert"]//a[@role="menuitem"]',
    );

    // ── Delete confirmation dialog ───────────────────────────────
    this.deleteConfirmDialog = page
      .locator('//div[@role="dialog" and @aria-modal="true"]')
      .last();
    this.deleteConfirmButton = page
      .locator('//div[@role="dialog" and @aria-modal="true"]')
      .last()
      .locator('//div[contains(@class,"modal-footer")]//button[last()]');
    this.deleteConfirmCancelButton = page
      .locator('//div[@role="dialog" and @aria-modal="true"]')
      .last()
      .locator('//div[contains(@class,"modal-footer")]//button[1]');

    // ── Toast (success/notification area) ───────────────────────
    this.toastSuccess = page
      .locator(
        "//div[contains(@class,'slds-notify_container')]//div[contains(@class,'slds-notify_toast') and contains(@class,'slds-theme_success')]",
      )
      .first();
    this.toastDeletion = page.locator('//*/div[@data-key="success"]');
    this.toastStatus = page
      .locator("//*[@role='status' or @role='alert']")
      .filter({
        has: page.locator(
          "//*[contains(@class,'slds-notify') or contains(@class,'toast') or contains(@class,'notification')]",
        ),
      })
      .first();

    // ── Field values by Salesforce API field name ───────────────
    this.getFieldValue = (fieldApiName) =>
      page
        .locator(
          [
            `//div[@data-target-selection-name="sfdc:RecordField.Lead.${fieldApiName}"]//lightning-formatted-text[@data-output-element-id="output-field"]`,
            `//div[@data-target-selection-name="sfdc:RecordField.Lead.${fieldApiName}"]//lightning-formatted-phone[@data-output-element-id="output-field"]`,
            `//div[@data-target-selection-name="sfdc:RecordField.Lead.${fieldApiName}"]//lightning-formatted-url[@data-output-element-id="output-field"]`,
            `//div[@data-target-selection-name="sfdc:RecordField.Lead.${fieldApiName}"]//span[@data-output-element-id="output-field"]`,
          ].join(" | "),
        )
        .first();
  }
}

export default LeadDetailPage;
