import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownItem {
  id: string;
  label: string;
  isSeparator?: boolean;
}

interface DropdownProps {
  label: React.ReactNode;
  items: DropdownItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  title?: string;
  width?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ label, items, selectedId, onSelect, title, width = '200px' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown" ref={containerRef} title={title}>
      <button 
        className={`dropdown-trigger ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="dropdown-label-content">{label}</span>
        <ChevronDown size={14} className="dropdown-caret" />
      </button>

      {isOpen && (
        <div className="dropdown-menu" style={{ width }} role="menu">
          {items.map((item, index) => {
            if (item.isSeparator) {
              return <div key={`sep-${index}`} className="dropdown-separator" role="separator" />;
            }
            return (
              <button
                key={item.id}
                className={`dropdown-item ${selectedId === item.id ? 'selected' : ''}`}
                onClick={() => handleSelect(item.id)}
                role="menuitem"
              >
                <span className="item-label">{item.label}</span>
                {selectedId === item.id && <Check size={14} className="item-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
