import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, description }) => {
  return (
    <label className="ui-switch-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      <div 
        className={`ui-switch ${checked ? 'checked' : ''}`}
        style={{
          width: '36px',
          height: '20px',
          backgroundColor: checked ? 'var(--cover-background)' : '#cbd5e1',
          borderRadius: '10px',
          position: 'relative',
          transition: 'background-color 0.2s ease'
        }}
      >
        <div 
          className="ui-switch-thumb"
          style={{
            width: '16px',
            height: '16px',
            backgroundColor: 'white',
            borderRadius: '50%',
            position: 'absolute',
            top: '2px',
            left: checked ? '18px' : '2px',
            transition: 'left 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        />
        {/* Hidden checkbox for accessibility */}
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
          style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
        />
      </div>
      {(label || description) && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {label && <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#1e293b' }}>{label}</span>}
          {description && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{description}</span>}
        </div>
      )}
    </label>
  );
};
