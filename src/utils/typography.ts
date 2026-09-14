/**
 * Foundation for calculating line usage.
 * In Phase 1, we rely strictly on CSS line-height matching our physical grid.
 * The body writing area height is 21.6cm - 1.4cm - 0.6cm - 1cm = 18.6cm.
 * 18.6cm / 32 lines = 0.58125cm per line.
 */
export const LINE_HEIGHT_CM = 0.58125;

export function getLineHeightStyle() {
  return {
    lineHeight: `${LINE_HEIGHT_CM}cm`,
    fontSize: `${LINE_HEIGHT_CM * 0.7}cm` // approximate a good font size for the line
  };
}
