import { expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import AccountsPage from "../../objects/accounts/AccountsPage.js";
import AccountDetailPage from "../../objects/accounts/AccountDetailPage.js";
import ContactsPage from "../../objects/contacts/ContactsPage.js";
import ContactDetailPage from "../../objects/contacts/ContactDetailPage.js";
import OpportunitiesPage from "../../objects/opportunities/OpportunitiesPage.js";
import OpportunityDetailPage from "../../objects/opportunities/OpportunityDetailPage.js";

class LeadSteps {
  constructor(topMenuActions, leadFormActions) {
    this.topMenuActions = topMenuActions;
    this.leadFormActions = leadFormActions;
  }

  // Helper method to save lead data to JSON
  async saveLeadDataToJson(data) {
    const now = new Date();
    const dateTimeString = now.toISOString().replace(/[:.]/g, "-").slice(0, -5); // Format: YYYY-MM-DDTHH-MM-SS
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateFolder = `${day}-${month}-${year}`;

    const fileName = `NewLead_${dateTimeString}.json`;
    const filePath = path.join(
      process.cwd(),
      "framework",
      "datasets",
      "savedjson",
      "lead",
      dateFolder,
      fileName,
    );

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const dataWithTimestamp = {
      ...data,
      created_at: now.toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(dataWithTimestamp, null, 2));
    console.log(`Lead data saved to: ${filePath}`);
    return filePath;
  }

  getLeadFullName(data) {
    return data.firstName && data.lastName
      ? `${data.firstName.trim()} ${data.lastName.trim()}`
      : data.lastName;
  }

  getExpectedOpportunityName(data) {
    return data.company
  }

  async getLatestActiveLeadDataFromJson() {
    const jsonFilePath = this.findLatestActiveLeadJsonFileToday();
    if (!jsonFilePath) {
      throw new Error(
        "No active (non-deleted) lead JSON file found for today. Please run the lead creation flow first.",
      );
    }

    const leadData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    return leadData;
  }

  async searchAndConvertLead() {
    const leadData = await this.getLatestActiveLeadDataFromJson();
    const leadName = this.getLeadFullName(leadData);

    console.log(`Searching for lead to convert: ${leadName}`);
    await this.topMenuActions.navigateTo("Leads");

    const found = await this.leadFormActions.searchLeadByName(leadName);
    if (!found) {
      throw new Error(`Lead "${leadName}" not found in Salesforce`);
    }

    await this.convertLead(leadData);
    return leadData;
  }

  async convertLead(data) {
    const accountName = data.company;
    const contactName = this.getLeadFullName(data);
    const opportunityName = this.getExpectedOpportunityName(data);

    console.log(`Converting lead to Account/Contact/Opportunity: ${contactName}`);
    await this.leadFormActions.convertLead({
      accountName,
      opportunityName,
      contactRole: "Decision Maker",
      createOpportunity: true,
    });

    await this.markLeadAsConverted();

    return {
      accountName,
      contactName,
      opportunityName,
    };
  }

  async markLeadAsConverted() {
    const jsonFilePath = this.findLatestActiveLeadJsonFileToday();
    if (!jsonFilePath) {
      console.log("No active lead JSON file found to mark as converted");
      return;
    }

    const leadData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    leadData.status = "Converted";
    leadData.converted_at = new Date().toISOString();

    fs.writeFileSync(jsonFilePath, JSON.stringify(leadData, null, 2));
    console.log(`Lead marked as Converted in JSON: ${jsonFilePath}`);
  }

  async validateConvertedAccount(accountName) {
    const page = this.leadFormActions.leadDetailPage.page;
    const accountsPage = new AccountsPage(page);
    const accountDetailPage = new AccountDetailPage(page);

    await this.topMenuActions.navigateTo("Accounts");
    await accountsPage.listViewSearchInput.waitFor({ state: "visible", timeout: 10000 });
    await accountsPage.listViewSearchInput.fill(accountName);
    await accountsPage.listViewSearchInput.press("Enter");
    await page.waitForTimeout(5000);

    const accountLink = accountsPage.accountListItem(accountName);
    const count = await accountLink.count();
    if (count === 0) {
      throw new Error(`Converted Account "${accountName}" was not found`);
    }

    await accountLink.click();
    await accountDetailPage.recordTitle.waitFor({ state: "visible", timeout: 10000 });
    const titleText = (await accountDetailPage.recordTitle.innerText()).trim();
    expect(titleText).toBe(accountName);
    console.log(`Converted Account validated: ${accountName}`);
  }

  async validateConvertedContact(contactName) {
    const page = this.leadFormActions.leadDetailPage.page;
    const contactsPage = new ContactsPage(page);
    const contactDetailPage = new ContactDetailPage(page);

    await this.topMenuActions.navigateTo("Contacts");
    await contactsPage.listViewSearchInput.waitFor({ state: "visible", timeout: 10000 });
    await contactsPage.listViewSearchInput.fill(contactName);
    await contactsPage.listViewSearchInput.press("Enter");
    await page.waitForTimeout(5000);

    const contactLink = contactsPage.contactListItem(contactName);
    const count = await contactLink.count();
    if (count === 0) {
      throw new Error(`Converted Contact "${contactName}" was not found`);
    }

    await contactLink.click();
    await contactDetailPage.recordTitle.waitFor({ state: "visible", timeout: 10000 });
    const titleText = (await contactDetailPage.recordTitle.innerText()).trim();
    expect(titleText).toBe(contactName);
    console.log(`Converted Contact validated: ${contactName}`);
  }

  async validateConvertedOpportunity(opportunityName) {
    const page = this.leadFormActions.leadDetailPage.page;
    const opportunitiesPage = new OpportunitiesPage(page);
    const opportunityDetailPage = new OpportunityDetailPage(page);

    await this.topMenuActions.navigateTo("Opportunities");
    await opportunitiesPage.listViewSearchInput.waitFor({ state: "visible", timeout: 10000 });
    await opportunitiesPage.listViewSearchInput.fill(opportunityName);
    await opportunitiesPage.listViewSearchInput.press("Enter");
    await page.waitForTimeout(5000);

    const opportunityLink = opportunitiesPage.opportunityListItem(opportunityName);
    const count = await opportunityLink.count();
    if (count === 0) {
      throw new Error(`Converted Opportunity "${opportunityName}" was not found`);
    }

    await opportunityLink.click();
    await opportunityDetailPage.recordTitle.waitFor({ state: "visible", timeout: 10000 });
    const titleText = (await opportunityDetailPage.recordTitle.innerText()).trim();
    expect(titleText).toBe(opportunityName);
    console.log(`Converted Opportunity validated: ${opportunityName}`);
  }

  async validateLeadConversion(data) {
    const accountName = data.company;
    const contactName = this.getLeadFullName(data);
    const opportunityName = this.getExpectedOpportunityName(data);

    await this.validateConvertedAccount(accountName);
    await this.validateConvertedContact(contactName);
    await this.validateConvertedOpportunity(opportunityName);
  }

  // Helper method to find the latest lead JSON file created today (any status)
  findLatestLeadJsonFileToday() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const dateFolder = `${day}-${month}-${year}`;

    const savedJsonDir = path.join(
      process.cwd(),
      "framework",
      "datasets",
      "savedjson",
      "lead",
      dateFolder,
    );
    if (!fs.existsSync(savedJsonDir)) {
      return null;
    }

    const files = fs
      .readdirSync(savedJsonDir)
      .filter((file) => file.startsWith("NewLead_") && file.endsWith(".json"))
      .sort()
      .reverse();

    if (files.length === 0) {
      return null;
    }

    return path.join(savedJsonDir, files[0]);
  }

  // Helper method to find the latest active (not deleted) lead JSON file created today
  findLatestActiveLeadJsonFileToday() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const dateFolder = `${day}-${month}-${year}`;

    const savedJsonDir = path.join(
      process.cwd(),
      "framework",
      "datasets",
      "savedjson",
      "lead",
      dateFolder,
    );
    if (!fs.existsSync(savedJsonDir)) {
      return null;
    }

    const files = fs
      .readdirSync(savedJsonDir)
      .filter((file) => file.startsWith("NewLead_") && file.endsWith(".json"))
      .sort()
      .reverse();

    for (const file of files) {
      const filePath = path.join(savedJsonDir, file);
      try {
        const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const isConverted =
          fileData.status &&
          String(fileData.status).trim().toLowerCase() === "converted";
        if (!fileData.deleted_from_salesforce && !isConverted) {
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
    const jsonFilePath = this.findLatestLeadJsonFileToday();
    if (!jsonFilePath) {
      console.log("No JSON file found for today");
      return;
    }

    const existingData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    const updatedData = { ...existingData };

    Object.keys(editedData).forEach((key) => {
      if (existingData[key] !== undefined) {
        updatedData[`${key}_edited`] = editedData[key];
      }
    });

    updatedData.updated_at = new Date().toISOString();

    fs.writeFileSync(jsonFilePath, JSON.stringify(updatedData, null, 2));
    console.log(`JSON file updated with edited data: ${jsonFilePath}`);
  }

  // Helper method to mark lead as deleted in JSON file
  async markLeadAsDeleted() {
    console.log("Marking lead as deleted in JSON...");
    const jsonFilePath = this.findLatestLeadJsonFileToday();
    if (!jsonFilePath) {
      console.log("No JSON file found for today");
      return;
    }

    const leadData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    leadData.deleted_from_salesforce = true;
    leadData.deleted_at = new Date().toISOString();

    fs.writeFileSync(jsonFilePath, JSON.stringify(leadData, null, 2));
    console.log(`Lead marked as deleted in JSON: ${jsonFilePath}`);
  }

  // ── Create ─────────────────────────────────────────────────────
  async createNewLead(data) {
    console.log(`Creating lead: ${data.lastName || data.company}`);
    await this.topMenuActions.navigateTo("Leads");
    await this.leadFormActions.openNewLeadForm();
    await this.leadFormActions.fillForm(data);
    await this.leadFormActions.saveForm();
    console.log(`Lead form submitted`);

    const safeData = { ...data };
    if (
      safeData.leadStatus &&
      String(safeData.leadStatus).trim().toLowerCase().includes("converted")
    ) {
      safeData.leadStatus = "Open - Not Contacted";
      console.log("Lead status sanitized to avoid created converted leads");
    }

    await this.saveLeadDataToJson(safeData);
  }

  async validateLeadCreation(data) {
    await this.leadFormActions.leadDetailPage.recordTitle.waitFor({
      state: "visible",
      timeout: 10000,
    });
    const titleText =
      await this.leadFormActions.leadDetailPage.recordTitle.innerText();

    const expectedTitle =
      data.firstName && data.lastName
        ? `${data.firstName.trim()} ${data.lastName.trim()}`
        : data.lastName;

    console.log(
      `Record title: expected="${expectedTitle}" | actual="${titleText}"`,
    );
    expect(titleText.trim()).toBe(expectedTitle);
    console.log("Lead validated successfully");
  }
  // ── Edit ─────────────────────────────────────────────────────
  async editLead(data) {
    console.log(`Editing lead: ${data.lastName || data.company}`);
    await this.leadFormActions.openEditLeadForm();
    await this.leadFormActions.fillUpdateForm(data);
    await this.leadFormActions.saveFormAndReload();
    console.log(`Lead updated`);
  }

  async searchAndEditLead(updateData) {
    console.log(`Searching for lead to edit`);
    const jsonFilePath = this.findLatestActiveLeadJsonFileToday();
    if (!jsonFilePath) {
      throw new Error(
        "No active (non-deleted) lead JSON file found for today. Please run lead creation flow first.",
      );
    }

    const leadData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    const leadName =
      leadData.lastName_edited || leadData.lastName || leadData.company;

    console.log(`Found lead from JSON: ${leadName}`);
    await this.topMenuActions.navigateTo("Leads");

    const found = await this.leadFormActions.searchLeadByName(leadName);
    if (!found) {
      throw new Error(`Lead "${leadName}" not found in Salesforce`);
    }

    console.log(`Editing lead: ${leadName}`);
    await this.leadFormActions.openEditLeadForm();
    await this.leadFormActions.fillUpdateForm(updateData);
    await this.leadFormActions.saveFormAndReload();
    console.log(`Lead updated`);

    await this.updateJsonWithEditedData(leadData, updateData);
  }

  async validateLeadUpdate(data) {
    await this.leadFormActions.leadDetailPage.recordTitle.waitFor({
      state: "visible",
      timeout: 10000,
    });
    const titleText =
      await this.leadFormActions.leadDetailPage.recordTitle.innerText();
    const expectedTitle = this.getLeadFullName(data);
    console.log(
      `Record title: expected="${expectedTitle}" | actual="${titleText}"`,
    );
    expect(titleText.trim()).toBe(expectedTitle);
    console.log("Lead validated after update");
  }

  // ── Delete ───────────────────────────────────────────────
  async deleteLead() {
    console.log("Deleting lead...");
    await this.leadFormActions.deleteLead();
    console.log("Lead deletion confirmed");
    await this.markLeadAsDeleted();
  }

  async searchAndDeleteLead() {
    console.log(`Searching for lead to delete`);
    const jsonFilePath = this.findLatestActiveLeadJsonFileToday();
    if (!jsonFilePath) {
      throw new Error(
        "No active (non-deleted) lead JSON file found for today. Please create a lead before running delete flow.",
      );
    }

    const leadData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    const leadName =
      leadData.lastName_edited || leadData.lastName || leadData.company;
    const wasEdited = !!leadData.lastName_edited;

    if (wasEdited) {
      console.log(
        `Found edited lead from JSON: ${leadName} (was: ${leadData.lastName})`,
      );
    } else {
      console.log(`Found lead from JSON: ${leadName}`);
    }

    await this.topMenuActions.navigateTo("Leads");
    const found = await this.leadFormActions.searchLeadByName(leadName);
    if (!found) {
      throw new Error(`Lead "${leadName}" not found in Salesforce`);
    }

    console.log(`Deleting lead: ${leadName}`);
    await this.leadFormActions.deleteLead();
    console.log(`Lead deleted`);
    await this.markLeadAsDeleted();
  }

  async validateLeadDeletion() {
    console.log("Validating lead deletion by searching for it...");
    const jsonFilePath = this.findLatestLeadJsonFileToday();
    if (!jsonFilePath) {
      console.log("No JSON file found for today");
      return;
    }

    const leadData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    const leadName =
      leadData.lastName_edited || leadData.lastName || leadData.company;

    await this.topMenuActions.navigateTo("Leads");
    await this.leadFormActions.leadsPage.page.waitForTimeout(2000);

    const leadLink = this.leadFormActions.leadsPage.page
      .locator(`//a[contains(text(), "${leadName}") or @title="${leadName}"]`)
      .first();
    const count = await leadLink.count();

    if (count > 0) {
      throw new Error(
        `Lead "${leadName}" still exists in Salesforce - deletion failed!`,
      );
    }

    console.log("Lead deletion validated successfully");
  }
}

export default LeadSteps;
