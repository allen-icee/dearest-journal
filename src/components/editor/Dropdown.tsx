import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  triggerClassName?: string;
  triggerStyle?: React.CSSProperties;
  footer?: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = React.memo(({ label, items, selectedId, onSelect, title, width = '200px', triggerClassName = '', triggerStyle, footer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
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

  const toggleDropdown = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="custom-dropdown" title={title}>
      <button 
        ref={triggerRef}
        className={`dropdown-trigger ${isOpen ? 'active' : ''} ${triggerClassName}`} 
        style={triggerStyle}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        <span className="dropdown-label-content">{label}</span>
        <ChevronDown size={14} className="dropdown-caret" />
      </button>

      {isOpen && createPortal(
        <div ref={menuRef} className="dropdown-menu" style={{ position: 'fixed', top: pos.top, left: pos.left, width, minWidth: width, zIndex: 9999 }} role="menu">
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
          {footer && (
            <>
              <div className="dropdown-separator" role="separator" />
              <div className="dropdown-footer" style={{ padding: '0.4rem 1rem' }}>
                {footer}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
});
