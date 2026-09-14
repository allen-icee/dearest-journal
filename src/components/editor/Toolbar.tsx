import React, { useState, useEffect } from 'react';
import { Undo2, Redo2, Bold, Italic, Printer, Download, Upload, PanelTopClose, PanelTopOpen, Cloud, CloudOff, CloudUpload, CheckCircle2, Settings } from 'lucide-react';
import { type JournalDocument } from '../../types/journal';
import { type SaveStatus } from '../../storage/storageTypes';
import { Tooltip } from './Tooltip';

interface ToolbarProps {
  document: JournalDocument;
  saveStatus: SaveStatus;
  onImport: () => void;
  onExport: () => void;
  onOpenSettings: () => void;
}

const renderSaveStatus = (status: SaveStatus) => {
  switch (status) {
    case 'saved':
      return <Tooltip content="All changes saved locally" position="bottom"><CheckCircle2 size={16} color="#34a853" /></Tooltip>;
    case 'saving':
      return <Tooltip content="Saving..." position="bottom"><CloudUpload size={16} color="#888" /></Tooltip>;
    case 'unsaved':
      return <Tooltip content="Unsaved changes" position="bottom"><Cloud size={16} color="#888" /></Tooltip>;
    case 'error':
      return <Tooltip content="Error saving locally" position="bottom"><CloudOff size={16} color="#ea4335" /></Tooltip>;
    default:
      return null;
  }
};

export const Toolbar: React.FC<ToolbarProps> = ({
  saveStatus,
  onImport,
  onExport,
  onOpenSettings
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('dj_ribbon_expanded');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('dj_ribbon_expanded', String(isExpanded));
  }, [isExpanded]);

  const execCmd = (cmd: string) => {
    window.document.execCommand(cmd, false, undefined);
  };

  return (
    <div className="unified-toolbar no-print" role="toolbar" aria-label="Editor Toolbar">
      {/* LEFT BLOCK: Save, Undo/Redo, Import/Export, Brand */}
      <div className="toolbar-section toolbar-left">
        <div className="toolbar-save-status">
          {renderSaveStatus(saveStatus)}
        </div>
        
        <div className="toolbar-divider" />
        
        <div className="toolbar-group">
          <Tooltip content="Undo (Ctrl+Z)" position="bottom">
            <button className="toolbar-btn ribbon-action-btn" onClick={() => execCmd('undo')} aria-label="Undo">
              <Undo2 size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Redo (Ctrl+Y)" position="bottom">
            <button className="toolbar-btn ribbon-action-btn" onClick={() => execCmd('redo')} aria-label="Redo">
              <Redo2 size={16} />
            </button>
          </Tooltip>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <Tooltip content="Import journal" position="bottom">
            <button className="toolbar-btn ribbon-action-btn" onClick={onImport} aria-label="Import journal">
              <Upload size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Export journal" position="bottom">
            <button className="toolbar-btn ribbon-action-btn" onClick={onExport} aria-label="Export journal">
              <Download size={16} />
            </button>
          </Tooltip>
        </div>

        <div className="toolbar-divider" />
        
        <div className="header-brand">DearestJournal</div>
      </div>

      {/* CENTER BLOCK: Editing & Settings (Only if expanded) */}
      {isExpanded && (
        <div className="toolbar-section toolbar-center">
          <div className="toolbar-group">
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
          
          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <Tooltip content="Settings" position="bottom">
              <button className="toolbar-btn ribbon-action-btn" onClick={onOpenSettings} aria-label="Settings">
                <Settings size={16} /> Settings
              </button>
            </Tooltip>
          </div>
        </div>
      )}

      {/* RIGHT BLOCK: Print & Collapse */}
      <div className="toolbar-section toolbar-right">
        <Tooltip content="Print journal" position="bottom">
          <button className="toolbar-btn ribbon-action-btn" onClick={() => window.print()} aria-label="Print journal">
            <Printer size={16} />
          </button>
        </Tooltip>
        
        <div className="toolbar-divider" />
        
        <Tooltip content={isExpanded ? "Collapse toolbar" : "Expand toolbar"} position="bottom">
          <button 
            className="toolbar-btn ribbon-action-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse toolbar" : "Expand toolbar"}
          >
            {isExpanded ? <PanelTopClose size={16} /> : <PanelTopOpen size={16} />}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
