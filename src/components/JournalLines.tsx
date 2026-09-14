import React from 'react';
import { LINE_HEIGHT_CM } from '../utils/typography';
import { JournalClosing } from './JournalClosing';

interface JournalLinesProps {
  content: string[];
}

export const JournalLines: React.FC<JournalLinesProps> = ({ content }) => {
  const usableLinesCount = 32;
  const hasContent = content.length > 0; // In a filler page, we might not render closing

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
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <span className="ice-font-italic">To My Dearest Beloved Miss</span>,
        </div>
        
        {content.map((paragraph, index) => (
          <div key={`p-${index}`} style={{ textAlign: 'left' }}>{paragraph}</div>
        ))}

        {hasContent && <JournalClosing />}
      </div>
    </div>
  );
};
