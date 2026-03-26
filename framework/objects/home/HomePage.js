class HomePage {
  constructor(page) {
    this.page = page;

    // App Launcher button — confirms home page loaded successfully
    this.appLauncherButton = page.locator('//one-app-launcher-header//button[@aria-haspopup="dialog"]');
  }

  async waitForPageLoad() {
    console.log(`Current URL: ${this.page.url()}`);
    
    // If on contentDoor page, wait for redirect to home
    if (this.page.url().includes('contentDoor')) {
      console.log('On contentDoor page, waiting for redirect to home...');
      try {
        await this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 });
        console.log(`Redirected to: ${this.page.url()}`);
      } catch (e) {
        console.log('No additional navigation detected after contentDoor');
      }
      await this.page.waitForTimeout(2000);
    }
    
    // Wait for app launcher button to confirm we're on home page
    console.log('Waiting for app launcher button...');
    try {
      await this.appLauncherButton.waitFor({ state: 'visible', timeout: 15000 });
      console.log('App launcher button found - home page loaded successfully!');
    } catch (e) {
      console.log(`App launcher button not found. Current URL: ${this.page.url()}`);
      // Get page content for debugging
      const bodyHTML = await this.page.evaluate(() => document.body.innerHTML.substring(0, 500));
      console.log(`Page content sample: ${bodyHTML}`);
      throw e;
    }
  }
}

export default HomePage;