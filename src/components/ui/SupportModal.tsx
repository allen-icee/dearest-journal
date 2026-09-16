import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Heart, X } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="advanced-dialog-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="advanced-dialog-box"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '380px' }}
      >
        <div className="advanced-dialog-header">
          <div className="advanced-dialog-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={16} color="#e91e63" />
            Support Dearest Journal
          </div>
          <button className="advanced-dialog-close" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <div className="advanced-dialog-content" style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#555', marginBottom: '20px', lineHeight: '1.5' }}>
            Dearest Journal is free, local-first, and private. If you enjoy using it, consider a donation to support my studies and future development!
          </p>

          <div style={{ marginBottom: '16px' }}>
            <img
              src="/InstaPayQRCode.png"
              alt="InstaPay QR Code"
              style={{
                width: '100%',
                maxWidth: '250px',
                aspectRatio: '1/1',
                objectFit: 'contain',
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '8px',
                backgroundColor: '#fafafa',
                margin: '0 auto',
                display: 'block'
              }}
            />
          </div>

          <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Accepts all InstaPay-supported PH banks.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};
