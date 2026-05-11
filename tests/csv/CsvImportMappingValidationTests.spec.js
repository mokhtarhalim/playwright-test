import { test, expect } from "@playwright/test";
import path from "path";
import { compareCsvFiles } from "../../framework/utils/CsvComparator.js";

const originalCsvPath = process.env.ORIGINAL_CSV_PATH || path.join(process.cwd(), "tests", "csv", "data", "original.csv");
const extractedCsvPath = process.env.EXTRACTED_CSV_PATH || path.join(process.cwd(), "tests", "csv", "data", "extracted.csv");

const fieldMapping = {
  // Map original CSV columns to the Salesforce extract CSV columns.
  // Example: "Original CSV Header": "Salesforce Extract Header"
  "External Id": "External Id",
  "Account Name": "Name",
};

const keyColumns = ["External Id"];
const failureCsvPath = process.env.CSV_FAILURE_PATH || path.join(process.cwd(), "tests", "csv", "data", "csv-failure-report.csv");

test.describe("CSV Import Mapping Validation", () => {
  test("Validate Salesforce import matches original CSV file", () => {
    const result = compareCsvFiles(originalCsvPath, extractedCsvPath, {
      keyColumns,
      extractedKeyColumns: keyColumns,
      fieldMapping,
      ignoreCase: true,
      failureCsvPath,
      failureCsvDelimiter: ";",
    });

    if (!result.isSuccess) {
      console.error("CSV comparison result:", JSON.stringify(result, null, 2));
      console.error(`CSV validation failed with ${result.unmatchedOriginal.length} unmatched original rows, ${result.unmatchedExtracted.length} unmatched extracted rows, ${result.mismatches.length} mismatches.`);
      if (result.failureCsvPath) {
        console.error(`Failure CSV report written to: ${result.failureCsvPath}`);
      }
    }

    expect.soft(result.unmatchedOriginal, "Records in original CSV missing from Salesforce extract").toEqual([]);
    expect.soft(result.unmatchedExtracted, "Records in Salesforce extract missing from original CSV").toEqual([]);
    expect.soft(result.mismatches, "Mapped fields do not match between original CSV and Salesforce extract").toEqual([]);
    expect(result.isSuccess, `CSV validation failed. See ${result.failureCsvPath || 'result details'}`).toBe(true);
  });
});
