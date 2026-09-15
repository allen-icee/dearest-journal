import React from 'react';
import { Diamond, Sparkles, Flower2 } from 'lucide-react';
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...getBackgroundStyle()
      }}>
        {config.showCoverText !== false && (
          <>
            {/* Foil Inset Double Border */}
            <div style={{
              position: 'absolute',
              inset: '1.2cm',
              border: `1px solid ${config.title.color}`,
              opacity: 0.6,
              pointerEvents: 'none',
              zIndex: 10
            }}>
              <div style={{
                position: 'absolute',
                inset: '4px',
                border: `1px solid ${config.title.color}`,
                opacity: 0.2
              }}></div>
            </div>

            {/* Content Container */}
            <div style={{
              position: 'relative',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%',
              height: '100%',
              padding: '2rem'
            }}>
              {/* Floral Anchor Emblem */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1cm', color: config.title.color, opacity: 0.85 }}>
                <Flower2 size={24} strokeWidth={1} />
              </div>

              <div 
                className="ice-font-italic" 
                style={{ 
                  fontSize: '2rem',
                  lineHeight: '1.4',
                  color: config.title.color, 
                  opacity: 0.85,
                  marginBottom: '1cm',
                  padding: '0 1rem',
                  mixBlendMode: 'multiply'
                }}
              >
                {title.slice(0, -1)}
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {title.slice(-1)}
                  {config.title.showHeart && <span className="ice-font" style={{ color: config.title.color, fontSize: '0.6em', marginLeft: '0.1em' }}>♥</span>}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '66%', margin: '0 auto', opacity: 0.5, color: config.title.color, marginBottom: '1cm' }}>
                <div style={{ height: '1px', flexGrow: 1, backgroundColor: 'currentColor', opacity: 0.2 }}></div>
                <Diamond size={14} strokeWidth={1} />
                <div style={{ height: '1px', flexGrow: 1, backgroundColor: 'currentColor', opacity: 0.2 }}></div>
              </div>
              
              <div className="ice-font" style={{ fontSize: '0.75rem', opacity: 0.85, color: config.title.color, letterSpacing: '2px', textTransform: 'uppercase' }}>
                {monthName} - {year}
              </div>

              {/* Subtle Trademark */}
              {config?.kaomoji?.enabled !== false && (
                <div className={config?.kaomoji?.fontFamily?.includes('Italic') ? 'ice-font-italic' : 'ice-font'} style={{ fontSize: '10px', opacity: 0.35, color: config.title.color, position: 'absolute', bottom: '1.5cm' }}>
                  {config?.kaomoji?.text || "⊂(≽^•⩊•^≼)つ"}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
