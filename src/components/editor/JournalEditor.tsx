import React, { useState, useEffect } from 'react';
import { type JournalDocument } from '../../types/journal';
import { type SaveStatus } from '../../storage/storageTypes';
import { AppHeader } from './AppHeader';
import { Ribbon } from './Ribbon';
import { JournalPage } from '../JournalPage';
import { JournalCover } from '../JournalCover';
import { JournalBackCover } from '../JournalBackCover';

interface JournalEditorProps {
  document: JournalDocument;
  saveStatus: SaveStatus;
  onMonthChange: (month: number, year: number) => void;
  onContentChange: (pageNumber: number, content: string) => void;
  onImport: () => void;
  onExport: () => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({ 
  document, 
  saveStatus,
  onMonthChange, 
  onContentChange,
  onImport,
  onExport
}) => {
  const [activeSlot, setActiveSlot] = useState<string>('cover');
  const [zoom, setZoom] = useState<number>(100);
  const [isRibbonExpanded, setIsRibbonExpanded] = useState<boolean>(true);

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

  return (
    <div className="app-container">
      {/* Editor Chrome */}
      <div className="editor-chrome no-print">
        <AppHeader 
          document={document}
          activeSlot={activeSlot}
          isExpanded={isRibbonExpanded}
          saveStatus={saveStatus}
          onToggleExpand={() => setIsRibbonExpanded(!isRibbonExpanded)}
          onMonthChange={onMonthChange}
          onSelectSlot={setActiveSlot}
        />
        {isRibbonExpanded && (
          <Ribbon 
            document={document}
            activeSlot={activeSlot}
            zoom={zoom}
            onMonthChange={onMonthChange}
            onSelectSlot={setActiveSlot}
            onZoomChange={setZoom}
            onImport={onImport}
            onExport={onExport}
          />
        )}
      </div>

      {/* Document Workspace */}
      <div className="document-workspace">
        {/* Visual scaling wrapper */}
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}>
          {activeSlot === 'cover' && <JournalCover month={document.month} year={document.year} />}
          
          {activeSlot === 'back-cover' && <JournalBackCover />}

          {activeSlot !== 'cover' && activeSlot !== 'back-cover' && (() => {
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
              />
            );
          })()}
        </div>
      </div>
    </div>
  );
};
