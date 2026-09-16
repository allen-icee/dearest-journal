import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Maximize, Minimize, Info } from 'lucide-react';
import { type JournalConfig, type CoverPosition } from '../../types/journalConfig';

interface AdvancedDialogBoxProps {
  isOpen: boolean;
  type: 'font' | 'covers' | 'signature' | null;
  initialConfig: JournalConfig;
  onClose: () => void;
  onSave: (newConfig: JournalConfig) => void;
}

/**
 * AdvancedDialogBox provides a comprehensive configuration interface
 * for the journal's appearance, covers, signature, and typography settings.
 */
export const AdvancedDialogBox: React.FC<AdvancedDialogBoxProps> = ({
  isOpen,
  type,
  initialConfig,
  onClose,
  onSave
}) => {
  const [draftConfig, setDraftConfig] = useState<JournalConfig>(initialConfig);

  useEffect(() => {
    if (isOpen) {
      setDraftConfig(initialConfig);
    }
  }, [isOpen, initialConfig]);

  if (!isOpen || !type) return null;

  const updateDraft = (updater: (prev: JournalConfig) => JournalConfig) => {
    setDraftConfig(updater);
  };

  const handleSave = () => {
    onSave(draftConfig);
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case 'font': return 'Font Settings';
      case 'covers': return 'Advanced Cover Settings';
      case 'signature': return 'Signature Settings';
    }
  };

  const renderSignatureSettings = () => (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <strong>Opacity</strong>
          <input 
            type="range" 
            min="0" max="1" step="0.05"
            value={draftConfig.signature.opacity} 
            onChange={e => updateDraft(p => ({...p, signature: {...p.signature, opacity: Number(e.target.value)}}))}
          />
          <span style={{ fontSize: '11px', color: '#666' }}>{Math.round(draftConfig.signature.opacity * 100)}%</span>
        </label>
        
        <label style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <strong>Width</strong>
          <input 
            type="text" 
            className="toolbar-btn"
            style={{ border: '1px solid #e1e4e8', borderRadius: '4px', padding: '4px 8px', background: '#fff' }}
            value={draftConfig.signature.width} 
            onChange={e => updateDraft(p => ({...p, signature: {...p.signature, width: e.target.value}}))}
            placeholder="e.g. 3cm"
            pattern="^\d+(\.\d+)?(cm|px|%)$"
            title="Must be a valid CSS dimension like '3cm', '150px', or '20%'"
          />
        </label>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <label style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <strong>X Offset</strong>
            <input 
              type="text" 
              className="toolbar-btn"
              style={{ border: '1px solid #e1e4e8', borderRadius: '4px', padding: '4px 8px', background: '#fff' }}
              value={draftConfig.signature.offsetX} 
              onChange={e => updateDraft(p => ({...p, signature: {...p.signature, offsetX: e.target.value}}))}
              pattern="^-?\d+(\.\d+)?(cm|px|%)$"
              title="Must be a valid CSS dimension like '3cm', '-10px', or '5%'"
            />
          </label>
          <label style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <strong>Y Offset</strong>
            <input 
              type="text" 
              className="toolbar-btn"
              style={{ border: '1px solid #e1e4e8', borderRadius: '4px', padding: '4px 8px', background: '#fff' }}
              value={draftConfig.signature.offsetY} 
              onChange={e => updateDraft(p => ({...p, signature: {...p.signature, offsetY: e.target.value}}))}
              pattern="^-?\d+(\.\d+)?(cm|px|%)$"
              title="Must be a valid CSS dimension like '3cm', '-10px', or '5%'"
            />
          </label>
        </div>
      </div>
    </>
  );

  const renderCoverSettings = () => {
    const gridPositions: { pos: CoverPosition; title: string }[] = [
      { pos: 'top left', title: 'Top Left' },
      { pos: 'top', title: 'Top Center' },
      { pos: 'top right', title: 'Top Right' },
      { pos: 'left', title: 'Center Left' },
      { pos: 'center', title: 'Center' },
      { pos: 'right', title: 'Center Right' },
      { pos: 'bottom left', title: 'Bottom Left' },
      { pos: 'bottom', title: 'Bottom Center' },
      { pos: 'bottom right', title: 'Bottom Right' }
    ];

    return (
      <>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#333', textAlign: 'center' }}>Front Cover Image</h4>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '4px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px' }}>Fit</span>
            <div className="alignment-group">
              <button 
                className={`alignment-btn ${draftConfig.frontCover.imageSize === 'cover' ? 'active' : ''}`} 
                onClick={() => updateDraft(p => ({...p, frontCover: {...p.frontCover, imageSize: 'cover'}}))} 
                title="Cover (Fill Page)"
              >
                <Maximize size={16} />
              </button>
              <button 
                className={`alignment-btn ${draftConfig.frontCover.imageSize === 'contain' ? 'active' : ''}`} 
                onClick={() => updateDraft(p => ({...p, frontCover: {...p.frontCover, imageSize: 'contain'}}))} 
                title="Contain (Fit to Page)"
              >
                <Minimize size={16} />
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px' }}>Position</span>
            <div className="position-grid">
              {gridPositions.map((item, i) => (
                <button
                  key={i}
                  className={`position-dot ${item.pos === draftConfig.frontCover.imagePosition ? 'active' : ''}`}
                  onClick={() => updateDraft(p => ({...p, frontCover: {...p.frontCover, imagePosition: item.pos}}))}
                  title={item.title}
                />
              ))}
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e1e4e8', margin: '4px 0 4px 0' }} />

        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#333', textAlign: 'center' }}>Back Cover Image</h4>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px' }}>Fit</span>
            <div className="alignment-group">
              <button 
                className={`alignment-btn ${draftConfig.backCover.imageSize === 'cover' ? 'active' : ''}`} 
                onClick={() => updateDraft(p => ({...p, backCover: {...p.backCover, imageSize: 'cover'}}))} 
                title="Cover (Fill Page)"
              >
                <Maximize size={16} />
              </button>
              <button 
                className={`alignment-btn ${draftConfig.backCover.imageSize === 'contain' ? 'active' : ''}`} 
                onClick={() => updateDraft(p => ({...p, backCover: {...p.backCover, imageSize: 'contain'}}))} 
                title="Contain (Fit to Page)"
              >
                <Minimize size={16} />
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px' }}>Position</span>
            <div className="position-grid">
              {gridPositions.map((item, i) => (
                <button
                  key={`back-${i}`}
                  className={`position-dot ${item.pos === draftConfig.backCover.imagePosition ? 'active' : ''}`}
                  onClick={() => updateDraft(p => ({...p, backCover: {...p.backCover, imagePosition: item.pos}}))}
                  title={item.title}
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const applyPreset = (preset: string) => {
    if (preset === 'default') {
      updateDraft(p => ({
        ...p,
        title: { ...p.title, color: '#333333' },
        greeting: { ...p.greeting, color: '#333333' },
        body: { ...p.body, color: '#333333' },
        closing: { ...p.closing, color: '#333333' }
      }));
    } else if (preset === 'classic') {
      updateDraft(p => ({
        ...p,
        title: { ...p.title, color: '#000000' },
        greeting: { ...p.greeting, color: '#000000' },
        body: { ...p.body, color: '#000000' },
        closing: { ...p.closing, color: '#000000' }
      }));
    } else if (preset === 'violet') {
      updateDraft(p => ({
        ...p,
        title: { ...p.title, color: '#6a0dad' },
        greeting: { ...p.greeting, color: '#6a0dad' },
        body: { ...p.body, color: '#4a4a4a' },
        closing: { ...p.closing, color: '#6a0dad' }
      }));
    } else if (preset === 'smallnote') {
      updateDraft(p => ({
        ...p,
        title: { ...p.title, color: '#2b5797' },
        greeting: { ...p.greeting, color: '#2b5797' },
        body: { ...p.body, color: '#333333' },
        closing: { ...p.closing, color: '#2b5797' }
      }));
    }
  };

  const renderFontSettings = () => (
    <>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333', textAlign: 'center' }}>Font Presets</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
        <button className="dialog-btn" onClick={() => applyPreset('default')}>Dearest Default</button>
        <button className="dialog-btn" onClick={() => applyPreset('classic')}>Classic (Black)</button>
        <button className="dialog-btn" onClick={() => applyPreset('violet')}>Soft Violet</button>
        <button className="dialog-btn" onClick={() => applyPreset('smallnote')}>Small Note</button>
      </div>
      <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f0f4f8', borderRadius: '4px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <Info size={16} color="#005fb8" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '11px', color: '#333', lineHeight: '1.4' }}>
          <strong>Pro Tip:</strong> Want to use your own real handwriting? You can create your own font for free at <a href="https://www.calligraphr.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#005fb8', textDecoration: 'underline' }}>Calligraphr.com</a> and install it on your device!
        </span>
      </div>
    </>
  );

  return createPortal(
    <div className="advanced-dialog-overlay" onClick={onClose}>
      <div className="advanced-dialog-box max-w-[95vw] max-h-[85svh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="advanced-dialog-header">
          <div className="advanced-dialog-title">{getTitle()}</div>
          <button className="advanced-dialog-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        
        <div className="advanced-dialog-content sm:p-4 p-2">
          {type === 'font' && renderFontSettings()}
          {type === 'covers' && renderCoverSettings()}
          {type === 'signature' && renderSignatureSettings()}
        </div>

        <div className="advanced-dialog-footer">
          <button className="dialog-btn" onClick={onClose}>Cancel</button>
          <button className="dialog-btn primary" onClick={handleSave}>OK</button>
        </div>
      </div>
    </div>,
    document.body
  );
};
