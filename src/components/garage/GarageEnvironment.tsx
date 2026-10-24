import React from 'react';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';

interface GarageEnvironmentProps {
  studioTheme?: 'light' | 'graphite';
  showGrid?: boolean;
}

/**
 * High-End Automotive Design Studio & Digital Engineering Lab Environment
 * Clean, bright, architectural, minimal.
 */
export const GarageEnvironment: React.FC<GarageEnvironmentProps> = ({
  studioTheme = 'light',
  showGrid = true
}) => {
  const isLight = studioTheme === 'light';

  const floorColor = isLight ? '#F4F1EA' : '#E8E2D8';
  const gridCellColor = isLight ? '#E8E2D8' : '#D6C09A';
  const gridSectionColor = isLight ? '#D6C09A' : '#B47A52';
  const turntableRingColor = isLight ? '#D6C09A' : '#B47A52';

  return (
    <group name="studio-environment">
      {/* Studio Floor Mesh with Soft Specular Highlights */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.005, 0]}
        receiveShadow
      >
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* Engineering Precision Turntable Ring (Beveled edge on floor) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
        receiveShadow
      >
        <ringGeometry args={[3.35, 3.42, 72]} />
        <meshStandardMaterial
          color={turntableRingColor}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Subtle Studio Alignment Center-Cross & Radians */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.0015, 0]}
      >
        <ringGeometry args={[1.5, 1.52, 64]} />
        <meshBasicMaterial
          color={isLight ? '#94A3B8' : '#475569'}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Engineering Grid (Subtle, non-distracting) */}
      {showGrid && (
        <Grid
          position={[0, 0.002, 0]}
          args={[26, 26]}
          cellSize={0.6}
          cellThickness={0.8}
          cellColor={gridCellColor}
          sectionSize={3}
          sectionThickness={1.2}
          sectionColor={gridSectionColor}
          fadeDistance={18}
          fadeStrength={1.4}
        />
      )}

      {/* Architectural Studio Ceiling Light Frame (Provides realistic studio perspective) */}
      <group position={[0, 7.5, 0]}>
        {/* Rectangular Studio Softbox Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[7, 0.15, 5]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.65}
            roughness={0.1}
          />
        </mesh>

        {/* Outer Minimalist Suspension Trusses */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[7.2, 0.08, 5.2]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
