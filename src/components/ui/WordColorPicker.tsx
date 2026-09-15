import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, PaintBucket } from 'lucide-react';

interface WordColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  icon?: React.ReactNode;
  label?: string;
  tooltip?: string;
}

const THEME_COLORS = [
  // Column 1: Violet/Purple (Brand color)
  ['#6C5B7B', '#4D4057', '#897A96', '#A79BB1', '#C6BECF', '#E4E0E8'],
  // Column 2: Warm Gray
  ['#888888', '#666666', '#AAAAAA', '#CCCCCC', '#DDDDDD', '#EEEEEE'],
  // Column 3: Soft Blue
  ['#5B6C7B', '#404D57', '#7A8996', '#9BA7B1', '#BEC6CF', '#E0E4E8'],
  // Column 4: Soft Rose
  ['#7B5B6C', '#57404D', '#967A89', '#B19BA7', '#CFBEC6', '#E8E0E4'],
  // Column 5: Cream/Gold
  ['#C19A6B', '#967448', '#D1B48E', '#E1CEB1', '#F0E7D4', '#F9F6F0'],
];

const STANDARD_COLORS = [
  '#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0'
];

export const WordColorPicker: React.FC<WordColorPickerProps> = ({ 
  color, 
  onChange, 
  icon = <PaintBucket size={16} />,
  label,
  tooltip 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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

  return (
    <div className="word-color-picker-container" style={{ position: 'relative' }} ref={popoverRef}>
      <button 
        className="toolbar-btn ribbon-action-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={tooltip || label}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '0.25rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <ChevronDown size={12} style={{ marginLeft: '2px' }} />
        </div>
        <div style={{ width: '16px', height: '4px', backgroundColor: color, border: '1px solid rgba(0,0,0,0.1)' }} />
      </button>

      {isOpen && (
        <div 
          className="word-color-popover" 
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '4px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #C8C6C4',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            borderRadius: '2px',
            padding: '12px',
            zIndex: 1000,
            width: '220px'
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
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
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

          <div style={{ height: '1px', background: '#e1e4e8', margin: '12px 0 8px 0' }} />
          
          <label style={{ 
            display: 'block', 
            fontSize: '12px', 
            color: '#333', 
            cursor: 'pointer', 
            padding: '4px',
            textAlign: 'center',
            background: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #e1e4e8'
          }}>
            🎨 More Colors...
            <input 
              type="color" 
              style={{ display: 'none' }}
              value={color.startsWith('#') ? color : '#000000'}
              onChange={(e) => handleSelect(e.target.value)}
            />
          </label>
        </div>
      )}
    </div>
  );
};
