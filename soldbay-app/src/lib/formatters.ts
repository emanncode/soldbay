/**
 * Formats a raw string of digits with thousand separators (commas).
 * Strips non-digit characters and normalizes leading zeros.
 * 
 * Examples:
 * "" -> ""
 * "0" -> "0"
 * "500" -> "500"
 * "1000" -> "1,000"
 * "15000" -> "15,000"
 * "450000" -> "450,000"
 */
export function formatPriceInput(value: string): string {
  const cleanDigits = value.replace(/\D/g, '');
  if (!cleanDigits) return '';

  // Normalize leading zeros (e.g., "05" -> "5", but leave single "0" alone)
  const normalized = cleanDigits.replace(/^0+(?=\d)/, '');

  // Insert commas every 3 digits
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Strips formatting commas and non-digits to return raw numeric digits.
 * 
 * Examples:
 * "15,000" -> "15000"
 * "450,000" -> "450000"
 */
export function parseRawPrice(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formats a number or string into standard Naira currency format.
 * 
 * Example:
 * 15000 -> "₦15,000"
 */
export function formatNaira(amount: number | string): string {
  const num = typeof amount === 'string' ? Number(parseRawPrice(amount)) : amount;
  if (isNaN(num)) return '₦0';
  return `₦${num.toLocaleString('en-US')}`;
}
