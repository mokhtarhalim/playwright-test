// All locators for the Account creation / edition modal form
class AccountFormPage {
  constructor(page) {
    this.page = page;

    // ── Basic Info ──────────────────────────────────────────────
    this.accountNameInput = page.getByLabel("Account Name");
    this.accountNumberInput = page.getByLabel("Account Number");
    this.accountSiteInput = page.getByLabel("Account Site");
    this.phoneInput = page.getByLabel("Phone");
    this.faxInput = page.getByLabel("Fax");
    this.websiteInput = page.getByLabel("Website");

    // ── Picklists ───────────────────────────────────────────────
    this.typeButton = page.getByRole("combobox", { name: "Type" }).first();
    this.industryButton = page
      .getByRole("combobox", { name: "Industry" })
      .first();
    this.ratingButton = page.getByRole("combobox", { name: "Rating" }).first();

    // ── Billing Address ─────────────────────────────────────────
    this.billingStreetInput = page.getByLabel("Billing Street");
    this.billingCityInput = page.getByLabel("Billing City");
    this.billingStateInput = page.getByLabel("Billing State/Province");
    this.billingPostalInput = page.getByLabel("Billing Zip/Postal Code");
    this.billingCountryInput = page.getByLabel("Billing Country");

    // ── Shipping Address ────────────────────────────────────────
    this.shippingStreetInput = page.getByLabel("Shipping Street");
    this.shippingCityInput = page.getByLabel("Shipping City");
    this.shippingStateInput = page.getByLabel("Shipping State/Province");
    this.shippingPostalInput = page.getByLabel("Shipping Zip/Postal Code");
    this.shippingCountryInput = page.getByLabel("Shipping Country");

    // ── Form Actions ────────────────────────────────────────────
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });

    // ── Toast notification ───────────────────────────────────────
    this.toastMessage = page.locator(".toastMessage");
    this.toastSuccess = page.locator(".slds-theme_success");
  }
}

export default AccountFormPage;
