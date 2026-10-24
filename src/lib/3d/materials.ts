import * as THREE from 'three';

export type PaintFinish = 'metallic' | 'matte' | 'gloss' | 'pearlescent' | 'chrome';

export interface PaintMaterialOptions {
  color: string;
  finish: PaintFinish;
  wireframe?: boolean;
}

/**
 * Creates high-fidelity Three.js materials tuned for a bright automotive studio environment.
 */
export function createPaintMaterial(options: PaintMaterialOptions): THREE.MeshStandardMaterial {
  const { color, finish, wireframe = false } = options;

  let metalness = 0.85;
  let roughness = 0.22;

  switch (finish) {
    case 'matte':
      metalness = 0.15;
      roughness = 0.82;
      break;
    case 'gloss':
      metalness = 0.25;
      roughness = 0.12;
      break;
    case 'chrome':
      metalness = 0.98;
      roughness = 0.04;
      break;
    case 'pearlescent':
      metalness = 0.72;
      roughness = 0.18;
      break;
    case 'metallic':
    default:
      metalness = 0.88;
      roughness = 0.22;
      break;
  }

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness,
    roughness,
    wireframe,
    envMapIntensity: 1.2
  });
}

export function createCarbonFiberMaterial(wireframe = false): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#14171D'),
    roughness: 0.32,
    metalness: 0.65,
    wireframe,
    envMapIntensity: 0.9
  });
}

export function createGlassMaterial(wireframe = false): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#1A202C'),
    metalness: 0.1,
    roughness: 0.06,
    transmission: 0.88,
    thickness: 0.5,
    transparent: true,
    opacity: 0.75,
    wireframe
  });
}

export function createWheelRimMaterial(selected = false, wireframe = false): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(selected ? '#0070F3' : '#D1D5DB'),
    metalness: 0.94,
    roughness: 0.14,
    wireframe,
    envMapIntensity: 1.5
  });
}

export function createTireMaterial(wireframe = false): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#111317'),
    metalness: 0.05,
    roughness: 0.92,
    wireframe
  });
}

export function createBrakeRotorMaterial(selected = false): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(selected ? '#38BDF8' : '#9CA3AF'),
    metalness: 0.92,
    roughness: 0.22
  });
}

export function createBrakeCaliperMaterial(selected = false): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(selected ? '#0070F3' : '#EF4444'),
    metalness: 0.8,
    roughness: 0.25,
    emissive: selected ? new THREE.Color('#003B80') : new THREE.Color('#330000'),
    emissiveIntensity: selected ? 0.6 : 0.2
  });
}

export function createExhaustMaterial(selected = false): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(selected ? '#38BDF8' : '#71717A'),
    metalness: 0.95,
    roughness: 0.12,
    emissive: selected ? new THREE.Color('#0055B3') : new THREE.Color('#000000'),
    emissiveIntensity: selected ? 0.5 : 0.0
  });
}
