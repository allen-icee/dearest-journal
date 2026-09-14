import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { ToolbarButton } from './ToolbarButton';

interface ZoomControlProps {
  zoom: number;
  onChange: (zoom: number) => void;
}

const ZOOM_LEVELS = [50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200];

export const ZoomControl: React.FC<ZoomControlProps> = ({ zoom, onChange }) => {
  const zoomItems = ZOOM_LEVELS.map(level => ({
    id: String(level),
    label: `${level}%`
  }));

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex > 0) {
      onChange(ZOOM_LEVELS[currentIndex - 1]);
    } else {
      onChange(Math.max(50, zoom - 10));
    }
  };

  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1 && currentIndex !== -1) {
      onChange(ZOOM_LEVELS[currentIndex + 1]);
    } else {
      onChange(Math.min(200, zoom + 10));
    }
  };

  return (
    <div className="zoom-control-group">
      <ToolbarButton 
        icon={<ZoomOut size={16} />} 
        tooltip="Zoom Out" 
        onClick={handleZoomOut}
        disabled={zoom <= 50}
      />
      <Dropdown 
        label={`${zoom}%`} 
        items={zoomItems}
        selectedId={String(zoom)}
        onSelect={(id) => onChange(Number(id))}
        width="100px"
      />
      <ToolbarButton 
        icon={<ZoomIn size={16} />} 
        tooltip="Zoom In" 
        onClick={handleZoomIn}
        disabled={zoom >= 200}
      />
    </div>
  );
};
