import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, PaintBucket } from 'lucide-react';

interface WordColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  icon?: React.ReactNode;
  label?: string;
  tooltip?: string;
}

const THEME_COLORS = [
  ['#9B84C8', '#8672B1', '#72609A', '#5E4E83', '#493C6C', '#352A55'],
  ['#E1DFDD', '#C8C6C4', '#A19F9D', '#797775', '#605E5C', '#3B3A39'],
  ['#A6C8FF', '#80ADFF', '#5A92FF', '#3477FF', '#005DFF', '#0047C2'],
  ['#FFB3C6', '#FF8EAA', '#FF698E', '#FF4472', '#FF1F56', '#D60036'],
  ['#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309']
];

const STANDARD_COLORS = [
  '#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0'
];

/**
 * A specialized color picker dropdown that provides a curated palette
 * of theme-appropriate colors for text and highlights.
 */
export const WordColorPicker: React.FC<WordColorPickerProps> = ({ 
  color, 
  onChange, 
  icon = <PaintBucket size={16} />,
  label,
  tooltip 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [hexInput, setHexInput] = useState(color || '#000000');

  useEffect(() => {
    setHexInput(color || '#000000');
  }, [color]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (selectedColor: string) => {
    onChange(selectedColor);
    setIsOpen(false);
  };

  const togglePopover = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="word-color-picker-container" style={{ position: 'relative' }}>
      <button 
        ref={triggerRef}
        className="toolbar-btn ribbon-action-btn"
        onClick={togglePopover}
        title={tooltip || label}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '0.25rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <ChevronDown size={12} style={{ marginLeft: '2px' }} />
        </div>
        <div style={{ width: '16px', height: '4px', backgroundColor: color, border: '1px solid rgba(0,0,0,0.1)' }} />
      </button>

      {isOpen && createPortal(
        <div 
          ref={popoverRef}
          className="word-color-popover max-w-[95vw] max-h-[85svh] overflow-y-auto sm:p-4 p-2" 
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            backgroundColor: '#FFFFFF',
            border: '1px solid #C8C6C4',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            borderRadius: '2px',
            zIndex: 9999,
            width: 'fit-content'
          }}
        >
          <div style={{ fontSize: '12px', color: '#605E5C', marginBottom: '8px', fontWeight: 600 }}>Theme Colors</div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {THEME_COLORS.map((column, colIdx) => (
              <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {column.map((hex, rowIdx) => (
                  <button
                    key={hex}
                    onClick={() => handleSelect(hex)}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: hex,
                      border: '1px solid rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      padding: 0,
                      margin: rowIdx === 0 ? '0 0 4px 0' : 0, // Space between main theme color and lighter variants
                    }}
                    className="word-color-swatch"
                    title={hex}
                  />
                ))}
              </div>
            ))}
          </div>

          <div style={{ fontSize: '12px', color: '#605E5C', marginBottom: '8px', fontWeight: 600 }}>Standard Colors</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '116px' }}>
            {STANDARD_COLORS.map(hex => (
              <button
                key={hex}
                onClick={() => handleSelect(hex)}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: hex,
                  border: '1px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  padding: 0,
                }}
                className="word-color-swatch"
                title={hex}
              />
            ))}
          </div>

          <div style={{ height: '1px', background: '#e1e4e8', margin: '8px 0 8px 0' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '116px', padding: '4px', margin: '0 auto', boxSizing: 'border-box' }}>
            <div style={{ fontSize: '12px', color: '#605E5C', fontWeight: 600 }}>Custom Hex</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '1px solid #e1e4e8', 
                borderRadius: '4px',
                background: '#fff',
                padding: '0 6px'
              }}>
                <span style={{ color: '#888', fontSize: '12px', fontWeight: 500, userSelect: 'none' }}>#</span>
                <input
                  type="text"
                  value={hexInput.replace('#', '')}
                  onChange={(e) => setHexInput('#' + e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6))}
                  placeholder="000000"
                  style={{
                    flex: 1,
                    width: '100%',
                    fontSize: '12px',
                    padding: '6px 4px',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
              
              <button
                type="button"
                disabled={!/^#[0-9A-F]{6}$/i.test(hexInput)}
                onClick={() => {
                  if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
                    handleSelect(hexInput);
                  }
                }}
                style={{
                  padding: '6px 8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: /^#[0-9A-F]{6}$/i.test(hexInput) ? '#C9B8E8' : '#f3f2f1',
                  color: /^#[0-9A-F]{6}$/i.test(hexInput) ? '#493C6C' : '#a19f9d',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: /^#[0-9A-F]{6}$/i.test(hexInput) ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s, color 0.2s'
                }}
              >
                Apply
              </button>

              <div style={{ textAlign: 'center', marginTop: '2px' }}>
                <a 
                  href="https://htmlcolorcodes.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontSize: '10px', color: '#8672B1', textDecoration: 'underline' }}
                  title="Find hex codes here"
                >
                  Need a color code?
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
