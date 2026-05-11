import { compareCsvFiles } from './framework/utils/CsvComparator.js';
const result = compareCsvFiles('./tests/csv/data/original.csv', './tests/csv/data/extracted.csv', {
  keyColumns: ['External Id'],
  extractedKeyColumns: ['External Id'],
  fieldMapping: {
    'External Id': 'External Id',
    'Account Name': 'Name',
  },
  ignoreCase: true,
  failureCsvPath: './tests/csv/data/csv-failure-report-debug.csv',
  failureCsvDelimiter: ';',
});
console.log(JSON.stringify(result, null, 2));
