import languageConfig from "../../config/languageConfig.js";

class TopMenuActions {
  constructor(topMenuPage) {
    this.topMenuPage = topMenuPage;
    this.currentLanguage = "English"; // Default language
  }

  // Set the current language (called after language change)
  setCurrentLanguage(language) {
    this.currentLanguage = language;
    console.log(`TopMenuActions: Current language set to ${this.currentLanguage}`);
  }

  // Get the current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Helper method to dynamically find the language select element
  async findLanguageSelectElement() {
    console.log("Finding language select element dynamically...");
    const page = this.topMenuPage.pageRef || this.topMenuPage.page;
    
    // Find all iframes
    const allIframes = await page.locator('iframe').count();
    console.log(`Found ${allIframes} iframes on page`);
    
    let languageSelectElement = null;
    
    // Try each iframe to find the one with the language select
    for (let i = 0; i < allIframes; i++) {
      try {
        const iframeTitle = await page.locator('iframe').nth(i).getAttribute('title');
        console.log(`Iframe ${i}: title="${iframeTitle}"`);
        
        // Check if this might be the settings iframe
        // (contains "Language"/"Langue" or "Time Zone"/"fuseau horaire")
        if (iframeTitle && (
          iframeTitle.includes('Language') || 
          iframeTitle.includes('Langue') ||
          iframeTitle.includes('Time Zone') ||
          iframeTitle.includes('fuseau horaire')
        )) {
          console.log(`Trying iframe ${i} (might be settings form)...`);
          
          // Try to find the select element in this iframe
          const iframe = page.frameLocator('iframe').nth(i);
          const selectElements = await iframe.locator('select[id*="languageLocaleKey"]').count();
          
          if (selectElements > 0) {
            console.log(`Found select element in iframe ${i}!`);
            languageSelectElement = iframe.locator('select[id*="languageLocaleKey"]');
            
            // Also set up the fallback
            this.topMenuPage.languageSelect = languageSelectElement;
            this.topMenuPage.languageSelectByXPath = iframe.locator('//select[contains(@id, "languageLocaleKey")]');
            return languageSelectElement;
          }
        }
      } catch (e) {
        // Continue to next iframe
        console.log(`  Iframe ${i}: Could not check - ${e.message}`);
      }
    }
    
    // If not found, throw error with debugging info
    throw new Error('Language select element not found in any iframe');
  }

  // Navigate to any Salesforce object via the App Launcher
  // objectName: logical name like "Accounts", "Contacts", etc.
  // The method uses the current language to determine the search label
  async navigateTo(objectName) {
    console.log(`Navigating to: ${objectName} (language: ${this.currentLanguage})`);

    // Verify page is still active
    if (this.topMenuPage.page.isClosed && this.topMenuPage.page.isClosed()) {
      throw new Error("Page has been closed!");
    }

    // Get the label for this object in the current language
    const label = languageConfig.getLabel(objectName, this.currentLanguage);
    console.log(`App Launcher search label: "${label}"`);

    try {
      // Click app launcher button
      await this.topMenuPage.appLauncherButton.waitFor({ state: "visible", timeout: 5000 });
      await this.topMenuPage.appLauncherButton.click();
      
      // Wait for search input to appear
      await this.topMenuPage.appLauncherSearchInput.waitFor({ state: "visible", timeout: 5000 });
      await this.topMenuPage.appLauncherSearchInput.fill(label);

      // Wait for the translated item to appear in results (matches the current language)
      await this.topMenuPage.appLauncherItemLink(label).waitFor({ state: "visible", timeout: 5000 });
      await this.topMenuPage.appLauncherItemLink(label).click();

      console.log(`Successfully navigated to ${objectName}`);
    } catch (error) {
      console.error(`Error navigating to ${objectName}: ${error.message}`);
      
      // Try to get current page state for debugging
      try {
        const currentUrl = this.topMenuPage.page.url();
        console.log(`Current URL: ${currentUrl}`);
      } catch (e) {
        console.log("Cannot get URL - page likely closed");
      }
      
      throw error;
    }
  }

  // Change language in user preferences
  async changeLanguage(language) {
    console.log(`Changing language to: ${language}`);

    try {
      // Click profile menu button
      console.log("Step 1: Clicking profile button...");
      await this.topMenuPage.profileButton.waitFor({ state: "visible", timeout: 5000 });
      await this.topMenuPage.profileButton.click();
      await this.topMenuPage.page.waitForTimeout(1000);

      // Click Settings link - this opens the settings page
      console.log("Step 2: Clicking Settings link...");
      await this.topMenuPage.settingsLink.waitFor({ state: "visible", timeout: 5000 });
      await this.topMenuPage.settingsLink.click();
      
      // Wait for page navigation to complete
      console.log("Step 3: Waiting for Settings page to load...");
      try {
        await this.topMenuPage.page.waitForNavigation({ waitUntil: "networkidle", timeout: 10000 }).catch(() => null);
      } catch (e) {
        // Ignore navigation errors
      }
      await this.topMenuPage.page.waitForTimeout(1500);

      // Click "Language & Time Zone" in the left navigation tree
      console.log("Step 4: Clicking Language & Time Zone nav item...");
      await this.topMenuPage.languageAndTimeZoneNav.waitFor({ state: "visible", timeout: 5000 });
      await this.topMenuPage.languageAndTimeZoneNav.click();
      
      // Wait for the settings form to load
      console.log("Step 5: Waiting for Language & Time Zone form to load...");
      await this.topMenuPage.page.waitForTimeout(1000); 

      // Wait explicitly for the iframe to be present first
      console.log("Step 6: Finding language select element dynamically...");
      let languageSelect;
      try {
        languageSelect = await this.findLanguageSelectElement();
      } catch (e) {
        console.error(`Failed to find language select: ${e.message}`);
        
        // Try one more time with a wait
        console.log("Retrying with wait...");
        await this.topMenuPage.page.waitForTimeout(2000);
        languageSelect = await this.findLanguageSelectElement();
      }

      // Now wait a bit for the iframe content to load
      await this.topMenuPage.page.waitForTimeout(500);
      console.log("Language select found and visible");

      // Use Playwright's selectOption() to select by label text
      console.log(`Step 7: Selecting language option: ${language}`);
      await languageSelect.selectOption({ label: language });
      console.log(`Language select option "${language}" selected`);

      // Wait for the selection to take effect
      await this.topMenuPage.page.waitForTimeout(1500);

      // The language change might trigger a page reload/navigation
      // Try to wait for navigation but don't fail if it doesn't happen
      console.log("Step 7b: Waiting for any page reload...");
      try {
        await this.topMenuPage.page.waitForNavigation({ waitUntil: "networkidle", timeout: 5000 }).catch(() => null);
      } catch (e) {
        console.log("No navigation detected after language selection");
      }

      // Save the language change by clicking Save button
      console.log("Step 8: Looking for Save button...");
      
      // The Save button should be in the same iframe context as the language select
      const page = this.topMenuPage.pageRef || this.topMenuPage.page;
      let saveButtonClicked = false;

      try {
        const allIframes = await page.locator('iframe').count();
        console.log(`Searching for Save button in ${allIframes} iframes...`);

        for (let i = 0; i < allIframes; i++) {
          try {
            const iframeTitle = await page.locator('iframe').nth(i).getAttribute('title');
            if (!iframeTitle) continue;

            if (!(
              iframeTitle.includes('Language') ||
              iframeTitle.includes('Langue') ||
              iframeTitle.includes('Time Zone') ||
              iframeTitle.includes('fuseau horaire')
            )) {
              continue;
            }

            console.log(`Searching for Save button in iframe ${i} (${iframeTitle})...`);
            const saveBtn = this.topMenuPage.saveButtonInIframe(i).first();
            const count = await saveBtn.count().catch(() => 0);

            console.log(`Found ${count} potential save input in iframe ${i}`);

            if (count > 0) {
              try {
                await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
                await saveBtn.click();
                console.log('Clicked Save button');
                saveButtonClicked = true;
                await this.topMenuPage.page.waitForTimeout(2000);
                break;
              } catch (clickError) {
                console.log(`Failed to click Save button in iframe ${i}: ${clickError.message}`);
              }
            }
          } catch (e) {
            console.log(`Error while checking iframe ${i} for Save: ${e.message}`);
          }
        }
      } catch (e) {
        console.log(`Error searching for Save button: ${e.message}`);
      }

      if (!saveButtonClicked) {
        console.log('Warning: Save button not found or not clicked. Language change may not be persisted.');
      }

      // Wait for any page reload that might happen after saving
      try {
        await this.topMenuPage.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 5000 }).catch(() => null);
      } catch (e) {
        // Ignore
      }

      await this.topMenuPage.page.waitForTimeout(1000);

      // Update the current language state
      this.setCurrentLanguage(language);
      console.log(`Language changed to: ${language}`);
    } catch (error) {
      console.error(`Error changing language: ${error.message}`);
      throw error;
    }
  }
}

export default TopMenuActions;
