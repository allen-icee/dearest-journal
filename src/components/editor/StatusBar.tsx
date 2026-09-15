import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface StatusBarProps {
  isVisible: boolean;
  isCover?: boolean;
  currentPage: number;
  totalPages: number;
  wordCount: number;
  zoom: number;
  onZoomChange: (z: number) => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  isVisible, 
  isCover,
  currentPage, 
  totalPages, 
  wordCount,
  zoom,
  onZoomChange
}) => {
  if (!isVisible) return null;

  return (
    <div className="status-bar-wrapper no-print">
      <div className="status-bar">
        {isCover ? (
          <span>Cover Page</span>
        ) : (
          <>
            <span>Page {currentPage} of {totalPages}</span>
            <span className="status-dot">•</span>
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          </>
        )}

        <div className="toolbar-divider" style={{ height: '14px', margin: '0 0.5rem' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Tooltip content="Zoom out" position="top">
            <button 
              className="toolbar-btn" 
              style={{ padding: '0.2rem' }}
              onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
              aria-label="Zoom out"
            >
              <Minus size={14} />
            </button>
          </Tooltip>
          
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={zoom} 
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="zoom-slider"
            aria-label="Zoom"
          />

          <Tooltip content="Zoom in" position="top">
            <button 
              className="toolbar-btn" 
              style={{ padding: '0.2rem' }}
              onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
              aria-label="Zoom in"
            >
              <Plus size={14} />
            </button>
          </Tooltip>

          <Tooltip content="Reset zoom" position="top">
            <button 
              className="toolbar-btn" 
              style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', minWidth: '40px' }}
              onClick={() => onZoomChange(1)}
            >
              {Math.round(zoom * 100)}%
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
