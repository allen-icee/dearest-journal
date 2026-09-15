import React, { useState, useEffect } from 'react';
import { Undo2, Redo2, Bold, Italic, Printer, Download, Upload, PanelTopClose, PanelTopOpen, Cloud, CloudOff, CloudUpload, CheckCircle2, ArrowDownRight, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { type JournalDocument } from '../../types/journal';
import { type SaveStatus } from '../../storage/storageTypes';
import { type JournalConfig, type CoverType } from '../../types/journalConfig';
import { Tooltip } from './Tooltip';
import { WordColorPicker } from '../ui/WordColorPicker';
import { Switch } from '../ui/Switch';
import { AdvancedDialogBox } from '../ui/AdvancedDialogBox';
import { compressImageFile } from '../../utils/imageUtils';

interface ToolbarProps {
  document: JournalDocument;
  config: JournalConfig;
  saveStatus: SaveStatus;
  onImport: () => void;
  onExport: () => void;
  onConfigChange: (newConfig: JournalConfig) => void;
}

const renderSaveStatus = (status: SaveStatus) => {
  switch (status) {
    case 'saved':
      return <Tooltip content="All changes saved locally" position="bottom" align="left"><CheckCircle2 size={16} color="#34a853" /></Tooltip>;
    case 'saving':
      return <Tooltip content="Saving..." position="bottom" align="left"><CloudUpload size={16} color="#888" /></Tooltip>;
    case 'unsaved':
      return <Tooltip content="Unsaved changes" position="bottom" align="left"><Cloud size={16} color="#888" /></Tooltip>;
    case 'error':
      return <Tooltip content="Error saving locally" position="bottom" align="left"><CloudOff size={16} color="#ea4335" /></Tooltip>;
    default:
      return null;
  }
};

type TabType = 'writing' | 'covers' | 'closing' | 'signature';

export const Toolbar: React.FC<ToolbarProps> = ({
  saveStatus,
  config,
  onImport,
  onExport,
  onConfigChange
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('dj_ribbon_expanded');
    return saved !== null ? saved === 'true' : true;
  });

  const [activeTab, setActiveTab] = useState<TabType>('writing');
  const [activeDialog, setActiveDialog] = useState<'font' | 'covers' | 'signature' | null>(null);

  useEffect(() => {
    localStorage.setItem('dj_ribbon_expanded', String(isExpanded));
  }, [isExpanded]);

  const execCmd = (cmd: string) => {
    window.document.execCommand(cmd, false, undefined);
  };

  const updateConfig = (updater: (prev: JournalConfig) => JournalConfig) => {
    onConfigChange(updater(config));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'frontCover' | 'backCover' | 'signature') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      updateConfig(prev => {
        if (target === 'signature') {
          return {
            ...prev,
            signature: {
              ...prev.signature,
              image: dataUrl
            }
          };
        }
        return {
          ...prev,
          [target]: {
            ...prev[target],
            image: dataUrl,
            type: 'image'
          }
        };
      });
    } catch (err) {
      console.error('Failed to compress image:', err);
    }
  };

  const renderWritingTab = () => (
    <>
      <div className="ribbon-group">
        <div className="ribbon-group-actions">
          <Tooltip content="Bold (Ctrl+B)" position="bottom">
            <button className="toolbar-btn ribbon-action-btn" onClick={() => execCmd('bold')} aria-label="Bold">
              <Bold size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Italic (Ctrl+I)" position="bottom">
            <button className="toolbar-btn ribbon-action-btn" onClick={() => execCmd('italic')} aria-label="Italic">
              <Italic size={16} />
            </button>
          </Tooltip>
        </div>
        <span className="ribbon-group-label">Format</span>
        <div className="dialog-box-launcher" title="Advanced Font Settings" onClick={() => setActiveDialog('font')}><ArrowDownRight size={10} /></div>
      </div>

      <div className="ribbon-divider" />

      <div className="ribbon-group">
        <div className="ribbon-group-actions">
          <select 
            className="toolbar-btn"
            style={{ border: '1px solid #e1e4e8', borderRadius: '4px', background: '#fff' }}
            value={config.body.fontFamily} 
            onChange={e => updateConfig(p => ({...p, body: {...p.body, fontFamily: e.target.value}}))}
          >
            <option value="IceFont Regular">IceFont Regular</option>
          </select>
          <WordColorPicker 
            color={config.body.color === 'black' ? '#000000' : config.body.color} 
            onChange={c => {
              updateConfig(p => ({...p, body: {...p.body, color: c}}));
              window.document.execCommand('foreColor', false, c);
            }}
            tooltip="Body Color"
          />
        </div>
        <span className="ribbon-group-label">Body Font</span>
      </div>

      <div className="ribbon-divider" />

      <div className="ribbon-group">
        <div className="ribbon-group-actions">
          <select 
            className="toolbar-btn"
            style={{ border: '1px solid #e1e4e8', borderRadius: '4px', background: '#fff' }}
            value={config.greeting.fontFamily} 
            onChange={e => updateConfig(p => ({...p, greeting: {...p.greeting, fontFamily: e.target.value}}))}
          >
            <option value="IceFont Italic">IceFont Italic</option>
          </select>
          <WordColorPicker 
            color={config.greeting.color === 'black' ? '#000000' : config.greeting.color} 
            onChange={c => updateConfig(p => ({...p, greeting: {...p.greeting, color: c}}))}
            tooltip="Greeting Color"
          />
        </div>
        <span className="ribbon-group-label">Greeting</span>
      </div>

      <div className="ribbon-divider" />

      <div className="ribbon-group">
        <div className="ribbon-group-actions">
          <input 
            type="text" 
            className="toolbar-btn"
            style={{ border: '1px solid #e1e4e8', borderRadius: '4px', background: '#fff', width: '120px' }}
            value={config.title.text} 
            onChange={e => updateConfig(p => ({...p, title: {...p.title, text: e.target.value}}))}
            placeholder="Journal Title"
          />
          <select 
            className="toolbar-btn"
            style={{ border: '1px solid #e1e4e8', borderRadius: '4px', background: '#fff' }}
            value={config.title.fontFamily} 
            onChange={e => updateConfig(p => ({...p, title: {...p.title, fontFamily: e.target.value}}))}
          >
            <option value="IceFont Italic">IceFont Italic</option>
          </select>
          <WordColorPicker 
            color={config.title.color === 'black' ? '#000000' : config.title.color} 
            onChange={c => updateConfig(p => ({...p, title: {...p.title, color: c}}))}
            tooltip="Title Color"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
            <Switch 
              checked={config.title.showHeart}
              onChange={(checked) => updateConfig(p => ({...p, title: {...p.title, showHeart: checked}}))}
              label=""
            />
            <span style={{ fontSize: '10px' }}>♥</span>
          </div>
        </div>
        <span className="ribbon-group-label">Journal Title</span>
      </div>

    </>
  );

  const renderCoverGroup = (target: 'frontCover' | 'backCover', label: string) => {
    const cv = config[target];
    return (
      <>
        <div className="ribbon-group">
          <div className="ribbon-group-actions">
            <select 
              className="toolbar-btn"
              style={{ border: '1px solid #e1e4e8', borderRadius: '4px', background: '#fff' }}
              value={cv.type} 
              onChange={e => updateConfig(p => ({...p, [target]: {...p[target], type: e.target.value as CoverType}}))}
            >
              <option value="color">Solid Color</option>
              <option value="image">Image</option>
            </select>
            
            {cv.type === 'color' && (
              <WordColorPicker 
                color={cv.color} 
                onChange={c => updateConfig(p => ({...p, [target]: {...p[target], color: c}}))}
                tooltip="Cover Color"
              />
            )}
            
            {cv.type === 'image' && (
              <label className="toolbar-btn ribbon-action-btn" style={{ cursor: 'pointer' }} title="Upload Image">
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, target)} style={{ display: 'none' }} />
                <ImageIcon size={16} />
              </label>
            )}
          </div>
          <span className="ribbon-group-label">{label}</span>
          <div className="dialog-box-launcher" title="Advanced Cover Settings" onClick={() => setActiveDialog('covers')}><ArrowDownRight size={10} /></div>
        </div>
        <div className="ribbon-divider" />
      </>
    );
  };

  const renderCoversTab = () => (
    <>
      {renderCoverGroup('frontCover', 'Front Cover')}
      {renderCoverGroup('backCover', 'Back Cover')}
    </>
  );

  const renderClosingTab = () => (
    <>
      <div className="ribbon-group">
        <div className="ribbon-group-actions">
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
            <Switch 
              checked={config.closing.enabled}
              onChange={(checked) => updateConfig(p => ({...p, closing: {...p.closing, enabled: checked}}))}
              label=""
            />
          </div>
          <input 
            type="text" 
            className="ribbon-text-input"
            style={{ width: '100px' }}
            value={config.closing.soulfullyYours} 
            onChange={e => updateConfig(p => ({...p, closing: {...p.closing, soulfullyYours: e.target.value}}))}
            placeholder="Line 1"
          />
          <input 
            type="text" 
            className="ribbon-text-input"
            style={{ width: '100px' }}
            value={config.closing.mrDearest} 
            onChange={e => updateConfig(p => ({...p, closing: {...p.closing, mrDearest: e.target.value}}))}
            placeholder="Line 2"
          />
        </div>
        <span className="ribbon-group-label">Closing Content</span>
      </div>

      <div className="ribbon-divider" />

      <div className="ribbon-group">
        <div className="ribbon-group-actions">
          <select 
            className="toolbar-btn"
            style={{ border: '1px solid #e1e4e8', borderRadius: '4px', background: '#fff' }}
            value={config.closing.fontFamily} 
            onChange={e => updateConfig(p => ({...p, closing: {...p.closing, fontFamily: e.target.value}}))}
          >
            <option value="IceFont Italic">IceFont Italic</option>
          </select>
          <div className="alignment-group">
            <button className={`alignment-btn ${config.closing.alignment === 'left' ? 'active' : ''}`} onClick={() => updateConfig(p => ({...p, closing: {...p.closing, alignment: 'left'}}))} aria-label="Align Left">
              <AlignLeft size={14} />
            </button>
            <button className={`alignment-btn ${config.closing.alignment === 'center' ? 'active' : ''}`} onClick={() => updateConfig(p => ({...p, closing: {...p.closing, alignment: 'center'}}))} aria-label="Align Center">
              <AlignCenter size={14} />
            </button>
            <button className={`alignment-btn ${config.closing.alignment === 'right' ? 'active' : ''}`} onClick={() => updateConfig(p => ({...p, closing: {...p.closing, alignment: 'right'}}))} aria-label="Align Right">
              <AlignRight size={14} />
            </button>
          </div>
          <WordColorPicker 
            color={config.closing.color === 'black' ? '#000000' : config.closing.color} 
            onChange={c => updateConfig(p => ({...p, closing: {...p.closing, color: c}}))}
            tooltip="Closing Color"
          />
        </div>
        <span className="ribbon-group-label">Formatting</span>
      </div>

      <div className="ribbon-divider" />

      <div className="ribbon-group">
        <div className="ribbon-group-actions">
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
            <Switch 
              checked={config.kaomoji.enabled}
              onChange={(checked) => updateConfig(p => ({...p, kaomoji: {...p.kaomoji, enabled: checked}}))}
              label=""
            />
          </div>
          <input 
            type="text" 
            className="ribbon-text-input"
            style={{ width: '80px' }}
            value={config.kaomoji.text} 
            onChange={e => updateConfig(p => ({...p, kaomoji: {...p.kaomoji, text: e.target.value}}))}
            placeholder="(´｡• ω •｡`)"
          />
          <div className="alignment-group">
            <button className={`alignment-btn ${config.kaomoji.alignment === 'left' ? 'active' : ''}`} onClick={() => updateConfig(p => ({...p, kaomoji: {...p.kaomoji, alignment: 'left'}}))} aria-label="Align Left">
              <AlignLeft size={14} />
            </button>
            <button className={`alignment-btn ${config.kaomoji.alignment === 'center' ? 'active' : ''}`} onClick={() => updateConfig(p => ({...p, kaomoji: {...p.kaomoji, alignment: 'center'}}))} aria-label="Align Center">
              <AlignCenter size={14} />
            </button>
            <button className={`alignment-btn ${config.kaomoji.alignment === 'right' ? 'active' : ''}`} onClick={() => updateConfig(p => ({...p, kaomoji: {...p.kaomoji, alignment: 'right'}}))} aria-label="Align Right">
              <AlignRight size={14} />
            </button>
          </div>
        </div>
        <span className="ribbon-group-label">Kaomoji</span>
      </div>
    </>
  );

  const renderSignatureTab = () => (
    <>
      <div className="ribbon-group">
        <div className="ribbon-group-actions">
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
            <Switch 
              checked={config.signature.enabled}
              onChange={(checked) => updateConfig(p => ({...p, signature: {...p.signature, enabled: checked}}))}
              label="Enable Signature"
            />
          </div>
          <label className="toolbar-btn ribbon-action-btn" style={{ cursor: 'pointer', border: '1px solid #e1e4e8', borderRadius: '4px', background: '#fff' }}>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'signature')} style={{ display: 'none' }} />
            <Upload size={14} style={{ marginRight: '4px' }} /> Upload Signature
          </label>
        </div>
        <span className="ribbon-group-label">Signature Data</span>
        <div className="dialog-box-launcher" title="Advanced Signature" onClick={() => setActiveDialog('signature')}><ArrowDownRight size={10} /></div>
      </div>
    </>
  );

  return (
    <>
      <div className="unified-toolbar no-print" role="toolbar" aria-label="Editor Toolbar">
        {/* LAYER 1: Title Bar */}
        <div className="toolbar-title-bar">
          <div className="toolbar-group">
            <div className="toolbar-save-status">
              {renderSaveStatus(saveStatus)}
            </div>
            <div className="toolbar-divider" style={{ height: '16px' }} />
            <Tooltip content="Undo (Ctrl+Z)" position="bottom" align="left">
              <button className="toolbar-btn ribbon-action-btn" onClick={() => execCmd('undo')} aria-label="Undo">
                <Undo2 size={16} />
              </button>
            </Tooltip>
            <Tooltip content="Redo (Ctrl+Y)" position="bottom" align="left">
              <button className="toolbar-btn ribbon-action-btn" onClick={() => execCmd('redo')} aria-label="Redo">
                <Redo2 size={16} />
              </button>
            </Tooltip>
          </div>
          
          <div className="header-brand">DearestJournal</div>
          
          <div className="toolbar-group">
          <Tooltip content="Import journal" position="bottom" align="right">
            <button className="toolbar-btn ribbon-action-btn" onClick={onImport} aria-label="Import journal">
              <Upload size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Export journal" position="bottom" align="right">
            <button className="toolbar-btn ribbon-action-btn" onClick={onExport} aria-label="Export journal">
              <Download size={16} />
            </button>
          </Tooltip>
          <div className="toolbar-divider" style={{ height: '16px' }} />
          <Tooltip content="Print journal" position="bottom" align="right">
            <button className="toolbar-btn ribbon-action-btn" onClick={() => window.print()} aria-label="Print journal">
              <Printer size={16} />
            </button>
          </Tooltip>
          <div className="toolbar-divider" style={{ height: '16px' }} />
          <Tooltip content={isExpanded ? "Collapse Ribbon" : "Expand Ribbon"} position="bottom" align="right">
            <button 
              className="toolbar-btn ribbon-action-btn" 
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse Ribbon" : "Expand Ribbon"}
            >
              {isExpanded ? <PanelTopClose size={16} /> : <PanelTopOpen size={16} />}
            </button>
          </Tooltip>
        </div>
        </div>

        {/* LAYER 2: Tab Row */}
        <div className="toolbar-tab-row">
          <div className="ribbon-tabs">
            <button 
              className={`ribbon-tab ${activeTab === 'writing' ? 'active' : ''}`}
              onClick={() => { setActiveTab('writing'); setIsExpanded(true); }}
            >
              Writing
            </button>
            <button 
              className={`ribbon-tab ${activeTab === 'covers' ? 'active' : ''}`}
              onClick={() => { setActiveTab('covers'); setIsExpanded(true); }}
            >
              Covers
            </button>
            <button 
              className={`ribbon-tab ${activeTab === 'closing' ? 'active' : ''}`}
              onClick={() => { setActiveTab('closing'); setIsExpanded(true); }}
            >
              Closing
            </button>
            <button 
              className={`ribbon-tab ${activeTab === 'signature' ? 'active' : ''}`}
              onClick={() => { setActiveTab('signature'); setIsExpanded(true); }}
            >
              Signature
            </button>
          </div>
        </div>

        {/* LAYER 3: Command Ribbon (Only visible when expanded) */}
        {isExpanded && (
          <div className="toolbar-command-ribbon">
            {activeTab === 'writing' && renderWritingTab()}
            {activeTab === 'covers' && renderCoversTab()}
            {activeTab === 'closing' && renderClosingTab()}
            {activeTab === 'signature' && renderSignatureTab()}
          </div>
        )}
      </div>

      <AdvancedDialogBox 
        isOpen={activeDialog !== null}
        type={activeDialog}
        initialConfig={config}
        onClose={() => setActiveDialog(null)}
        onSave={(newConfig) => onConfigChange(newConfig)}
      />
    </>
  );
};
