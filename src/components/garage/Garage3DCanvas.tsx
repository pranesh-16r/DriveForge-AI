import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { gtaSoundEngine } from '../../utils/soundEffects';
import { BorderBeam } from '../magicui/BorderBeam';
import { Particles } from '../magicui/Particles';
import {
  Flame,
  Volume2,
  VolumeX,
  Layers,
  Camera,
  Sparkles,
  Eye,
  Sliders,
  Maximize2,
  RotateCw,
  Lightbulb,
  DoorClosed
} from 'lucide-react';

interface CarMeshProps {
  color?: string;
  wireframe?: boolean;
  selectedComponentCategory?: string;
  underglowColor?: string;
  spoilerType?: 'stock' | 'gt_wing' | 'carbon_ducktail' | 'drag';
  isRevving?: boolean;
  bodyFinish?: 'metallic' | 'matte' | 'pearlescent' | 'chrome';
  hoodOpen?: boolean;
  doorsOpen?: boolean;
  headlightsOn?: boolean;
  rideHeight?: number; // 0 (slammed) to 1 (high)
  camberAngle?: number; // -5 to 0
}

// Camera animation helper component inside R3F Canvas
const CameraController: React.FC<{
  category?: string;
  cameraPreset?: 'free' | 'front' | 'side' | 'rear' | 'engine' | 'cockpit';
}> = ({ category, cameraPreset = 'free' }) => {
  const { camera } = useThree();

  useEffect(() => {
    let targetPos = [4, 2.2, 5];
    let targetLook = [0, 0.4, 0];

    if (cameraPreset !== 'free') {
      switch (cameraPreset) {
        case 'front':
          targetPos = [0, 1.3, 4.4];
          targetLook = [0, 0.4, 1.2];
          break;
        case 'side':
          targetPos = [4.6, 1.2, 0];
          targetLook = [0, 0.4, 0];
          break;
        case 'rear':
          targetPos = [0, 1.4, -4.4];
          targetLook = [0, 0.4, -1.5];
          break;
        case 'engine':
          targetPos = [1.2, 2.0, 2.4];
          targetLook = [0, 0.6, 1.2];
          break;
        case 'cockpit':
          targetPos = [0.8, 1.3, 0.2];
          targetLook = [-0.3, 0.8, 0];
          break;
      }
    } else {
      switch (category) {
        case 'engine':
        case 'powertrain':
          targetPos = [1.2, 1.8, 2.8];
          targetLook = [0, 0.5, 1.2];
          break;
        case 'brakes':
        case 'wheels_tires':
        case 'suspension':
          targetPos = [2.2, 0.8, 1.5];
          targetLook = [0.8, 0.4, 1.3];
          break;
        case 'exhaust':
          targetPos = [1.8, 1.0, -3.2];
          targetLook = [0, 0.3, -2.0];
          break;
        case 'aerodynamics':
        case 'bodykit':
          targetPos = [2.8, 1.8, -2.5];
          targetLook = [0, 0.8, -1.8];
          break;
        default:
          targetPos = [4, 2.2, 5];
          targetLook = [0, 0.4, 0];
          break;
      }
    }

    camera.position.set(targetPos[0], targetPos[1], targetPos[2]);
    camera.lookAt(targetLook[0], targetLook[1], targetLook[2]);
  }, [category, cameraPreset, camera]);

  return null;
};

// Procedural 3D GTA Custom Sports Car Model
const CarMesh: React.FC<CarMeshProps> = ({
  color = '#C0C0C0',
  wireframe = false,
  selectedComponentCategory,
  underglowColor = '#0070F3',
  spoilerType = 'gt_wing',
  isRevving = false,
  bodyFinish = 'metallic',
  hoodOpen = false,
  doorsOpen = false,
  headlightsOn = true,
  rideHeight = 0.5,
  camberAngle = -2,
}) => {
  const carGroupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Group>(null);
  const hoodGroupRef = useRef<THREE.Group>(null);
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Smooth hood open/close animation
    if (hoodGroupRef.current) {
      const targetRotation = hoodOpen ? 0.75 : 0;
      hoodGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        hoodGroupRef.current.rotation.x,
        targetRotation,
        delta * 6
      );
    }

    // Smooth scissor doors open/close
    if (leftDoorRef.current && rightDoorRef.current) {
      const targetDoorRot = doorsOpen ? 0.85 : 0;
      leftDoorRef.current.rotation.z = THREE.MathUtils.lerp(
        leftDoorRef.current.rotation.z,
        -targetDoorRot,
        delta * 6
      );
      rightDoorRef.current.rotation.z = THREE.MathUtils.lerp(
        rightDoorRef.current.rotation.z,
        targetDoorRot,
        delta * 6
      );
    }

    // Flame burst jitter during engine revving
    if (flameRef.current) {
      if (isRevving) {
        flameRef.current.scale.set(
          1 + Math.random() * 0.8,
          1 + Math.random() * 1.2,
          1 + Math.random() * 0.8
        );
      }
    }
  });

  // Calculate material finish
  const getMaterialProps = () => {
    switch (bodyFinish) {
      case 'matte':
        return { metalness: 0.15, roughness: 0.85 };
      case 'chrome':
        return { metalness: 0.98, roughness: 0.05 };
      case 'pearlescent':
        return { metalness: 0.75, roughness: 0.18 };
      case 'metallic':
      default:
        return { metalness: 0.85, roughness: 0.22 };
    }
  };

  const matProps = getMaterialProps();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: matProps.metalness,
    roughness: matProps.roughness,
    wireframe: wireframe,
  });

  const carbonMaterial = new THREE.MeshStandardMaterial({
    color: '#15171C',
    roughness: 0.35,
    metalness: 0.7,
    wireframe: wireframe,
  });

  const engineGoldMaterial = new THREE.MeshStandardMaterial({
    color: '#F59E0B',
    metalness: 0.9,
    roughness: 0.2,
  });

  const engineChromeMaterial = new THREE.MeshStandardMaterial({
    color: '#E2E8F0',
    metalness: 0.95,
    roughness: 0.1,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#090B0E',
    metalness: 0.2,
    roughness: 0.05,
    transmission: 0.9,
    thickness: 0.6,
    wireframe: wireframe,
  });

  const wheelRimMaterial = new THREE.MeshStandardMaterial({
    color: selectedComponentCategory === 'wheels_tires' ? '#F59E0B' : '#C0C0C0',
    metalness: 0.95,
    roughness: 0.15,
    wireframe: wireframe,
  });

  const brakeMaterial = new THREE.MeshStandardMaterial({
    color: selectedComponentCategory === 'brakes' ? '#10B981' : '#EF4444',
    emissive: selectedComponentCategory === 'brakes' ? '#10B981' : '#660000',
    emissiveIntensity: 0.5,
    metalness: 0.9,
    roughness: 0.2,
  });

  const exhaustMaterial = new THREE.MeshStandardMaterial({
    color: selectedComponentCategory === 'exhaust' ? '#38BDF8' : '#6B7280',
    emissive: selectedComponentCategory === 'exhaust' ? '#0070F3' : '#000000',
    emissiveIntensity: 0.6,
    metalness: 0.95,
    roughness: 0.1,
  });

  const headlightMaterial = new THREE.MeshBasicMaterial({
    color: headlightsOn ? '#38BDF8' : '#222730',
  });

  const taillightMaterial = new THREE.MeshBasicMaterial({
    color: '#EF4444',
  });

  const flameMaterial = new THREE.MeshBasicMaterial({
    color: '#FF4500',
    transparent: true,
    opacity: isRevving ? 0.95 : 0,
  });

  // Calculate dynamic chassis vertical offset from rideHeight
  const chassisY = 0.36 + (rideHeight - 0.5) * 0.12;

  return (
    <group ref={carGroupRef} position={[0, chassisY, 0]}>
      {/* 1. Main Fuselage / GTA Tuner Monocoque */}
      <mesh position={[0, 0.42, 0]} material={bodyMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.88, 0.58, 4.3]} />
      </mesh>

      {/* 2. Widebody Flared Fender Arches */}
      {/* Front Left Arch */}
      <mesh position={[-0.98, 0.24, 1.35]} material={bodyMaterial} castShadow>
        <boxGeometry args={[0.22, 0.35, 0.95]} />
      </mesh>
      {/* Front Right Arch */}
      <mesh position={[0.98, 0.24, 1.35]} material={bodyMaterial} castShadow>
        <boxGeometry args={[0.22, 0.35, 0.95]} />
      </mesh>
      {/* Rear Left Arch */}
      <mesh position={[-1.02, 0.28, -1.35]} material={bodyMaterial} castShadow>
        <boxGeometry args={[0.26, 0.4, 1.05]} />
      </mesh>
      {/* Rear Right Arch */}
      <mesh position={[1.02, 0.28, -1.35]} material={bodyMaterial} castShadow>
        <boxGeometry args={[0.26, 0.4, 1.05]} />
      </mesh>

      {/* 3. Aerodynamic Carbon Side Skirts */}
      <mesh position={[-1.02, 0.12, 0]} material={carbonMaterial}>
        <boxGeometry args={[0.1, 0.08, 3.8]} />
      </mesh>
      <mesh position={[1.02, 0.12, 0]} material={carbonMaterial}>
        <boxGeometry args={[0.1, 0.08, 3.8]} />
      </mesh>

      {/* 4. Cabin Glass Canopy with Roll Cage */}
      <mesh position={[0, 0.9, -0.2]} material={glassMaterial}>
        <boxGeometry args={[1.44, 0.44, 2.1]} />
      </mesh>
      {/* Interior Roll Cage Tubes */}
      <mesh position={[0.45, 0.88, -0.2]} material={engineGoldMaterial}>
        <cylinderGeometry args={[0.025, 0.025, 1.8, 8]} />
      </mesh>
      <mesh position={[-0.45, 0.88, -0.2]} material={engineGoldMaterial}>
        <cylinderGeometry args={[0.025, 0.025, 1.8, 8]} />
      </mesh>

      {/* 5. Animated Bonnet / Hood with Vents */}
      <group ref={hoodGroupRef} position={[0, 0.52, 1.2]}>
        <mesh position={[0, -0.1, 0.7]} rotation={[-0.12, 0, 0]} material={bodyMaterial} castShadow>
          <boxGeometry args={[1.78, 0.18, 1.35]} />
        </mesh>
        {/* Carbon Hood Vents Scoop */}
        <mesh position={[0, -0.01, 0.7]} rotation={[-0.12, 0, 0]} material={carbonMaterial}>
          <boxGeometry args={[0.7, 0.06, 0.6]} />
        </mesh>
      </group>

      {/* 6. Realistic V8 Twin-Turbo Engine Block (Visible when Hood is Popped) */}
      <group position={[0, 0.38, 1.7]}>
        {/* Engine block */}
        <mesh material={engineGoldMaterial}>
          <boxGeometry args={[0.8, 0.35, 0.7]} />
        </mesh>
        {/* Twin Turbo Chargers & Piping */}
        <mesh position={[-0.45, 0.1, 0.1]} material={engineChromeMaterial}>
          <cylinderGeometry args={[0.12, 0.12, 0.16, 16]} />
        </mesh>
        <mesh position={[0.45, 0.1, 0.1]} material={engineChromeMaterial}>
          <cylinderGeometry args={[0.12, 0.12, 0.16, 16]} />
        </mesh>
        {/* Carbon Intake Manifold */}
        <mesh position={[0, 0.22, 0]} material={carbonMaterial}>
          <boxGeometry args={[0.55, 0.08, 0.45]} />
        </mesh>
      </group>

      {/* 7. Scissor / Butterfly Doors */}
      <group ref={leftDoorRef} position={[-0.94, 0.45, 0.4]}>
        <mesh position={[0, 0, -0.6]} material={bodyMaterial}>
          <boxGeometry args={[0.06, 0.42, 1.2]} />
        </mesh>
      </group>
      <group ref={rightDoorRef} position={[0.94, 0.45, 0.4]}>
        <mesh position={[0, 0, -0.6]} material={bodyMaterial}>
          <boxGeometry args={[0.06, 0.42, 1.2]} />
        </mesh>
      </group>

      {/* 8. Front Carbon Splitter with Canards */}
      <mesh position={[0, 0.09, 2.38]} material={carbonMaterial}>
        <boxGeometry args={[1.98, 0.04, 0.45]} />
      </mesh>
      {/* Aerodynamic Canards */}
      <mesh position={[-0.95, 0.22, 2.28]} rotation={[0, 0.4, 0]} material={carbonMaterial}>
        <boxGeometry args={[0.15, 0.02, 0.25]} />
      </mesh>
      <mesh position={[0.95, 0.22, 2.28]} rotation={[0, -0.4, 0]} material={carbonMaterial}>
        <boxGeometry args={[0.15, 0.02, 0.25]} />
      </mesh>

      {/* 9. Headlights (Xenon LED) with Projector Glow */}
      <mesh position={[-0.68, 0.38, 2.22]} material={headlightMaterial}>
        <boxGeometry args={[0.38, 0.12, 0.08]} />
      </mesh>
      <mesh position={[0.68, 0.38, 2.22]} material={headlightMaterial}>
        <boxGeometry args={[0.38, 0.12, 0.08]} />
      </mesh>
      {headlightsOn && (
        <>
          <spotLight
            position={[-0.68, 0.38, 2.3]}
            target-position={[-0.68, 0, 8]}
            intensity={3.5}
            distance={10}
            angle={0.55}
            color="#38BDF8"
          />
          <spotLight
            position={[0.68, 0.38, 2.3]}
            target-position={[0.68, 0, 8]}
            intensity={3.5}
            distance={10}
            angle={0.55}
            color="#38BDF8"
          />
        </>
      )}

      {/* 10. Rear Tail Light Strip */}
      <mesh position={[0, 0.45, -2.18]} material={taillightMaterial}>
        <boxGeometry args={[1.82, 0.08, 0.06]} />
      </mesh>

      {/* 11. Rear Spoiler Options */}
      {spoilerType === 'gt_wing' && (
        <group position={[0, 1.1, -1.95]}>
          {/* Top Carbon Airfoil Blade */}
          <mesh material={carbonMaterial}>
            <boxGeometry args={[2.2, 0.05, 0.48]} />
          </mesh>
          {/* Endplates */}
          <mesh position={[-1.1, 0, 0]} material={carbonMaterial}>
            <boxGeometry args={[0.02, 0.22, 0.48]} />
          </mesh>
          <mesh position={[1.1, 0, 0]} material={carbonMaterial}>
            <boxGeometry args={[0.02, 0.22, 0.48]} />
          </mesh>
          {/* Upright Struts */}
          <mesh position={[-0.72, -0.28, 0]} material={carbonMaterial}>
            <boxGeometry args={[0.06, 0.52, 0.22]} />
          </mesh>
          <mesh position={[0.72, -0.28, 0]} material={carbonMaterial}>
            <boxGeometry args={[0.06, 0.52, 0.22]} />
          </mesh>
        </group>
      )}

      {spoilerType === 'drag' && (
        <group position={[0, 1.25, -2.15]}>
          <mesh material={carbonMaterial}>
            <boxGeometry args={[2.4, 0.06, 0.6]} />
          </mesh>
          {/* Heavy chassis struts */}
          <mesh position={[-0.8, -0.4, 0.1]} rotation={[0.4, 0, 0]} material={carbonMaterial}>
            <boxGeometry args={[0.08, 0.8, 0.1]} />
          </mesh>
          <mesh position={[0.8, -0.4, 0.1]} rotation={[0.4, 0, 0]} material={carbonMaterial}>
            <boxGeometry args={[0.08, 0.8, 0.1]} />
          </mesh>
        </group>
      )}

      {spoilerType === 'carbon_ducktail' && (
        <mesh position={[0, 0.78, -2.14]} rotation={[0.26, 0, 0]} material={carbonMaterial}>
          <boxGeometry args={[1.82, 0.14, 0.28]} />
        </mesh>
      )}

      {/* 12. Custom Concave Wheels with Stance Camber & Slotted Brembos */}
      {[
        [-0.98, -chassisY + 0.38, 1.35, true], // Front Left
        [0.98, -chassisY + 0.38, 1.35, false], // Front Right
        [-1.02, -chassisY + 0.38, -1.35, true], // Rear Left
        [1.02, -chassisY + 0.38, -1.35, false], // Rear Right
      ].map(([x, y, z, isLeft], idx) => (
        <group
          key={idx}
          position={[x as number, y as number, z as number]}
          rotation={[0, 0, (isLeft ? 1 : -1) * (camberAngle * Math.PI / 180)]}
        >
          {/* Low-profile Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.42, 0.42, 0.34, 28]} />
            <meshStandardMaterial color="#0E1013" roughness={0.7} metalness={0.1} />
          </mesh>
          {/* 5-Spoke Tuner Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={wheelRimMaterial} position={[isLeft ? -0.02 : 0.02, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.3, 16]} />
          </mesh>
          {/* Slotted Brake Rotor */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[isLeft ? 0.08 : -0.08, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.04, 20]} />
            <meshStandardMaterial color="#71717A" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Red/Green Brembo Caliper */}
          <mesh material={brakeMaterial} position={[isLeft ? 0.08 : -0.08, 0.16, 0]}>
            <boxGeometry args={[0.07, 0.14, 0.18]} />
          </mesh>
        </group>
      ))}

      {/* 13. Quad Exhaust Pipes with Backfire Flame Emitter */}
      <group position={[0, 0.18, -2.22]}>
        {[-0.45, -0.3, 0.3, 0.45].map((pos, i) => (
          <mesh key={i} position={[pos, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={exhaustMaterial}>
            <cylinderGeometry args={[0.07, 0.07, 0.38, 16]} />
          </mesh>
        ))}

        {/* Dynamic Flame Cones */}
        <group ref={flameRef} position={[0, 0, -0.32]}>
          <mesh position={[-0.37, 0, 0]} material={flameMaterial}>
            <coneGeometry args={[0.15, 0.7, 12]} />
          </mesh>
          <mesh position={[0.37, 0, 0]} material={flameMaterial}>
            <coneGeometry args={[0.15, 0.7, 12]} />
          </mesh>
        </group>
      </group>

      {/* 14. Neon Underglow PointLight */}
      <pointLight
        position={[0, -0.2, 0]}
        intensity={underglowColor ? 5.5 : 0}
        distance={4.8}
        color={underglowColor || '#0070F3'}
      />
    </group>
  );
};

export interface Garage3DCanvasProps {
  vehicleColor?: string;
  className?: string;
  selectedCategory?: string;
  underglowColor?: string;
  bodyFinish?: 'metallic' | 'matte' | 'pearlescent' | 'chrome';
  spoilerType?: 'stock' | 'gt_wing' | 'carbon_ducktail' | 'drag';
  rideHeight?: number;
  camberAngle?: number;
}

export const Garage3DCanvas: React.FC<Garage3DCanvasProps> = ({
  vehicleColor = '#C0C0C0',
  className = '',
  selectedCategory,
  underglowColor = '#0070F3',
  bodyFinish = 'metallic',
  spoilerType = 'gt_wing',
  rideHeight = 0.5,
  camberAngle = -2,
}) => {
  const [wireframe, setWireframe] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRevving, setIsRevving] = useState(false);
  const [hoodOpen, setHoodOpen] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<'free' | 'front' | 'side' | 'rear' | 'engine' | 'cockpit'>('free');

  const handleRevEngine = () => {
    setIsRevving(true);
    gtaSoundEngine.playEngineRev(3);
    setTimeout(() => setIsRevving(false), 1600);
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    gtaSoundEngine.setEnabled(nextState);
  };

  return (
    <div
      className={`relative w-full h-[540px] sm:h-[640px] bg-[#0A0C0E] rounded-[28px] overflow-hidden border-2 border-[#F59E0B]/50 shadow-[0_0_40px_rgba(245,158,11,0.2)] ${className}`}
    >
      {/* Magic UI: BorderBeam circling the 3D workshop stage */}
      <BorderBeam size={300} duration={10} colorFrom="#F59E0B" colorTo="#0070F3" />

      {/* Magic UI: Embers / Sparks floating in the workshop */}
      <Particles quantity={28} size={1.2} color="#F59E0B" />

      {/* Top Banner: GTA Los Santos Customs Style HUD */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-[#121418]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#F59E0B]/60 shadow-xl">
          <div className="w-3 h-3 rounded-full bg-[#F59E0B] animate-pulse" />
          <div>
            <span className="text-xs font-mono font-black text-[#F59E0B] tracking-widest uppercase block">
              LOS SANTOS MOTORWORKS HUD
            </span>
            <span className="text-[10px] font-mono text-gray-400">BENNY'S ORIGINAL SPECIFICATION V3</span>
          </div>
        </div>

        {/* Action controls */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {/* Hood Toggle */}
          <button
            onClick={() => {
              gtaSoundEngine.playClick();
              setHoodOpen(!hoodOpen);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
              hoodOpen
                ? 'bg-[#F59E0B] text-black border-[#F59E0B] font-black'
                : 'bg-[#181B20] text-gray-300 border-white/10 hover:border-white/30'
            }`}
          >
            <span>{hoodOpen ? 'Close Hood' : 'Pop Hood'}</span>
          </button>

          {/* Scissor Doors Toggle */}
          <button
            onClick={() => {
              gtaSoundEngine.playClick();
              setDoorsOpen(!doorsOpen);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
              doorsOpen
                ? 'bg-[#F59E0B] text-black border-[#F59E0B] font-black'
                : 'bg-[#181B20] text-gray-300 border-white/10 hover:border-white/30'
            }`}
          >
            <DoorClosed className="w-3.5 h-3.5" />
            <span>{doorsOpen ? 'Close Doors' : 'Scissor Doors'}</span>
          </button>

          {/* Lights Toggle */}
          <button
            onClick={() => {
              gtaSoundEngine.playClick();
              setHeadlightsOn(!headlightsOn);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
              headlightsOn
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40'
                : 'bg-[#181B20] text-gray-400 border-white/10'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{headlightsOn ? 'Lights ON' : 'Lights OFF'}</span>
          </button>

          {/* Wireframe Toggle */}
          <button
            onClick={() => {
              gtaSoundEngine.playClick();
              setWireframe(!wireframe);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
              wireframe
                ? 'bg-[#0070F3] text-white border-[#0070F3]'
                : 'bg-[#181B20] text-gray-300 border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{wireframe ? 'Mesh' : 'Solid'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase bg-[#181B20] text-gray-300 border border-white/10 hover:border-white/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#10B981]" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
            <span>{soundEnabled ? 'FX ON' : 'Muted'}</span>
          </button>

          {/* REV ENGINE BUTTON */}
          <button
            onClick={handleRevEngine}
            disabled={isRevving}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xl
              ${
                isRevving
                  ? 'bg-[#EF4444] text-white animate-bounce ring-4 ring-red-500/60'
                  : 'bg-gradient-to-r from-[#F59E0B] via-[#EAB308] to-[#EF4444] text-black hover:scale-105 active:scale-95'
              }
            `}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>{isRevving ? 'BACKFIRE POPS!!!' : 'THROTTLE REV'}</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[4, 2.2, 5]} fov={46} />

        <CameraController category={selectedCategory} cameraPreset={cameraPreset} />

        {/* Studio Workshop Lighting */}
        <ambientLight intensity={0.65} />
        <directionalLight position={[12, 16, 10]} intensity={2.0} castShadow />
        <directionalLight position={[-12, -6, -10]} intensity={0.8} color="#38BDF8" />
        <spotLight
          position={[0, 9, 0]}
          intensity={3.0}
          angle={0.65}
          penumbra={0.85}
          color="#FFFFFF"
          castShadow
        />

        {/* Underglow RGB Light */}
        <pointLight position={[0, 0.2, 0]} intensity={4.5} color={underglowColor} />

        <Suspense fallback={null}>
          <CarMesh
            color={vehicleColor}
            wireframe={wireframe}
            selectedComponentCategory={selectedCategory}
            underglowColor={underglowColor}
            bodyFinish={bodyFinish}
            spoilerType={spoilerType}
            isRevving={isRevving}
            hoodOpen={hoodOpen}
            doorsOpen={doorsOpen}
            headlightsOn={headlightsOn}
            rideHeight={rideHeight}
            camberAngle={camberAngle}
          />

          {/* Precision Workshop Floor Grid */}
          <Grid
            position={[0, 0, 0]}
            args={[28, 28]}
            cellSize={0.6}
            cellThickness={1}
            cellColor="#2A2F38"
            sectionSize={3}
            sectionThickness={1.5}
            sectionColor={underglowColor || '#F59E0B'}
            fadeDistance={22}
            fadeStrength={1.5}
          />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={2.4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2 - 0.04}
        />
      </Canvas>

      {/* Bottom GTA Workshop HUD Controls Bar & Camera Presets */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Camera Preset Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#121418]/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-xs font-mono">
          <Camera className="w-3.5 h-3.5 text-[#F59E0B] mr-1" />
          <span className="text-gray-400 text-[10px] uppercase font-bold mr-1">ANGLE:</span>
          {(['free', 'front', 'side', 'rear', 'engine', 'cockpit'] as const).map((cam) => (
            <button
              key={cam}
              onClick={() => {
                gtaSoundEngine.playClick();
                setCameraPreset(cam);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                cameraPreset === cam
                  ? 'bg-[#F59E0B] text-black font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cam}
            </button>
          ))}
        </div>

        <div className="pointer-events-auto text-[11px] font-mono text-[#F59E0B] bg-[#121418]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#F59E0B]/30 font-bold flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>FOCUSED: {selectedCategory ? selectedCategory.toUpperCase() : 'FULL CHASSIS'}</span>
        </div>
      </div>
    </div>
  );
};
