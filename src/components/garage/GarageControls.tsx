import React from 'react';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Lightbulb,
  DoorClosed,
  DoorOpen,
  Wrench,
  Layers,
  MapPin
} from 'lucide-react';

interface GarageControlsProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  hoodOpen: boolean;
  onToggleHood: () => void;
  doorsOpen: boolean;
  onToggleDoors: () => void;
  headlightsOn: boolean;
  onToggleHeadlights: () => void;
  wireframe: boolean;
  onToggleWireframe: () => void;
  showHotspots: boolean;
  onToggleHotspots: () => void;
  className?: string;
}

/**
 * Tactical Neomorphic Vehicle & Viewport Controls
 * Provides physical hardware-style buttons for 360° rotation, zoom, and kinematics.
 */
export const GarageControls: React.FC<GarageControlsProps> = ({
  autoRotate,
  onToggleAutoRotate,
  onZoomIn,
  onZoomOut,
  onResetView,
  hoodOpen,
  onToggleHood,
  doorsOpen,
  onToggleDoors,
  headlightsOn,
  onToggleHeadlights,
  wireframe,
  onToggleWireframe,
  showHotspots,
  onToggleHotspots,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 p-2 rounded-2xl neo-raised bg-[#181B20]/95 backdrop-blur-md border border-white/10 shadow-2xl ${className}`}
      role="group"
      aria-label="Garage manipulation controls"
    >
      {/* 360° AUTO-ROTATE TOGGLE */}
      <button
        onClick={onToggleAutoRotate}
        title={autoRotate ? 'Pause 360° Turntable Rotation' : 'Start 360° Turntable Rotation'}
        aria-pressed={autoRotate}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer select-none
          ${
            autoRotate
              ? 'neo-inset text-[#0070F3] border border-[#0070F3]/60 bg-[#111317]'
              : 'neo-button text-gray-300 hover:text-white'
          }
        `}
      >
        <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin text-[#0070F3]' : ''}`} />
        <span className="text-[11px] uppercase tracking-wider">360° ROTATE</span>
      </button>

      {/* ZOOM IN / OUT BUTTONS */}
      <div className="flex items-center gap-1 bg-[#111317] p-0.5 rounded-xl border border-white/10 neo-inset">
        <button
          onClick={onZoomIn}
          title="Zoom Camera In"
          aria-label="Zoom In"
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-3.5 bg-white/15" />
        <button
          onClick={onZoomOut}
          title="Zoom Camera Out"
          aria-label="Zoom Out"
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* DIVIDER */}
      <div className="hidden sm:block w-px h-5 bg-white/10 mx-0.5" />

      {/* KINEMATIC VEHICLE ACTIONS */}
      {/* Hood Toggle (Reveals Powertrain) */}
      <button
        onClick={onToggleHood}
        title={hoodOpen ? 'Close Engine Bay Hood' : 'Open Hood (Inspect Powertrain)'}
        aria-pressed={hoodOpen}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer select-none
          ${
            hoodOpen
              ? 'neo-inset text-[#0070F3] border border-[#0070F3]/60 bg-[#111317]'
              : 'neo-button text-gray-400 hover:text-white'
          }
        `}
      >
        <Wrench className="w-3.5 h-3.5" />
        <span className="text-[11px] uppercase tracking-wider">{hoodOpen ? 'HOOD OPEN' : 'HOOD'}</span>
      </button>

      {/* Doors Toggle (Reveals Cockpit) */}
      <button
        onClick={onToggleDoors}
        title={doorsOpen ? 'Close Scissor Doors' : 'Open Scissor Doors (Inspect Interior)'}
        aria-pressed={doorsOpen}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer select-none
          ${
            doorsOpen
              ? 'neo-inset text-[#0070F3] border border-[#0070F3]/60 bg-[#111317]'
              : 'neo-button text-gray-400 hover:text-white'
          }
        `}
      >
        {doorsOpen ? <DoorOpen className="w-3.5 h-3.5" /> : <DoorClosed className="w-3.5 h-3.5" />}
        <span className="text-[11px] uppercase tracking-wider">{doorsOpen ? 'DOORS OPEN' : 'DOORS'}</span>
      </button>

      {/* Headlights Toggle */}
      <button
        onClick={onToggleHeadlights}
        title={headlightsOn ? 'Extinguish Projector Headlights' : 'Illuminate Projector Headlights'}
        aria-pressed={headlightsOn}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer select-none
          ${
            headlightsOn
              ? 'neo-inset text-[#38BDF8] border border-[#38BDF8]/60 bg-[#111317]'
              : 'neo-button text-gray-400 hover:text-white'
          }
        `}
      >
        <Lightbulb className="w-3.5 h-3.5" />
        <span className="text-[11px] uppercase tracking-wider">{headlightsOn ? 'LIGHTS ON' : 'LIGHTS'}</span>
      </button>

      {/* Interactive Hotspots Toggle */}
      <button
        onClick={onToggleHotspots}
        title={showHotspots ? 'Hide 3D Hotspot Pins' : 'Show 3D Hotspot Pins'}
        aria-pressed={showHotspots}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer select-none
          ${
            showHotspots
              ? 'neo-inset text-[#0070F3] border border-[#0070F3]/60 bg-[#111317]'
              : 'neo-button text-gray-400 hover:text-white'
          }
        `}
      >
        <MapPin className="w-3.5 h-3.5" />
        <span className="text-[11px] uppercase tracking-wider">HOTSPOTS</span>
      </button>

      {/* Wireframe Toggle */}
      <button
        onClick={onToggleWireframe}
        title={wireframe ? 'Return to Solid Shaded Body' : 'View Wireframe Engineering Topology'}
        aria-pressed={wireframe}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer select-none
          ${
            wireframe
              ? 'neo-inset text-[#0070F3] border border-[#0070F3]/60 bg-[#111317]'
              : 'neo-button text-gray-400 hover:text-white'
          }
        `}
      >
        <Layers className="w-3.5 h-3.5" />
        <span className="text-[11px] uppercase tracking-wider">{wireframe ? 'WIREFRAME' : 'SURFACE'}</span>
      </button>
    </div>
  );
};
