import dotenv from "dotenv"; 
dotenv.config();

const ENV = {
  baseUrl: process.env.BASE_URL,
  username: process.env.SF_USERNAME,
  password: process.env.SF_PASSWORD,
  totpSecret: process.env.TOTP_SECRET,

  // Global language for all tests
  testLanguage: process.env.TEST_LANGUAGE || "English",
};

export default ENV;
