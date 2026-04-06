import { NextResponse } from 'next/server';

/**
 * Escapes a CSV field: wraps in quotes, escapes internal quotes.
 */
function escapeField(value: unknown): string {
  const str = value == null ? '' : String(value);
  // Always quote to handle commas, newlines, quotes
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Generates a CSV NextResponse with UTF-8 BOM for universal compatibility.
 * Works correctly with Google Sheets, Apple Numbers, and Excel.
 */
export function csvResponse(
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][],
  filename: string
): NextResponse {
  const headerLine = headers.map(escapeField).join(',');
  const dataLines = rows.map(row => row.map(escapeField).join(','));
  const csvContent = [headerLine, ...dataLines].join('\r\n');

  // UTF-8 BOM ensures Excel/Numbers detect encoding correctly
  const BOM = '\uFEFF';
  const body = BOM + csvContent;

  // Add date to filename
  const date = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${date}.csv`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fullFilename}"`,
    },
  });
}
