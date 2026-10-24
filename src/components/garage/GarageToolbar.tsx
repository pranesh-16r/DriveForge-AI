import React from 'react';
import {
  Orbit,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Maximize2,
  Disc,
  RotateCcw,
  Camera
} from 'lucide-react';
import { CameraTargetId, CAMERA_PRESETS } from '../../lib/3d/camera';

interface GarageToolbarProps {
  activePreset: CameraTargetId;
  onSelectPreset: (presetId: CameraTargetId) => void;
  onResetCamera: () => void;
  className?: string;
}

interface ToolbarButtonConfig {
  id: CameraTargetId;
  label: string;
  tooltip: string;
  icon: React.ReactNode;
  shortcut: string;
}

const TOOLBAR_BUTTONS: ToolbarButtonConfig[] = [
  {
    id: 'hero',
    label: 'Hero',
    tooltip: 'Hero 360° Studio Angle [Key: 1]',
    icon: <Orbit className="w-4 h-4" />,
    shortcut: '1'
  },
  {
    id: 'front',
    label: 'Front',
    tooltip: 'Front Fascia & Grille [Key: 2]',
    icon: <ArrowUp className="w-4 h-4" />,
    shortcut: '2'
  },
  {
    id: 'side',
    label: 'Side',
    tooltip: 'Side Profile Silhouette [Key: 4]',
    icon: <ArrowRight className="w-4 h-4" />,
    shortcut: '4'
  },
  {
    id: 'rear',
    label: 'Rear',
    tooltip: 'Rear Aero & Diffuser [Key: 3]',
    icon: <ArrowDown className="w-4 h-4" />,
    shortcut: '3'
  },
  {
    id: 'top',
    label: 'Top',
    tooltip: 'Overhead Aerodynamic Footprint [Key: 5]',
    icon: <Maximize2 className="w-4 h-4" />,
    shortcut: '5'
  },
  {
    id: 'wheel',
    label: 'Wheel',
    tooltip: 'Front Wheel & Fitment [Key: 6]',
    icon: <Disc className="w-4 h-4" />,
    shortcut: '6'
  }
];

/**
 * Tactical Neomorphic Camera Preset Toolbar
 * Provides quick perspective switching with physical tactile button feel.
 */
export const GarageToolbar: React.FC<GarageToolbarProps> = ({
  activePreset,
  onSelectPreset,
  onResetCamera,
  className = ''
}) => {
  return (
    <div
      className={`relative z-20 flex items-center gap-1.5 p-1.5 rounded-2xl neo-raised bg-[#181B20]/95 backdrop-blur-md border border-white/10 shadow-2xl ${className}`}
      role="toolbar"
      aria-label="Camera viewpoint controls"
    >
      {/* Visual Title / Icon */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 border-r border-white/10 text-gray-400">
        <Camera className="w-3.5 h-3.5 text-[#0070F3]" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
          CAMERA
        </span>
      </div>

      {/* Preset Viewport Buttons */}
      <div className="flex items-center gap-1">
        {TOOLBAR_BUTTONS.map((btn) => {
          const isActive = activePreset === btn.id;

          return (
            <button
              key={btn.id}
              onClick={() => onSelectPreset(btn.id)}
              title={btn.tooltip}
              aria-label={btn.tooltip}
              aria-pressed={isActive}
              className={`
                relative group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer select-none
                ${
                  isActive
                    ? 'neo-inset text-white border border-[#0070F3]/60 bg-[#111317] shadow-[inset_0_0_10px_rgba(0,112,243,0.3)]'
                    : 'neo-button text-gray-400 hover:text-white hover:border-white/20'
                }
              `}
            >
              <span className={isActive ? 'text-[#0070F3]' : 'text-gray-400 group-hover:text-gray-200'}>
                {btn.icon}
              </span>
              <span className="text-[11px] uppercase tracking-wider">{btn.label}</span>

              {/* Active Engineering Blue Indicator Pip */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0070F3] shadow-[0_0_6px_#0070F3]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Camera Reset Button (Raised Tactical Action) */}
      <div className="border-l border-white/10 pl-1">
        <button
          onClick={onResetCamera}
          title="Reset Camera to Hero Perspective"
          aria-label="Reset Camera"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl neo-button text-gray-400 hover:text-[#0070F3] hover:border-[#0070F3]/40 text-xs font-mono font-bold cursor-pointer transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px] uppercase tracking-wider">RESET</span>
        </button>
      </div>
    </div>
  );
};
