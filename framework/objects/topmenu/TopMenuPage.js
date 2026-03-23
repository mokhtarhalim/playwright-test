class TopMenuPage {
  constructor(page) {
    this.page = page;

    // App Launcher button
    this.appLauncherButton = page.locator('//one-app-launcher-header//button[@aria-haspopup="dialog"]');

    // App Launcher search input
    this.appLauncherSearchInput = page.locator('//one-app-launcher-search-bar//input[@type="search"]');

    // App Launcher item link (dynamic — pass the data-label attribute value)
    this.appLauncherItemLink = (label) =>
      page.locator(`//one-app-launcher-menu-item//a[@role="option" and @data-label="${label}"]`);
  }
}

export default TopMenuPage;



