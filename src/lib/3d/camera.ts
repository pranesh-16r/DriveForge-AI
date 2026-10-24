export type CameraTargetId = 
  | 'hero'
  | 'front'
  | 'rear'
  | 'side'
  | 'top'
  | 'wheel'
  | 'brake'
  | 'exhaust'
  | 'engine'
  | 'interior'
  | 'suspension';

export type ModificationCategoryNavId = 
  | 'exterior'
  | 'wheels'
  | 'brakes'
  | 'suspension'
  | 'performance'
  | 'interior';

export interface CameraPresetConfig {
  id: CameraTargetId;
  label: string;
  description: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  shortcutKey?: string;
  iconName: string;
}

export const CAMERA_PRESETS: Record<CameraTargetId, CameraPresetConfig> = {
  hero: {
    id: 'hero',
    label: 'Hero 360°',
    description: 'Dynamic isometric three-quarter studio perspective',
    position: [4.2, 2.0, 4.8],
    target: [0, 0.45, 0],
    fov: 44,
    shortcutKey: '1',
    iconName: 'Orbit'
  },
  front: {
    id: 'front',
    label: 'Front Fascia',
    description: 'Direct head-on view focusing on front bumper, grille & headlights',
    position: [0, 1.2, 5.0],
    target: [0, 0.45, 1.5],
    fov: 40,
    shortcutKey: '2',
    iconName: 'ArrowUp'
  },
  rear: {
    id: 'rear',
    label: 'Rear Aero & Diffuser',
    description: 'Rear view focusing on wing, taillights, diffuser & exhaust',
    position: [0, 1.4, -5.0],
    target: [0, 0.45, -1.6],
    fov: 40,
    shortcutKey: '3',
    iconName: 'ArrowDown'
  },
  side: {
    id: 'side',
    label: 'Side Profile',
    description: 'Clean side silhouette highlighting stance and roofline',
    position: [5.2, 1.15, 0],
    target: [0, 0.45, 0],
    fov: 40,
    shortcutKey: '4',
    iconName: 'ArrowRight'
  },
  top: {
    id: 'top',
    label: 'Top Aerodynamics',
    description: 'High-angle overhead view of chassis footprint and aero surfaces',
    position: [0.01, 6.2, 0.01],
    target: [0, 0, 0],
    fov: 48,
    shortcutKey: '5',
    iconName: 'Maximize2'
  },
  wheel: {
    id: 'wheel',
    label: 'Front Wheel & Tire',
    description: 'Close inspection of front wheel fitment, tire profile and offset',
    position: [2.3, 0.65, 1.6],
    target: [1.0, 0.38, 1.4],
    fov: 34,
    shortcutKey: '6',
    iconName: 'Disc'
  },
  brake: {
    id: 'brake',
    label: 'Braking Hardware',
    description: 'Detailed inspection of brake caliper and ceramic rotor geometry',
    position: [1.9, 0.55, 1.5],
    target: [0.95, 0.38, 1.4],
    fov: 28,
    shortcutKey: '7',
    iconName: 'ShieldAlert'
  },
  exhaust: {
    id: 'exhaust',
    label: 'Exhaust System',
    description: 'Close inspection of dual exhaust tips and lower aero diffuser',
    position: [1.4, 0.7, -3.2],
    target: [0.4, 0.32, -2.1],
    fov: 32,
    shortcutKey: '8',
    iconName: 'Flame'
  },
  engine: {
    id: 'engine',
    label: 'Powertrain Bay',
    description: 'Engine bay inspection focusing on intake, turbos and strut brace',
    position: [1.1, 1.9, 2.5],
    target: [0, 0.7, 1.1],
    fov: 36,
    shortcutKey: '9',
    iconName: 'Cpu'
  },
  interior: {
    id: 'interior',
    label: 'Cockpit & Cabin',
    description: 'Interior cabin view with steering wheel, cluster and sport seats',
    position: [0.75, 1.3, 0.1],
    target: [-0.3, 0.75, 0],
    fov: 46,
    shortcutKey: '0',
    iconName: 'DoorClosed'
  },
  suspension: {
    id: 'suspension',
    label: 'Suspension & Stance',
    description: 'Low angle inspection of wheel arch gap, drop and camber angle',
    position: [2.6, 0.5, 0.8],
    target: [0.9, 0.4, 0.6],
    fov: 34,
    iconName: 'Sliders'
  }
};

/**
 * Data-driven mapping from Modification Category to default Camera Target.
 * As required by Phase 4 specification:
 * EXTERIOR -> default vehicle view
 * WHEELS -> wheel focus
 * BRAKES -> wheel/brake focus
 * SUSPENSION -> wheel/body stance area
 * PERFORMANCE -> engine/rear
 * INTERIOR -> cabin
 */
export const CATEGORY_CAMERA_MAPPING: Record<ModificationCategoryNavId, CameraTargetId> = {
  exterior: 'hero',
  wheels: 'wheel',
  brakes: 'brake',
  suspension: 'suspension',
  performance: 'engine',
  interior: 'interior'
};
