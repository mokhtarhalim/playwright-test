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

// Dataset
import { generateAccountData } from "../../framework/datasets/accounts/accounts.data.js";

// ─── Flow 04 — Accounts Deletion ────────────────────────────────────────────
test.describe.serial("Flow04 - Accounts Deletion", () => {
  let accountData;
  let sharedPage;
  let accountSteps;

  test.beforeAll(async ({ browser }) => {
    accountData = generateAccountData();

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

    // Build accountSteps once
    accountSteps = new AccountSteps(
      new TopMenuActions(new TopMenuPage(sharedPage)),
      new AccountFormActions(
        new AccountsPage(sharedPage),
        new AccountFormPage(sharedPage),
        new AccountDetailPage(sharedPage),
      ),
    );

    // Create account once — prerequisite for deletion
    console.log("Creating account for Flow04:", accountData.accountName);
    await accountSteps.createNewAccount(accountData);
    console.log("Account created — ready for deletion test");
  });

  test.afterAll(async () => {
    await sharedPage.close();
  });

  // ── Test 1: Delete the account ────────────────────────────────
  test("DeleteAccount", async () => {
    await accountSteps.deleteAccount();
  });

  // ── Test 2: Validate deletion via toast ───────────────────────
  test("ValidateDeletionToast", async () => {
    await accountSteps.validateAccountDeletion();
  });
});
