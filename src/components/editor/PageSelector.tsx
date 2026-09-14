import React from 'react';
import { Dropdown } from './Dropdown';
import { type JournalPageData } from '../../types/journal';

interface PageSelectorProps {
  pages: JournalPageData[];
  activeSlot: string;
  onSelectSlot: (slot: string) => void;
  monthName: string;
}

export const PageSelector: React.FC<PageSelectorProps> = ({ pages, activeSlot, onSelectSlot, monthName }) => {
  const pageItems = [
    { id: 'cover', label: 'Front Cover' },
    { id: 'sep1', label: '', isSeparator: true },
    ...pages.map(p => ({
      id: String(p.pageNumber),
      label: `${String(p.pageNumber).padStart(2, '0')} — ${monthName} ${p.pageNumber}`
    })),
    { id: 'sep2', label: '', isSeparator: true },
    { id: 'back-cover', label: 'Back Cover' }
  ];

  const activePageLabel = activeSlot === 'cover' 
    ? 'Front Cover' 
    : activeSlot === 'back-cover' 
    ? 'Back Cover' 
    : `Day ${String(activeSlot).padStart(2, '0')}`;

  return (
    <Dropdown 
      label={activePageLabel} 
      items={pageItems}
      selectedId={activeSlot}
      onSelect={onSelectSlot}
      width="220px"
    />
  );
};
