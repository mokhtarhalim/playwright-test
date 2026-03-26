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

// Dataset
import { generateAccountData } from "../../framework/datasets/accounts/accounts.data.js";

// ─── Flow 02 — Accounts Creation & Validation ───────────────────────────────
test.describe.serial("Flow02 - Accounts Creation And Validation", () => {
  let page;
  let accountData;
  let accountSteps;
  let topMenuActions; // Keep TopMenuActions in scope for all tests

  // Login ONCE before all tests — shared session
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    
    accountData = generateAccountData();
    console.log("Generated account data:", accountData);

    // Create a single shared page for all tests in this suite
    page = await browser.newPage();
    await page.goto(ENV.baseUrl);

    const loginPage = new LoginPage(page);
    const mfaPage = new MFAPage(page);
    const loginActions = new LoginActions(loginPage, mfaPage, page);
    const mfaActions = new MFAActions(mfaPage);
    const authSteps = new AuthSteps(loginActions, mfaActions);

    await authSteps.loginWithMFA();
    console.log("Logged in once — session shared across all tests");

    // Create one TopMenuActions instance and share it across LanguageSteps and AccountSteps
    topMenuActions = new TopMenuActions(new TopMenuPage(page));

    // Change language (using global test language from env)
    const languageSteps = new LanguageSteps(topMenuActions);
    await languageSteps.changeLanguageTo(ENV.testLanguage);
    console.log(`Flow02 running with language: ${ENV.testLanguage}`);

    // Build accountSteps with the same topMenuActions instance so language state is shared
    accountSteps = new AccountSteps(
      topMenuActions,
      new AccountFormActions(
        new AccountsPage(page),
        new AccountFormPage(page),
        new AccountDetailPage(page),
      ),
    );
  });

  // Close the shared page after all tests
  test.afterAll(async () => {
    await page.close();
  });

  // ── Test 1: Create a new Account ─────────────────────────────────────────
  test("CreateNewAccount", async () => {
    test.setTimeout(60000); // 60 second timeout for account creation
    await accountSteps.createNewAccount(accountData);
  });

  // ── Test 2: Validate data after creation ─────────────────────────────────
  test("ValidateDataAfterCreation", async () => {
    test.setTimeout(30000);
    await accountSteps.validateAccountCreation(accountData);
  });
});
