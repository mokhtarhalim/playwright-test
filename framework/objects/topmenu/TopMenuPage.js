class TopMenuPage {
  constructor(page) {
    this.page = page;

    // App Launcher button - uses aria-haspopup for language-agnostic selection
    this.appLauncherButton = page.locator('//one-app-launcher-header//button[@aria-haspopup="dialog"]');

    // App Launcher search input - stable selector by role
    this.appLauncherSearchInput = page.locator('//one-app-launcher-search-bar//input[@type="search"]');

    // App Launcher item link - search by exact visible text content
    // Works in any language by matching exact menu item text
    this.appLauncherItemLink = (label) =>
      page.locator(`//one-app-launcher-menu-item//a[@role="option" and normalize-space(.) = "${label}"]`);

    // Profile menu button - user avatar/dropdown button in top-right
    this.profileButton = page.locator('//button[contains(@class, "profile") or contains(@class, "user") or @aria-haspopup="menu"]').first();

    // The Settings link always has href containing "/lightning/settings"
    this.settingsLink = page.locator('//a[contains(@href, "lightning/settings")]').first();

    // Language & Time Zone navigation item in settings tree - find by data-node-id
    this.languageAndTimeZoneNav = page.locator('//li[@data-node-id="LanguageAndTimeZone"]//a');

    this.pageRef = page;
    
    // These will be set dynamically after finding the correct iframe
    this.languageSelect = null;
    this.languageSelectByXPath = null;
  }

  // Save button inside language settings iframe
  saveButtonInIframe(index) {
    return this.page.frameLocator('iframe').nth(index)
      .locator('input.btn.primary[id*=":save"][name*=":save"][title="Enregistrer"], input.btn.primary[value="Save"], input.btn.primary[value="Enregistrer"]');
  }
}

export default TopMenuPage;



