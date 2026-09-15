import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    // Auto-dismiss after 3.5 seconds
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }[toast.type];

  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
      <div 
        className="toast" 
        role="status" 
        aria-live="polite"
        style={{
          background: '#ffffff',
          color: '#333333',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          minWidth: '300px',
          pointerEvents: 'auto',
          animation: 'slideInRight 0.3s ease-out forwards',
          borderLeft: `4px solid ${colors[toast.type]}`
        }}
      >
        <div style={{ color: colors[toast.type], marginTop: '2px' }}>
          <Icon size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: toast.description ? '4px' : '0' }}>{toast.title}</div>
          {toast.description && <div style={{ fontSize: '13px', color: '#666666' }}>{toast.description}</div>}
        </div>
        <button 
          onClick={() => onRemove(toast.id)}
          aria-label="Close notification"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999999', padding: '2px', marginLeft: '8px' }}
        >
          <X size={16} />
        </button>
      </div>
    </>
  );
};
