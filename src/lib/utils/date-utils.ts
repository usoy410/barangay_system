/**
 * Utility functions for date formatting and age calculations.
 */

/**
 * Calculates the age based on a birth date.
 * @param birthDate - The date of birth.
 * @returns The calculated age in years.
 */
export function calculateAge(birthDate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Gets the ordinal suffix for a given number.
 * @param n - The number to get the ordinal for.
 * @returns The number with its ordinal suffix (e.g., "1st", "2nd", "3rd").
 */
export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Formats a date into a full readable string (e.g., "January 19, 2026").
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}
