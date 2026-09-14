import React from 'react';

export const JournalCover: React.FC = () => {
  return (
    <div className="journal-physical-page" id="journal-cover" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      {/* Centered Grouping */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="ice-font-italic" style={{ fontSize: '0.8cm', marginBottom: '0.5cm' }}>
          To My Dearest Beloved Mis<span style={{ display: 'inline-flex', alignItems: 'center' }}>s<span className="ice-font" style={{ color: 'black', fontSize: '0.6em', marginLeft: '0.1em' }}>♥</span></span>
        </div>
        
        <div className="ice-font" style={{ fontSize: '0.6cm', marginBottom: '1.5cm' }}>
          August - 2026
        </div>

        <div className="ice-font" style={{ fontSize: '0.6cm' }}>
          ⊂(≽^•⩊•^≼)つ
        </div>
      </div>
    </div>
  );
};
