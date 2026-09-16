import React, { useState, useEffect, useCallback } from 'react';
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

/**
 * JournalEditor is the main container for the application.
 * It integrates the global toolbar, the physical page views, and the status bar,
 * managing the orchestration of the document state and user interface.
 */
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
  const [activeFormats, setActiveFormats] = useState({
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false
  });

  useEffect(() => {
    const updateFormatState = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      // Get the immediate element wrapping the text cursor
      let node = selection.anchorNode;
      if (node && node.nodeType === 3) {
        node = node.parentNode;
      }
      if (!node || !(node instanceof Element)) return;

      const style = window.getComputedStyle(node);
      const currentAlign = style.textAlign || 'left';

      setActiveFormats(prev => {
        const newState = {
          justifyLeft: currentAlign === 'left' || currentAlign === 'start' || window.document.queryCommandState('justifyLeft'),
          justifyCenter: currentAlign === 'center' || window.document.queryCommandState('justifyCenter'),
          justifyRight: currentAlign === 'right' || window.document.queryCommandState('justifyRight'),
          justifyFull: currentAlign === 'justify' || window.document.queryCommandState('justifyFull')
        };
        
        // Only trigger React re-render if the state actually changed
        return JSON.stringify(prev) === JSON.stringify(newState) ? prev : newState;
      });
    };

    window.document.addEventListener('selectionchange', updateFormatState);
    // Also listen globally for clicks and keys to ensure reliable state updates
    window.document.addEventListener('mouseup', updateFormatState);
    window.document.addEventListener('keyup', updateFormatState);
    return () => {
      window.document.removeEventListener('selectionchange', updateFormatState);
      window.document.removeEventListener('mouseup', updateFormatState);
      window.document.removeEventListener('keyup', updateFormatState);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setZoom(window.innerWidth / 600);
    }
  }, []);

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

  const handleScroll = useCallback((direction: 'up' | 'down', currentId: string) => {
    const wrappers = Array.from(window.document.querySelectorAll('.page-wrapper'));
    const currentIndex = wrappers.findIndex(w => w.getAttribute('data-page-id') === currentId);
    if (currentIndex === -1) return;

    let targetIndex = currentIndex;
    if (direction === 'up' && currentIndex > 0) targetIndex = currentIndex - 1;
    if (direction === 'down' && currentIndex < wrappers.length - 1) targetIndex = currentIndex + 1;

    wrappers[targetIndex].scrollIntoView({ behavior: 'smooth' });
  }, []);



  const handlePageContentChange = useCallback((pageNumber: number, html: string) => {
    onContentChange(pageNumber, html);
  }, [onContentChange]);

  return (
    <div className="app-container">

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
        activeFormats={activeFormats}
      />

      {/* Document Workspace */}
      <div className="document-workspace">

        {/* Scaled Render Layer */}
        <div style={{ zoom: zoom, transition: 'zoom 0.15s ease', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>

          <div className="page-wrapper" data-page-id="Front Cover">
            <div className="page-nav-container no-print">
              <span style={{ fontWeight: 500 }}>Front Cover</span>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
                <ChevronUp size={20} style={{ cursor: 'pointer' }} onClick={() => handleScroll('up', 'Front Cover')} />
                <ChevronDown size={20} style={{ cursor: 'pointer' }} onClick={() => handleScroll('down', 'Front Cover')} />
              </div>
            </div>
            <JournalCover month={document.month} year={document.year} config={config} />
          </div>

          {document.pages.map((p) => {
            const pageId = `Page ${p.pageNumber} of ${document.pages.length}`;
            return (
              <div key={p.pageNumber} className="page-wrapper" data-page-id={pageId}>
                <div className="page-nav-container no-print">
                  <span style={{ fontWeight: 500 }}>Day {p.pageNumber} - {p.date}</span>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
                    <ChevronUp size={20} style={{ cursor: 'pointer' }} onClick={() => handleScroll('up', pageId)} />
                    <ChevronDown size={20} style={{ cursor: 'pointer' }} onClick={() => handleScroll('down', pageId)} />
                  </div>
                </div>
                <JournalPage
                  date={p.date}
                  content={p.content}
                  onChange={(html) => handlePageContentChange(p.pageNumber, html)}
                  isEditable={true}
                  config={config}
                />
              </div>
            );
          })}

          <div className="page-wrapper" data-page-id="Back Cover">
            <div className="page-nav-container no-print">
              <span style={{ fontWeight: 500 }}>Back Cover</span>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
                <ChevronUp size={20} style={{ cursor: 'pointer' }} onClick={() => handleScroll('up', 'Back Cover')} />
                <ChevronDown size={20} style={{ cursor: 'pointer' }} onClick={() => handleScroll('down', 'Back Cover')} />
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
        zoom={zoom}
        onZoomChange={setZoom}
      />

    </div>
  );
};
