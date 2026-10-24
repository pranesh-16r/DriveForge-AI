import React from 'react';

interface GarageLightingProps {
  studioIntensity?: number;
  underglowColor?: string;
  headlightsOn?: boolean;
}

/**
 * Premium Bright Automotive Studio Lighting
 * Avoids dark cyberpunk / neon clichés.
 * Accentuates vehicle body creases, metallic reflections, and wheel geometry.
 */
export const GarageLighting: React.FC<GarageLightingProps> = ({
  studioIntensity = 1.0,
  underglowColor,
  headlightsOn = false
}) => {
  return (
    <group name="studio-lighting-rig">
      {/* Soft Ambient Fill for a bright high-end showroom atmosphere */}
      <ambientLight intensity={0.75 * studioIntensity} color="#F8FAFC" />

      {/* Main Overhead Softbox Panel (illuminates roofline, hood, and contours) */}
      <directionalLight
        position={[0, 15, 0]}
        intensity={1.4 * studioIntensity}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
      />

      {/* Studio Key Light (Front-Three-Quarter High Angle) */}
      <directionalLight
        position={[8, 10, 8]}
        intensity={1.5 * studioIntensity}
        color="#FFFFFF"
      />

      {/* Studio Fill Light (Rear-Opposite Low-Contrast) */}
      <directionalLight
        position={[-8, 6, -6]}
        intensity={0.8 * studioIntensity}
        color="#E2E8F0"
      />

      {/* Studio Rim / Specular Accent Light (Accentuates rear aero & shoulder lines) */}
      <directionalLight
        position={[-6, 4, 8]}
        intensity={0.9 * studioIntensity}
        color="#F1F5F9"
      />

      {/* Low Ground Fill (Prevents overly dark underbody shadows on light studio floor) */}
      <directionalLight
        position={[0, -2, 0]}
        intensity={0.25 * studioIntensity}
        color="#E2E8F0"
      />

      {/* Front Headlight Projector Beams */}
      {headlightsOn && (
        <group position={[0, 0.45, 2.3]}>
          <spotLight
            position={[-0.65, 0, 0]}
            target-position={[-0.65, 0, 10]}
            intensity={4.5}
            distance={14}
            angle={0.45}
            penumbra={0.7}
            color="#E0F2FE"
          />
          <spotLight
            position={[0.65, 0, 0]}
            target-position={[0.65, 0, 10]}
            intensity={4.5}
            distance={14}
            angle={0.45}
            penumbra={0.7}
            color="#E0F2FE"
          />
        </group>
      )}

      {/* Optional Subtle Chassis Inspection Light (if user enabled underglow) */}
      {underglowColor && (
        <pointLight
          position={[0, 0.15, 0]}
          intensity={2.0 * studioIntensity}
          distance={4.5}
          color={underglowColor}
        />
      )}
    </group>
  );
};
