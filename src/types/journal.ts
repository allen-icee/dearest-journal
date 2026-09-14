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

export const MAX_INTERIOR_PAGES = 32;

export interface JournalPageData {
  pageNumber: number;
  date?: string; // MM-DD-YYYY if dated, otherwise undefined for filler
  content: string[]; 
}

export interface JournalDocument {
  month: number; // 1-12
  year: number;
  pages: JournalPageData[]; // Exactly 32 items
}

// Deprecated Phase 1 interface
export interface JournalEntry {
  id: string;
  date: string;
  content: string[];
}
