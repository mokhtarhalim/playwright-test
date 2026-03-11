//We put locators only in the Ojbjects layer
class LoginPage {

  constructor(page) {
    this.page = page;

    this.usernameInput = page.locator('[name="username"]');
    this.passwordInput = page.locator('[name="pw"]');
    this.loginButton = page.locator('[name="Login"]');

  }

}

export default LoginPage;