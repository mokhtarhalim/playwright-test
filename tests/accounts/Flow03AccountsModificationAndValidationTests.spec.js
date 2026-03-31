import { test } from "@playwright/test";
import ENV from "../../framework/config/env.js";

import LoginPage from "../../framework/objects/login/LoginPage.js";
import MFAPage from "../../framework/objects/login/MFAPage.js";
import TopMenuPage from "../../framework/objects/topmenu/TopMenuPage.js";
import AccountsPage from "../../framework/objects/accounts/AccountsPage.js";
import AccountFormPage from "../../framework/objects/accounts/AccountFormPage.js";
import AccountDetailPage from "../../framework/objects/accounts/AccountDetailPage.js";
import LoginActions from "../../framework/actions/login/LoginActions.js";
import MFAActions from "../../framework/actions/login/MFAActions.js";
import TopMenuActions from "../../framework/actions/topmenu/TopMenuActions.js";
import AccountFormActions from "../../framework/actions/accounts/AccountFormActions.js";
import AuthSteps from "../../framework/steps/login/AuthSteps.js";
import AccountSteps from "../../framework/steps/accounts/AccountSteps.js";
import LanguageSteps from "../../framework/steps/language/LanguageSteps.js";
import {
  generateAccountUpdateData,
} from "../../framework/datasets/accounts/accounts.data.js";

test.describe.serial("Flow03 - Accounts Modification And Validation", () => {
  let updateData;
  let sharedPage; // ← shared page across all tests
  let accountSteps;
  let topMenuActions; // ← Keep TopMenuActions in scope for all tests

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    
    updateData = generateAccountUpdateData();

    // Create one shared page and login once
    sharedPage = await browser.newPage();
    await sharedPage.goto(ENV.baseUrl);

    const loginActions = new LoginActions(
      new LoginPage(sharedPage),
      new MFAPage(sharedPage),
      sharedPage,
    );
    const mfaActions = new MFAActions(new MFAPage(sharedPage));
    const authSteps = new AuthSteps(loginActions, mfaActions);
    await authSteps.loginWithMFA();

    // Create one TopMenuActions instance and share it across LanguageSteps and AccountSteps
    topMenuActions = new TopMenuActions(new TopMenuPage(sharedPage));

    // Change language (using global test language from env)
    const languageSteps = new LanguageSteps(topMenuActions);
    await languageSteps.changeLanguageTo(ENV.testLanguage);
    console.log(`Flow03 running with language: ${ENV.testLanguage}`);

    // Build accountSteps with the same topMenuActions instance so language state is shared
    accountSteps = new AccountSteps(
      topMenuActions,
      new AccountFormActions(
        new AccountsPage(sharedPage),
        new AccountFormPage(sharedPage),
        new AccountDetailPage(sharedPage),
      ),
    );

    console.log("Flow03 setup complete — ready to search and edit accounts");
  });

  test.afterAll(async () => {
    await sharedPage.close();
  });

  // ── Test 1: Edit the account ──────────────────────────────────
  test("EditAccount", async () => {
    test.setTimeout(60000); // 60 second timeout for lead creation
    await accountSteps.searchAndEditAccount(updateData);
  });

  // ── Test 2: Validate data after update ────────────────────────
  test("ValidateDataAfterUpdate", async () => {
    test.setTimeout(60000); // 60 second timeout for lead creation
    await accountSteps.validateAccountUpdate(updateData);
  });
});
