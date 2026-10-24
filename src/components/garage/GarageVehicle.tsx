import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Vehicle3DAsset } from '../../lib/3d/assets';
import {
  PaintFinish,
  createPaintMaterial,
  createCarbonFiberMaterial,
  createGlassMaterial,
  createWheelRimMaterial,
  createTireMaterial,
  createBrakeRotorMaterial,
  createBrakeCaliperMaterial,
  createExhaustMaterial
} from '../../lib/3d/materials';

interface GarageVehicleProps {
  asset: Vehicle3DAsset;
  color?: string;
  finish?: PaintFinish;
  wireframe?: boolean;
  activeCategory?: string;
  hoodOpen?: boolean;
  doorsOpen?: boolean;
  headlightsOn?: boolean;
  rideHeight?: number; // 0 (slammed) to 1 (high)
  camberAngle?: number; // degrees (e.g. -2.5)
  spoilerType?: 'stock' | 'ducktail' | 'gt_wing' | 'drag';
  rimColor?: string;
  caliperColor?: string;
  exhaustColor?: string;
  hasRaceSplitter?: boolean;
  hasCarbonHood?: boolean;
}

/**
 * Modular Automotive 3D Vehicle Asset Renderer
 * Houses high-accuracy procedural vehicle geometry, dynamic materials,
 * interactive doors/hood kinematics, and real-time stance adjustments.
 */
export const GarageVehicle: React.FC<GarageVehicleProps> = ({
  asset,
  color,
  finish = 'metallic',
  wireframe = false,
  activeCategory,
  hoodOpen = false,
  doorsOpen = false,
  headlightsOn = false,
  rideHeight = 0.5,
  camberAngle = -2.0,
  spoilerType = 'gt_wing',
  rimColor,
  caliperColor,
  exhaustColor,
  hasRaceSplitter = false,
  hasCarbonHood = false
}) => {
  const vehicleColor = color || asset.baseColor;
  const isWheelsActive = activeCategory === 'wheels';
  const isBrakesActive = activeCategory === 'brakes';
  const isExhaustActive = activeCategory === 'exterior' || activeCategory === 'performance';

  // Refs for kinematic elements
  const vehicleGroupRef = useRef<THREE.Group>(null);
  const hoodGroupRef = useRef<THREE.Group>(null);
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  // Memoized materials based on current color & finish
  const materials = useMemo(() => {
    const rimMat = rimColor 
      ? new THREE.MeshStandardMaterial({
          color: new THREE.Color(rimColor),
          metalness: 0.94,
          roughness: 0.16,
          wireframe,
          envMapIntensity: 1.5
        })
      : createWheelRimMaterial(isWheelsActive, wireframe);

    const caliperMat = caliperColor
      ? new THREE.MeshStandardMaterial({
          color: new THREE.Color(caliperColor),
          metalness: 0.82,
          roughness: 0.22,
          emissive: new THREE.Color(caliperColor).multiplyScalar(0.2),
          emissiveIntensity: 0.4
        })
      : createBrakeCaliperMaterial(isBrakesActive);

    const exhaustMat = exhaustColor
      ? new THREE.MeshStandardMaterial({
          color: new THREE.Color(exhaustColor),
          metalness: 0.96,
          roughness: 0.12,
          emissive: new THREE.Color(exhaustColor).multiplyScalar(0.3),
          emissiveIntensity: 0.6
        })
      : createExhaustMaterial(isExhaustActive);

    return {
      paint: createPaintMaterial({ color: vehicleColor, finish, wireframe }),
      carbon: createCarbonFiberMaterial(wireframe),
      glass: createGlassMaterial(wireframe),
      rims: rimMat,
      tires: createTireMaterial(wireframe),
      brakeRotor: createBrakeRotorMaterial(isBrakesActive),
      brakeCaliper: caliperMat,
      exhaust: exhaustMat,
      interiorPlastics: new THREE.MeshStandardMaterial({
        color: '#181B20',
        roughness: 0.85,
        metalness: 0.1,
        wireframe
      }),
      interiorLeather: new THREE.MeshStandardMaterial({
        color: '#242A34',
        roughness: 0.65,
        metalness: 0.15,
        wireframe
      }),
      headlightLenses: new THREE.MeshBasicMaterial({
        color: headlightsOn ? '#38BDF8' : '#334155'
      }),
      taillights: new THREE.MeshBasicMaterial({
        color: '#EF4444'
      }),
      engineGold: new THREE.MeshStandardMaterial({
        color: '#F59E0B',
        metalness: 0.88,
        roughness: 0.2
      }),
      engineBlock: new THREE.MeshStandardMaterial({
        color: '#374151',
        metalness: 0.75,
        roughness: 0.35
      })
    };
  }, [vehicleColor, finish, wireframe, isWheelsActive, isBrakesActive, isExhaustActive, headlightsOn, rimColor, caliperColor, exhaustColor]);

  // Smooth door & hood animation frame updates
  useFrame((_, delta) => {
    const lerpSpeed = Math.min(1, delta * 6.5);

    // Hood tilt
    if (hoodGroupRef.current) {
      const targetHoodRot = hoodOpen ? 0.72 : 0;
      hoodGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        hoodGroupRef.current.rotation.x,
        targetHoodRot,
        lerpSpeed
      );
    }

    // Scissor doors
    if (leftDoorRef.current && rightDoorRef.current) {
      const targetDoorRot = doorsOpen ? 0.82 : 0;
      leftDoorRef.current.rotation.z = THREE.MathUtils.lerp(
        leftDoorRef.current.rotation.z,
        -targetDoorRot,
        lerpSpeed
      );
      rightDoorRef.current.rotation.z = THREE.MathUtils.lerp(
        rightDoorRef.current.rotation.z,
        targetDoorRot,
        lerpSpeed
      );
    }
  });

  // Calculate chassis ground offset from ride height (0.0 = slammed, 1.0 = stock/high)
  const chassisY = 0.28 + (rideHeight - 0.5) * 0.14;
  const wheelCamberRad = THREE.MathUtils.degToRad(camberAngle);

  return (
    <group ref={vehicleGroupRef} name="garage-vehicle" position={[0, 0, 0]}>
      {/* ================= CHASSIS SUSPENDED BODY ================= */}
      <group position={[0, chassisY, 0]}>
        
        {/* Lower Floorpan Underbody */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.72, 0.14, 4.3]} />
          <primitive object={materials.interiorPlastics} />
        </mesh>

        {/* Front Splitter Aerodynamics */}
        <mesh position={[0, hasRaceSplitter ? 0.06 : 0.08, hasRaceSplitter ? 2.26 : 2.18]} castShadow>
          <boxGeometry args={[hasRaceSplitter ? 1.88 : 1.76, 0.04, hasRaceSplitter ? 0.58 : 0.42]} />
          <primitive object={materials.carbon} />
        </mesh>

        {/* Extended Splitter Dive Plane Canards (If Race Splitter Active) */}
        {hasRaceSplitter && (
          <group position={[0, 0.16, 2.18]}>
            <mesh position={[-0.92, 0, 0]} rotation={[0.2, 0, -0.2]}>
              <boxGeometry args={[0.04, 0.14, 0.22]} />
              <primitive object={materials.carbon} />
            </mesh>
            <mesh position={[0.92, 0, 0]} rotation={[0.2, 0, 0.2]}>
              <boxGeometry args={[0.04, 0.14, 0.22]} />
              <primitive object={materials.carbon} />
            </mesh>
          </group>
        )}

        {/* Rear Aerodynamic Diffuser */}
        <mesh position={[0, 0.14, -2.14]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[1.68, 0.18, 0.45]} />
          <primitive object={materials.carbon} />
        </mesh>

        {/* Dual Stainless/Titanium Exhaust Tips */}
        <group position={[0, 0.16, -2.25]}>
          <mesh position={[-0.38, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.075, 0.28, 24, 1, true]} />
            <primitive object={materials.exhaust} />
          </mesh>
          <mesh position={[0.38, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.075, 0.28, 24, 1, true]} />
            <primitive object={materials.exhaust} />
          </mesh>
        </group>

        {/* Main Monocoque Lower Waistline */}
        <mesh position={[0, 0.36, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.86, 0.38, 4.2]} />
          <primitive object={materials.paint} />
        </mesh>

        {/* Front Muscular Fenders & Fascia */}
        <mesh position={[0, 0.42, 1.45]} castShadow receiveShadow>
          <boxGeometry args={[1.88, 0.34, 1.25]} />
          <primitive object={materials.paint} />
        </mesh>

        {/* Rear Muscular Haunches */}
        <mesh position={[0, 0.46, -1.35]} castShadow receiveShadow>
          <boxGeometry args={[1.92, 0.38, 1.4]} />
          <primitive object={materials.paint} />
        </mesh>

        {/* Headlight Assemblies (Projector Lens) */}
        <group position={[0, 0.48, 2.06]}>
          <mesh position={[-0.64, 0, 0]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.32, 0.12, 0.18]} />
            <primitive object={materials.headlightLenses} />
          </mesh>
          <mesh position={[0.64, 0, 0]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.32, 0.12, 0.18]} />
            <primitive object={materials.headlightLenses} />
          </mesh>
        </group>

        {/* Full-Width Rear LED Taillight Strip */}
        <mesh position={[0, 0.54, -2.12]}>
          <boxGeometry args={[1.68, 0.08, 0.06]} />
          <primitive object={materials.taillights} />
        </mesh>

        {/* Greenhouse Cabin Glass & Pillars */}
        <mesh position={[0, 0.76, -0.22]} castShadow>
          <boxGeometry args={[1.44, 0.48, 1.95]} />
          <primitive object={materials.glass} />
        </mesh>

        {/* Aerodynamic Carbon Roof Panel */}
        <mesh position={[0, 1.01, -0.22]} castShadow>
          <boxGeometry args={[1.34, 0.04, 1.65]} />
          <primitive object={materials.carbon} />
        </mesh>

        {/* ================= INTERIOR CABIN ================= */}
        <group position={[0, 0.44, -0.15]}>
          {/* Dashboard Arch */}
          <mesh position={[0, 0.18, 0.58]}>
            <boxGeometry args={[1.32, 0.22, 0.38]} />
            <primitive object={materials.interiorPlastics} />
          </mesh>
          {/* Steering Wheel */}
          <mesh position={[-0.34, 0.25, 0.42]} rotation={[0.4, 0, 0]}>
            <torusGeometry args={[0.13, 0.02, 16, 24]} />
            <primitive object={materials.interiorLeather} />
          </mesh>
          {/* Driver Sport Bucket Seat */}
          <mesh position={[-0.32, 0.14, -0.2]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[0.42, 0.58, 0.42]} />
            <primitive object={materials.interiorLeather} />
          </mesh>
          {/* Passenger Sport Bucket Seat */}
          <mesh position={[0.32, 0.14, -0.2]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[0.42, 0.58, 0.42]} />
            <primitive object={materials.interiorLeather} />
          </mesh>
        </group>

        {/* ================= INTERACTIVE SCISSOR DOORS ================= */}
        {/* Left Driver Door */}
        <group ref={leftDoorRef} position={[-0.93, 0.44, 0.4]}>
          <mesh position={[0, 0, -0.55]} castShadow>
            <boxGeometry args={[0.08, 0.46, 1.15]} />
            <primitive object={materials.paint} />
          </mesh>
        </group>

        {/* Right Passenger Door */}
        <group ref={rightDoorRef} position={[0.93, 0.44, 0.4]}>
          <mesh position={[0, 0, -0.55]} castShadow>
            <boxGeometry args={[0.08, 0.46, 1.15]} />
            <primitive object={materials.paint} />
          </mesh>
        </group>

        {/* ================= ENGINE BAY & DETAILED POWERTRAIN ================= */}
        <group position={[0, 0.38, 1.3]}>
          {/* Engine Block */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.76, 0.32, 0.88]} />
            <primitive object={materials.engineBlock} />
          </mesh>
          {/* Twin Intake Plenums / Carbon Covers */}
          <mesh position={[-0.22, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.72, 16]} />
            <primitive object={materials.engineGold} />
          </mesh>
          <mesh position={[0.22, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.72, 16]} />
            <primitive object={materials.engineGold} />
          </mesh>
          {/* Carbon Fiber Strut Tower Brace */}
          <mesh position={[0, 0.22, -0.1]} rotation={[0, 0, 0]}>
            <boxGeometry args={[1.2, 0.04, 0.08]} />
            <primitive object={materials.carbon} />
          </mesh>
        </group>

        {/* Interactive Hinged Hood Panel */}
        <group ref={hoodGroupRef} position={[0, 0.58, 0.75]}>
          <mesh position={[0, 0, 0.65]} rotation={[-0.08, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.48, 0.04, 1.3]} />
            <primitive object={hasCarbonHood ? materials.carbon : materials.paint} />
          </mesh>
        </group>

        {/* ================= AERODYNAMIC SPOILER WINGS ================= */}
        {spoilerType === 'ducktail' && (
          <mesh position={[0, 0.68, -2.04]} rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[1.52, 0.08, 0.22]} />
            <primitive object={materials.carbon} />
          </mesh>
        )}

        {spoilerType === 'gt_wing' && (
          <group position={[0, 0.72, -1.95]}>
            {/* Left Aluminum Stanchion */}
            <mesh position={[-0.45, 0.16, 0]} castShadow>
              <boxGeometry args={[0.04, 0.32, 0.18]} />
              <primitive object={materials.carbon} />
            </mesh>
            {/* Right Aluminum Stanchion */}
            <mesh position={[0.45, 0.16, 0]} castShadow>
              <boxGeometry args={[0.04, 0.32, 0.18]} />
              <primitive object={materials.carbon} />
            </mesh>
            {/* Carbon Fiber Main Airfoil Plane */}
            <mesh position={[0, 0.32, 0]} rotation={[0.08, 0, 0]} castShadow>
              <boxGeometry args={[1.78, 0.035, 0.38]} />
              <primitive object={materials.carbon} />
            </mesh>
            {/* Endplates */}
            <mesh position={[-0.89, 0.32, 0]}>
              <boxGeometry args={[0.02, 0.16, 0.42]} />
              <primitive object={materials.carbon} />
            </mesh>
            <mesh position={[0.89, 0.32, 0]}>
              <boxGeometry args={[0.02, 0.16, 0.42]} />
              <primitive object={materials.carbon} />
            </mesh>
          </group>
        )}

        {spoilerType === 'drag' && (
          <group position={[0, 0.76, -2.08]}>
            <mesh position={[0, 0.28, 0]} rotation={[0.15, 0, 0]} castShadow>
              <boxGeometry args={[1.92, 0.04, 0.48]} />
              <primitive object={materials.carbon} />
            </mesh>
            <mesh position={[-0.96, 0.28, 0]}>
              <boxGeometry args={[0.025, 0.26, 0.52]} />
              <primitive object={materials.carbon} />
            </mesh>
            <mesh position={[0.96, 0.28, 0]}>
              <boxGeometry args={[0.025, 0.26, 0.52]} />
              <primitive object={materials.carbon} />
            </mesh>
          </group>
        )}

      </group>

      {/* ================= WHEEL ASSEMBLIES (INDEPENDENT ROTATION & CAMBER) ================= */}
      {/* Front Left Wheel */}
      <group position={[-0.96, 0.34, 1.38]} rotation={[0, 0, -wheelCamberRad]}>
        {/* Rubber Tire */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.26, 32]} />
          <primitive object={materials.tires} />
        </mesh>
        {/* Forged Rim Face */}
        <mesh position={[-0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.2, 24]} />
          <primitive object={materials.rims} />
        </mesh>
        {/* Slotted Brake Rotor */}
        <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
          <primitive object={materials.brakeRotor} />
        </mesh>
        {/* 6-Piston Brake Caliper */}
        <mesh position={[0.06, 0.12, 0.08]}>
          <boxGeometry args={[0.07, 0.16, 0.09]} />
          <primitive object={materials.brakeCaliper} />
        </mesh>
      </group>

      {/* Front Right Wheel */}
      <group position={[0.96, 0.34, 1.38]} rotation={[0, 0, wheelCamberRad]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.26, 32]} />
          <primitive object={materials.tires} />
        </mesh>
        <mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.2, 24]} />
          <primitive object={materials.rims} />
        </mesh>
        <mesh position={[-0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
          <primitive object={materials.brakeRotor} />
        </mesh>
        <mesh position={[-0.06, 0.12, 0.08]}>
          <boxGeometry args={[0.07, 0.16, 0.09]} />
          <primitive object={materials.brakeCaliper} />
        </mesh>
      </group>

      {/* Rear Left Wheel */}
      <group position={[-0.98, 0.35, -1.35]} rotation={[0, 0, -wheelCamberRad * 0.8]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
          <primitive object={materials.tires} />
        </mesh>
        <mesh position={[-0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.22, 24]} />
          <primitive object={materials.rims} />
        </mesh>
        <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.21, 0.21, 0.03, 24]} />
          <primitive object={materials.brakeRotor} />
        </mesh>
        <mesh position={[0.06, 0.1, 0.08]}>
          <boxGeometry args={[0.06, 0.14, 0.08]} />
          <primitive object={materials.brakeCaliper} />
        </mesh>
      </group>

      {/* Rear Right Wheel */}
      <group position={[0.98, 0.35, -1.35]} rotation={[0, 0, wheelCamberRad * 0.8]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
          <primitive object={materials.tires} />
        </mesh>
        <mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.22, 24]} />
          <primitive object={materials.rims} />
        </mesh>
        <mesh position={[-0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.21, 0.21, 0.03, 24]} />
          <primitive object={materials.brakeRotor} />
        </mesh>
        <mesh position={[-0.06, 0.1, 0.08]}>
          <boxGeometry args={[0.06, 0.14, 0.08]} />
          <primitive object={materials.brakeCaliper} />
        </mesh>
      </group>

      {/* Real-time Studio Ground Contact Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[2.4, 4.6]} />
        <meshBasicMaterial color="#0B0E14" transparent opacity={0.45} />
      </mesh>
    </group>
  );
};
