import React from 'react';
import { Dropdown } from './Dropdown';

interface YearSelectorProps {
  year: number;
  onChange: (year: number) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({ year, onChange }) => {
  // Generate a list of years (e.g., current year - 1 to current year + 5)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 2 + i);

  const yearItems = years.map(y => ({
    id: String(y),
    label: String(y)
  }));

  return (
    <Dropdown 
      label={<span style={{ fontWeight: 600 }}>{year}</span>} 
      items={yearItems}
      selectedId={String(year)}
      onSelect={(id) => onChange(Number(id))}
      width="100px"
    />
  );
};
