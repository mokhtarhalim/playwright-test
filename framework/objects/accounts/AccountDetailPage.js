// Locators for the Account detail page
class AccountDetailPage {
  constructor(page) {
    this.page = page;

    // ── Record Title (page header) ───────────────────────────────
    this.recordTitle = page.locator(
      '//lightning-formatted-text[@slot="primaryField"]',
    );

    // ── Actions menu ─────────────────────────────────────────────
    this.actionsMenuButton = page.locator(
      '//lightning-button-menu[contains(@data-target-reveals,"sfdc:StandardButton.Account.Edit")]//button',
    );
    this.editButton = page.locator(
      '//lightning-menu-item[@data-target-selection-name="sfdc:StandardButton.Account.Edit"]//a[@role="menuitem"]',
    );
    this.deleteButton = page.locator(
      '//lightning-menu-item[@data-target-selection-name="sfdc:StandardButton.Account.Delete"]//a[@role="menuitem"]',
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

    // ── Toast (targets the standard Lightning success/notification area) ──
    this.toastSuccess = page
      .locator("//div[contains(@class,'slds-notify_container')]//div[contains(@class,'slds-notify_toast') and contains(@class,'slds-theme_success')]")
      .first();

    // The deletion toast text is translated; match 'deleted' or 'supprimé' in lower-case text.
    this.toastDeletion = page.locator('//*/div[@data-key="success"]');

    // Fallback toast locator if rendered as ARIA status/alert (Salesforce Lightning flavors)
    this.toastStatus = page
      .locator("//*[@role='status' or @role='alert']")
      .filter({ has: page.locator("//*[contains(@class,'slds-notify') or contains(@class,'toast') or contains(@class,'notification')]") })
      .first();

    // ── Field values by Salesforce API field name ────────────────
    this.getFieldValue = (fieldApiName) =>
      page
        .locator(
          [
            `//div[@data-target-selection-name="sfdc:RecordField.Account.${fieldApiName}"]//lightning-formatted-text[@data-output-element-id="output-field"]`,
            `//div[@data-target-selection-name="sfdc:RecordField.Account.${fieldApiName}"]//lightning-formatted-phone[@data-output-element-id="output-field"]`,
            `//div[@data-target-selection-name="sfdc:RecordField.Account.${fieldApiName}"]//lightning-formatted-url[@data-output-element-id="output-field"]`,
            `//div[@data-target-selection-name="sfdc:RecordField.Account.${fieldApiName}"]//span[@data-output-element-id="output-field"]`,
          ].join(" | "),
        )
        .first();
  }
}

export default AccountDetailPage;
