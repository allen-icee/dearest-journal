import React, { createContext, useState, useCallback } from 'react';
import { Toast, type ToastData, type ToastType } from './Toast';

interface ToastContextValue {
  addToast: (title: string, type?: ToastType, description?: string) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((title: string, type: ToastType = 'info', description?: string) => {
    const newToast: ToastData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      description
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Container is rendered globally, unaffected by editor print styles */}
      <div className="toast-container no-print" aria-live="polite" aria-atomic="true">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
