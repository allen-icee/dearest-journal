import { type JournalPageData, MAX_INTERIOR_PAGES } from '../types/journal';

/**
 * Returns the number of days in a given month and year.
 * @param month 1-12
 * @param year e.g. 2026
 */
export function getDaysInMonth(month: number, year: number): number {
  // Day 0 of the next month is the last day of the current month
  return new Date(year, month, 0).getDate();
}

/**
 * Generates an array of exactly 32 page slots.
 * The first N slots are dated based on the days in the month.
 * The remaining slots are blank filler pages.
 */
export function generateMonthPages(month: number, year: number, sampleContent: string[] = []): JournalPageData[] {
  const days = getDaysInMonth(month, year);
  const pages: JournalPageData[] = [];

  for (let i = 1; i <= MAX_INTERIOR_PAGES; i++) {
    const isDated = i <= days;
    const dateStr = isDated 
      ? `${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}-${year}` 
      : undefined;

    // For demonstration, only add sample content to the first few pages
    const content = i <= 3 ? sampleContent : [];

    pages.push({
      pageNumber: i,
      date: dateStr,
      content: content
    });
  }

  return pages;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
