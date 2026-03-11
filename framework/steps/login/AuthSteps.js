class AuthSteps {
  constructor(loginActions, mfaActions) {
    this.loginActions = loginActions;
    this.mfaActions = mfaActions;
  }

  async loginWithMFA() {
    await this.loginActions.loginToSalesforce();
    await this.mfaActions.submitMFA();
  }
}

export default AuthSteps;