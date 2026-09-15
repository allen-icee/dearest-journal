import React, { useState, useEffect } from 'react';
import { X, Maximize, Minimize } from 'lucide-react';
import { type JournalConfig, type CoverPosition } from '../../types/journalConfig';

interface AdvancedDialogBoxProps {
  isOpen: boolean;
  type: 'font' | 'covers' | 'signature' | null;
  initialConfig: JournalConfig;
  onClose: () => void;
  onSave: (newConfig: JournalConfig) => void;
}

export const AdvancedDialogBox: React.FC<AdvancedDialogBoxProps> = ({
  isOpen,
  type,
  initialConfig,
  onClose,
  onSave
}) => {
  const [draftConfig, setDraftConfig] = useState<JournalConfig>(initialConfig);

  // Sync draft when opened
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
            />
          </label>
        </div>
      </div>
    </>
  );

  const renderCoverSettings = () => {
    const gridPositions = [
      null, 'top', null,
      'left', 'center', 'right',
      null, 'bottom', null
    ];

    return (
      <>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>Front Cover Image</h4>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                title="Contain (Fit in View)"
              >
                <Minimize size={16} />
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '13px' }}>Position</span>
            <div className="position-grid">
              {gridPositions.map((pos, i) => (
                <button
                  key={i}
                  disabled={pos === null}
                  className={`position-dot ${pos === draftConfig.frontCover.imagePosition ? 'active' : ''}`}
                  onClick={() => pos && updateDraft(p => ({...p, frontCover: {...p.frontCover, imagePosition: pos as CoverPosition}}))}
                  title={pos ? `Align ${pos}` : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e1e4e8', margin: '8px 0 8px 0' }} />

        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>Back Cover Image</h4>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                title="Contain (Fit in View)"
              >
                <Minimize size={16} />
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '13px' }}>Position</span>
            <div className="position-grid">
              {gridPositions.map((pos, i) => (
                <button
                  key={`back-${i}`}
                  disabled={pos === null}
                  className={`position-dot ${pos === draftConfig.backCover.imagePosition ? 'active' : ''}`}
                  onClick={() => pos && updateDraft(p => ({...p, backCover: {...p.backCover, imagePosition: pos as CoverPosition}}))}
                  title={pos ? `Align ${pos}` : undefined}
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
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>Font Presets</h4>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <button className="dialog-btn" onClick={() => applyPreset('default')}>Dearest Default</button>
        <button className="dialog-btn" onClick={() => applyPreset('classic')}>Classic (Black)</button>
        <button className="dialog-btn" onClick={() => applyPreset('violet')}>Soft Violet</button>
        <button className="dialog-btn" onClick={() => applyPreset('smallnote')}>Small Note</button>
      </div>
    </>
  );

  return (
    <div className="advanced-dialog-overlay" onClick={onClose}>
      <div className="advanced-dialog-box" onClick={e => e.stopPropagation()}>
        <div className="advanced-dialog-header">
          <div className="advanced-dialog-title">{getTitle()}</div>
          <button className="advanced-dialog-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        
        <div className="advanced-dialog-content">
          {type === 'font' && renderFontSettings()}
          {type === 'covers' && renderCoverSettings()}
          {type === 'signature' && renderSignatureSettings()}
        </div>

        <div className="advanced-dialog-footer">
          <button className="dialog-btn" onClick={onClose}>Cancel</button>
          <button className="dialog-btn primary" onClick={handleSave}>OK</button>
        </div>
      </div>
    </div>
  );
};
