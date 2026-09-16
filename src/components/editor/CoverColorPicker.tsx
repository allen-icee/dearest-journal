import React, { useState, useEffect, useRef } from 'react';
import { Palette, Pipette } from 'lucide-react';
import { Tooltip } from './Tooltip';

export const COVER_COLOR_PRESETS = [
  '#C9B8E8',
  '#D8C9EF',
  '#E5D7F2',
  '#BDAACF',
  '#D4BFCF',
  '#EBCFD6',
  '#C8DCEF',
  '#C9DCCF',
  '#EFE1B8',
  '#D8D6D3',
];

export const DEFAULT_COVER_COLOR = '#C9B8E8';

interface CoverColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const CoverColorPicker: React.FC<CoverColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color || DEFAULT_COVER_COLOR);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(color || DEFAULT_COVER_COLOR);
  }, [color]);

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

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="custom-dropdown" ref={popoverRef}>
      <Tooltip content="Cover Color" position="bottom">
        <button
          className={`toolbar-btn ribbon-action-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Cover Color"
        >
          <div className="toolbar-btn-icon">
            <Palette size={18} />
          </div>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: color || DEFAULT_COVER_COLOR,
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          />
        </button>
      </Tooltip>

      {isOpen && (
        <div className="dropdown-menu color-picker-menu">
          <div className="color-picker-section">
            <div className="color-picker-label">Preset colors</div>
            <div className="color-preset-grid">
              {COVER_COLOR_PRESETS.map(preset => (
                <button
                  key={preset}
                  className={`color-preset-swatch ${(color || DEFAULT_COVER_COLOR).toUpperCase() === preset.toUpperCase() ? 'selected' : ''}`}
                  style={{ backgroundColor: preset }}
                  onClick={() => {
                    onChange(preset);
                    setIsOpen(false);
                  }}
                  aria-label={`Select color ${preset}`}
                />
              ))}
            </div>
          </div>

          <div className="dropdown-separator" />

          <div className="color-picker-section">
            <div className="color-picker-label">Custom color</div>
            <div className="custom-color-row">
              <div className="hex-input-wrapper">
                <span className="hex-hash">#</span>
                <input
                  type="text"
                  className="hex-input"
                  value={hexInput.replace('#', '')}
                  onChange={handleHexChange}
                  maxLength={6}
                />
              </div>

              <div className="native-color-picker-wrapper">
                <Pipette size={16} className="native-color-picker-icon" />
                <input
                  type="color"
                  className="native-color-picker"
                  value={color || DEFAULT_COVER_COLOR}
                  onChange={(e) => onChange(e.target.value)}
                  title="Eyedropper / Color Picker"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
