class TopMenuPage {
  constructor(page) {
    this.page = page;

    // App Launcher
    this.appLauncherButton = page.getByRole('button', { name: 'App Launcher' });
    this.appLauncherSearchInput = page.getByPlaceholder('Search apps and items...');

    // App Launcher result item (dynamic — use method below)
    this.appLauncherItemLink = (label) =>
      page.getByRole('option', { name: label }).or(
        page.locator('.slds-listbox__item').filter({ hasText: label })
      ).first();
  }
}

export default TopMenuPage;