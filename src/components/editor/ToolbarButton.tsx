import React from 'react';
import { Tooltip } from './Tooltip';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label?: string; // For text alongside icon (if any)
  tooltip: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  showLabel?: boolean;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  icon, 
  label, 
  tooltip, 
  onClick, 
  isActive = false, 
  disabled = false,
  className = '',
  showLabel = false
}) => {
  return (
    <Tooltip content={tooltip} position="bottom">
      <button 
        className={`toolbar-btn ${isActive ? 'active' : ''} ${className}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={tooltip}
      >
        <span className="toolbar-btn-icon">{icon}</span>
        {showLabel && label && <span className="toolbar-btn-label">{label}</span>}
      </button>
    </Tooltip>
  );
};
