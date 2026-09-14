import React from 'react';
import { ChevronDown, ChevronUp, Cloud, CloudOff, CloudUpload, CheckCircle2 } from 'lucide-react';
import { type JournalDocument } from '../../types/journal';
import { type SaveStatus } from '../../storage/storageTypes';
import { MonthSelector } from './MonthSelector';
import { PageSelector } from './PageSelector';
import { MONTH_NAMES } from '../../utils/calendar';
import { Tooltip } from './Tooltip';

interface AppHeaderProps {
  document: JournalDocument;
  activeSlot: string;
  isExpanded: boolean;
  saveStatus: SaveStatus;
  onToggleExpand: () => void;
  onMonthChange: (month: number, year: number) => void;
  onSelectSlot: (slot: string) => void;
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

export const AppHeader: React.FC<AppHeaderProps> = ({
  document,
  activeSlot,
  isExpanded,
  saveStatus,
  onToggleExpand,
  onMonthChange,
  onSelectSlot
}) => {
  const monthName = MONTH_NAMES[document.month - 1];

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-brand">DearestJournal</div>
        <div className="header-save-status">
          {renderSaveStatus(saveStatus)}
        </div>
        <div className="header-divider" />
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
      <div className="header-right">
        <button 
          className="ribbon-toggle-btn" 
          onClick={onToggleExpand}
          title={isExpanded ? "Collapse Ribbon" : "Expand Ribbon"}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
    </header>
  );
};
