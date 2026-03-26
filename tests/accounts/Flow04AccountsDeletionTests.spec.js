import { test } from "@playwright/test";

import ENV from "../../framework/config/env.js";

// Objects
import LoginPage from "../../framework/objects/login/LoginPage.js";
import MFAPage from "../../framework/objects/login/MFAPage.js";
import TopMenuPage from "../../framework/objects/topmenu/TopMenuPage.js";
import AccountsPage from "../../framework/objects/accounts/AccountsPage.js";
import AccountFormPage from "../../framework/objects/accounts/AccountFormPage.js";
import AccountDetailPage from "../../framework/objects/accounts/AccountDetailPage.js";

// Actions
import LoginActions from "../../framework/actions/login/LoginActions.js";
import MFAActions from "../../framework/actions/login/MFAActions.js";
import TopMenuActions from "../../framework/actions/topmenu/TopMenuActions.js";
import AccountFormActions from "../../framework/actions/accounts/AccountFormActions.js";

// Steps
import AuthSteps from "../../framework/steps/login/AuthSteps.js";
import AccountSteps from "../../framework/steps/accounts/AccountSteps.js";
import LanguageSteps from "../../framework/steps/language/LanguageSteps.js";

// ─── Flow 04 — Accounts Deletion ────────────────────────────────────────────
test.describe.serial("Flow04 - Accounts Deletion", () => {
  let sharedPage;
  let accountSteps;
  let topMenuActions; // ← Keep TopMenuActions in scope for all tests

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    
    // Create shared page and login once
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
    console.log(`Flow04 running with language: ${ENV.testLanguage}`);

    // Build accountSteps with the same topMenuActions instance so language state is shared
    accountSteps = new AccountSteps(
      topMenuActions,
      new AccountFormActions(
        new AccountsPage(sharedPage),
        new AccountFormPage(sharedPage),
        new AccountDetailPage(sharedPage),
      ),
    );

    console.log("Flow04 setup complete — ready to search and delete accounts");
  });

  test.afterAll(async () => {
    await sharedPage.close();
  });

  // ── Test 1: Delete the account ────────────────────────────────
  test("DeleteAccount", async () => {
    test.setTimeout(60000); // 60 second timeout for account deletion
    await accountSteps.searchAndDeleteAccount();
  });

  // ── Test 2: Validate deletion via toast ───────────────────────
  test("ValidateDeletionToast", async () => {
    test.setTimeout(30000);
    await accountSteps.validateAccountDeletion();
  });
});
