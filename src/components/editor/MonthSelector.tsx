import React from 'react';
import { Dropdown } from './Dropdown';
import { MONTH_NAMES } from '../../utils/calendar';

interface MonthSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({ month, year, onChange }) => {
  const activeMonthLabel = MONTH_NAMES[month - 1];
  
  const monthItems = MONTH_NAMES.map((name, i) => ({
    id: String(i + 1),
    label: `${name} ${year}`
  }));

  return (
    <Dropdown 
      label={<span style={{ fontWeight: 600 }}>{activeMonthLabel} {year}</span>} 
      items={monthItems}
      selectedId={String(month)}
      onSelect={(id) => onChange(Number(id), year)}
      width="180px"
    />
  );
};
