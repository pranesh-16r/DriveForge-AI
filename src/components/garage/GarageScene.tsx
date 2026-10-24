import React, { Suspense, useRef, useState, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Vehicle } from '../../types';
import { ExtendedVehicle } from '../../data/vehicles';
import { resolveVehicle3DAsset } from '../../lib/3d/assets';
import { CameraTargetId, ModificationCategoryNavId } from '../../lib/3d/camera';
import { PaintFinish } from '../../lib/3d/materials';
import { GarageLighting } from './GarageLighting';
import { GarageEnvironment } from './GarageEnvironment';
import { GarageVehicle } from './GarageVehicle';
import { GarageCamera } from './GarageCamera';
import { ComponentHotspot, GARAGE_HOTSPOTS, HotspotItem } from './ComponentHotspot';
import { RotateCw, AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackHeroImage?: string;
  onRetry: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

class ThreeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Three.js Garage Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-full min-h-[460px] flex flex-col items-center justify-center p-6 bg-[#121418] rounded-[24px] border border-red-500/30 text-center overflow-hidden">
          {this.props.fallbackHeroImage && (
            <img
              src={this.props.fallbackHeroImage}
              alt="Vehicle Preview Fallback"
              className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="relative z-10 max-w-md space-y-3 neo-panel p-6 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-sans text-white">3D PREVIEW UNAVAILABLE</h3>
            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              The WebGL hardware pipeline encountered an initialization issue. Vehicle telemetry, specifications, and build configurations remain fully accessible.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onRetry();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl neo-button text-xs font-mono font-bold text-white hover:text-[#0070F3] transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RETRY 3D PIPELINE</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Clean Studio Canvas Loading Placeholder
 */
const GarageLoadingIndicator: React.FC = () => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#181B20]/75 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full neo-inset flex items-center justify-center border border-[#0070F3]/40">
          <RotateCw className="w-5 h-5 text-[#0070F3] animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-widest block">
            PREPARING DIGITAL GARAGE
          </span>
          <span className="text-[11px] font-mono text-gray-400 block">
            Calibrating 3D automotive studio environment...
          </span>
        </div>
      </div>
    </div>
  );
};

export interface GarageSceneProps {
  vehicle: Vehicle | ExtendedVehicle;
  activeCategory?: ModificationCategoryNavId;
  activePreset: CameraTargetId;
  autoRotate: boolean;
  hoodOpen: boolean;
  doorsOpen: boolean;
  headlightsOn: boolean;
  wireframe: boolean;
  showHotspots: boolean;
  rideHeight: number;
  camberAngle: number;
  paintColor?: string;
  paintFinish?: PaintFinish;
  spoilerType?: 'stock' | 'ducktail' | 'gt_wing' | 'drag';
  rimColor?: string;
  caliperColor?: string;
  exhaustColor?: string;
  hasRaceSplitter?: boolean;
  hasCarbonHood?: boolean;
  onSelectHotspot?: (hotspot: HotspotItem) => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

/**
 * Core 3D Garage Scene Component
 * Integrates Three.js, React Three Fiber, Drei, procedural vehicle renderer,
 * and cinematic camera positioning.
 */
export const GarageScene: React.FC<GarageSceneProps> = ({
  vehicle,
  activeCategory,
  activePreset,
  autoRotate,
  hoodOpen,
  doorsOpen,
  headlightsOn,
  wireframe,
  showHotspots,
  rideHeight,
  camberAngle,
  paintColor,
  paintFinish = 'metallic',
  spoilerType = 'gt_wing',
  rimColor,
  caliperColor,
  exhaustColor,
  hasRaceSplitter,
  hasCarbonHood,
  onSelectHotspot,
  onInteractionStart,
  onInteractionEnd
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Resolve replaceable 3D asset metadata
  const asset = resolveVehicle3DAsset(vehicle);

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[620px] rounded-[26px] overflow-hidden neo-panel border border-white/10 select-none bg-[#16181E]">
      {/* Subtle Asset Notice Badge (honest, non-intrusive) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="px-3 py-1 rounded-xl neo-inset bg-[#111317]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>{asset.assetNoticeText}</span>
        </div>
      </div>

      <ThreeErrorBoundary
        key={retryKey}
        fallbackHeroImage={(vehicle as ExtendedVehicle).heroImage || vehicle.imageUrl}
        onRetry={() => setRetryKey((k) => k + 1)}
      >
        <Suspense fallback={<GarageLoadingIndicator />}>
          <Canvas
            shadows
            camera={{ position: [4.2, 2.0, 4.8], fov: 44 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onPointerDown={onInteractionStart}
            onPointerUp={onInteractionEnd}
            gl={{ antialias: true, alpha: true }}
          >
            {/* Camera Controller syncing with active presets */}
            <GarageCamera
              activePreset={activePreset}
              controlsRef={controlsRef}
            />

            {/* Bright Studio Lighting Rig */}
            <GarageLighting
              headlightsOn={headlightsOn}
            />

            {/* Studio Architectural Environment & Floor */}
            <GarageEnvironment studioTheme="light" showGrid={true} />

            {/* Primary Replaceable Vehicle 3D Model */}
            <GarageVehicle
              asset={asset}
              color={paintColor || vehicle.colorHex}
              finish={paintFinish}
              wireframe={wireframe}
              activeCategory={activeCategory}
              hoodOpen={hoodOpen}
              doorsOpen={doorsOpen}
              headlightsOn={headlightsOn}
              rideHeight={rideHeight}
              camberAngle={camberAngle}
              spoilerType={spoilerType}
              rimColor={rimColor}
              caliperColor={caliperColor}
              exhaustColor={exhaustColor}
              hasRaceSplitter={hasRaceSplitter}
              hasCarbonHood={hasCarbonHood}
            />

            {/* Interactive 3D Component Hotspots */}
            {showHotspots && (
              <group name="hotspots-container">
                {GARAGE_HOTSPOTS.map((hotspot) => (
                  <ComponentHotspot
                    key={hotspot.id}
                    hotspot={hotspot}
                    isActive={activeCategory === hotspot.category}
                    onSelect={(h) => onSelectHotspot?.(h)}
                  />
                ))}
              </group>
            )}

            {/* Orbit Controls for 360° vehicle manipulation */}
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableDamping={true}
              dampingFactor={0.06}
              autoRotate={autoRotate}
              autoRotateSpeed={1.8}
              minDistance={2.6}
              maxDistance={11.0}
              maxPolarAngle={Math.PI / 2 - 0.05} // Prevents going below ground
              minPolarAngle={0.1}
            />
          </Canvas>
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  );
};
