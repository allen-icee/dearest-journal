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
  pageNumber: number;
  date: string | null;
  content: string;
}

import { type JournalConfig } from './journalConfig';

export interface JournalDocument {
  month: number;
  year: number;
  pages: JournalPageData[];
  coverColor?: string; // Deprecated: use config.frontCover.color
  config?: JournalConfig;
}

// Deprecated Phase 1 interface
export interface JournalEntry {
  id: string;
  date: string;
  content: string[];
}
