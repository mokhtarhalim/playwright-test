// All locators for the Account creation / edition modal form
class AccountFormPage {
  constructor(page) {
    this.page = page;

    // ── Basic Info ──────────────────────────────────────────────
    this.accountNameInput = page.getByRole("textbox", { name: "Account Name" });
    this.accountNumberInput = page.getByRole("textbox", {
      name: "Account Number",
    });
    this.accountSiteInput = page.getByRole("textbox", { name: "Account Site" });
    this.phoneInput = page.getByRole("textbox", { name: "Phone" });
    this.faxInput = page.getByRole("textbox", { name: "Fax" });
    this.websiteInput = page.getByRole("textbox", { name: "Website" });
    // ── Picklists ───────────────────────────────────────────────
    this.typeButton = page.getByRole("combobox", { name: "Type" }).first();
    this.industryButton = page
      .getByRole("combobox", { name: "Industry" })
      .first();
    this.ratingButton = page.getByRole("combobox", { name: "Rating" }).first();

    // ── Billing Address ─────────────────────────────────────────
    this.billingStreetInput = page.getByRole("textbox", {
      name: "Billing Street",
    });
    this.billingCityInput = page.getByRole("textbox", { name: "Billing City" });
    this.billingPostalInput = page.getByRole("textbox", {
      name: "Billing Zip/Postal Code",
    });

    this.billingStateInput = page
      .getByRole("combobox", { name: "Billing State/Province" })
      .first();
    this.billingCountryInput = page
      .getByRole("combobox", { name: "Billing Country" })
      .first();

    // ── Shipping Address ────────────────────────────────────────
    this.shippingStreetInput = page.getByRole("textbox", {
      name: "Shipping Street",
    });
    this.shippingCityInput = page.getByRole("textbox", {
      name: "Shipping City",
    });
    this.shippingPostalInput = page.getByRole("textbox", {
      name: "Shipping Zip/Postal Code",
    });
    this.shippingStateInput = page
      .getByRole("combobox", { name: "Shipping State/Province" })
      .first();
    this.shippingCountryInput = page
      .getByRole("combobox", { name: "Shipping Country" })
      .first();

    // ── Form Actions ────────────────────────────────────────────
    this.saveButton = page.locator('button[name="SaveEdit"]');
    this.cancelButton = page.locator('button[name="CancelEdit"]');

    // ── Toast notification ───────────────────────────────────────
    const successToast = page.getByRole("alert").filter({ hasText: "created" });
  }
}

export default AccountFormPage;
