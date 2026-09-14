import React from 'react';
import { Dropdown } from './Dropdown';
import { type JournalPageData } from '../../types/journal';

interface PageSelectorProps {
  pages: JournalPageData[];
  activeSlot: string;
  onSelectSlot: (slot: string) => void;
}

export const PageSelector: React.FC<PageSelectorProps> = ({ pages, activeSlot, onSelectSlot }) => {
  const pageItems = [
    { id: 'cover', label: 'Front Cover' },
    { id: 'sep1', label: '', isSeparator: true },
    ...pages.map(p => ({
      id: String(p.pageNumber),
      label: `Day ${p.pageNumber}`
    })),
    { id: 'sep2', label: '', isSeparator: true },
    { id: 'back-cover', label: 'Back Cover' }
  ];

  const activePageLabel = activeSlot === 'cover' 
    ? 'Front Cover' 
    : activeSlot === 'back-cover' 
    ? 'Back Cover' 
    : `Day ${activeSlot} of ${pages.length}`;

  return (
    <Dropdown 
      label={<span style={{ fontWeight: 600 }}>{activePageLabel}</span>} 
      items={pageItems}
      selectedId={activeSlot}
      onSelect={onSelectSlot}
      width="200px"
    />
  );
};
