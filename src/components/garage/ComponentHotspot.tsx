import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { CameraTargetId, ModificationCategoryNavId } from '../../lib/3d/camera';

export interface HotspotItem {
  id: string;
  name: string;
  category: ModificationCategoryNavId;
  cameraPreset: CameraTargetId;
  position: [number, number, number];
  description: string;
}

export const GARAGE_HOTSPOTS: HotspotItem[] = [
  {
    id: 'hotspot-hood',
    name: 'Powertrain Bay',
    category: 'performance',
    cameraPreset: 'engine',
    position: [0, 0.95, 1.2],
    description: 'Engine, Turbos & Cooling'
  },
  {
    id: 'hotspot-wheel',
    name: 'Forged Wheels',
    category: 'wheels',
    cameraPreset: 'wheel',
    position: [1.02, 0.38, 1.35],
    description: '20" Monoblock Spec'
  },
  {
    id: 'hotspot-brake',
    name: 'Carbon Ceramic Brakes',
    category: 'brakes',
    cameraPreset: 'brake',
    position: [0.98, 0.42, 1.25],
    description: '6-Piston Calipers & Rotors'
  },
  {
    id: 'hotspot-suspension',
    name: 'Coilovers & Stance',
    category: 'suspension',
    cameraPreset: 'suspension',
    position: [0.95, 0.58, -0.2],
    description: 'Ride Height & Geometry'
  },
  {
    id: 'hotspot-cabin',
    name: 'Cockpit Architecture',
    category: 'interior',
    cameraPreset: 'interior',
    position: [0, 1.15, 0.1],
    description: 'Sport Seats & Instruments'
  },
  {
    id: 'hotspot-exhaust',
    name: 'Titanium Exhaust',
    category: 'exterior',
    cameraPreset: 'exhaust',
    position: [0.35, 0.35, -2.15],
    description: 'Dual Valved Tips'
  }
];

interface ComponentHotspotProps {
  hotspot: HotspotItem;
  isActive: boolean;
  onSelect: (hotspot: HotspotItem) => void;
}

export const ComponentHotspot: React.FC<ComponentHotspotProps> = ({
  hotspot,
  isActive,
  onSelect
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <group position={hotspot.position}>
      <Html
        center
        distanceFactor={6}
        className="pointer-events-auto select-none"
      >
        <div
          className="relative group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(hotspot);
          }}
        >
          {/* Subtle Outer Radar Pulse */}
          <div
            className={`absolute -inset-2 rounded-full transition-all duration-300 ${
              isActive || isHovered
                ? 'bg-[#0070F3]/30 scale-125 animate-ping'
                : 'bg-white/10 scale-100 opacity-60'
            }`}
          />

          {/* Tactile Hotspot Pin Point */}
          <div
            className={`relative w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 border shadow-md ${
              isActive
                ? 'bg-[#0070F3] border-white scale-110 shadow-[0_0_12px_rgba(0,112,243,0.8)]'
                : isHovered
                ? 'bg-[#38BDF8] border-white scale-110'
                : 'bg-[#181B20] border-white/60 hover:border-[#0070F3]'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-[#0070F3]'}`} />
          </div>

          {/* Hover / Active Tooltip Badge */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 bottom-6 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 ${
              isHovered || isActive
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-1 scale-95'
            }`}
          >
            <div className="px-2.5 py-1 rounded-lg bg-[#111317]/95 border border-white/15 text-[11px] font-mono shadow-2xl backdrop-blur-md">
              <span className="font-bold text-white block leading-none">{hotspot.name}</span>
              <span className="text-[9px] text-[#0070F3] uppercase tracking-wider block mt-0.5">
                {hotspot.description}
              </span>
            </div>
            {/* Arrow Tip */}
            <div className="w-2 h-2 bg-[#111317] border-r border-b border-white/15 rotate-45 mx-auto -mt-1" />
          </div>
        </div>
      </Html>
    </group>
  );
};
