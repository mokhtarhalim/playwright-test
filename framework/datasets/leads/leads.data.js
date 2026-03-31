import { faker } from "@faker-js/faker";

const INDUSTRY_VALUES = ["Finance", "Healthcare", "Retail"];
const RATING_VALUES = ["Hot", "Warm", "Cold"];
const LEAD_SOURCE_VALUES = [
  "Web",
  "Phone Inquiry",
  "Partner Referral",
  "Purchased List",
];
const LEAD_STATUS_VALUES = [
  "Open - Not Contacted",
  "Working - Contacted",
  "Closed - Not Converted",
];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateLeadData = () => ({
  lastName: `${faker.person.lastName()} ${faker.string.alphanumeric(3).toUpperCase()}`,
  firstName: faker.person.firstName(),
  company: faker.company.name(),
  title: faker.person.jobTitle(),
  phone: faker.phone.number("+1 (###) ###-####"),
  mobile: faker.phone.number("+1 (###) ###-####"),
  email: faker.internet.email(),
  website: faker.internet.url(),
  industry: randomFrom(INDUSTRY_VALUES),
  rating: randomFrom(RATING_VALUES),
  leadSource: randomFrom(LEAD_SOURCE_VALUES),
  leadStatus: randomFrom(LEAD_STATUS_VALUES),
  mailingStreet: faker.location.streetAddress(),
  mailingCity: faker.location.city(),
  mailingState: faker.location.state(),
  mailingPostal: faker.location.zipCode(),
  mailingCountry: faker.location.country(),
});

const generateLeadUpdateData = () => ({
  lastName: `${faker.person.lastName()} ${faker.string.alphanumeric(3).toUpperCase()}`,
  phone: faker.phone.number("+1 (###) ###-####"),
  email: faker.internet.email(),
  website: faker.internet.url(),
  industry: randomFrom(INDUSTRY_VALUES),
  rating: randomFrom(RATING_VALUES),
});

export {
  generateLeadData,
  generateLeadUpdateData,
  INDUSTRY_VALUES,
  RATING_VALUES,
  LEAD_SOURCE_VALUES,
};
