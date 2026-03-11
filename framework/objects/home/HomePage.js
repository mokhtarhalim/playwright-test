class HomePage {
  constructor(page) {
    this.page = page;
  }

  get appLauncherButton() {
    return this.page.getByRole("button", { name: "App Launcher" });
  }

  async waitForPageLoad() {
    await this.appLauncherButton.waitFor({ state: "visible", timeout: 15000 });
  }
}

export default HomePage;