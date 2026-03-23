class HomePage {
  constructor(page) {
    this.page = page;

    // App Launcher button — confirms home page loaded successfully
    this.appLauncherButton = page.locator('//one-app-launcher-header//button[@aria-haspopup="dialog"]');
  }

  async waitForPageLoad() {
    await this.appLauncherButton.waitFor({ state: 'visible', timeout: 15000 });
  }
}

export default HomePage;