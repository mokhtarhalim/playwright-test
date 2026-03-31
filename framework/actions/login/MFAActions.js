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
      console.log('MFA code entered, clicking verify button...');
      
      // Click verify button and wait for potential navigation
      await this.mfaPage.verifyButton.click();
      
      // Wait for any redirect/navigation to complete
      try {
        await this.mfaPage.mfaInput.page().waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 });
        console.log('Navigation completed after MFA verification');
      } catch (e) {
        console.log('Navigation check completed or no navigation needed');
      }
      
      // Give the page time to fully load after redirect
      await this.mfaPage.mfaInput.page().waitForTimeout(3000);

    } catch {
      // MFA input never appeared — MFA not required
      console.log('MFA not required or already passed.');
    }
  }
}

export default MFAActions;