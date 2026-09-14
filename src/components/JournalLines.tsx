import React, { useRef, useEffect } from 'react';
import { LINE_HEIGHT_CM } from '../utils/typography';
import { JournalClosing } from './JournalClosing';

interface JournalLinesProps {
  content: string; // HTML string representing rich text
  onChange?: (html: string) => void;
  isEditable?: boolean;
}

export const JournalLines: React.FC<JournalLinesProps> = ({ content, onChange, isEditable = false }) => {
  const textContainerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  
  const lastValidHtml = useRef<string>(content);
  const isReverting = useRef(false);

  const usableLinesCount = 32;
  const hasContent = content.length > 0;

  // Sync content if it changes externally (e.g., navigating pages)
  useEffect(() => {
    if (textContainerRef.current && textContainerRef.current.innerHTML !== content) {
      textContainerRef.current.innerHTML = content;
      lastValidHtml.current = content;
    }
  }, [content]);

  const handleInput = () => {
    if (isReverting.current) return;
    if (!scrollWrapperRef.current || !textContainerRef.current) return;

    // Check if the current actual rendered height exceeds the physical bounding box
    if (scrollWrapperRef.current.scrollHeight > scrollWrapperRef.current.clientHeight) {
      isReverting.current = true;
      
      // Native undo flawlessly reverts the DOM modification (typing, pasting, bolding)
      // and perfectly preserves the cursor selection before the foul edit.
      document.execCommand('undo');

      // Fallback just in case undo didn't resolve the height (e.g., complex paste)
      if (scrollWrapperRef.current.scrollHeight > scrollWrapperRef.current.clientHeight) {
         textContainerRef.current.innerHTML = lastValidHtml.current;
      }

      isReverting.current = false;
      // Do NOT trigger onChange because the input was rejected and reverted
    } else {
      // The change fit within the physical geometry. Commit it.
      lastValidHtml.current = textContainerRef.current.innerHTML;
      if (onChange) {
        onChange(textContainerRef.current.innerHTML);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&emsp;&emsp;');
    }
  };

  return (
    <div id="journal-lines-container" style={{
      position: 'relative',
      height: '100%', 
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Background Lines Grid (32 rows + top border = 33 boundaries) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        borderTop: '1px solid #d3d3d3',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        {Array.from({ length: usableLinesCount }).map((_, i) => (
          <div key={`line-bg-${i}`} className="journal-horizontal-line" style={{
            height: `${LINE_HEIGHT_CM}cm`,
            borderBottom: '1px solid #d3d3d3',
            boxSizing: 'border-box'
          }} />
        ))}
      </div>

      {/* Text Content Overlay */}
      <div 
        ref={scrollWrapperRef}
        className="ice-font"
        style={{
          position: 'relative',
          top: '0.15cm',
          zIndex: 1,
          height: '100%',
          width: '100%',
          paddingLeft: '0.5cm',
          paddingRight: '0.5cm',
          margin: 0,
          boxSizing: 'border-box',
          lineHeight: `${LINE_HEIGHT_CM}cm`,
          fontSize: `${LINE_HEIGHT_CM * 0.7}cm`,
          overflow: 'hidden', // physical container bounds restrict the layout
        }}
      >
        <div style={{ textAlign: 'left' }} contentEditable={false}>
          <span className="ice-font-italic">To My Dearest Beloved Miss</span>,
        </div>
        
        {/* The rich-text editable writing surface */}
        <div 
          ref={textContainerRef}
          contentEditable={isEditable}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning={true}
          style={{ 
            textAlign: 'left', 
            minHeight: '1em', 
            outline: 'none',
            whiteSpace: 'pre-wrap'
          }}
        />

        <div contentEditable={false} style={{ userSelect: 'none' }}>
          {hasContent && <JournalClosing />}
        </div>
      </div>
    </div>
  );
};
