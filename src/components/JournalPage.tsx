import React from 'react';
import { JournalHeader } from './JournalHeader';
import { JournalLines } from './JournalLines';
import { JOURNAL_METRICS } from '../types/journal';
import { type JournalConfig } from '../types/journalConfig';

interface JournalPageProps {
  date: string | null;
  content: string; // HTML string
  onChange?: (html: string) => void;
  isEditable?: boolean;
  config: JournalConfig;
}

export const JournalPage: React.FC<JournalPageProps> = ({ date, content, onChange, isEditable = false, config }) => {
  return (
    <div className="responsive-scale-wrapper">
      <div className="journal-physical-page" id="journal-page">
        {/* Header */}
        <div id="journal-header">
          {date && <JournalHeader date={date} />}
        </div>
        
        {/* Top Spacing */}
        <div id="journal-top-spacing" style={{ height: JOURNAL_METRICS.bodyTopSpacing, boxSizing: 'border-box' }} />

        {/* Writing Area */}
        <div id="journal-body" style={{ 
          height: `calc(${JOURNAL_METRICS.height} - ${JOURNAL_METRICS.headerHeight} - ${JOURNAL_METRICS.bodyTopSpacing} - ${JOURNAL_METRICS.footerHeight})`, 
          boxSizing: 'border-box' 
        }}>
          <JournalLines content={content} onChange={onChange} isEditable={isEditable} config={config} />
        </div>
        
        {/* Footer */}
        <div id="journal-footer" style={{ height: JOURNAL_METRICS.footerHeight, boxSizing: 'border-box' }} />
      </div>
    </div>
  );
};
