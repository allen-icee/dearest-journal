import React from 'react';
import { Dropdown } from './Dropdown';

interface YearSelectorProps {
  year: number;
  onChange: (year: number) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({ year, onChange }) => {
  // Generate a list of years backwards from the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

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
