class LanguageSteps {
  constructor(topMenuActions) {
    this.topMenuActions = topMenuActions;
  }

  // Change application language and update internal state
  async changeLanguageTo(language) {
    console.log(`LanguageSteps: Switching to ${language}`);
    
    // Update TopMenuActions' internal language state
    this.topMenuActions.setCurrentLanguage(language);
    
    // Change the UI language
    await this.topMenuActions.changeLanguage(language);
    
    console.log(`LanguageSteps: Successfully switched to ${language}`);
  }
}

export default LanguageSteps;
