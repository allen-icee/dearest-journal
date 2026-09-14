import { type JournalPageData } from '../types/journal';

/**
 * Returns the number of days in a given month and year.
 * @param month 1-indexed month (1 = January, 12 = December)
 * @param year full year (e.g., 2026)
 */
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Generates an array of JournalPageData representing exactly the calendar days in the month.
 * Does NOT generate fake filler pages.
 */
export function generateMonthPages(month: number, year: number, initialContent: string = ''): JournalPageData[] {
  const days = getDaysInMonth(month, year);
  const pages: JournalPageData[] = [];

  for (let i = 1; i <= days; i++) {
    // MM-DD-YYYY format
    const mm = String(month).padStart(2, '0');
    const dd = String(i).padStart(2, '0');
    const yyyy = year;

    pages.push({
      pageNumber: i, // Physical page number within the calendar (1 to days)
      date: `${mm}-${dd}-${yyyy}`,
      content: i === 1 ? initialContent : '' // only pre-fill day 1 if provided
    });
  }

  return pages;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
