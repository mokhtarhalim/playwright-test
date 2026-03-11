import { test } from "@playwright/test";

import ENV from "../framework/config/env.js";

import LoginPage from "../framework/objects/login/LoginPage.js";
import MFAPage from "../framework/objects/login/MFAPage.js";

import LoginActions from "../framework/actions/login/LoginActions.js";
import MFAActions from "../framework/actions/login/MFAActions.js";

import AuthSteps from "../framework/steps/login/AuthSteps.js";

test("Login to Salesforce with MFA", async ({ page }) => {
  await page.goto(ENV.baseUrl);

  const loginPage = new LoginPage(page);
  const mfaPage = new MFAPage(page);

  const loginActions = new LoginActions(loginPage, mfaPage, page);
  const mfaActions = new MFAActions(mfaPage);

  const authSteps = new AuthSteps(loginActions, mfaActions);

  await authSteps.loginWithMFA();
});
