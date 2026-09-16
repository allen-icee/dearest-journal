import React, { useState, useEffect, useRef } from 'react';
import { Undo2, Redo2, Printer, Download, Upload, PanelTopClose, PanelTopOpen, Cloud, CloudOff, CloudUpload, CheckCircle2, ArrowDownRight, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, User, Heart, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { type JournalDocument } from '../../types/journal';
import { type SaveStatus } from '../../storage/storageTypes';
import { type JournalConfig, type CoverType } from '../../types/journalConfig';
import { Tooltip } from './Tooltip';
import { WordColorPicker } from '../ui/WordColorPicker';
import { AdvancedDialogBox } from '../ui/AdvancedDialogBox';
import { compressImageFile } from '../../utils/imageUtils';
import { MONTH_NAMES } from '../../utils/calendar';
import { Dropdown } from './Dropdown';
import { SupportModal } from '../ui/SupportModal';

interface ToolbarProps {
  document: JournalDocument;
  config: JournalConfig;
  saveStatus: SaveStatus;
  month: number;
  year: number;
  onMonthChange: (month: number, year: number) => void;
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

type TabType = 'writing' | 'covers' | 'closing-signature';

/**
 * Toolbar represents the global command ribbon for the journal.
 * It provides rich-text formatting, font selection, page insertion,
 * cover customization, and data import/export functionality.
 */
export const Toolbar: React.FC<ToolbarProps> = React.memo(({
  saveStatus,
  config,
  month,
  year,
  onMonthChange,
  onImport,
  onExport,
  onConfigChange
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  /**
   * Manages the expanded/collapsed state of the Canva-style Ribbon UI.
   * State is persisted to localStorage to maintain user preference across sessions.
   */
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('dj_ribbon_expanded');
    return saved !== null ? saved === 'true' : true;
  });

  /**
   * Tracks the currently active functional tab in the Ribbon (Writing, Covers, or Closing).
   */
  const [activeTab, setActiveTab] = useState<TabType>('writing');
  const [activeDialog, setActiveDialog] = useState<'font' | 'covers' | 'signature' | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

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

  const SYSTEM_FONTS = [
    'IceFont Regular', 'IceFont Italic', 'Arial', 'Times New Roman', 'Calibri',
    'Courier New', 'Georgia', 'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Tahoma'
  ];

  const fontItems = [
    ...SYSTEM_FONTS.map(f => ({ id: f, label: f })),
    ...(config.customFonts?.length ? [{ id: 'separator-1', label: '', isSeparator: true }] : []),
    ...(config.customFonts?.map(f => ({ id: f.name, label: f.name })) || [])
  ];

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fontName = prompt("Enter a name for your custom font:", file.name.split('.')[0]);
    if (!fontName) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateConfig(prev => ({
          ...prev,
          customFonts: [...(prev.customFonts || []), { name: fontName, base64 }]
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadFontFooter = (
    <label className="cursor-pointer" style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
      + Upload Custom Font
      <input type="file" accept=".ttf,.otf" style={{ display: 'none' }} onChange={handleFontUpload} />
    </label>
  );

  const renderWritingTab = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

    return (
      <>
        <div className="ribbon-group" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
          <div className="ribbon-group-actions">
            <Dropdown 
              label={MONTH_NAMES[month - 1]}
              items={MONTH_NAMES.map((m, idx) => ({ id: String(idx + 1), label: m }))}
              selectedId={String(month)}
              onSelect={id => onMonthChange(Number(id), year)}
              width="max-content"
              triggerClassName="border border-gray-300 rounded px-3 py-1.5 bg-white hover:border-gray-400 cursor-pointer flex items-center justify-between min-w-[110px]"
              triggerStyle={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px 12px', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '110px' }}
            />
            <Dropdown 
              label={String(year)}
              items={years.map(y => ({ id: String(y), label: String(y) }))}
              selectedId={String(year)}
              onSelect={id => onMonthChange(month, Number(id))}
              width="max-content"
              triggerClassName="border border-gray-300 rounded px-3 py-1.5 bg-white hover:border-gray-400 cursor-pointer flex items-center justify-between min-w-[110px]"
              triggerStyle={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px 12px', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '110px' }}
            />
          </div>
          <span className="ribbon-group-label">Date</span>
        </div>
        <div className="ribbon-divider" />

        <div className="ribbon-group" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
          <div className="ribbon-group-actions">
            <div className="alignment-group">
              <Tooltip content="Align Left" position="bottom">
                <button className="alignment-btn" onClick={() => execCmd('justifyLeft')} aria-label="Align Left">
                  <AlignLeft size={14} />
                </button>
              </Tooltip>
              <Tooltip content="Align Center" position="bottom">
                <button className="alignment-btn" onClick={() => execCmd('justifyCenter')} aria-label="Align Center">
                  <AlignCenter size={14} />
                </button>
              </Tooltip>
              <Tooltip content="Align Right" position="bottom">
                <button className="alignment-btn" onClick={() => execCmd('justifyRight')} aria-label="Align Right">
                  <AlignRight size={14} />
                </button>
              </Tooltip>
              <Tooltip content="Justify" position="bottom">
                <button className="alignment-btn" onClick={() => execCmd('justifyFull')} aria-label="Justify">
                  <AlignJustify size={14} />
                </button>
              </Tooltip>
            </div>
          </div>
        <span className="ribbon-group-label">Format</span>
        <div className="dialog-box-launcher" title="Advanced Font Settings" onClick={() => setActiveDialog('font')}><ArrowDownRight size={10} /></div>
      </div>

      <div className="ribbon-divider" />

      <div className="ribbon-group" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
        <div className="ribbon-group-actions">
          <Dropdown 
            label={config.body.fontFamily}
            items={fontItems}
            selectedId={config.body.fontFamily}
            onSelect={id => updateConfig(p => ({...p, body: {...p.body, fontFamily: id}}))}
            triggerClassName="border border-gray-300 rounded px-3 py-1.5 bg-white hover:border-gray-400 cursor-pointer flex items-center justify-between"
            triggerStyle={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px 12px', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            width="200px"
            footer={uploadFontFooter}
          />
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

      <div className="ribbon-group" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
        <div className="ribbon-group-actions">
          <Dropdown 
            label={config.greeting.fontFamily}
            items={fontItems}
            selectedId={config.greeting.fontFamily}
            onSelect={id => updateConfig(p => ({...p, greeting: {...p.greeting, fontFamily: id}}))}
            triggerClassName="border border-gray-300 rounded px-3 py-1.5 bg-white hover:border-gray-400 cursor-pointer flex items-center justify-between"
            triggerStyle={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px 12px', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            width="200px"
            footer={uploadFontFooter}
          />
          <WordColorPicker 
            color={config.greeting.color === 'black' ? '#000000' : config.greeting.color} 
            onChange={c => updateConfig(p => ({...p, greeting: {...p.greeting, color: c}}))}
            tooltip="Greeting Color"
          />
        </div>
        <span className="ribbon-group-label">Greeting</span>
      </div>

      <div className="ribbon-divider" />

      <div className="ribbon-group" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
        <div className="ribbon-group-actions">
          <input 
            type="text" 
            className="toolbar-btn"
            style={{ border: '1px solid #e1e4e8', borderRadius: '4px', background: '#fff', width: '120px' }}
            value={config.title.text} 
            onChange={e => updateConfig(p => ({...p, title: {...p.title, text: e.target.value}}))}
            placeholder="Journal Title"
          />
          <Dropdown 
            label={config.title.fontFamily}
            items={fontItems}
            selectedId={config.title.fontFamily}
            onSelect={id => updateConfig(p => ({...p, title: {...p.title, fontFamily: id}}))}
            triggerClassName="border border-gray-300 rounded px-3 py-1.5 bg-white hover:border-gray-400 cursor-pointer flex items-center justify-between"
            triggerStyle={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px 12px', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            width="200px"
            footer={uploadFontFooter}
          />
          <WordColorPicker 
            color={config.title.color === 'black' ? '#000000' : config.title.color} 
            onChange={c => updateConfig(p => ({...p, title: {...p.title, color: c}}))}
            tooltip="Title Color"
          />
          <div style={{ width: '1px', height: '24px', background: '#e1e4e8', margin: '0 4px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tooltip content={config.title.showHeart ? "Hide Title Heart" : "Show Title Heart"} position="bottom">
              <button 
                className="toolbar-btn ribbon-action-btn" 
                onClick={() => updateConfig(p => ({...p, title: {...p.title, showHeart: !p.title.showHeart}}))}
                aria-label="Toggle Heart Visibility"
              >
                {config.title.showHeart ? <Eye size={16} color="#374151" /> : <EyeOff size={16} color="#9ca3af" />}
              </button>
            </Tooltip>
            <span style={{ fontSize: '10px' }}>♥</span>
          </div>
        </div>
        <span className="ribbon-group-label">Journal Title</span>
      </div>

    </>
  );
};

  const renderCoverGroup = (target: 'frontCover' | 'backCover', label: string) => {
    const cv = config[target];
    return (
      <>
        <div className="ribbon-group" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
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
      
      <div className="ribbon-group" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
        <div className="ribbon-group-actions">
          <Tooltip content={config.showCoverText !== false ? "Hide Cover Text" : "Show Cover Text"} position="bottom">
            <button 
              className="toolbar-btn ribbon-action-btn" 
              onClick={() => updateConfig(p => ({...p, showCoverText: p.showCoverText === false ? true : false}))}
              aria-label="Toggle Cover Text Visibility"
            >
              {config.showCoverText !== false ? <Eye size={16} color="#374151" /> : <EyeOff size={16} color="#9ca3af" />}
            </button>
          </Tooltip>
        </div>
        <span className="ribbon-group-label">Cover Text</span>
      </div>
      <div className="ribbon-divider" />
    </>
  );

  const renderClosingSignatureTab = () => (
    <>
      <div className="ribbon-group" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
        <div className="ribbon-group-actions">
          <input 
            type="text" 
            className="ribbon-text-input"
            style={{ width: '100px' }}
            value={config.closing.soulfullyYours} 
            onChange={e => updateConfig(p => ({...p, closing: {...p.closing, soulfullyYours: e.target.value}}))}
            placeholder="Line 1"
            maxLength={50}
          />
          <input 
            type="text" 
            className="ribbon-text-input"
            style={{ width: '100px' }}
            value={config.closing.mrDearest} 
            onChange={e => updateConfig(p => ({...p, closing: {...p.closing, mrDearest: e.target.value}}))}
            placeholder="Line 2"
            maxLength={50}
          />
          <div style={{ width: '1px', height: '24px', background: '#e1e4e8', margin: '0 4px' }} />
          <Tooltip content={config.closing.enabled ? "Hide Closing Content" : "Show Closing Content"} position="bottom">
            <button 
              className="toolbar-btn ribbon-action-btn" 
              onClick={() => updateConfig(p => ({...p, closing: {...p.closing, enabled: !p.closing.enabled}}))}
              aria-label="Toggle Closing Visibility"
            >
              {config.closing.enabled ? <Eye size={16} color="#374151" /> : <EyeOff size={16} color="#9ca3af" />}
            </button>
          </Tooltip>
        </div>
        <span className="ribbon-group-label">Closing Content</span>
      </div>

      <div className="ribbon-divider" />

      <div className="ribbon-group" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
        <div className="ribbon-group-actions">
          <Dropdown 
            label={config.closing.fontFamily}
            items={fontItems}
            selectedId={config.closing.fontFamily}
            onSelect={id => updateConfig(p => ({...p, closing: {...p.closing, fontFamily: id}}))}
            triggerClassName="border border-gray-300 rounded px-3 py-1.5 bg-white hover:border-gray-400 cursor-pointer flex items-center justify-between"
            triggerStyle={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px 12px', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            width="200px"
            footer={uploadFontFooter}
          />
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

      <div className="ribbon-group" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
        <div className="ribbon-group-actions">
          <input 
            type="text" 
            className="ribbon-text-input"
            style={{ width: '80px' }}
            value={config.kaomoji.text} 
            onChange={e => updateConfig(p => ({...p, kaomoji: {...p.kaomoji, text: e.target.value}}))}
            placeholder="(´｡• ω •｡`)"
            maxLength={50}
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
          <div style={{ width: '1px', height: '24px', background: '#e1e4e8', margin: '0 4px' }} />
          <Tooltip content={config.kaomoji.enabled ? "Hide Kaomoji" : "Show Kaomoji"} position="bottom">
            <button 
              className="toolbar-btn ribbon-action-btn" 
              onClick={() => updateConfig(p => ({...p, kaomoji: {...p.kaomoji, enabled: !p.kaomoji.enabled}}))}
              aria-label="Toggle Kaomoji Visibility"
            >
              {config.kaomoji.enabled ? <Eye size={16} color="#374151" /> : <EyeOff size={16} color="#9ca3af" />}
            </button>
          </Tooltip>
        </div>
        <span className="ribbon-group-label">Kaomoji</span>
      </div>
      
      <div className="ribbon-divider" />

      <div className="ribbon-group" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
        <div className="ribbon-group-actions">
          <label className="toolbar-btn ribbon-action-btn" style={{ cursor: 'pointer', border: '1px solid #e1e4e8', borderRadius: '4px', background: '#fff' }}>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'signature')} style={{ display: 'none' }} />
            <Upload size={14} style={{ marginRight: '4px' }} /> Upload Signature
          </label>
          <div style={{ width: '1px', height: '24px', background: '#e1e4e8', margin: '0 4px' }} />
          <Tooltip content={config.signature.enabled ? "Hide Signature" : "Show Signature"} position="bottom">
            <button 
              className="toolbar-btn ribbon-action-btn" 
              onClick={() => updateConfig(p => ({...p, signature: {...p.signature, enabled: !p.signature.enabled}}))}
              aria-label="Toggle Signature Visibility"
            >
              {config.signature.enabled ? <Eye size={16} color="#374151" /> : <EyeOff size={16} color="#9ca3af" />}
            </button>
          </Tooltip>
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
        <div className="toolbar-title-bar flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-hide w-full px-2 gap-4">
          <div className="toolbar-group flex-shrink-0 flex items-center gap-2">
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
          
          <div className="header-brand flex-shrink-0" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/DearestJournalLogo.png" alt="Dearest Journal Logo" style={{ height: '20px', width: 'auto' }} />
            <span className="mobile-hidden" style={{ fontFamily: "'IceFontItalic', cursive", color: '#C9B8E8', fontSize: '1.25rem' }}>Dearest Journal</span>
          </div>
          
          <div className="toolbar-group flex-shrink-0 flex items-center gap-2">
          <a 
            href="https://allen-icee.is-a.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="toolbar-btn ribbon-action-btn"
            style={{ textDecoration: 'none', color: 'inherit', fontSize: '13px' }}
          >
            <User size={16} /> <span className="mobile-hidden">Portfolio</span>
          </a>
          <button 
            className="toolbar-btn ribbon-action-btn"
            style={{ fontSize: '13px' }}
            onClick={() => setIsSupportModalOpen(true)}
          >
            <Heart size={16} /> <span className="mobile-hidden">Support</span>
          </button>
          <div className="toolbar-divider" style={{ height: '16px' }} />
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
        </div>
        </div>

        {/* LAYER 2: Tab Row */}
        <div className="toolbar-tab-row flex overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="ribbon-tabs flex-shrink-0">
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
              className={`ribbon-tab ${activeTab === 'closing-signature' ? 'active' : ''}`}
              onClick={() => { setActiveTab('closing-signature'); setIsExpanded(true); }}
            >
              Closing & Signature
            </button>
          </div>
          <button 
            className="collapse-ribbon-btn cursor-pointer"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse Ribbon" : "Expand Ribbon"}
          >
            {isExpanded ? <PanelTopClose size={16} /> : <PanelTopOpen size={16} />}
          </button>
        </div>

        {/* LAYER 3: Command Ribbon (Only visible when expanded) */}
        {isExpanded && (
          <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
            
            {/* LEFT ARROW */}
            <button 
              className="ribbon-scroll-arrow no-print"
              onClick={() => scrollRef.current?.scrollBy({ left: -(scrollRef.current.clientWidth / 1.5), behavior: 'smooth' })}
              style={{ position: 'absolute', left: '4px', zIndex: 50, backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Scrollable Container */}
            <div 
              ref={scrollRef} 
              style={{ scrollSnapType: 'x mandatory', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}
              className="toolbar-command-ribbon"
            >
              {activeTab === 'writing' && renderWritingTab()}
              {activeTab === 'covers' && renderCoversTab()}
              {activeTab === 'closing-signature' && renderClosingSignatureTab()}
            </div>

            {/* RIGHT ARROW */}
            <button 
              className="ribbon-scroll-arrow no-print"
              onClick={() => scrollRef.current?.scrollBy({ left: scrollRef.current.clientWidth / 1.5, behavior: 'smooth' })}
              style={{ position: 'absolute', right: '4px', zIndex: 50, backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              <ChevronRight size={16} />
            </button>

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

      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />
    </>
  );
});
