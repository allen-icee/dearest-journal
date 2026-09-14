import React from 'react';
import { Signature } from './Signature';

export const JournalClosing: React.FC = () => {
  return (
    <>
      {/* Trademark Centered */}
      <div className="ice-font" style={{ textAlign: 'center' }}>
        ⊂(≽^•⩊•^≼)つ
      </div>
      
      {/* Sign-off Block (Relative Container for absolute signature) */}
      <div style={{ position: 'relative' }}>
        <Signature />
        
        {/* Sign-offs Right Aligned (Higher z-index) */}
        <div className="ice-font" style={{ position: 'relative', zIndex: 1, textAlign: 'right', paddingRight: '0.5cm' }}>
          <span className="ice-font-italic">Soulfully Yours</span>,
        </div>
        <div className="ice-font" style={{ position: 'relative', zIndex: 1, textAlign: 'right', paddingRight: '0.5cm' }}>
          <span className="ice-font-italic">Mr</span>.<span className="ice-font-italic">Dearest</span>
        </div>
      </div>
    </>
  );
};
