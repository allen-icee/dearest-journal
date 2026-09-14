export interface JournalPageMetrics {
  width: "15cm";
  height: "21.6cm";
  headerHeight: "1.4cm";
  footerHeight: "1cm";
  bodyTopSpacing: "0.6cm";
  totalLines: 32;
}

export const JOURNAL_METRICS: JournalPageMetrics = {
  width: "15cm",
  height: "21.6cm",
  headerHeight: "1.4cm",
  footerHeight: "1cm",
  bodyTopSpacing: "0.6cm",
  totalLines: 32,
};

export interface JournalPageData {
  pageNumber: number; // The physical slot number of the calendar day
  date: string | null; // e.g., "09-14-2026"
  content: string; // HTML rich text content
}

export interface JournalDocument {
  month: number;
  year: number;
  pages: JournalPageData[]; // Exactly 32 items
}

// Deprecated Phase 1 interface
export interface JournalEntry {
  id: string;
  date: string;
  content: string[];
}
