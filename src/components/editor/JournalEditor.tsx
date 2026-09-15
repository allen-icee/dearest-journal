import React, { useState, useEffect } from 'react';
import { type JournalDocument } from '../../types/journal';
import { type SaveStatus } from '../../storage/storageTypes';
import { type JournalConfig } from '../../types/journalConfig';
import { DEFAULT_JOURNAL_CONFIG } from '../../config/journalDefaults';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { JournalPage } from '../JournalPage';
import { JournalCover } from '../JournalCover';
import { JournalBackCover } from '../JournalBackCover';
import { YearSelector } from './YearSelector';
import { MonthSelector } from './MonthSelector';
import { PageSelector } from './PageSelector';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface JournalEditorProps {
  document: JournalDocument;
  saveStatus: SaveStatus;
  onMonthChange: (month: number, year: number) => void;
  onContentChange: (pageNumber: number, content: string) => void;
  onImport: () => void;
  onExport: () => void;
  onDocumentChange: (updatedDoc: JournalDocument) => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({ 
  document, 
  saveStatus,
  onMonthChange, 
  onContentChange,
  onImport,
  onExport,
  onDocumentChange
}) => {
  const [activeSlot, setActiveSlot] = useState<string>('cover');
  const [zoom, setZoom] = useState<number>(1);

  // Safely fallback to defaults if config is missing or using the old schema (e.g. older journal)
  const getSafeConfig = (): JournalConfig => {
    let base = { ...DEFAULT_JOURNAL_CONFIG };
    if (document.config) {
      const oldConfig = document.config as any;
      if (oldConfig.writing && !oldConfig.body) {
        // Upgrade from old Phase 5 schema to the separated role schema
        base = {
          ...base,
          ...oldConfig,
          body: {
            fontFamily: oldConfig.writing.fontFamily || base.body.fontFamily,
            fontSize: oldConfig.writing.fontSize || base.body.fontSize,
            color: oldConfig.writing.fontColor || base.body.color,
          },
          // Greeting, title, closing fallback to safe pristine defaults
          greeting: { ...base.greeting },
          title: { ...base.title, text: oldConfig.journal?.title || base.title.text, showHeart: oldConfig.journal?.titleHeartEnabled ?? base.title.showHeart },
          closing: { ...base.closing, ...oldConfig.closing },
        };
        // Clean up the obsolete property
        delete (base as any).writing;
        delete (base as any).journal;
      } else {
        base = { ...base, ...document.config };
      }
    }
    
    return {
      ...base,
      frontCover: {
        ...base.frontCover
      },
      backCover: {
        ...base.backCover
      }
    };
  };

  const config: JournalConfig = getSafeConfig();

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        window.document.execCommand('undo', false, undefined);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        window.document.execCommand('redo', false, undefined);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        window.document.execCommand('bold', false, undefined);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        window.document.execCommand('italic', false, undefined);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleConfigSave = (newConfig: JournalConfig) => {
    onDocumentChange({
      ...document,
      config: newConfig
    });
  };

  const navigatePage = (direction: 'prev' | 'next') => {
    const allSlots = ['cover', ...document.pages.map(p => String(p.pageNumber)), 'back-cover'];
    const idx = allSlots.indexOf(activeSlot);
    if (idx === -1) return;
    
    if (direction === 'prev' && idx > 0) {
      setActiveSlot(allSlots[idx - 1]);
    } else if (direction === 'next' && idx < allSlots.length - 1) {
      setActiveSlot(allSlots[idx + 1]);
    }
  };

  const getWordCount = () => {
    if (activeSlot === 'cover' || activeSlot === 'back-cover') return 0;
    const pageNum = Number(activeSlot);
    const page = document.pages.find(p => p.pageNumber === pageNum);
    if (!page || !page.content) return 0;
    
    const temp = window.document.createElement('div');
    temp.innerHTML = page.content;
    const text = temp.textContent || temp.innerText || '';
    const words = text.trim().split(/\s+/);
    return text.trim() === '' ? 0 : words.length;
  };

  const isCover = activeSlot === 'cover' || activeSlot === 'back-cover';

  return (
    <div className="app-container">
      {/* Top Toolbar */}
      <Toolbar 
        document={document}
        config={config}
        saveStatus={saveStatus}
        onImport={onImport}
        onExport={onExport}
        onConfigChange={handleConfigSave}
      />

      {/* Document Workspace */}
      <div className="document-workspace">
        
        {/* Navigation Layer */}
        <div className="workspace-navigation no-print">
          <Tooltip content="Previous page" position="bottom">
            <button className="nav-arrow-btn" onClick={() => navigatePage('prev')} aria-label="Previous page">
              <ChevronLeft size={20} />
            </button>
          </Tooltip>

          <YearSelector 
            year={document.year} 
            onChange={(y) => {
              onMonthChange(document.month, y);
              setActiveSlot('cover');
            }}
          />
          <MonthSelector 
            month={document.month} 
            onChange={(m) => {
              onMonthChange(m, document.year);
              setActiveSlot('cover');
            }} 
          />
          <PageSelector 
            pages={document.pages} 
            activeSlot={activeSlot} 
            onSelectSlot={setActiveSlot} 
          />

          <Tooltip content="Next page" position="bottom">
            <button className="nav-arrow-btn" onClick={() => navigatePage('next')} aria-label="Next page">
              <ChevronRight size={20} />
            </button>
          </Tooltip>
        </div>

        {/* Scaled Render Layer */}
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}>
          {activeSlot === 'cover' && <JournalCover month={document.month} year={document.year} config={config} />}
          
          {activeSlot === 'back-cover' && <JournalBackCover config={config} />}

          {!isCover && (() => {
            const pageNum = Number(activeSlot);
            const activePage = document.pages.find(p => p.pageNumber === pageNum);
            if (!activePage) return null;
            return (
              <JournalPage 
                key={pageNum}
                date={activePage.date} 
                content={activePage.content} 
                onChange={(html) => onContentChange(pageNum, html)}
                isEditable={true}
                config={config}
              />
            );
          })()}
        </div>
      </div>

      {/* Floating Status Bar with Zoom Controls */}
      <StatusBar 
        isVisible={true} // Always visible to allow zooming
        isCover={isCover}
        currentPage={Number(activeSlot) || 1}
        totalPages={document.pages.length}
        wordCount={getWordCount()}
        zoom={zoom}
        onZoomChange={setZoom}
      />

    </div>
  );
};
