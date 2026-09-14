import React from 'react';

export const JournalBackCover: React.FC = () => {
  return (
    <div className="responsive-scale-wrapper">
      <div className="journal-physical-page journal-cover-page" id="journal-back-cover" style={{
        padding: '1.2cm',
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
          boxSizing: 'border-box'
        }}>
          {/* Subtle minimalist ornament */}
          <div style={{ fontSize: '0.5cm', opacity: 0.6 }}>
            ❦
          </div>
        </div>
      </div>
    </div>
  );
};
