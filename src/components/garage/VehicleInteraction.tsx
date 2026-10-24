import React from 'react';
import { MousePointer2, Move, RotateCw, ZoomIn } from 'lucide-react';

interface VehicleInteractionProps {
  isInteracting: boolean;
  activePresetLabel: string;
  className?: string;
}

/**
 * Minimalist Automotive Engineering Interaction Cues
 * Non-intrusive indicator informing the user of active camera and gestures.
 */
export const VehicleInteraction: React.FC<VehicleInteractionProps> = ({
  isInteracting,
  activePresetLabel,
  className = ''
}) => {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-1.5 rounded-full neo-inset bg-[#111317]/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-gray-400 select-none pointer-events-none transition-opacity duration-300 ${className}`}
    >
      <div className="flex items-center gap-1.5 text-gray-300">
        <RotateCw className="w-3 h-3 text-[#0070F3]" />
        <span>DRAG TO ORBIT</span>
      </div>

      <div className="w-px h-3 bg-white/15" />

      <div className="flex items-center gap-1.5 text-gray-300">
        <ZoomIn className="w-3 h-3 text-[#0070F3]" />
        <span>PINCH / SCROLL ZOOM</span>
      </div>

      <div className="w-px h-3 bg-white/15" />

      <div className="flex items-center gap-1.5 text-[#0070F3] font-bold uppercase">
        <span>VIEW: {activePresetLabel}</span>
      </div>
    </div>
  );
};
