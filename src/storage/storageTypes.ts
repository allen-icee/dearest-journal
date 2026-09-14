import { type JournalDocument } from '../types/journal';

export const CURRENT_SCHEMA_VERSION = 1;

export interface StoredJournal {
  id: string; // "YYYY-MM"
  schemaVersion: number;
  updatedAt: number;
  document: JournalDocument;
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';
