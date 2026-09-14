import React from 'react';
import { Undo2, Redo2, Bold, Italic, Printer, Download, Upload } from 'lucide-react';
import { type JournalDocument } from '../../types/journal';
import { RibbonGroup } from './RibbonGroup';
import { MonthSelector } from './MonthSelector';
import { PageSelector } from './PageSelector';
import { ZoomControl } from './ZoomControl';
import { ToolbarButton } from './ToolbarButton';
import { MONTH_NAMES } from '../../utils/calendar';

interface RibbonProps {
  document: JournalDocument;
  activeSlot: string;
  zoom: number;
  onMonthChange: (month: number, year: number) => void;
  onSelectSlot: (slot: string) => void;
  onZoomChange: (zoom: number) => void;
  onImport: () => void;
  onExport: () => void;
}

export const Ribbon: React.FC<RibbonProps> = ({
  document,
  activeSlot,
  zoom,
  onMonthChange,
  onSelectSlot,
  onZoomChange,
  onImport,
  onExport
}) => {
  const execCmd = (cmd: string) => {
    window.document.execCommand(cmd, false, undefined);
  };

  const monthName = MONTH_NAMES[document.month - 1];

  return (
    <div className="ribbon-expanded" role="toolbar" aria-label="Editor Ribbon">
      <RibbonGroup title="DOCUMENT">
        <ToolbarButton 
          icon={<Printer size={18} />} 
          label="Print"
          showLabel={true}
          tooltip="Print Notebook" 
          onClick={() => window.print()} 
          className="ribbon-action-btn"
        />
        <div className="ribbon-vertical-divider" />
        <div className="ribbon-stacked-controls">
          <MonthSelector 
            month={document.month} 
            year={document.year} 
            onChange={(m, y) => {
              onMonthChange(m, y);
              onSelectSlot('cover');
            }} 
          />
          <PageSelector 
            pages={document.pages} 
            activeSlot={activeSlot} 
            onSelectSlot={onSelectSlot} 
            monthName={monthName}
          />
        </div>
        <div className="ribbon-vertical-divider" />
        <ToolbarButton icon={<Upload size={18} />} tooltip="Import Backup" onClick={onImport} />
        <ToolbarButton icon={<Download size={18} />} tooltip="Export Backup" onClick={onExport} />
      </RibbonGroup>

      <RibbonGroup title="HISTORY">
        <ToolbarButton icon={<Undo2 size={18} />} tooltip="Undo (Ctrl+Z)" onClick={() => execCmd('undo')} className="ribbon-action-btn" />
        <ToolbarButton icon={<Redo2 size={18} />} tooltip="Redo (Ctrl+Y)" onClick={() => execCmd('redo')} className="ribbon-action-btn" />
      </RibbonGroup>

      <RibbonGroup title="TEXT">
        <ToolbarButton icon={<Bold size={18} />} tooltip="Bold (Ctrl+B)" onClick={() => execCmd('bold')} className="ribbon-action-btn" />
        <ToolbarButton icon={<Italic size={18} />} tooltip="Italic (Ctrl+I)" onClick={() => execCmd('italic')} className="ribbon-action-btn" />
      </RibbonGroup>

      <RibbonGroup title="VIEW">
        <ZoomControl zoom={zoom} onChange={onZoomChange} />
      </RibbonGroup>
    </div>
  );
};
