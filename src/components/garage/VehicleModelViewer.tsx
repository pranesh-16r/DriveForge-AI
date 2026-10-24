import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Vehicle } from '../../types';
import { ExtendedVehicle } from '../../data/vehicles';
import { resolveVehicle3DAsset, Vehicle3DAsset } from '../../lib/3d/assets';
import { PaintFinish } from '../../lib/3d/materials';
import { GarageLighting } from './GarageLighting';
import { GarageEnvironment } from './GarageEnvironment';
import { GarageVehicle } from './GarageVehicle';
import {
  RotateCw,
  Eye,
  Camera,
  Layers,
  Wrench,
  Gauge,
  Sliders,
  Maximize2,
  Minimize2,
  RefreshCw,
  Compass,
  Zap,
  ShieldCheck,
  Bot,
  Palette,
  DoorOpen,
  Lightbulb,
  Crosshair,
  Info,
  CheckCircle2,
  Flame
} from 'lucide-react';

export type ViewerInspectionMode = 'showroom' | 'wireframe' | 'xray' | 'aerodynamics';

export interface InspectionHotspot {
  id: string;
  name: string;
  category: 'powertrain' | 'exterior' | 'suspension' | 'wheels_tires' | 'brakes' | 'exhaust';
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  title: string;
  description: string;
  inspectionMetrics: { label: string; value: string }[];
}

interface VehicleModelViewerProps {
  vehicle: Vehicle | ExtendedVehicle;
  paintColor?: string;
  paintFinish?: PaintFinish;
  onAskChiefEngineer?: (query?: string) => void;
  className?: string;
}

// 3D Inspection Hotspots on the vehicle
const INSPECTION_HOTSPOTS: InspectionHotspot[] = [
  {
    id: 'hotspot-engine',
    name: 'Powertrain & Intake',
    category: 'powertrain',
    position: [0, 0.9, 1.2],
    cameraTarget: [0, 0.7, 1.2],
    cameraPosition: [1.2, 1.8, 2.5],
    title: 'Engine Bay & Forced Induction System',
    description: 'Inspect manifold clearances, intake ducting, oil cooler lines, and strut tower clearance.',
    inspectionMetrics: [
      { label: 'Induction Type', value: 'Twin-Turbocharged / NA' },
      { label: 'Hood Clearance', value: '38 mm over intake plenum' },
      { label: 'Thermal Headroom', value: 'Adequate for track cooling' }
    ]
  },
  {
    id: 'hotspot-brakes',
    name: 'Brakes & Hub',
    category: 'brakes',
    position: [1.0, 0.45, 1.25],
    cameraTarget: [0.9, 0.4, 1.25],
    cameraPosition: [2.0, 0.6, 1.8],
    title: 'Front Axle Monobloc Braking System',
    description: 'Inspect caliper-to-spoke clearance, rotor diameter, cooling duct routing, and pad wear.',
    inspectionMetrics: [
      { label: 'Brake Disc', value: '380mm Floating Slotted' },
      { label: 'Caliper Spacing', value: '6 mm barrel clearance' },
      { label: 'Brake Fade Resistance', value: 'Track Verified' }
    ]
  },
  {
    id: 'hotspot-suspension',
    name: 'Suspension Kinematics',
    category: 'suspension',
    position: [0.95, 0.6, -1.2],
    cameraTarget: [0.8, 0.4, -1.2],
    cameraPosition: [2.2, 0.8, -0.6],
    title: 'Rear Multilink & Damper Geometry',
    description: 'Inspect coilover preload, sway bar endlinks, bump stop engagement, and camber arm angles.',
    inspectionMetrics: [
      { label: 'Spring Rate', value: '9 kg/mm Front / 12 kg/mm Rear' },
      { label: 'Damper Travel', value: '65 mm compression headroom' },
      { label: 'Roll Center', value: 'Optimized for 20mm drop' }
    ]
  },
  {
    id: 'hotspot-exhaust',
    name: 'Exhaust & Diffuser',
    category: 'exhaust',
    position: [0, 0.35, -2.1],
    cameraTarget: [0, 0.35, -1.8],
    cameraPosition: [0, 0.9, -3.4],
    title: 'Valvetronic Catback & Rear Underbody',
    description: 'Inspect exhaust tip alignment, ground clearance, heat shielding, and diffuser airflow channels.',
    inspectionMetrics: [
      { label: 'Piping Bore', value: '76 mm (3.0 inch) Dual' },
      { label: 'Ground Clearance', value: '115 mm under mid-pipe' },
      { label: 'Sound Homologation', value: '98 dB Track Compliant' }
    ]
  },
  {
    id: 'hotspot-aero',
    name: 'Aero & GT Wing',
    category: 'exterior',
    position: [0, 1.35, -1.9],
    cameraTarget: [0, 1.2, -1.8],
    cameraPosition: [1.8, 1.8, -3.0],
    title: 'High-Downforce Aerodynamic Wing',
    description: 'Inspect rear wing angle of attack, endplate vortex generation, and decklid mounting rigidity.',
    inspectionMetrics: [
      { label: 'Downforce at 160 km/h', value: '~140 kg Net Rear Axle' },
      { label: 'Angle of Attack', value: 'Adjustable 4°–12°' },
      { label: 'Material', value: 'Dry Pre-Preg Carbon Fiber' }
    ]
  }
];

// Camera controller component inside R3F Canvas
const ViewerCameraController: React.FC<{
  targetPosition: [number, number, number] | null;
  targetLookAt: [number, number, number] | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  onCameraUpdate: (azimuth: number, elevation: number, distance: number) => void;
}> = ({ targetPosition, targetLookAt, controlsRef, onCameraUpdate }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (controlsRef.current) {
      // Calculate spherical coordinates for HUD
      const offset = camera.position.clone().sub(controlsRef.current.target);
      const distance = offset.length();
      const azimuth = Math.round(((Math.atan2(offset.x, offset.z) * 180) / Math.PI + 360) % 360);
      const elevation = Math.round((Math.asin(Math.max(-1, Math.min(1, offset.y / distance))) * 180) / Math.PI);
      onCameraUpdate(azimuth, elevation, distance);

      // Smooth camera transition if target is specified
      if (targetPosition && targetLookAt) {
        camera.position.lerp(new THREE.Vector3(...targetPosition), 0.08);
        controlsRef.current.target.lerp(new THREE.Vector3(...targetLookAt), 0.08);
        controlsRef.current.update();
      }
    }
  });

  return null;
};

// 3D Aerodynamic Flow Lines (Wind tunnel inspection effect)
const AerodynamicFlowLines: React.FC = () => {
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, idx) => {
        child.position.z += delta * (4.5 + (idx % 3) * 0.8);
        if (child.position.z > 3.5) {
          child.position.z = -3.5;
        }
      });
    }
  });

  const streamLines = useMemo(() => {
    const list = [];
    for (let i = 0; i < 24; i++) {
      const x = (Math.random() - 0.5) * 1.8;
      const y = 0.3 + Math.random() * 1.1;
      const z = -3.5 + Math.random() * 7;
      const len = 0.6 + Math.random() * 0.9;
      list.push({ x, y, z, len, id: i });
    }
    return list;
  }, []);

  return (
    <group ref={linesRef}>
      {streamLines.map((line) => (
        <mesh key={line.id} position={[line.x, line.y, line.z]}>
          <boxGeometry args={[0.015, 0.015, line.len]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

export const VehicleModelViewer: React.FC<VehicleModelViewerProps> = ({
  vehicle,
  paintColor: initialPaintColor,
  paintFinish: initialPaintFinish = 'metallic',
  onAskChiefEngineer,
  className = ''
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Viewer State
  const [paintColor, setPaintColor] = useState<string>(
    initialPaintColor || vehicle?.colorHex || '#C0C0C0'
  );
  const [paintFinish, setPaintFinish] = useState<PaintFinish>(initialPaintFinish);
  const [inspectionMode, setInspectionMode] = useState<ViewerInspectionMode>('showroom');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState<number>(1.2);
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'cyberpunk' | 'dark' | 'track'>('studio');

  // Kinematic Door & Stance State
  const [hoodOpen, setHoodOpen] = useState<boolean>(false);
  const [doorsOpen, setDoorsOpen] = useState<boolean>(false);
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);
  const [rideHeight, setRideHeight] = useState<number>(0.5); // 0 (slammed) to 1 (high)
  const [camberAngle, setCamberAngle] = useState<number>(-2.2); // degrees

  // Hotspot & Camera Target State
  const [activeHotspot, setActiveHotspot] = useState<InspectionHotspot | null>(null);
  const [camTargetPos, setCamTargetPos] = useState<[number, number, number] | null>(null);
  const [camTargetLook, setCamTargetLook] = useState<[number, number, number] | null>(null);

  // Camera HUD Telemetry
  const [hudAzimuth, setHudAzimuth] = useState<number>(45);
  const [hudElevation, setHudElevation] = useState<number>(20);
  const [hudDistance, setHudDistance] = useState<number>(5.2);

  // UI Panels
  const [showControlsDrawer, setShowControlsDrawer] = useState<boolean>(false);
  const [showSpecsHUD, setShowSpecsHUD] = useState<boolean>(true);

  const asset: Vehicle3DAsset = useMemo(() => {
    return resolveVehicle3DAsset(vehicle);
  }, [vehicle]);

  // Camera Preset Snapping
  const snapToPreset = (preset: 'hero' | 'front' | 'side' | 'rear' | 'top' | 'chassis') => {
    setActiveHotspot(null);
    switch (preset) {
      case 'hero':
        setCamTargetPos([4.2, 1.9, 4.5]);
        setCamTargetLook([0, 0.4, 0]);
        break;
      case 'front':
        setCamTargetPos([0, 1.1, 4.8]);
        setCamTargetLook([0, 0.45, 0.8]);
        break;
      case 'side':
        setCamTargetPos([5.2, 1.2, 0]);
        setCamTargetLook([0, 0.45, 0]);
        break;
      case 'rear':
        setCamTargetPos([0, 1.3, -4.8]);
        setCamTargetLook([0, 0.45, -0.8]);
        break;
      case 'top':
        setCamTargetPos([0.1, 6.2, 0.1]);
        setCamTargetLook([0, 0, 0]);
        break;
      case 'chassis':
        setCamTargetPos([3.2, 0.3, 2.8]);
        setCamTargetLook([0, 0.2, 0]);
        break;
    }
  };

  // Inspect a specific hotspot
  const handleSelectHotspot = (hotspot: InspectionHotspot) => {
    setActiveHotspot(hotspot);
    setAutoRotate(false);
    setCamTargetPos(hotspot.cameraPosition);
    setCamTargetLook(hotspot.cameraTarget);
  };

  // Reset Camera View
  const handleResetCamera = () => {
    setActiveHotspot(null);
    setCamTargetPos([4.2, 1.9, 4.5]);
    setCamTargetLook([0, 0.4, 0]);
    setAutoRotate(true);
  };

  return (
    <div
      className={`relative w-full h-[520px] sm:h-[600px] lg:h-[680px] rounded-[26px] overflow-hidden neo-panel border border-white/10 select-none bg-[#13151A] shadow-2xl flex flex-col ${className}`}
    >
      {/* 3D Canvas Viewport */}
      <div className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          shadows
          camera={{ position: [4.2, 1.9, 4.5], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          {/* Real-time Camera Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={2.4}
            maxDistance={8.5}
            maxPolarAngle={Math.PI / 2 - 0.02}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
          />

          <ViewerCameraController
            targetPosition={camTargetPos}
            targetLookAt={camTargetLook}
            controlsRef={controlsRef}
            onCameraUpdate={(azimuth, elevation, distance) => {
              setHudAzimuth(azimuth);
              setHudElevation(elevation);
              setHudDistance(Number(distance.toFixed(1)));
            }}
          />

          {/* Lighting Rig */}
          <GarageLighting headlightsOn={headlightsOn} />

          {/* Additional lighting variations */}
          {lightingPreset === 'cyberpunk' && (
            <>
              <pointLight position={[3, 2, 2]} color="#EC4899" intensity={1.8} distance={8} />
              <pointLight position={[-3, 2, -2]} color="#0070F3" intensity={2.2} distance={8} />
            </>
          )}

          {/* Studio Environment & Reflective Floor */}
          <GarageEnvironment
            studioTheme={lightingPreset === 'dark' ? 'graphite' : 'light'}
            showGrid={inspectionMode === 'wireframe' || inspectionMode === 'aerodynamics'}
          />

          {/* Aerodynamic Wind Tunnel Particle Streamlines */}
          {inspectionMode === 'aerodynamics' && <AerodynamicFlowLines />}

          {/* Procedural Automotive Vehicle Model */}
          <GarageVehicle
            asset={asset}
            color={paintColor}
            finish={paintFinish}
            wireframe={inspectionMode === 'wireframe'}
            hoodOpen={hoodOpen}
            doorsOpen={doorsOpen}
            headlightsOn={headlightsOn}
            rideHeight={rideHeight}
            camberAngle={camberAngle}
            spoilerType="gt_wing"
            hasRaceSplitter={true}
            hasCarbonHood={inspectionMode === 'xray'}
          />
        </Canvas>

        {/* TOP LEFT: Active Vehicle Badge & Inspection Mode Selector */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-[85%] sm:max-w-md pointer-events-none">
          <div className="pointer-events-auto p-3 rounded-2xl bg-[#0F1116]/90 backdrop-blur-md border border-white/10 shadow-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white font-sans tracking-tight">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                <p className="text-[10px] font-mono text-gray-400">
                  {vehicle.chassisCode || 'OEM PLATFORM'} • {vehicle.engine || 'Powertrain Verified'}
                </p>
              </div>
            </div>

            <button
              onClick={() => snapToPreset('hero')}
              className="p-1.5 rounded-lg neo-button text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Reset Hero Angle"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inspection Mode Tabs */}
          <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-[#0F1116]/85 backdrop-blur-md border border-white/10 shadow-lg text-[10px] font-mono font-bold overflow-x-auto">
            <button
              onClick={() => setInspectionMode('showroom')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                inspectionMode === 'showroom'
                  ? 'bg-[#0070F3] text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Palette className="w-3 h-3" />
              <span>Showroom</span>
            </button>

            <button
              onClick={() => setInspectionMode('wireframe')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                inspectionMode === 'wireframe'
                  ? 'bg-[#0070F3] text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>CAD Mesh</span>
            </button>

            <button
              onClick={() => setInspectionMode('aerodynamics')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                inspectionMode === 'aerodynamics'
                  ? 'bg-[#0070F3] text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-[#38BDF8]" />
              <span>Aero Flow</span>
            </button>
          </div>
        </div>

        {/* TOP RIGHT: Real-time Camera Orbit HUD & Quick Chief Engineer Advice */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none">
          {/* Compass & Angles HUD */}
          <div className="pointer-events-auto px-3 py-1.5 rounded-xl bg-[#0F1116]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300 flex items-center gap-3 shadow-lg">
            <div className="flex items-center gap-1 text-[#38BDF8]">
              <Compass className="w-3.5 h-3.5" />
              <span>{hudAzimuth}° AZM</span>
            </div>
            <span className="text-gray-600">|</span>
            <span>{hudElevation}° ELV</span>
            <span className="text-gray-600">|</span>
            <span>{hudDistance}m DIST</span>
          </div>

          {/* Quick Trigger: Ask Chief Engineer for advice */}
          {onAskChiefEngineer && (
            <button
              onClick={() => onAskChiefEngineer(`Please evaluate the modification potential of my ${vehicle.year} ${vehicle.make} ${vehicle.model}.`)}
              className="pointer-events-auto px-3 py-1.5 rounded-xl bg-[#0070F3] hover:bg-[#0060DF] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-[#0070F3]/30 transition-all cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask Chief Engineer</span>
            </button>
          )}
        </div>

        {/* BOTTOM LEFT: Camera Preset Angle Buttons */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0F1116]/85 backdrop-blur-md border border-white/10 shadow-xl">
          <span className="text-[10px] font-mono font-bold text-gray-400 px-2 uppercase">
            ANGLES:
          </span>
          {(['hero', 'front', 'side', 'rear', 'top', 'chassis'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => snapToPreset(preset)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase neo-button text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* BOTTOM RIGHT: Rotation Controls & Kinematics Drawer Toggle */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold ${
              autoRotate
                ? 'bg-[#0070F3] text-white border-[#0070F3] shadow-[0_0_12px_rgba(0,112,243,0.5)]'
                : 'bg-[#0F1116]/90 text-gray-400 hover:text-white border-white/10'
            }`}
            title="Toggle 360° Auto-Rotation"
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{autoRotate ? 'Rotating' : 'Rotate'}</span>
          </button>

          {/* Stance & Kinematic Inspection Drawer Toggle */}
          <button
            onClick={() => setShowControlsDrawer(!showControlsDrawer)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold ${
              showControlsDrawer
                ? 'bg-[#10B981] text-white border-[#10B981]'
                : 'bg-[#0F1116]/90 text-gray-300 hover:text-white border-white/10'
            }`}
            title="Vehicle Kinematics & Inspection Controls"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">Inspect Rig</span>
          </button>
        </div>

        {/* 3D Hotspot Inspection Card (Floating when an inspection zone is clicked) */}
        {activeHotspot && (
          <div className="absolute bottom-16 left-4 right-4 sm:left-auto sm:right-4 z-30 max-w-sm rounded-2xl bg-[#12141A]/95 backdrop-blur-lg border border-[#0070F3]/40 p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-[#38BDF8]" />
                <h5 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                  {activeHotspot.title}
                </h5>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
              {activeHotspot.description}
            </p>

            <div className="space-y-1.5 py-1">
              {activeHotspot.inspectionMetrics.map((m, idx) => (
                <div key={idx} className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{m.label}:</span>
                  <span className="text-white font-bold">{m.value}</span>
                </div>
              ))}
            </div>

            {onAskChiefEngineer && (
              <button
                onClick={() =>
                  onAskChiefEngineer(
                    `Tell me about recommended upgrades, clearances, and maintenance for the ${activeHotspot.name} on my ${vehicle.make} ${vehicle.model}.`
                  )
                }
                className="w-full py-2 px-3 rounded-xl bg-[#0070F3]/20 hover:bg-[#0070F3]/30 border border-[#0070F3]/50 text-[#38BDF8] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask Chief Engineer about {activeHotspot.name}</span>
              </button>
            )}
          </div>
        )}

        {/* KINEMATICS & STANCE CONTROLS DRAWER */}
        {showControlsDrawer && (
          <div className="absolute top-16 right-4 z-30 w-72 rounded-2xl bg-[#0F1116]/95 backdrop-blur-xl border border-white/15 p-4 shadow-2xl space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#0070F3]" />
                Inspection Rig Controls
              </span>
              <button
                onClick={() => setShowControlsDrawer(false)}
                className="text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Kinematics Toggles */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Part Kinematics</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setHoodOpen(!hoodOpen)}
                  className={`py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    hoodOpen
                      ? 'bg-[#0070F3] text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {hoodOpen ? 'Hood Open' : 'Hood Closed'}
                </button>

                <button
                  onClick={() => setDoorsOpen(!doorsOpen)}
                  className={`py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    doorsOpen
                      ? 'bg-[#0070F3] text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {doorsOpen ? 'Doors Open' : 'Doors Closed'}
                </button>

                <button
                  onClick={() => setHeadlightsOn(!headlightsOn)}
                  className={`py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    headlightsOn
                      ? 'bg-amber-400 text-black font-bold'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {headlightsOn ? 'Lights ON' : 'Lights OFF'}
                </button>
              </div>
            </div>

            {/* Stance Sliders */}
            <div className="space-y-3 pt-1 border-t border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Chassis Geometry</span>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">Ride Height Drop:</span>
                  <span className="text-[#38BDF8] font-bold">
                    {rideHeight < 0.3 ? 'Slammed (-35mm)' : rideHeight < 0.6 ? 'Track (-20mm)' : 'OEM Spec'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={rideHeight}
                  onChange={(e) => setRideHeight(parseFloat(e.target.value))}
                  className="w-full accent-[#0070F3] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">Front Camber Angle:</span>
                  <span className="text-[#38BDF8] font-bold">{camberAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-4.0"
                  max="0"
                  step="0.2"
                  value={camberAngle}
                  onChange={(e) => setCamberAngle(parseFloat(e.target.value))}
                  className="w-full accent-[#0070F3] cursor-pointer"
                />
              </div>
            </div>

            {/* Inspection Hotspots Direct Selection */}
            <div className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-[10px] font-mono text-gray-400 uppercase">
                Focus Inspection Point
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {INSPECTION_HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleSelectHotspot(h)}
                    className="p-1.5 rounded-lg text-[10px] font-mono text-left bg-white/5 hover:bg-[#0070F3]/20 hover:text-[#38BDF8] border border-white/5 transition-colors cursor-pointer truncate"
                  >
                    • {h.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
