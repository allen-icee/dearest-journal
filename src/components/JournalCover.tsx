import React from 'react';
import { MONTH_NAMES } from '../utils/calendar';
import { type JournalConfig } from '../types/journalConfig';
import { DEFAULT_JOURNAL_CONFIG } from '../config/journalDefaults';

interface JournalCoverProps {
  month: number;
  year: number;
  color?: string; // deprecated
  config?: JournalConfig;
}

export const JournalCover: React.FC<JournalCoverProps> = ({ month, year, config = DEFAULT_JOURNAL_CONFIG }) => {
  const monthName = MONTH_NAMES[month - 1] || "Unknown";

  const getBackgroundStyle = (): React.CSSProperties => {
    if (!config) return { backgroundColor: 'var(--cover-background)' };
    const cv = config.frontCover;
    if (cv.type === 'image' && cv.image) {
      return {
        backgroundImage: `url(${cv.image})`,
        backgroundSize: cv.imageSize,
        backgroundPosition: cv.imagePosition,
        backgroundRepeat: 'no-repeat',
      };
    }
    return { backgroundColor: cv.color };
  };

  const title = config.title.text || "To My Dearest Beloved Miss";

  return (
    <div className="responsive-scale-wrapper">
      <div className="journal-physical-page journal-cover-page" id="journal-cover" style={{
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
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          {/* Subtle top ornament */}
          <div style={{ fontSize: '0.5cm', opacity: 0.6, marginBottom: '2cm' }}>
            ❦
          </div>

          <div 
            className={config.title.fontFamily.includes('Italic') ? 'ice-font-italic' : 'ice-font'} 
            style={{ 
              fontSize: config.title.fontSize, 
              color: config.title.color, 
              marginBottom: '0.8cm' 
            }}
          >
            {title.slice(0, -1)}
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              {title.slice(-1)}
              {config.title.showHeart && <span className="ice-font" style={{ color: config.title.color, fontSize: '0.6em', marginLeft: '0.1em' }}>♥</span>}
            </span>
          </div>
          
          <div className="ice-font" style={{ fontSize: '0.55cm', marginBottom: '2cm', opacity: 0.9 }}>
            {monthName} - {year}
          </div>

          {/* Subtle Trademark */}
          {config?.kaomoji?.enabled !== false && (
            <div className={config?.kaomoji?.fontFamily?.includes('Italic') ? 'ice-font-italic' : 'ice-font'} style={{ fontSize: '0.45cm', opacity: 0.6 }}>
              {config?.kaomoji?.text || "⊂(≽^•⩊•^≼)つ"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
