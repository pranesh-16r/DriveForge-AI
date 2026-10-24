import { ExperienceLevel } from '../types';

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  {
    id: 'street-enthusiast',
    title: 'Street & Daily Enthusiast',
    subtitle: 'Balanced performance, reliability, and daily comfort',
    description: 'Designed for owners who want OEM+ upgrades, enhanced exhaust note, crisper gearshifts, and OEM street usability without sacrificing comfort.',
    recommendedFocus: ['Bolt-on Titanium Exhausts', 'Street Sport Coilovers', 'High-Flow Cold Air Intakes', 'Stage 1 ECU Maps'],
    techDetailMode: 'standard'
  },
  {
    id: 'club-track',
    title: 'Club Track & Autocross',
    subtitle: 'High thermal endurance, lap time consistency, and chassis rigidity',
    description: 'For drivers taking their vehicle to HPDE events and track days. Focuses on thermal braking limits, adjustable dampening, track alignments, and sticky R-compound rubber.',
    recommendedFocus: ['Monobloc Big Brake Kits', '3-Way Adjustable Coilovers', 'Carbon Aerodynamic Downforce', 'Corner Balancing'],
    techDetailMode: 'advanced'
  },
  {
    id: 'master-tuner',
    title: 'Master Race Engineer',
    subtitle: 'Uncompromised performance telemetry, custom fuel maps, and chassis kinematics',
    description: 'Unlocks full raw engineering metrics, spring rate calculators, roll center corrections, E85 flex-fuel sensors, and custom ECU ignition timing curves.',
    recommendedFocus: ['Standalone MoTeC ECU', 'Forged Engine Internals', 'Full Race Center-Lock Conversions', 'Telemetry Datalogging'],
    techDetailMode: 'telemetry'
  }
];
