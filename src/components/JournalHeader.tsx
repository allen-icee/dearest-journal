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
      paddingBottom: '0.1cm',
      fontSize: '0.6cm',
      color: 'black'
    }}>
      {date}
    </div>
  );
};
