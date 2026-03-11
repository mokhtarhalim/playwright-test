import { generateMfaCode } from '../../utils/MfaService.js';

class MFAActions {
  constructor(mfaPage) {
    this.mfaPage = mfaPage;
  }

  async submitMFA() {
    try {
      // Wait for MFA input to appear
      await this.mfaPage.mfaInput.waitFor({ state: 'visible', timeout: 8000 });

      const otp = generateMfaCode(); // no await needed, it's synchronous now
      console.log('Generated OTP:', otp);

      await this.mfaPage.mfaInput.fill(otp);
      await this.mfaPage.verifyButton.click();

    } catch {
      // MFA input never appeared — MFA not required
      console.log('MFA not required or already passed.');
    }
  }
}

export default MFAActions;