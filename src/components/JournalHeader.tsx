import React from 'react';
import { JOURNAL_METRICS } from '../types/journal';

interface JournalHeaderProps {
  date: string; // MM-DD-YYYY
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({ date }) => {
  return (
    <div className="ice-font" style={{
      height: JOURNAL_METRICS.headerHeight,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      paddingRight: '0.5cm', 
      fontSize: '0.6cm',
      color: 'black',
      position: 'relative',
      top: '0.45cm', // Pulls the text downwards across the top-spacing gap to sit near the line
    }}>
      {date}
    </div>
  );
};
