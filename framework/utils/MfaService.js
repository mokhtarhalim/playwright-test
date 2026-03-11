import * as OTPAuth from 'otpauth';

function generateMfaCode() {
  const secret = process.env.TOTP_SECRET;
  if (!secret) throw new Error('TOTP_SECRET undefined');

  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(secret),
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  });

  return totp.generate();
}

export { generateMfaCode };