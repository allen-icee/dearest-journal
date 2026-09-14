import { type JournalDocument } from '../types/journal';
import { type StoredJournal, CURRENT_SCHEMA_VERSION } from '../storage/storageTypes';
import { generateJournalId } from '../storage/journalRepository';

export const exportJournal = (document: JournalDocument) => {
  const id = generateJournalId(document.month, document.year);
  
  const payload: StoredJournal = {
    id,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    updatedAt: Date.now(),
    document
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = window.document.createElement('a');
  a.href = url;
  a.download = `DearestJournal-${id}.json`;
  window.document.body.appendChild(a);
  a.click();
  
  // Cleanup
  window.document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importJournal = (file: File): Promise<JournalDocument> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content) as StoredJournal;
        
        // Basic Validation
        if (!parsed.schemaVersion || parsed.schemaVersion > CURRENT_SCHEMA_VERSION) {
          throw new Error(`Unsupported schema version: ${parsed.schemaVersion}`);
        }
        
        if (!parsed.document || !parsed.document.month || !parsed.document.year || !Array.isArray(parsed.document.pages)) {
          throw new Error('Invalid journal document structure');
        }

        resolve(parsed.document);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Failed to parse journal file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
