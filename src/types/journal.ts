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

export interface JournalEntry {
  id: string;
  date: string; // MM-DD-YYYY
  content: string[]; // Array of strings where each string might represent a paragraph or line, depending on Phase 2 implementation. For Phase 1 we will pass it simply as text.
}
