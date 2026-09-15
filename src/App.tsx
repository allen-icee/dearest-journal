import { useState, useEffect, useRef } from 'react';
import { JournalCover } from './components/JournalCover';
import { JournalBackCover } from './components/JournalBackCover';
import { JournalPage } from './components/JournalPage';
import { JournalEditor } from './components/editor/JournalEditor';
import { generateMonthPages } from './utils/calendar';
import { type JournalDocument } from './types/journal';
import { getJournal, saveJournal, generateJournalId, getGlobalConfig, saveGlobalConfig } from './storage/journalRepository';
import { type SaveStatus } from './storage/storageTypes';
import { exportJournal, importJournal } from './utils/backup';
import { useToast } from './hooks/useToast';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { DEFAULT_JOURNAL_CONFIG } from './config/journalDefaults';
import { type JournalConfig } from './types/journalConfig';

function App() {
  const [document, setDocument] = useState<JournalDocument | null>(null);
  const [globalConfig, setGlobalConfig] = useState<JournalConfig>(DEFAULT_JOURNAL_CONFIG);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const debounceRef = useRef<number | null>(null);
  const { addToast } = useToast();

  // Dialog State
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      let gConfig = await getGlobalConfig();
      
      const lastId = localStorage.getItem('lastActiveJournalId');
      let m = new Date().getMonth() + 1;
      let y = new Date().getFullYear();

      if (lastId) {
        const parts = lastId.split('-');
        if (parts.length === 2) {
          y = parseInt(parts[0], 10);
          m = parseInt(parts[1], 10);
        }
      }

      // Legacy fallback: If no global config exists, try to extract from the last active document
      if (!gConfig) {
        const lastStored = await getJournal(m, y);
        if (lastStored && lastStored.document.config) {
          gConfig = lastStored.document.config;
        } else {
          gConfig = DEFAULT_JOURNAL_CONFIG;
        }
        await saveGlobalConfig(gConfig);
      }
      
      setGlobalConfig(gConfig);
      await loadDocument(m, y, false);
    };

    initialize();
  }, []);

  const loadDocument = async (month: number, year: number, notifyCreation = true) => {
    try {
      const stored = await getJournal(month, year);
      if (stored) {
        setDocument(stored.document);
      } else {
        const newDoc: JournalDocument = {
          month,
          year,
          pages: generateMonthPages(month, year, "")
        };
        setDocument(newDoc);
        if (notifyCreation) {
          const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
          addToast(`${monthName} ${year} journal created.`, 'info');
        }
      }
      localStorage.setItem('lastActiveJournalId', generateJournalId(month, year));
      setSaveStatus('saved');
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      addToast('Unable to load journal.', 'error');
    }
  };

  const handleMonthChange = async (month: number, year: number) => {
    if (document) {
      setSaveStatus('saving');
      try {
        await saveJournal(document);
      } catch (e) {
        addToast('Unable to save your current journal locally.', 'error', 'Your changes are still visible, but storage may be unavailable.');
      }
    }
    await loadDocument(month, year, true);
  };

  const handleContentChange = (pageNumber: number, content: string) => {
    setDocument(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: prev.pages.map(p => p.pageNumber === pageNumber ? { ...p, content } : p)
      };
    });
    setSaveStatus('unsaved');
  };

  const handleConfigChange = async (newConfig: JournalConfig) => {
    setGlobalConfig(newConfig);
    try {
      await saveGlobalConfig(newConfig);
    } catch (e) {
      addToast('Unable to save settings.', 'error');
    }
  };

  // Debounced Autosave Effect
  useEffect(() => {
    if (!document || saveStatus !== 'unsaved') return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(async () => {
      try {
        setSaveStatus('saving');
        await saveJournal(document);
        setSaveStatus('saved');
      } catch (e) {
        setSaveStatus('error');
        addToast('Unable to save your journal locally.', 'error', 'Your changes are still visible, but local storage may be unavailable.');
      }
    }, 750);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [document, saveStatus, addToast]);

  const handleImportClick = () => {
    const input = window.document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setPendingImportFile(file);
        setIsImportDialogOpen(true);
      }
    };
    input.click();
  };

  const confirmImport = async () => {
    if (!pendingImportFile) return;
    setIsImportDialogOpen(false);

    try {
      const importedDoc = await importJournal(pendingImportFile);
      setSaveStatus('saving');
      await saveJournal(importedDoc);
      setDocument(importedDoc);
      localStorage.setItem('lastActiveJournalId', generateJournalId(importedDoc.month, importedDoc.year));
      setSaveStatus('saved');
      addToast('Journal imported successfully.', 'success');
    } catch (err) {
      console.error(err);
      addToast('Unable to import journal.', 'error', 'Invalid journal file.');
    } finally {
      setPendingImportFile(null);
    }
  };

  const cancelImport = () => {
    setIsImportDialogOpen(false);
    setPendingImportFile(null);
  };

  const handleExport = () => {
    if (document) {
      try {
        exportJournal(document);
        addToast('Journal exported successfully.', 'success');
      } catch (err) {
        console.error(err);
        addToast('Unable to export journal.', 'error');
      }
    }
  };

  const getMonthName = (month?: number) => {
    if (!month) return '';
    return new Date(2000, month - 1).toLocaleString('default', { month: 'long' });
  };

  if (!document) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <>
      <ConfirmDialog 
        isOpen={isImportDialogOpen}
        title="Import Journal"
        description={`Importing this journal will replace the currently open journal for ${getMonthName(document.month)} ${document.year}. Your current journal is already saved locally.`}
        confirmLabel="Import Journal"
        onConfirm={confirmImport}
        onCancel={cancelImport}
      />

      {/* Interactive Editor UI (Hidden during print) */}
      <div className="no-print" style={{ width: '100%' }}>
        <JournalEditor 
          key={`${document.month}-${document.year}`}
          document={document} 
          saveStatus={saveStatus}
          onMonthChange={handleMonthChange}
          onContentChange={handleContentChange}
          onImport={handleImportClick}
          onExport={handleExport}
          config={globalConfig}
          onConfigChange={handleConfigChange}
        />
      </div>

      <div className="print-only">
        {/* 1. Front Cover */}
        <JournalCover month={document.month} year={document.year} config={globalConfig} />

        {/* 2. Interior Pages (Exactly 32 slots) */}
        {document.pages.map((pageData) => (
          <JournalPage 
            key={`print-page-${pageData.pageNumber}`}
            date={pageData.date} 
            content={pageData.content} 
            config={globalConfig}
          />
        ))}

        {/* 3. Back Cover */}
        <JournalBackCover config={globalConfig} />
      </div>
    </>
  );
}

export default App;
