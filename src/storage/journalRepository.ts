import { get, put, getAll, remove } from './db';
import { type StoredJournal, CURRENT_SCHEMA_VERSION } from './storageTypes';
import { type JournalDocument } from '../types/journal';

/**
 * Generates the stable ID for a journal document based on its month and year.
 */
export const generateJournalId = (month: number, year: number): string => {
  return `${year}-${String(month).padStart(2, '0')}`;
};

/**
 * Retrieves a journal from IndexedDB.
 */
export const getJournal = async (month: number, year: number): Promise<StoredJournal | null> => {
  const id = generateJournalId(month, year);
  try {
    const journal = await get<StoredJournal>(id);
    return journal || null;
  } catch (error) {
    console.error(`Failed to get journal ${id}`, error);
    return null;
  }
};

/**
 * Saves a journal document to IndexedDB.
 */
export const saveJournal = async (document: JournalDocument): Promise<void> => {
  const id = generateJournalId(document.month, document.year);
  const storedJournal: StoredJournal = {
    id,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    updatedAt: Date.now(),
    document
  };

  try {
    await put(storedJournal);
  } catch (error) {
    console.error(`Failed to save journal ${id}`, error);
    throw error;
  }
};

/**
 * Lists all persisted journals.
 */
export const listJournals = async (): Promise<StoredJournal[]> => {
  try {
    return await getAll<StoredJournal>();
  } catch (error) {
    console.error("Failed to list journals", error);
    return [];
  }
};

/**
 * Deletes a journal from IndexedDB.
 */
export const deleteJournal = async (month: number, year: number): Promise<void> => {
  const id = generateJournalId(month, year);
  try {
    await remove(id);
  } catch (error) {
    console.error(`Failed to delete journal ${id}`, error);
    throw error;
  }
};
