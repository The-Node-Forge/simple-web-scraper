import * as fs from 'fs';

/**
 * Exports the provided data as a JSON file.
 * @param data - The data to export.
 * @param filePath - The output file path.
 */
export function exportToJSON(data: any, filePath: string): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data exported to JSON file at ${filePath}`);
}

/**
 * Exports the provided data as a CSV file.
 * If a single object is provided, it will be wrapped in an array.
 * @param data - The data to export (object or array of objects).
 * @param filePath - The output file path.
 */
export function exportToCSV(data: any | any[], filePath: string): void {
  // ensure the data is an array
  const arrData = Array.isArray(data) ? data : [data];

  if (arrData.length === 0) {
    console.log('No data to export');
    return;
  }

  // extract the keys (column headers) from the first object in the array
  const headers = Object.keys(arrData[0]);
  const csvRows: string[] = [];

  // create CSV header row
  csvRows.push(headers.join(','));

  // create CSV data row
  for (const row of arrData) {
    const values = headers.map((header) => {
      let value = row[header];

      // ensure values are formatted correctly for CSV
      if (typeof value === 'string') {
        // escape double quotes by doubling them up
        value = value.replace(/"/g, '""');

        // if value contains a comma, wrap it in double quotes
        if (value.indexOf(',') >= 0) {
          value = `"${value}"`;
        }
      }
      return value;
    });

    csvRows.push(values.join(','));
  }

  fs.writeFileSync(filePath, csvRows.join('\n'));
  console.log(`Data exported to CSV file at ${filePath}`);
}
