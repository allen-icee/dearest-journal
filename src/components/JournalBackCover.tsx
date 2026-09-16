import React from 'react';
import { Flower2 } from 'lucide-react';
import { type JournalConfig } from '../types/journalConfig';

interface JournalBackCoverProps {
  config?: JournalConfig;
}

/**
 * Renders the back cover of the journal, matching the aesthetic
 * configuration of the front cover (color or image background).
 */
export const JournalBackCover: React.FC<JournalBackCoverProps> = React.memo(({ config }) => {
  const getBackgroundStyle = (): React.CSSProperties => {
    if (!config) return { backgroundColor: 'var(--cover-background)' };
    const cv = config.backCover;
    if (cv.type === 'image' && cv.image) {
      return {
        backgroundImage: `url(${cv.image})`,
        backgroundSize: cv.imageSize,
        backgroundPosition: cv.imagePosition,
        backgroundRepeat: 'no-repeat',
      };
    }
    return { backgroundColor: cv.color || 'var(--cover-background)' };
  };

  return (
    <div className="responsive-scale-wrapper">
      <div className="journal-physical-page journal-cover-page" id="journal-back-cover" style={{
        padding: '1.2cm',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...getBackgroundStyle()
      }}>
        {config?.showCoverText !== false && (
          <>
            {/* Foil Inset Double Border */}
            <div style={{
              position: 'absolute',
              inset: '1.2cm',
              border: `1px solid ${config?.title.color || '#fff'}`,
              opacity: 0.6,
              pointerEvents: 'none',
              zIndex: 10
            }}>
              <div style={{
                position: 'absolute',
                inset: '4px',
                border: `1px solid ${config?.title.color || '#fff'}`,
                opacity: 0.2
              }}></div>
            </div>

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
              {/* Subtle minimalist ornament */}
              <div style={{ opacity: 0.85, color: config?.title.color || '#fff' }}>
                <Flower2 size={20} strokeWidth={1} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
