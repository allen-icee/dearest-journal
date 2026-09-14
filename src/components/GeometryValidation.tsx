import React, { useEffect, useState } from 'react';

// Using standard CSS conversion: 1in = 96px, 1in = 2.54cm => 1cm = 96/2.54 px ~= 37.79527559px
const PX_PER_CM = 96 / 2.54;

const toCm = (px: number) => (px / PX_PER_CM).toFixed(5);

export const GeometryValidation: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    // Wait a brief moment for layout to settle
    const timer = setTimeout(() => {
      const page = document.getElementById('journal-page');
      const header = document.getElementById('journal-header');
      const topSpacing = document.getElementById('journal-top-spacing');
      const body = document.getElementById('journal-body-area');
      const footer = document.getElementById('journal-footer');
      const linesContainer = document.getElementById('journal-lines-container');
      const horizontalLines = document.querySelectorAll('.journal-horizontal-line');

      if (page && header && topSpacing && body && footer && linesContainer) {
        const pageRect = page.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const topRect = topSpacing.getBoundingClientRect();
        const bodyRect = body.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();

        const actualLinesHeight = Array.from(horizontalLines).reduce(
          (sum, el) => sum + el.getBoundingClientRect().height, 
          0
        );
        const singleLineHeight = horizontalLines.length > 0 ? horizontalLines[0].getBoundingClientRect().height : 0;

        setMetrics({
          page: {
            widthCm: toCm(pageRect.width),
            heightCm: toCm(pageRect.height)
          },
          header: { heightCm: toCm(headerRect.height) },
          topSpacing: { heightCm: toCm(topRect.height) },
          body: { heightCm: toCm(bodyRect.height) },
          footer: { heightCm: toCm(footerRect.height) },
          lines: {
            count: horizontalLines.length,
            singleHeightCm: toCm(singleLineHeight),
            totalHeightCm: toCm(actualLinesHeight)
          }
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!metrics) return null;

  return (
    <div className="no-print" style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: '#0f0',
      padding: '1rem',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>Geometry Validation</h3>
      <p>Page: {metrics.page.widthCm}cm x {metrics.page.heightCm}cm (Expected: 15x21.6)</p>
      <p>Header: {metrics.header.heightCm}cm (Expected: 1.4)</p>
      <p>Top Spacing: {metrics.topSpacing.heightCm}cm (Expected: 0.6)</p>
      <p>Body: {metrics.body.heightCm}cm (Expected: 18.6)</p>
      <p>Footer: {metrics.footer.heightCm}cm (Expected: 1.0)</p>
      <p>Usable Spaces: {metrics.lines.count} (Expected: 32)</p>
      <p>Horizontal Boundaries: {metrics.lines.count + 1} (Expected: 33)</p>
      <p>Line Height: {metrics.lines.singleHeightCm}cm (Expected: 0.58125)</p>
      <hr style={{ borderColor: '#333', margin: '10px 0' }} />
      <p>Sum: { (parseFloat(metrics.header.heightCm) + parseFloat(metrics.topSpacing.heightCm) + parseFloat(metrics.body.heightCm) + parseFloat(metrics.footer.heightCm)).toFixed(5) }cm (Expected: 21.6)</p>
    </div>
  );
};
