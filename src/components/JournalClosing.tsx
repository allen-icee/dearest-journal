import React from 'react';
import { Signature } from './Signature';
import { type JournalConfig } from '../types/journalConfig';

interface JournalClosingProps {
  config: JournalConfig;
}

export const JournalClosing: React.FC<JournalClosingProps> = ({ config }) => {
  const fontClass = 'ice-font-italic';

  const renderWithRegularPunctuation = (text: string) => {
    const parts = text.split(/([.,!?]+)/);
    return parts.map((part, i) => {
      if (/^[.,!?]+$/.test(part)) {
        return <span key={i} className="ice-font">{part}</span>;
      }
      return <span key={i} className={fontClass}>{part}</span>;
    });
  };

  return (
    <>
      {config.kaomoji.enabled && (
        <div 
          className={config.kaomoji.fontFamily.includes('Italic') ? 'ice-font-italic' : 'ice-font'} 
          style={{ 
            textAlign: config.kaomoji.alignment,
            fontSize: config.kaomoji.fontSize,
            color: config.kaomoji.color
          }}
        >
          {config.kaomoji.text}
        </div>
      )}
      
      {config.closing.enabled && (
        <div style={{ position: 'relative' }}>
          <Signature config={config} />
          
          <div 
            className="ice-font" 
            style={{ 
              position: 'relative', 
              zIndex: 1, 
              textAlign: config.closing.alignment, 
              paddingRight: config.closing.alignment === 'right' ? '0.5cm' : '0',
              paddingLeft: config.closing.alignment === 'left' ? '0.5cm' : '0',
              fontSize: config.closing.fontSize,
              color: config.closing.color
            }}
          >
            {renderWithRegularPunctuation(config.closing.soulfullyYours)}
          </div>
          <div 
            className="ice-font" 
            style={{ 
              position: 'relative', 
              zIndex: 1, 
              textAlign: config.closing.alignment, 
              paddingRight: config.closing.alignment === 'right' ? '0.5cm' : '0',
              paddingLeft: config.closing.alignment === 'left' ? '0.5cm' : '0',
              fontSize: config.closing.fontSize,
              color: config.closing.color
            }}
          >
            {renderWithRegularPunctuation(config.closing.mrDearest)}
          </div>
        </div>
      )}
    </>
  );
};
