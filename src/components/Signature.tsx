import React from 'react';
import { type JournalConfig } from '../types/journalConfig';

interface SignatureProps {
  config: JournalConfig;
}

export const Signature: React.FC<SignatureProps> = ({ config }) => {
  return (
    <img 
      src={config.signature.image} 
      alt="Signature" 
      className="signature-image"
      style={{
        opacity: config.signature.opacity,
        width: config.signature.width,
        right: config.signature.offsetX,
        top: config.signature.offsetY
      }}
    />
  );
};
