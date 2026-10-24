import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { CameraTargetId, CAMERA_PRESETS } from '../../lib/3d/camera';
import { isPrefersReducedMotion } from '../../lib/3d/helpers';

interface GarageCameraProps {
  activePreset: CameraTargetId;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  onTransitionComplete?: () => void;
}

/**
 * Dedicated Cinematic Camera Controller for DriveForge Garage
 * Interpolates position and orbit lookAt target with smooth spring-like dampening.
 */
export const GarageCamera: React.FC<GarageCameraProps> = ({
  activePreset,
  controlsRef,
  onTransitionComplete
}) => {
  const { camera } = useThree();
  const targetPosRef = useRef(new THREE.Vector3());
  const targetLookRef = useRef(new THREE.Vector3());
  const isTransitioningRef = useRef(true);

  // Update desired target vectors when preset changes
  useEffect(() => {
    const config = CAMERA_PRESETS[activePreset] || CAMERA_PRESETS.hero;
    targetPosRef.current.set(...config.position);
    targetLookRef.current.set(...config.target);

    // If reduced motion is preferred, jump instantly
    if (isPrefersReducedMotion()) {
      camera.position.copy(targetPosRef.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLookRef.current);
        controlsRef.current.update();
      }
      isTransitioningRef.current = false;
      onTransitionComplete?.();
    } else {
      isTransitioningRef.current = true;
    }
  }, [activePreset, camera, controlsRef, onTransitionComplete]);

  // Frame interpolation loop
  useFrame((_, delta) => {
    if (!isTransitioningRef.current) return;

    // Smooth lerp speed calibrated for responsive yet cinematic feel
    const lerpFactor = Math.min(1, delta * 4.5);

    // Lerp Camera Position
    camera.position.lerp(targetPosRef.current, lerpFactor);

    // Lerp OrbitControls Target
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookRef.current, lerpFactor);
      controlsRef.current.update();
    }

    // Check distance threshold to mark transition as settled
    const posDist = camera.position.distanceTo(targetPosRef.current);
    const targetDist = controlsRef.current
      ? controlsRef.current.target.distanceTo(targetLookRef.current)
      : 0;

    if (posDist < 0.02 && targetDist < 0.02) {
      camera.position.copy(targetPosRef.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLookRef.current);
      }
      isTransitioningRef.current = false;
      onTransitionComplete?.();
    }
  });

  return null;
};
