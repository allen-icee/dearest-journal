import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FileDown, Printer, X, Loader2, Sparkles } from 'lucide-react';
import { type JournalDocument } from '../../types/journal';
import { type JournalConfig } from '../../types/journalConfig';
import { JournalCover } from '../JournalCover';
import { JournalPage } from '../JournalPage';
import { JournalBackCover } from '../JournalBackCover';
import { MONTH_NAMES } from '../../utils/calendar';
import { useToast } from '../../hooks/useToast';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: JournalDocument;
  config: JournalConfig;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  document,
  config,
}) => {
  const [paperFormat, setPaperFormat] = useState<'a4' | 'journal'>('a4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stagePageIndex, setStagePageIndex] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusText, setStatusText] = useState('');
  const abortRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const monthName = MONTH_NAMES[document.month - 1] || 'Journal';
  const totalPages = 1 + document.pages.length + 1; // Cover + daily pages + Back cover

  const handleCancel = useCallback(() => {
    abortRef.current = true;
    setIsGenerating(false);
    setStagePageIndex(null);
    setProgressPercent(0);
    setStatusText('');
    addToast('PDF download cancelled.', 'info');
  }, [addToast]);

  // Keyboard accessibility: Escape to close / cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isGenerating) {
          handleCancel();
        } else if (isOpen) {
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      window.document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.document.body.style.overflow = 'unset';
    };
  }, [isOpen, isGenerating, onClose, handleCancel]);

  if (!isOpen) return null;

  const handlePrint = () => {
    onClose();
    // Allow the modal overlay to fully dismiss before launching the native print dialogue
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const waitForImages = async (element: HTMLElement) => {
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map(img => {
        if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const handler = () => {
            img.removeEventListener('load', handler);
            img.removeEventListener('error', handler);
            resolve();
          };
          img.addEventListener('load', handler);
          img.addEventListener('error', handler);
          setTimeout(resolve, 350);
        });
      })
    );
  };

  const handleDownloadPdf = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    abortRef.current = false;
    setProgressPercent(0);
    setStatusText('Preparing document & fonts...');

    try {
      if (window.document.fonts && window.document.fonts.ready) {
        await window.document.fonts.ready;
      }

      const isA4 = paperFormat === 'a4';

      // Initialize jsPDF:
      // - A4 (21cm × 29.7cm): Centers the 15cm × 21.6cm journal page with margins and border outline
      // - Journal (15cm × 21.6cm): Native page size with border outline
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'cm',
        format: isA4 ? 'a4' : [15, 21.6],
        compress: true,
      });

      // Calculate centering offsets:
      // A4 is 21.0cm wide x 29.7cm high. Journal is 15.0cm x 21.6cm.
      // Left/right margin = (21.0 - 15.0) / 2 = 3.0 cm
      // Top/bottom margin = (29.7 - 21.6) / 2 = 4.05 cm
      const imgX = isA4 ? 3.0 : 0;
      const imgY = isA4 ? 4.05 : 0;

      for (let i = 0; i < totalPages; i++) {
        if (abortRef.current) {
          return;
        }

        // Set the active stage index so the hidden stage renders this exact page
        setStagePageIndex(i);

        if (i === 0) {
          setStatusText(`Rendering Front Cover (1 of ${totalPages})...`);
        } else if (i === totalPages - 1) {
          setStatusText(`Rendering Back Cover (${totalPages} of ${totalPages})...`);
        } else {
          setStatusText(`Rendering Day ${i} (${i + 1} of ${totalPages})...`);
        }

        // Allow React to commit the new page to the DOM and trigger useEffects
        await new Promise(resolve => setTimeout(resolve, 80));

        if (abortRef.current) return;

        const stageEl = stageRef.current;
        if (!stageEl) throw new Error('Render stage not available');

        const pageEl = (stageEl.querySelector('.journal-physical-page') as HTMLElement) || stageEl;
        await waitForImages(pageEl);

        // Capture page DOM with html2canvas at 2x scale for sharp print quality
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
        });

        if (abortRef.current) return;

        // Use high-quality JPEG for crisp text and efficient file size
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage(isA4 ? 'a4' : [15, 21.6], 'portrait');
        }
        pdf.addImage(imgData, 'JPEG', imgX, imgY, 15, 21.6, undefined, 'FAST');

        setProgressPercent(Math.round(((i + 1) / totalPages) * 100));
      }

      if (abortRef.current) return;

      setStatusText('Assembling PDF download...');
      const fileName = isA4
        ? `DearestJournal-${document.year}-${String(document.month).padStart(2, '0')}-A4.pdf`
        : `DearestJournal-${document.year}-${String(document.month).padStart(2, '0')}.pdf`;
      const pdfBlob = pdf.output('blob');

      // 1. Primary: Native File System Access API (supported in Edge/Chrome on Windows)
      // Opens the native Windows "Save As" dialog with pre-filled name and .pdf type.
      // This completely avoids Edge's HTTP/blob download manager renaming.
      if ('showSaveFilePicker' in window) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: fileName,
            types: [
              {
                description: 'PDF Document (*.pdf)',
                accept: { 'application/pdf': ['.pdf'] },
              },
            ],
          });
          const writableStream = await fileHandle.createWritable();
          await writableStream.write(pdfBlob);
          await writableStream.close();

          addToast('PDF saved successfully!', 'success');
          setIsGenerating(false);
          setStagePageIndex(null);
          onClose();
          return;
        } catch (pickerErr: unknown) {
          // If the user cancelled the dialog, cleanly exit without error
          if (pickerErr instanceof Error && pickerErr.name === 'AbortError') {
            setIsGenerating(false);
            setStagePageIndex(null);
            return;
          }
          console.warn('Native file picker failed or unavailable, falling back:', pickerErr);
        }
      }

      // 2. Fallback: Wrap in a File object with explicit name and MIME type
      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(pdfFile);

      const downloadAnchor = window.document.createElement('a');
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = fileName;
      downloadAnchor.style.display = 'none';
      window.document.body.appendChild(downloadAnchor);
      downloadAnchor.click();

      // Defer cleanup to ensure Edge/Chrome download manager has acquired the blob and filename
      setTimeout(() => {
        if (window.document.body.contains(downloadAnchor)) {
          window.document.body.removeChild(downloadAnchor);
        }
        URL.revokeObjectURL(blobUrl);
      }, 5000);

      addToast('PDF downloaded successfully!', 'success');
      setIsGenerating(false);
      setStagePageIndex(null);
      onClose();
    } catch (err) {
      console.error('PDF generation error:', err);
      addToast('Failed to generate PDF. Please try again.', 'error');
      setIsGenerating(false);
      setStagePageIndex(null);
    }
  };

  const renderStagePage = () => {
    if (stagePageIndex === null) return null;

    if (stagePageIndex === 0) {
      return <JournalCover month={document.month} year={document.year} config={config} />;
    }

    if (stagePageIndex >= 1 && stagePageIndex <= document.pages.length) {
      const pageData = document.pages[stagePageIndex - 1];
      return (
        <JournalPage
          key={`export-page-${pageData.pageNumber}`}
          date={pageData.date}
          content={pageData.content}
          isEditable={false}
          config={config}
        />
      );
    }

    if (stagePageIndex === document.pages.length + 1) {
      return <JournalBackCover config={config} />;
    }

    return null;
  };

  return createPortal(
    <>
      {/* Off-screen capture stage: strictly isolated from editor zoom and scroll */}
      {stagePageIndex !== null && (
        <div ref={stageRef} className="pdf-export-stage" aria-hidden="true">
          {renderStagePage()}
        </div>
      )}

      {/* Modal Dialog */}
      <div 
        className="advanced-dialog-overlay" 
        onClick={isGenerating ? undefined : onClose}
        style={{ zIndex: 9999 }}
      >
        <div
          className="advanced-dialog-box export-modal-box"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="advanced-dialog-header">
            <div className="advanced-dialog-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileDown size={17} style={{ color: 'var(--cover-background, #005fb8)' }} />
              <span>Download PDF or Print</span>
            </div>
            {!isGenerating && (
              <button className="advanced-dialog-close" onClick={onClose} aria-label="Close modal">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="advanced-dialog-content export-modal-content">
            {isGenerating ? (
              /* Generating Progress State */
              <div className="export-progress-container">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 95, 184, 0.08)',
                  color: 'var(--cover-background, #005fb8)',
                  marginBottom: '16px',
                }}>
                  <Loader2 size={28} className="animate-spin" />
                </div>

                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600, color: '#222' }}>
                  Generating Journal PDF
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                  {statusText}
                </p>

                <div className="export-progress-bar-bg">
                  <div 
                    className="export-progress-bar-fill" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>

                <div className="export-progress-info">
                  <span>{progressPercent}% completed</span>
                  <span>{totalPages} Pages</span>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button 
                    className="dialog-btn" 
                    onClick={handleCancel}
                    style={{ fontSize: '13px', padding: '6px 20px', color: '#666' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Selection Options State */
              <>
                <div style={{ marginBottom: '14px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#444', lineHeight: 1.4 }}>
                    Choose how you would like to export your completed journal for <strong>{monthName} {document.year}</strong>.
                  </p>

                  {/* Paper Format Selector */}
                  <div className="export-paper-selector">
                    <span className="export-paper-label">PDF Paper Size:</span>
                    <div className="export-paper-options">
                      <button
                        type="button"
                        className={`export-paper-btn ${paperFormat === 'a4' ? 'active' : ''}`}
                        onClick={() => setPaperFormat('a4')}
                        title="Standard A4 sheet with cut-line border outline (Recommended for printing on A4 paper)"
                      >
                        A4 Paper (Centered + Cut Border)
                      </button>
                      <button
                        type="button"
                        className={`export-paper-btn ${paperFormat === 'journal' ? 'active' : ''}`}
                        onClick={() => setPaperFormat('journal')}
                        title="Exact 15×21.6 cm journal size with cut border"
                      >
                        Exact 15 × 21.6 cm
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <span className="export-badge">{totalPages} Total Pages</span>
                    <span className="export-badge">
                      {paperFormat === 'a4' ? 'A4 Sheet (21 × 29.7 cm)' : '15 × 21.6 cm Page'}
                    </span>
                    <span className="export-badge">Cut-Line Border Outline</span>
                  </div>
                </div>

                <div className="export-modal-options">
                  {/* Option 1: Direct PDF Download */}
                  <div 
                    className="export-option-card" 
                    onClick={handleDownloadPdf}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleDownloadPdf()}
                  >
                    <div className="export-option-icon pdf">
                      <FileDown size={22} />
                    </div>
                    <div className="export-option-details">
                      <div className="export-option-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Download PDF Document</span>
                        <Sparkles size={13} style={{ color: '#d97706' }} />
                      </div>
                      <div className="export-option-desc">
                        Assembles a direct high-resolution <code>.pdf</code> file including Front Cover, all daily entries, and Back Cover ready to save or share.
                      </div>
                      <div style={{ marginTop: '6px' }}>
                        <button 
                          className="dialog-btn primary" 
                          style={{ fontSize: '12px', padding: '5px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          onClick={(e) => { e.stopPropagation(); handleDownloadPdf(); }}
                        >
                          <FileDown size={14} /> Download PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Browser Print Dialog */}
                  <div 
                    className="export-option-card" 
                    onClick={handlePrint}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handlePrint()}
                  >
                    <div className="export-option-icon print">
                      <Printer size={22} />
                    </div>
                    <div className="export-option-details">
                      <div className="export-option-title">Print via Browser Dialog</div>
                      <div className="export-option-desc">
                        Opens your browser's native print dialogue with printer margins and paper cut guides applied.
                      </div>
                      <div style={{ marginTop: '6px' }}>
                        <button 
                          className="dialog-btn" 
                          style={{ fontSize: '12px', padding: '5px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          onClick={(e) => { e.stopPropagation(); handlePrint(); }}
                        >
                          <Printer size={14} /> Open Print Dialog
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {!isGenerating && (
            <div className="advanced-dialog-footer">
              <button className="dialog-btn" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>,
    window.document.body
  );
};
