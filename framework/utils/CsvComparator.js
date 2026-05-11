/**
 * CsvComparator utility
 *
 * Use this utility to compare an original import CSV and a Salesforce-exported CSV.
 * It matches rows by key columns and verifies that mapped fields contain the same values.
 *
 * Example:
 *   import { compareCsvFiles } from "../../framework/utils/CsvComparator.js";
 *   const result = compareCsvFiles("original.csv", "extracted.csv", {
 *     keyColumns: ["External Id"],
 *     extractedKeyColumns: ["External Id"],
 *     fieldMapping: {
 *       "External Id": "External Id",
 *       "Account Name": "Name",
 *       "Phone": "Phone",
 *     },
 *     ignoreCase: true,
 *   });
 *
 * Result:
 *   - isSuccess: true when there are no missing records or mismatches
 *   - unmatchedOriginal: original rows not found in extracted file
 *   - unmatchedExtracted: extracted rows not found in original file
 *   - mismatches: fields that differ based on the provided mapping
 */
import fs from "fs";
import path from "path";

function parseCsv(content, delimiter = ",") {
  let rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
      i += 1;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(current);
      current = "";
      i += 1;
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      i += 1;
      continue;
    }

    current += char;
    i += 1;
  }

  if (current !== "" || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  rows = rows.filter((row) => row.some((field) => String(field).trim() !== ""));

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  const records = rows.slice(1).map((fields) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = fields[index] !== undefined ? fields[index].trim() : "";
    });
    return record;
  });

  return records;
}

function normalizeValue(value, options) {
  if (value === undefined || value === null) {
    return "";
  }
  let normalized = String(value).trim();
  if (options?.ignoreCase) {
    normalized = normalized.toLowerCase();
  }
  return normalized;
}

function buildRecordKey(record, keyColumns, options = {}) {
  return keyColumns
    .map((column) => normalizeValue(record[column], options))
    .join("||");
}

function normalizeHeader(header, options = {}) {
  if (header === undefined || header === null) {
    return "";
  }
  let normalized = String(header).trim();
  if (options.ignoreCase) {
    normalized = normalized.toLowerCase();
  }
  return normalized;
}

function detectDelimiter(content, options = {}) {
  const headerLine = content.split(/\r?\n/)[0] || "";
  const delimiters = options.delimiters || [",", ";", "\t", "|"];
  let bestDelimiter = delimiters[0];
  let bestCount = -1;

  delimiters.forEach((delimiter) => {
    const count = headerLine.split(delimiter).length - 1;
    if (count > bestCount) {
      bestCount = count;
      bestDelimiter = delimiter;
    }
  });

  return bestDelimiter;
}

function autoMapHeaders(originalHeaders, extractedHeaders, options = {}) {
  const map = {};
  const extractedIndex = new Map();

  extractedHeaders.forEach((header) => {
    extractedIndex.set(normalizeHeader(header, options), header);
  });

  originalHeaders.forEach((header) => {
    const normalized = normalizeHeader(header, options);
    if (extractedIndex.has(normalized)) {
      map[header] = extractedIndex.get(normalized);
    }
  });

  return map;
}

function readCsvHeaders(filePath, delimiter = ",") {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf8");
  const firstLine = content.split(/\r?\n/)[0] || "";
  const headers = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < firstLine.length; i += 1) {
    const char = firstLine[i];
    const nextChar = firstLine[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      headers.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  headers.push(current.trim());
  return headers;
}

function buildFailureRow(failureType, error, key, originalHeaders, extractedHeaders, originalRow = {}, extractedRow = {}) {
  const row = {
    failureType,
    error,
    key,
  };

  originalHeaders.forEach((header) => {
    row[`original_${header}`] = originalRow[header] || "";
  });

  extractedHeaders.forEach((header) => {
    row[`extracted_${header}`] = extractedRow[header] || "";
  });

  return row;
}

function writeCsvFile(filePath, headers, rows, delimiter = ",") {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const escaped = (value) => {
    const stringValue = value === undefined || value === null ? "" : String(value);
    const needsQuotes = /[",\n\r]/.test(stringValue);
    const escapedValue = stringValue.replace(/"/g, '""');
    return needsQuotes ? `"${escapedValue}"` : escapedValue;
  };

  const content = [headers.join(delimiter)];
  rows.forEach((row) => {
    const line = headers.map((header) => escaped(row[header]));
    content.push(line.join(delimiter));
  });

  try {
    fs.writeFileSync(filePath, content.join("\n"), "utf8");
    return filePath;
  } catch (error) {
    if (error.code === "EBUSY" || error.code === "EPERM" || error.code === "EACCES") {
      const fallbackPath = filePath.replace(/\.csv$/i, `.${Date.now()}.csv`);
      fs.writeFileSync(fallbackPath, content.join("\n"), "utf8");
      return fallbackPath;
    }
    throw error;
  }
}

function writeFailureCsvReport(result, originalHeaders, extractedHeaders, failureCsvPath, delimiter = ",") {
  const rows = [];

  result.unmatchedOriginal.forEach((item) => {
    rows.push(buildFailureRow(
      "unmatchedOriginal",
      "Original row not found in extracted CSV",
      item.key,
      originalHeaders,
      extractedHeaders,
      item.row,
      {},
    ));
  });

  result.unmatchedExtracted.forEach((item) => {
    rows.push(buildFailureRow(
      "unmatchedExtracted",
      item.note || "Extracted row not found in original CSV",
      item.key,
      originalHeaders,
      extractedHeaders,
      {},
      item.row,
    ));
  });

  result.mismatches.forEach((item) => {
    const row = buildFailureRow(
      "mismatch",
      `Value mismatch for field '${item.originalField}' -> '${item.extractedField}'`,
      item.key,
      originalHeaders,
      extractedHeaders,
      item.originalRow,
      item.extractedRow,
    );
    rows.push(row);
  });

  if (rows.length === 0) {
    return;
  }

  const headers = ["failureType", "error", "key", ...originalHeaders.map((h) => `original_${h}`), ...extractedHeaders.map((h) => `extracted_${h}`)];
  return writeCsvFile(failureCsvPath, headers, rows, delimiter);
}

/**
 * Compare two CSV files using a key mapping and field mapping.
 *
 * @param {string} originalCsvPath - Path to the original CSV file.
 * @param {string} extractedCsvPath - Path to the Salesforce-exported CSV file.
 * @param {Object} [options={}] - Comparison options.
 * @param {string} [options.delimiter=","] - CSV delimiter.
 * @param {string|string[]} options.keyColumns - Column(s) used to match rows in the original file.
 * @param {string|string[]} [options.extractedKeyColumns] - Column(s) used to match rows in the extracted file.
 *   If omitted, uses the same columns as keyColumns.
 * @param {Object} [options.fieldMapping={}] - Mapping of original column names to extracted column names.
 *   Example: { "Account Name": "Name", "Phone": "Phone" }
 *   If omitted, exact matching headers are automatically mapped.
 * @param {boolean} [options.ignoreCase=false] - Whether to compare values case-insensitively.
 * @param {string} [options.failureCsvPath] - Optional path to write a failure report CSV when there are mismatches or missing rows.
 * @param {string} [options.failureCsvDelimiter] - Optional delimiter for the failure report CSV. Defaults to the same delimiter as the input files.
 * @returns {Object} Comparison result with counts, unmatched rows, mismatches, boolean flags, success state, and failureCsvPath when written.
 */
function compareCsvFiles(originalCsvPath, extractedCsvPath, options = {}) {
  if (!fs.existsSync(originalCsvPath)) {
    throw new Error(`Original CSV file not found: ${originalCsvPath}`);
  }
  if (!fs.existsSync(extractedCsvPath)) {
    throw new Error(`Extracted CSV file not found: ${extractedCsvPath}`);
  }

  const originalContent = fs.readFileSync(originalCsvPath, "utf8");
  const extractedContent = fs.readFileSync(extractedCsvPath, "utf8");
  const delimiter = options.delimiter || detectDelimiter(originalContent, options);
  const originalRows = parseCsv(originalContent, delimiter);
  const extractedRows = parseCsv(extractedContent, delimiter);
  const failureCsvDelimiter = options.failureCsvDelimiter || delimiter;
  const failureCsvPath = options.failureCsvPath;

  const keyColumns = Array.isArray(options.keyColumns)
    ? options.keyColumns
    : [options.keyColumns];
  const extractedKeyColumns = Array.isArray(options.extractedKeyColumns)
    ? options.extractedKeyColumns
    : options.keyColumns || keyColumns;

  if (!keyColumns || keyColumns.length === 0) {
    throw new Error("compareCsvFiles requires at least one keyColumns value.");
  }

  const compareOptions = { ignoreCase: Boolean(options.ignoreCase) };
  let fieldMapping = options.fieldMapping || {};
  const originalHeaders = originalRows.length ? Object.keys(originalRows[0]) : [];
  const extractedHeaders = extractedRows.length ? Object.keys(extractedRows[0]) : [];

  if (Object.keys(fieldMapping).length === 0) {
    fieldMapping = autoMapHeaders(originalHeaders, extractedHeaders, compareOptions);
  } else {
    const autoMapped = autoMapHeaders(originalHeaders, extractedHeaders, compareOptions);
    fieldMapping = { ...autoMapped, ...fieldMapping };
  }

  const extractedMap = new Map();
  extractedRows.forEach((row) => {
    const recordKey = buildRecordKey(row, extractedKeyColumns, compareOptions);
    if (!extractedMap.has(recordKey)) {
      extractedMap.set(recordKey, []);
    }
    extractedMap.get(recordKey).push(row);
  });

  const result = {
    originalCount: originalRows.length,
    extractedCount: extractedRows.length,
    matchedCount: 0,
    unmatchedOriginal: [],
    unmatchedExtracted: [],
    mismatches: [],
    hasUnmatchedOriginal: false,
    hasUnmatchedExtracted: false,
    hasMismatches: false,
  };

  const matchedExtractedKeys = new Set();

  originalRows.forEach((originalRow, index) => {
    const key = buildRecordKey(originalRow, keyColumns, compareOptions);
    const extractedCandidates = extractedMap.get(key) || [];

    if (extractedCandidates.length === 0) {
      result.unmatchedOriginal.push({ index: index + 1, row: originalRow, key });
      return;
    }

    const extractedRow = extractedCandidates.shift();
    matchedExtractedKeys.add(key);
    result.matchedCount += 1;

    Object.entries(fieldMapping).forEach(([originalField, extractedField]) => {
      const originalValue = normalizeValue(originalRow[originalField], compareOptions);
      const extractedValue = normalizeValue(extractedRow[extractedField], compareOptions);
      if (originalValue !== extractedValue) {
        result.mismatches.push({
          key,
          originalField,
          extractedField,
          expected: originalValue,
          actual: extractedValue,
          originalRow,
          extractedRow,
        });
      }
    });

    if (extractedCandidates.length > 0) {
      result.unmatchedExtracted.push({
        key,
        row: extractedCandidates.shift(),
        note: "Additional extracted record with same key",
      });
    }
  });

  extractedMap.forEach((rows, unmatchedKey) => {
    rows.forEach((row) => {
      if (!matchedExtractedKeys.has(unmatchedKey)) {
        result.unmatchedExtracted.push({ key: unmatchedKey, row });
      }
    });
  });

  result.hasUnmatchedOriginal = result.unmatchedOriginal.length > 0;
  result.hasUnmatchedExtracted = result.unmatchedExtracted.length > 0;
  result.hasMismatches = result.mismatches.length > 0;
  result.isSuccess =
    !result.hasUnmatchedOriginal &&
    !result.hasUnmatchedExtracted &&
    !result.hasMismatches;

  if (failureCsvPath && !result.isSuccess) {
    const originalHeaders = originalRows.length ? Object.keys(originalRows[0]) : [];
    const extractedHeaders = extractedRows.length ? Object.keys(extractedRows[0]) : [];
    const actualFailurePath = writeFailureCsvReport(result, originalHeaders, extractedHeaders, failureCsvPath, failureCsvDelimiter);
    if (actualFailurePath) {
      result.failureCsvPath = actualFailurePath;
    }
  }

  return result;
}

export { compareCsvFiles, readCsvHeaders, autoMapHeaders };
