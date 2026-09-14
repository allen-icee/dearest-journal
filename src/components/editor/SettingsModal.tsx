import React, { useState } from 'react';
import { X, Type, PenTool, Book, Settings, Upload } from 'lucide-react';
import { type JournalConfig, type CoverType, type CoverFit, type CoverPosition, type Alignment } from '../../types/journalConfig';
import { FONT_PRESETS, COVER_PRESETS } from '../../config/journalPresets';
import { compressImageFile } from '../../utils/imageUtils';

interface SettingsModalProps {
  config: JournalConfig;
  onSave: (newConfig: JournalConfig) => void;
  onClose: () => void;
}

type TabType = 'writing' | 'closing' | 'signature' | 'covers' | 'general';

export const SettingsModal: React.FC<SettingsModalProps> = ({ config, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('writing');
  const [draft, setDraft] = useState<JournalConfig>(JSON.parse(JSON.stringify(config)));

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'frontCover' | 'backCover') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setDraft(prev => ({
        ...prev,
        [target]: {
          ...prev[target],
          image: dataUrl,
          type: 'image'
        }
      }));
    } catch (err) {
      console.error('Failed to compress image:', err);
    }
  };

  const renderWritingTab = () => (
    <div className="settings-section">
      <h3>Font Presets</h3>
      <div className="preset-grid">
        {FONT_PRESETS.map(preset => (
          <button 
            key={preset.id} 
            className="preset-btn"
            onClick={() => {
              setDraft(p => ({
                ...p,
                body: {
                  fontFamily: preset.body.fontFamily,
                  fontSize: preset.body.fontSize,
                  color: preset.body.color
                },
                greeting: {
                  fontFamily: preset.greeting.fontFamily,
                  fontSize: preset.greeting.fontSize,
                  color: preset.greeting.color
                },
                title: {
                  ...p.title,
                  fontFamily: preset.title.fontFamily,
                  fontSize: preset.title.fontSize,
                  color: preset.title.color
                },
                closing: {
                  ...p.closing,
                  fontFamily: preset.closing.fontFamily,
                  fontSize: preset.closing.fontSize,
                  color: preset.closing.color
                }
              }));
            }}
          >
            {preset.name}
          </button>
        ))}
      </div>
      
      <h3 style={{ marginTop: '1.5rem' }}>Body Writing</h3>
      <div className="settings-form">
        <label>
          <span>Font Family</span>
          <select 
            value={draft.body.fontFamily} 
            onChange={e => setDraft(p => ({...p, body: {...p.body, fontFamily: e.target.value}}))}
          >
            <option value="IceFont Regular">IceFont Regular</option>
            <option value="IceFont Italic">IceFont Italic</option>
          </select>
        </label>
        <label>
          <span>Font Size</span>
          <input 
            type="text" 
            value={draft.body.fontSize} 
            onChange={e => setDraft(p => ({...p, body: {...p.body, fontSize: e.target.value}}))}
          />
        </label>
        <label>
          <span>Color</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="color" 
              value={draft.body.color === 'black' ? '#000000' : draft.body.color} 
              onChange={e => setDraft(p => ({...p, body: {...p.body, color: e.target.value}}))}
            />
            <input 
              type="text" 
              value={draft.body.color} 
              onChange={e => setDraft(p => ({...p, body: {...p.body, color: e.target.value}}))}
              style={{ flexGrow: 1 }}
            />
          </div>
        </label>
      </div>

      <h3 style={{ marginTop: '1.5rem' }}>Greeting (First Line)</h3>
      <div className="settings-form">
        <label>
          <span>Font Family</span>
          <select 
            value={draft.greeting.fontFamily} 
            onChange={e => setDraft(p => ({...p, greeting: {...p.greeting, fontFamily: e.target.value}}))}
          >
            <option value="IceFont Regular">IceFont Regular</option>
            <option value="IceFont Italic">IceFont Italic</option>
          </select>
        </label>
        <label>
          <span>Font Size</span>
          <input 
            type="text" 
            value={draft.greeting.fontSize} 
            onChange={e => setDraft(p => ({...p, greeting: {...p.greeting, fontSize: e.target.value}}))}
          />
        </label>
        <label>
          <span>Color</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="color" 
              value={draft.greeting.color === 'black' ? '#000000' : draft.greeting.color} 
              onChange={e => setDraft(p => ({...p, greeting: {...p.greeting, color: e.target.value}}))}
            />
            <input 
              type="text" 
              value={draft.greeting.color} 
              onChange={e => setDraft(p => ({...p, greeting: {...p.greeting, color: e.target.value}}))}
              style={{ flexGrow: 1 }}
            />
          </div>
        </label>
      </div>

      <h3 style={{ marginTop: '1.5rem' }}>Journal Title</h3>
      <div className="settings-form">
        <label>
          <span>Title Text</span>
          <input 
            type="text" 
            value={draft.title.text} 
            onChange={e => setDraft(p => ({...p, title: {...p.title, text: e.target.value}}))}
          />
        </label>
        <label>
          <span>Font Family</span>
          <select 
            value={draft.title.fontFamily} 
            onChange={e => setDraft(p => ({...p, title: {...p.title, fontFamily: e.target.value}}))}
          >
            <option value="IceFont Regular">IceFont Regular</option>
            <option value="IceFont Italic">IceFont Italic</option>
          </select>
        </label>
        <label>
          <span>Font Size</span>
          <input 
            type="text" 
            value={draft.title.fontSize} 
            onChange={e => setDraft(p => ({...p, title: {...p.title, fontSize: e.target.value}}))}
          />
        </label>
        <label>
          <span>Color</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="color" 
              value={draft.title.color === 'black' ? '#000000' : draft.title.color} 
              onChange={e => setDraft(p => ({...p, title: {...p.title, color: e.target.value}}))}
            />
            <input 
              type="text" 
              value={draft.title.color} 
              onChange={e => setDraft(p => ({...p, title: {...p.title, color: e.target.value}}))}
              style={{ flexGrow: 1 }}
            />
          </div>
        </label>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={draft.title.showHeart}
            onChange={e => setDraft(p => ({...p, title: {...p.title, showHeart: e.target.checked}}))}
          />
          <span>Show Heart (♥)</span>
        </label>
      </div>
    </div>
  );

  const renderClosingTab = () => (
    <div className="settings-section">
      <label className="checkbox-label mb-4">
        <input 
          type="checkbox" 
          checked={draft.closing.enabled}
          onChange={e => setDraft(p => ({...p, closing: {...p.closing, enabled: e.target.checked}}))}
        />
        <span style={{ fontWeight: 600 }}>Enable Closing Block</span>
      </label>

      {draft.closing.enabled && (
        <div className="settings-form">
          <label>
            <span>Closing Line 1</span>
            <input 
              type="text" 
              value={draft.closing.soulfullyYours} 
              onChange={e => setDraft(p => ({...p, closing: {...p.closing, soulfullyYours: e.target.value}}))}
            />
          </label>
          <label>
            <span>Closing Line 2</span>
            <input 
              type="text" 
              value={draft.closing.mrDearest} 
              onChange={e => setDraft(p => ({...p, closing: {...p.closing, mrDearest: e.target.value}}))}
            />
          </label>
          <label>
            <span>Font Family</span>
            <select 
              value={draft.closing.fontFamily} 
              onChange={e => setDraft(p => ({...p, closing: {...p.closing, fontFamily: e.target.value}}))}
            >
              <option value="IceFont Regular">IceFont Regular</option>
              <option value="IceFont Italic">IceFont Italic</option>
            </select>
          </label>
          <label>
            <span>Font Size</span>
            <input 
              type="text" 
              value={draft.closing.fontSize} 
              onChange={e => setDraft(p => ({...p, closing: {...p.closing, fontSize: e.target.value}}))}
            />
          </label>
          <label>
            <span>Color</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="color" 
                value={draft.closing.color === 'black' ? '#000000' : draft.closing.color} 
                onChange={e => setDraft(p => ({...p, closing: {...p.closing, color: e.target.value}}))}
              />
              <input 
                type="text" 
                value={draft.closing.color} 
                onChange={e => setDraft(p => ({...p, closing: {...p.closing, color: e.target.value}}))}
                style={{ flexGrow: 1 }}
              />
            </div>
          </label>
          <label>
            <span>Alignment</span>
            <select 
              value={draft.closing.alignment} 
              onChange={e => setDraft(p => ({...p, closing: {...p.closing, alignment: e.target.value as Alignment}}))}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
        </div>
      )}

      <hr className="my-4" />

      <label className="checkbox-label mb-4">
        <input 
          type="checkbox" 
          checked={draft.kaomoji.enabled}
          onChange={e => setDraft(p => ({...p, kaomoji: {...p.kaomoji, enabled: e.target.checked}}))}
        />
        <span style={{ fontWeight: 600 }}>Enable Trademark Kaomoji</span>
      </label>
      
      {draft.kaomoji.enabled && (
        <div className="settings-form">
          <label>
            <span>Text</span>
            <input 
              type="text" 
              value={draft.kaomoji.text} 
              onChange={e => setDraft(p => ({...p, kaomoji: {...p.kaomoji, text: e.target.value}}))}
            />
          </label>
          <label>
            <span>Alignment</span>
            <select 
              value={draft.kaomoji.alignment} 
              onChange={e => setDraft(p => ({...p, kaomoji: {...p.kaomoji, alignment: e.target.value as Alignment}}))}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );

  const renderSignatureTab = () => (
    <div className="settings-section">
      <label className="checkbox-label mb-4">
        <input 
          type="checkbox" 
          checked={draft.signature.enabled}
          onChange={e => setDraft(p => ({...p, signature: {...p.signature, enabled: e.target.checked}}))}
        />
        <span style={{ fontWeight: 600 }}>Enable Signature</span>
      </label>

      {draft.signature.enabled && (
        <div className="settings-form">
          <label>
            <span>Opacity (0 to 1)</span>
            <input 
              type="number" 
              step="0.05"
              min="0"
              max="1"
              value={draft.signature.opacity} 
              onChange={e => setDraft(p => ({...p, signature: {...p.signature, opacity: Number(e.target.value)}}))}
            />
          </label>
          <label>
            <span>Width (e.g. 3cm)</span>
            <input 
              type="text" 
              value={draft.signature.width} 
              onChange={e => setDraft(p => ({...p, signature: {...p.signature, width: e.target.value}}))}
            />
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ flex: 1 }}>
              <span>Offset X</span>
              <input 
                type="text" 
                value={draft.signature.offsetX} 
                onChange={e => setDraft(p => ({...p, signature: {...p.signature, offsetX: e.target.value}}))}
              />
            </label>
            <label style={{ flex: 1 }}>
              <span>Offset Y</span>
              <input 
                type="text" 
                value={draft.signature.offsetY} 
                onChange={e => setDraft(p => ({...p, signature: {...p.signature, offsetY: e.target.value}}))}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const renderCoverSettings = (target: 'frontCover' | 'backCover', label: string) => {
    const cv = draft[target];
    return (
      <div className="settings-form mb-6">
        <h3 style={{ borderBottom: '1px solid #e1e4e8', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{label}</h3>
        <label>
          <span>Cover Type</span>
          <select 
            value={cv.type} 
            onChange={e => setDraft(p => ({...p, [target]: {...p[target], type: e.target.value as CoverType}}))}
          >
            <option value="color">Solid Color</option>
            <option value="image">Image</option>
          </select>
        </label>

        {cv.type === 'color' && (
          <div style={{ marginTop: '0.5rem' }}>
            <div className="color-preset-grid" style={{ marginBottom: '1rem' }}>
              {COVER_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  className={`color-preset-swatch ${cv.color.toUpperCase() === preset.color.toUpperCase() ? 'selected' : ''}`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                  onClick={() => setDraft(p => ({...p, [target]: {...p[target], color: preset.color}}))}
                />
              ))}
            </div>
            <label>
              <span>Custom HEX</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="color" 
                  value={cv.color} 
                  onChange={e => setDraft(p => ({...p, [target]: {...p[target], color: e.target.value}}))}
                />
                <input 
                  type="text" 
                  value={cv.color} 
                  onChange={e => setDraft(p => ({...p, [target]: {...p[target], color: e.target.value}}))}
                  style={{ flexGrow: 1 }}
                />
              </div>
            </label>
          </div>
        )}

        {cv.type === 'image' && (
          <div style={{ marginTop: '0.5rem' }}>
            {cv.image ? (
              <div className="cover-image-preview" style={{ backgroundImage: `url(${cv.image})` }}>
                <button className="remove-image-btn" onClick={() => setDraft(p => ({...p, [target]: {...p[target], image: undefined, type: 'color'}}))}>
                  <X size={14} /> Remove Image
                </button>
              </div>
            ) : (
              <label className="image-upload-zone">
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, target)} style={{ display: 'none' }} />
                <Upload size={24} color="#9aa0a6" />
                <span>Click to upload image</span>
              </label>
            )}
            
            <label style={{ marginTop: '1rem' }}>
              <span>Fit</span>
              <select 
                value={cv.imageSize} 
                onChange={e => setDraft(p => ({...p, [target]: {...p[target], imageSize: e.target.value as CoverFit}}))}
              >
                <option value="cover">Cover (Fill page)</option>
                <option value="contain">Contain (Show full image)</option>
              </select>
            </label>
            <label>
              <span>Position</span>
              <select 
                value={cv.imagePosition} 
                onChange={e => setDraft(p => ({...p, [target]: {...p[target], imagePosition: e.target.value as CoverPosition}}))}
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>
        )}
      </div>
    );
  };

  const renderCoversTab = () => (
    <div className="settings-section">
      {renderCoverSettings('frontCover', 'Front Cover')}
      {renderCoverSettings('backCover', 'Back Cover')}
    </div>
  );

  const renderGeneralTab = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    
    return (
      <div className="settings-section">
        <h3>System Information</h3>
        <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          DearestJournal operates entirely locally. Dates and times are derived directly from your device.
        </p>
        
        <div className="sys-info-grid">
          <div className="sys-info-label">Current date</div>
          <div className="sys-info-value">{now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          
          <div className="sys-info-label">Current time</div>
          <div className="sys-info-value">{now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</div>
          
          <div className="sys-info-label">Timezone</div>
          <div className="sys-info-value">{tz}</div>
          
          <div className="sys-info-label">Date source</div>
          <div className="sys-info-value">Device local time</div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'writing', label: 'Writing', icon: <Type size={16} /> },
    { id: 'closing', label: 'Closing', icon: <PenTool size={16} /> },
    { id: 'signature', label: 'Signature', icon: <PenTool size={16} /> },
    { id: 'covers', label: 'Covers', icon: <Book size={16} /> },
    { id: 'general', label: 'General', icon: <Settings size={16} /> },
  ] as const;

  return (
    <div className="modal-overlay">
      <div className="settings-modal">
        <div className="settings-modal-header">
          <h2>Customize Journal</h2>
          <button className="settings-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="settings-modal-body">
          <div className="settings-sidebar">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as TabType)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          
          <div className="settings-content">
            {activeTab === 'writing' && renderWritingTab()}
            {activeTab === 'closing' && renderClosingTab()}
            {activeTab === 'signature' && renderSignatureTab()}
            {activeTab === 'covers' && renderCoversTab()}
            {activeTab === 'general' && renderGeneralTab()}
          </div>
        </div>
        
        <div className="settings-modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn-confirm" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};
