import React, { useState, useEffect } from 'react';
import { type JournalDocument } from '../../types/journal';
import { type SaveStatus } from '../../storage/storageTypes';
import { type JournalConfig } from '../../types/journalConfig';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { JournalPage } from '../JournalPage';
import { JournalCover } from '../JournalCover';
import { JournalBackCover } from '../JournalBackCover';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface JournalEditorProps {
  document: JournalDocument;
  saveStatus: SaveStatus;
  onMonthChange: (month: number, year: number) => void;
  onContentChange: (pageNumber: number, content: string) => void;
  onImport: () => void;
  onExport: () => void;
  config: JournalConfig;
  onConfigChange: (updatedConfig: JournalConfig) => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({ 
  document, 
  saveStatus,
  onMonthChange, 
  onContentChange,
  onImport,
  onExport,
  config,
  onConfigChange
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [activePageId, setActivePageId] = useState<string>('Front Cover');



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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find(e => e.isIntersecting);
      if (visible) {
        const id = visible.target.getAttribute('data-page-id');
        if (id) setActivePageId(id);
      }
    }, {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0
    });

    const elements = window.document.querySelectorAll('.page-wrapper');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [document.pages, zoom]);

  const handleScroll = (direction: 'up' | 'down', currentId: string) => {
    const wrappers = Array.from(window.document.querySelectorAll('.page-wrapper'));
    const currentIndex = wrappers.findIndex(w => w.getAttribute('data-page-id') === currentId);
    if (currentIndex === -1) return;
    
    let targetIndex = currentIndex;
    if (direction === 'up' && currentIndex > 0) targetIndex = currentIndex - 1;
    if (direction === 'down' && currentIndex < wrappers.length - 1) targetIndex = currentIndex + 1;
    
    wrappers[targetIndex].scrollIntoView({ behavior: 'smooth' });
  };

  const getWordCount = () => {
    let total = 0;
    document.pages.forEach(page => {
      if (!page.content) return;
      const temp = window.document.createElement('div');
      temp.innerHTML = page.content;
      const text = temp.textContent || temp.innerText || '';
      const words = text.trim().split(/\s+/);
      if (text.trim() !== '') {
        total += words.length;
      }
    });
    return total;
  };

  return (
    <div className="app-container">
      {/**
        * Dynamically injects user-uploaded custom fonts at runtime.
        * Converts the stored Base64 payload into a native @font-face rule,
        * allowing the journal to render custom typography entirely client-side 
        * without external font requests or local installation.
        */}
      {config.customFonts?.map(font => (
        <style key={font.name}>
          {`
            @font-face {
              font-family: '${font.name}';
              src: url(${font.base64}) format('truetype');
            }
          `}
        </style>
      ))}

      {/* Top Toolbar */}
      <Toolbar 
        document={document}
        config={config}
        saveStatus={saveStatus}
        month={document.month}
        year={document.year}
        onMonthChange={onMonthChange}
        onImport={onImport}
        onExport={onExport}
        onConfigChange={onConfigChange}
      />

      {/* Document Workspace */}
      <div className="document-workspace">
        {/* Scaled Render Layer */}
        <div style={{ zoom: zoom, transition: 'zoom 0.15s ease', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
          
          <div className="page-wrapper" data-page-id="Front Cover">
            <div className="page-header-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Front Cover</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="canva-nav-btn" onClick={() => handleScroll('up', 'Front Cover')} aria-label="Previous Page"><ChevronUp size={16} /></button>
                <button className="canva-nav-btn" onClick={() => handleScroll('down', 'Front Cover')} aria-label="Next Page"><ChevronDown size={16} /></button>
              </div>
            </div>
            <JournalCover month={document.month} year={document.year} config={config} />
          </div>

          {document.pages.map((p) => {
            const pageId = `Page ${p.pageNumber} of ${document.pages.length}`;
            return (
              <div key={p.pageNumber} className="page-wrapper" data-page-id={pageId}>
                <div className="page-header-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Day {p.pageNumber} - {p.date}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="canva-nav-btn" onClick={() => handleScroll('up', pageId)} aria-label="Previous Page"><ChevronUp size={16} /></button>
                    <button className="canva-nav-btn" onClick={() => handleScroll('down', pageId)} aria-label="Next Page"><ChevronDown size={16} /></button>
                  </div>
                </div>
                <JournalPage 
                  date={p.date} 
                  content={p.content} 
                  onChange={(html) => onContentChange(p.pageNumber, html)}
                  isEditable={true}
                  config={config}
                />
              </div>
            );
          })}

          <div className="page-wrapper" data-page-id="Back Cover">
            <div className="page-header-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Back Cover</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="canva-nav-btn" onClick={() => handleScroll('up', 'Back Cover')} aria-label="Previous Page"><ChevronUp size={16} /></button>
                <button className="canva-nav-btn" onClick={() => handleScroll('down', 'Back Cover')} aria-label="Next Page"><ChevronDown size={16} /></button>
              </div>
            </div>
            <JournalBackCover config={config} />
          </div>

        </div>
      </div>

      {/* Floating Status Bar with Zoom Controls */}
      <StatusBar 
        isVisible={true}
        activePageId={activePageId}
        wordCount={getWordCount()}
        zoom={zoom}
        onZoomChange={setZoom}
      />

    </div>
  );
};
