import * as fs from 'fs';

/**
 * Exports the provided data as a JSON file.
 * @param data - The data to export.
 * @param filePath - The output file path.
 */
export function exportToJSON(data: unknown, filePath: string): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data exported to JSON file at: ${filePath}`);
}

const FORMULA_PREFIX = /^[=+\-@\t\r]/;

/**
 * Prefixes string cells that spreadsheet apps would interpret as formulas
 * (`=`, `+`, `-`, `@`, tab, CR) with a single quote, so scraped content like
 * `=HYPERLINK(...)` is shown as text instead of executed (CSV injection).
 */
function neutralizeFormula(value: string): string {
  return FORMULA_PREFIX.test(value) ? `'${value}` : value;
}

/**
 * Exports the provided data as a CSV file.
 * If a single object is provided, it will be wrapped in an array.
 * @param data - The data to export (object or array of objects).
 * @param filePath - The output file path.
 * @param options - `preserveNulls` keeps null/undefined as "null"; `sanitizeFormulas`
 *   (default true) neutralizes cells starting with `=`, `+`, `-`, `@`.
 */
export function exportToCSV(
  data: unknown | unknown[],
  filePath: string,
  options: { preserveNulls?: boolean; sanitizeFormulas?: boolean } = {},
): void {
  const { preserveNulls = false, sanitizeFormulas = true } = options;

  const arrData = Array.isArray(data) ? data : [data];

  if (arrData.length === 0) {
    console.log('No data to export');
    return;
  }

  const headers = Object.keys(arrData[0]);
  const csvRows: string[] = [];

  const escape = (text: string): string => {
    const safe = sanitizeFormulas ? neutralizeFormula(text) : text;
    return `"${safe.replace(/"/g, '""')}"`;
  };

  csvRows.push(headers.map((header) => escape(header)).join(','));

  for (const row of arrData) {
    const values = headers.map((header) => {
      let value = row[header];

      if (value === null || value === undefined) {
        return preserveNulls ? `"null"` : `""`;
      }

      // numbers/booleans can't carry formulas ("-5" is data, not an expression)
      if (typeof value !== 'string') {
        return `"${String(value).replace(/"/g, '""')}"`;
      }

      return escape(value);
    });

    csvRows.push(values.join(','));
  }

  fs.writeFileSync(filePath, csvRows.join('\n'), 'utf-8');
  console.log(`Data exported to CSV file at: ${filePath}`);
}
