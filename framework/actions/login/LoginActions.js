import ENV from "../../config/env.js";
import MFAActions from "./MFAActions";
import HomePage from "../../objects/home/HomePage";

class LoginActions {
  constructor(loginPage, mfaPage, page) {
    this.loginPage = loginPage;
    this.mfaActions = new MFAActions(mfaPage);
    this.page = page;
  }

  async loginToSalesforce() {
    // Fill login form
    await this.loginPage.usernameInput.fill(ENV.username);
    await this.loginPage.passwordInput.fill(ENV.password);
    await this.loginPage.loginButton.click();

    // Handle MFA
    await this.mfaActions.submitMFA();

    // Verify home page loaded
    await this.verifyHomePage();
  }

  async verifyHomePage() {
    const homePage = new HomePage(this.page);
    await homePage.waitForPageLoad();
    console.log("Home page loaded, login successful!");
  }
}

export default LoginActions;