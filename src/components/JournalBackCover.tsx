import React from 'react';
import { type JournalConfig } from '../types/journalConfig';

interface JournalBackCoverProps {
  color?: string; // deprecated
  config?: JournalConfig;
}

export const JournalBackCover: React.FC<JournalBackCoverProps> = ({ config, color }) => {
  const getBackgroundStyle = (): React.CSSProperties => {
    if (!config) return { backgroundColor: color || 'var(--cover-background)' };
    const cv = config.backCover;
    if (cv.type === 'image' && cv.image) {
      return {
        backgroundImage: `url(${cv.image})`,
        backgroundSize: cv.imageSize,
        backgroundPosition: cv.imagePosition,
        backgroundRepeat: 'no-repeat',
      };
    }
    return { backgroundColor: cv.color || color };
  };

  return (
    <div className="responsive-scale-wrapper">
      <div className="journal-physical-page journal-cover-page" id="journal-back-cover" style={{
        padding: '1.2cm',
        ...getBackgroundStyle()
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
