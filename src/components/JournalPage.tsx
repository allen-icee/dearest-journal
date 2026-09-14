import React from 'react';
import { JOURNAL_METRICS } from '../types/journal';
import { JournalHeader } from './JournalHeader';
import { JournalLines } from './JournalLines';

interface JournalPageProps {
  date?: string;
  content: string[];
}

export const JournalPage: React.FC<JournalPageProps> = ({ date, content }) => {
  return (
    <div className="responsive-scale-wrapper">
      <div className="journal-physical-page" id="journal-page">
        <div id="journal-header">
          {/* Always render header wrapper to maintain 1.4cm height, conditionally render date text */}
          <JournalHeader date={date || ""} />
        </div>
        
        {/* Top Spacing */}
        <div id="journal-top-spacing" style={{ height: JOURNAL_METRICS.bodyTopSpacing, boxSizing: 'border-box' }} />

        {/* Body Area */}
        <div id="journal-body-area" style={{
          height: `calc(${JOURNAL_METRICS.height} - ${JOURNAL_METRICS.headerHeight} - ${JOURNAL_METRICS.bodyTopSpacing} - ${JOURNAL_METRICS.footerHeight})`,
          boxSizing: 'border-box',
        }}>
          <JournalLines content={content} />
        </div>

        {/* Footer Area */}
        <div id="journal-footer" style={{
          height: JOURNAL_METRICS.footerHeight,
          boxSizing: 'border-box',
        }} />
      </div>
    </div>
  );
};
