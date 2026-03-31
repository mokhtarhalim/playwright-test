import { test } from "@playwright/test";
import ENV from "../../framework/config/env.js";

import LoginPage from "../../framework/objects/login/LoginPage.js";
import MFAPage from "../../framework/objects/login/MFAPage.js";
import TopMenuPage from "../../framework/objects/topmenu/TopMenuPage.js";
import LeadsPage from "../../framework/objects/leads/LeadsPage.js";
import LeadFormPage from "../../framework/objects/leads/LeadFormPage.js";
import LeadDetailPage from "../../framework/objects/leads/LeadDetailPage.js";
import LeadConvertPage from "../../framework/objects/leads/LeadConvertPage.js";

import LoginActions from "../../framework/actions/login/LoginActions.js";
import MFAActions from "../../framework/actions/login/MFAActions.js";
import TopMenuActions from "../../framework/actions/topmenu/TopMenuActions.js";
import LeadFormActions from "../../framework/actions/leads/LeadFormActions.js";

import AuthSteps from "../../framework/steps/login/AuthSteps.js";
import LeadSteps from "../../framework/steps/leads/LeadSteps.js";
import LanguageSteps from "../../framework/steps/language/LanguageSteps.js";
import { generateLeadUpdateData } from "../../framework/datasets/leads/leads.data.js";

test.describe.serial("Flow06 - Leads Modification And Validation", () => {
  let page;
  let updateData;
  let leadSteps;
  let topMenuActions;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);

    updateData = generateLeadUpdateData();

    page = await browser.newPage();
    await page.goto(ENV.baseUrl);

    const loginPage = new LoginPage(page);
    const mfaPage = new MFAPage(page);
    const loginActions = new LoginActions(loginPage, mfaPage, page);
    const mfaActions = new MFAActions(mfaPage);
    const authSteps = new AuthSteps(loginActions, mfaActions);

    await authSteps.loginWithMFA();
    console.log("Logged in once — session shared across all tests");

    topMenuActions = new TopMenuActions(new TopMenuPage(page));

    const languageSteps = new LanguageSteps(topMenuActions);
    await languageSteps.changeLanguageTo(ENV.testLanguage);
    console.log(`Flow06 running with language: ${ENV.testLanguage}`);

    leadSteps = new LeadSteps(
      topMenuActions,
      new LeadFormActions(
        new LeadsPage(page),
        new LeadFormPage(page),
        new LeadDetailPage(page),
        new LeadConvertPage(page),
      ),
    );
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("EditLead", async () => {
    test.setTimeout(60000); // 60 second timeout for lead creation
    await leadSteps.searchAndEditLead(updateData);
  });

  test("ValidateDataAfterUpdate", async () => {
    test.setTimeout(60000); // 60 second timeout for lead creation
    await leadSteps.validateLeadUpdate(updateData);
  });
});
