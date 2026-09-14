import React from 'react';
import { MONTH_NAMES } from '../utils/calendar';

interface JournalCoverProps {
  month: number;
  year: number;
}

export const JournalCover: React.FC<JournalCoverProps> = ({ month, year }) => {
  const monthName = MONTH_NAMES[month - 1] || "Unknown";

  return (
    <div className="responsive-scale-wrapper">
      <div className="journal-physical-page journal-cover-page" id="journal-cover" style={{
        padding: '1.2cm', /* padding for the frame */
      }}>
        <div style={{
          height: '100%',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          {/* Subtle top ornament */}
          <div style={{ fontSize: '0.5cm', opacity: 0.6, marginBottom: '2cm' }}>
            ❦
          </div>

          <div className="ice-font-italic" style={{ fontSize: '0.8cm', marginBottom: '0.8cm' }}>
            To My Dearest Beloved Mis<span style={{ display: 'inline-flex', alignItems: 'center' }}>s<span className="ice-font" style={{ color: 'black', fontSize: '0.6em', marginLeft: '0.1em' }}>♥</span></span>
          </div>
          
          <div className="ice-font" style={{ fontSize: '0.55cm', marginBottom: '2cm', opacity: 0.9 }}>
            {monthName} - {year}
          </div>

          {/* Subtle Trademark */}
          <div className="ice-font" style={{ fontSize: '0.45cm', opacity: 0.6 }}>
            ⊂(≽^•⩊•^≼)つ
          </div>
        </div>
      </div>
    </div>
  );
};
