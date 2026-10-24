import * as THREE from 'three';

/**
 * Checks if the user environment has requested reduced motion.
 */
export function isPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Smoothly interpolates Vector3 target with a given speed.
 */
export function lerpVector3(
  current: THREE.Vector3,
  target: THREE.Vector3 | [number, number, number],
  alpha: number
): void {
  const targetVec = Array.isArray(target)
    ? new THREE.Vector3(target[0], target[1], target[2])
    : target;
  current.lerp(targetVec, Math.min(1, Math.max(0, alpha)));
}

/**
 * Formats dimension metrics (meters to mm or inches)
 */
export function formatDimension(meters: number): string {
  return `${Math.round(meters * 1000)} mm`;
}
