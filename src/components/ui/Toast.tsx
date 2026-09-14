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

  const colorClass = `toast-icon-${toast.type}`;

  return (
    <div className="toast" role="status" aria-live="polite">
      <div className={`toast-icon ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div className="toast-content">
        <div className="toast-title">{toast.title}</div>
        {toast.description && <div className="toast-desc">{toast.description}</div>}
      </div>
      <button 
        className="toast-close-btn" 
        onClick={() => onRemove(toast.id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
