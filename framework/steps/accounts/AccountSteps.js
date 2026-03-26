import { expect } from "@playwright/test";
import fs from "fs";
import path from "path";

class AccountSteps {
  constructor(topMenuActions, accountFormActions) {
    this.topMenuActions = topMenuActions;
    this.accountFormActions = accountFormActions;
  }

  // Helper method to save account data to JSON
  async saveAccountDataToJson(data) {
    const now = new Date();
    const dateTimeString = now.toISOString().replace(/[:.]/g, "-").slice(0, -5); // Format: YYYY-MM-DDTHH-MM-SS

    // Create date folder in DD-MM-YYYY format
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateFolder = `${day}-${month}-${year}`;

    const fileName = `NewAccount_${dateTimeString}.json`;
    const filePath = path.join(
      process.cwd(),
      "framework",
      "datasets",
      "savedjson",
      "account",
      dateFolder,
      fileName,
    );

    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Add timestamp to the data
    const dataWithTimestamp = {
      ...data,
      created_at: now.toISOString(),
    };

    // Write the data to JSON file
    fs.writeFileSync(filePath, JSON.stringify(dataWithTimestamp, null, 2));
    console.log(`Account data saved to: ${filePath}`);
    return filePath;
  }

  // Helper method to find the latest account JSON file created today (any status)
  findLatestJsonFileToday() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const dateFolder = `${day}-${month}-${year}`;

    const savedJsonDir = path.join(
      process.cwd(),
      "framework",
      "datasets",
      "savedjson",
      "account",
      dateFolder,
    );
    if (!fs.existsSync(savedJsonDir)) {
      return null;
    }

    const files = fs
      .readdirSync(savedJsonDir)
      .filter(
        (file) => file.startsWith("NewAccount_") && file.endsWith(".json"),
      )
      .sort()
      .reverse(); // Most recent first

    if (files.length === 0) {
      return null;
    }

    return path.join(savedJsonDir, files[0]);
  }

  // Helper method to find the latest active (not deleted) account JSON file created today
  findLatestActiveJsonFileToday() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const dateFolder = `${day}-${month}-${year}`;

    const savedJsonDir = path.join(
      process.cwd(),
      "framework",
      "datasets",
      "savedjson",
      "account",
      dateFolder,
    );
    if (!fs.existsSync(savedJsonDir)) {
      return null;
    }

    const files = fs
      .readdirSync(savedJsonDir)
      .filter(
        (file) => file.startsWith("NewAccount_") && file.endsWith(".json"),
      )
      .sort()
      .reverse(); // Most recent first

    for (const file of files) {
      const filePath = path.join(savedJsonDir, file);
      try {
        const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        if (!fileData.deleted_from_salesforce) {
          return filePath;
        }
      } catch (error) {
        console.log(`Skipping invalid JSON file: ${filePath}`);
      }
    }

    return null;
  }

  // Helper method to update JSON file with edited data
  async updateJsonWithEditedData(originalData, editedData) {
    const jsonFilePath = this.findLatestJsonFileToday();
    if (!jsonFilePath) {
      console.log("No JSON file found for today");
      return;
    }

    // Read existing data
    const existingData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

    // Create updated data with both original and edited values
    const updatedData = { ...existingData };

    // Add edited values with "_edited" suffix
    Object.keys(editedData).forEach((key) => {
      if (existingData[key] !== undefined) {
        updatedData[`${key}_edited`] = editedData[key];
      }
    });

    // Add update timestamp
    updatedData.updated_at = new Date().toISOString();

    // Write back to file
    fs.writeFileSync(jsonFilePath, JSON.stringify(updatedData, null, 2));
    console.log(`JSON file updated with edited data: ${jsonFilePath}`);
  }

  // ── Create ─────────────────────────────────────────────────────
  async createNewAccount(data) {
    console.log(`Creating account: ${data.accountName}`);
    await this.topMenuActions.navigateTo("Accounts");
    await this.accountFormActions.openNewAccountForm();
    await this.accountFormActions.fillForm(data);
    await this.accountFormActions.saveForm();
    console.log(`Account form submitted`);

    // Save the account data to JSON file
    await this.saveAccountDataToJson(data);
  }

  async validateAccountCreation(data) {
    await this.accountFormActions.accountDetailPage.recordTitle.waitFor({
      state: "visible",
      timeout: 10000,
    });

    const titleText =
      await this.accountFormActions.accountDetailPage.recordTitle.innerText();
    console.log(
      `Record title: expected="${data.accountName}" | actual="${titleText}"`,
    );

    expect(titleText.trim()).toBe(data.accountName);
    console.log("Account Name validated successfully");
    /*
    // 2. Validate fields using Salesforce API field names
    const fieldsToValidate = [
      { apiName: 'AccountNumber', value: data.accountNumber },
      { apiName: 'Site',          value: data.accountSite },
      { apiName: 'Phone',         value: data.phone },
      { apiName: 'Fax',           value: data.fax },
      { apiName: 'Website',       value: data.website },
      { apiName: 'Type',          value: data.type },
      { apiName: 'Industry',      value: data.industry },
      { apiName: 'Rating',        value: data.rating },
    ];
    for (const { apiName, value } of fieldsToValidate) {
      const actual = await this.accountFormActions.validateFieldValue(apiName, value);
      expect(actual).toContain(value);
    }
    console.log('All account fields validated on detail page');*/
  }

  // ── Edit ─────────────────────────────────────────────────────
  async editAccount(data) {
    console.log(`Editing account: ${data.accountName}`);
    await this.accountFormActions.openEditAccountForm();
    await this.accountFormActions.fillUpdateForm(data);
    await this.accountFormActions.saveFormAndReload();
    console.log(`Account updated`);
  }

  //Search for existing account and edit it
  async searchAndEditAccount(updateData) {
    console.log(`Searching for account to edit`);

    // Find the latest non-deleted JSON file created today
    const jsonFilePath = this.findLatestActiveJsonFileToday();
    if (!jsonFilePath) {
      throw new Error(
        "No active (non-deleted) account JSON file found for today. Please run Flow02 first to create an account.",
      );
    }

    // Read the account data from JSON
    const accountData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    const accountName =
      accountData.accountName_edited || accountData.accountName;

    console.log(`Found account from JSON: ${accountName}`);

    // Navigate to Accounts
    await this.topMenuActions.navigateTo("Accounts");

    // Search for the account
    const found =
      await this.accountFormActions.searchAccountByName(accountName);
    if (!found) {
      throw new Error(`Account "${accountName}" not found in Salesforce`);
    }

    // Edit the account
    console.log(`Editing account: ${accountName}`);
    await this.accountFormActions.openEditAccountForm();
    await this.accountFormActions.fillUpdateForm(updateData);
    await this.accountFormActions.saveFormAndReload();
    console.log(`Account updated`);

    // Update the JSON file with edited data
    await this.updateJsonWithEditedData(accountData, updateData);
  }

  async validateAccountUpdate(data) {
    await this.accountFormActions.accountDetailPage.recordTitle.waitFor({
      state: "visible",
      timeout: 10000,
    });
    const titleText =
      await this.accountFormActions.accountDetailPage.recordTitle.innerText();
    console.log(
      `Record title: expected="${data.accountName}" | actual="${titleText}"`,
    );
    expect(titleText.trim()).toBe(data.accountName);
    console.log("Account name validated after update");
  }

  // Helper method to mark account as deleted in JSON file
  async markAccountAsDeleted() {
    console.log("Marking account as deleted in JSON...");
    const jsonFilePath = this.findLatestJsonFileToday();
    if (!jsonFilePath) {
      console.log("No JSON file found for today");
      return;
    }

    // Read existing data
    const accountData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

    // Add deletion flag and timestamp
    accountData.deleted_from_salesforce = true;
    accountData.deleted_at = new Date().toISOString();

    // Write back to file
    fs.writeFileSync(jsonFilePath, JSON.stringify(accountData, null, 2));
    console.log(`Account marked as deleted in JSON: ${jsonFilePath}`);
  }

  // ── Delete ───────────────────────────────────────────────
  async deleteAccount() {
    console.log("Deleting account...");
    await this.accountFormActions.deleteAccount();
    console.log("Account deletion confirmed");

    // Mark the account as deleted in the JSON file
    await this.markAccountAsDeleted();
  }

  // Search for existing account and delete it
  async searchAndDeleteAccount() {
    console.log(`Searching for account to delete`);

    // Find the latest non-deleted JSON file created today
    const jsonFilePath = this.findLatestActiveJsonFileToday();
    if (!jsonFilePath) {
      throw new Error(
        "No active (non-deleted) account JSON file found for today. Please create an account before running edit flow.",
      );
    }

    // Read the account data from JSON
    const accountData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

    // Use edited name if available (if account was updated), otherwise use original name
    const accountName =
      accountData.accountName_edited || accountData.accountName;
    const wasEdited = !!accountData.accountName_edited;

    if (wasEdited) {
      console.log(
        `Found edited account from JSON: ${accountName} (was: ${accountData.accountName})`,
      );
    } else {
      console.log(`Found account from JSON: ${accountName}`);
    }

    // Navigate to Accounts
    await this.topMenuActions.navigateTo("Accounts");

    // Search for the account
    const found =
      await this.accountFormActions.searchAccountByName(accountName);
    if (!found) {
      throw new Error(`Account "${accountName}" not found in Salesforce`);
    }

    // Delete the account
    console.log(`Deleting account: ${accountName}`);
    await this.accountFormActions.deleteAccount();
    console.log(`Account deleted`);

    // Mark the account as deleted in the JSON file
    await this.markAccountAsDeleted();
  }

  async validateAccountDeletion() {
    console.log("Validating account deletion by searching for it...");

    // Find the latest JSON file created today
    const jsonFilePath = this.findLatestJsonFileToday();
    if (!jsonFilePath) {
      console.log("No JSON file found for today");
      return;
    }

    // Read the account data from JSON
    const accountData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

    // Use edited name if available (if account was updated), otherwise use original name
    const accountName =
      accountData.accountName_edited || accountData.accountName;

    // Navigate to Accounts
    await this.topMenuActions.navigateTo("Accounts");

    // Wait for page to load
    await this.accountFormActions.accountsPage.page.waitForTimeout(2000);

    // Try to search for the deleted account
    const accountLink = this.accountFormActions.accountsPage.page
      .locator(
        `//a[contains(text(), "${accountName}") or @title="${accountName}"]`,
      )
      .first();
    const count = await accountLink.count();

    if (count > 0) {
      throw new Error(
        `Account "${accountName}" still exists in Salesforce - deletion failed!`,
      );
    } else {
      console.log(`Account "${accountName}" not found - deletion successful!`);
    }
  }
}

export default AccountSteps;
