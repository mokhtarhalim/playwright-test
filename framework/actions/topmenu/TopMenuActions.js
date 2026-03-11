class TopMenuActions {
  constructor(topMenuPage) {
    this.topMenuPage = topMenuPage;
  }

  // Navigate to any Salesforce object via the App Launcher
  async navigateTo(label) {
    await this.topMenuPage.appLauncherButton.click();
    await this.topMenuPage.appLauncherSearchInput.waitFor({ state: "visible" });
    await this.topMenuPage.appLauncherSearchInput.fill(label);
    await this.topMenuPage.appLauncherItemLink(label).click();
  }
}

export default TopMenuActions;
