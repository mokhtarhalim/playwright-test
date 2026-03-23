import { faker } from "@faker-js/faker";

// Some Picklist values as they exist in Salesforce org
const INDUSTRY_VALUES = ["Finance", "Healthcare", "Retail"];
const TYPE_VALUES = ["Prospect"];
const RATING_VALUES = ["Hot", "Warm", "Cold"];

// Pick a random value from an array
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Each call to generateAccountData() produces a unique record
const generateAccountData = () => ({
  // ── Basic Info ───────────────────────────────────────────────
  accountName: `${faker.company.name()} ${faker.string.alphanumeric(5).toUpperCase()}`,
  accountNumber: faker.string.numeric(8),
  accountSite: faker.location.city(),
  phone: faker.phone.number("+1 (###) ###-####"),
  fax: faker.phone.number("+1 (###) ###-####"),
  website: faker.internet.url(),

  // ── Picklists ────────────────────────────────────────────────
  type: randomFrom(TYPE_VALUES),
  industry: randomFrom(INDUSTRY_VALUES),
  rating: randomFrom(RATING_VALUES),

  // ── Billing Address ──────────────────────────────────────────
  billingStreet: faker.location.streetAddress(),
  billingCity: faker.location.city(),
  billingState: faker.location.state(),
  billingPostal: faker.location.zipCode(),
  billingCountry: faker.location.country(),

  // ── Shipping Address ─────────────────────────────────────────
  shippingStreet: faker.location.streetAddress(),
  shippingCity: faker.location.city(),
  shippingState: faker.location.state(),
  shippingPostal: faker.location.zipCode(),
  shippingCountry: faker.location.country(),
});

// Generate unique account update data (only fields being updated)
const generateAccountUpdateData = () => ({
  accountName: `${faker.company.name()} ${faker.string.alphanumeric(5).toUpperCase()}`,
  phone: faker.phone.number("+1 (###) ###-####"),
  website: faker.internet.url(),
  industry: randomFrom(INDUSTRY_VALUES),
});

export { generateAccountData, generateAccountUpdateData, INDUSTRY_VALUES, TYPE_VALUES, RATING_VALUES };
