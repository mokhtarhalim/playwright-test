// Language configuration for UI navigation across different languages
const languageConfig = {
  // Map object/menu names to their values across languages
  // Key: logical name, Value: object { en: English label, fr: French label }
  menuItems: {
    Accounts: {
      en: "Accounts",
      fr: "Comptes",
    },
    Contacts: {
      en: "Contacts",
      fr: "Contacts",
    },
    Leads: {
      en: "Leads",
      fr: "Pistes",
    },
    Opportunities: {
      en: "Opportunities",
      fr: "Opportunités",
    },
  },

  // Get the label for a specific object in a given language
  getLabel(objectName, language) {
    const lang = language === "Français" ? "fr" : "en";
    if (!this.menuItems[objectName]) {
      throw new Error(`Unknown menu item: ${objectName}. Available: ${Object.keys(this.menuItems).join(", ")}`);
    }
    return this.menuItems[objectName][lang];
  },

  // Settings/Preferences labels
  settingsLabels: {
    en: "Settings",
    fr: "Paramètres",
  },

  // Language selector labels
  languageLabels: {
    en: "Language",
    fr: "Langue",
  },

  // Get settings label for a given language
  getSettingsLabel(language) {
    const lang = language === "Français" ? "fr" : "en";
    return this.settingsLabels[lang];
  },

  // Get language label for a given language
  getLanguageLabel(language) {
    const lang = language === "Français" ? "fr" : "en";
    return this.languageLabels[lang];
  },
};

export default languageConfig;
