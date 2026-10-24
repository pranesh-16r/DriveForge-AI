import { VehicleTypeCategory } from '../types';

export const VEHICLE_TYPES: VehicleTypeCategory[] = [
  {
    id: 'sports-car',
    name: 'Sports Car',
    shortDescription: 'Dedicated two-door chassis engineered for maximum handling agility, cornering balance, and driver engagement.',
    badge: 'AGILITY & TRACK'
  },
  {
    id: 'supercar',
    name: 'Supercar',
    shortDescription: 'Ultra-high-performance exotic architectures with bespoke aerodynamics, carbon tubs, and extreme power outputs.',
    badge: 'EXOTIC POWER'
  },
  {
    id: 'sedan',
    name: 'Sedan',
    shortDescription: 'High-rigidity four-door performance platforms offering high-speed stability, tuning breadth, and daily practicality.',
    badge: 'PERFORMANCE SEDAN'
  },
  {
    id: 'coupe',
    name: 'Coupe',
    shortDescription: 'Streamlined grand touring and sport two-door profiles with structural chassis stiffness and muscular proportions.',
    badge: 'GT & STIFFNESS'
  },
  {
    id: 'hatchback',
    name: 'Hatchback',
    shortDescription: 'Agile front-wheel or all-wheel drive hot hatches with short wheelbases and explosive technical road capabilities.',
    badge: 'HOT HATCH'
  },
  {
    id: 'suv',
    name: 'Performance SUV',
    shortDescription: 'High-torque twin-turbo all-terrain platforms blending all-weather traction with track-capable active suspension.',
    badge: 'ALL-TERRAIN POWER'
  }
];

export const getVehicleTypeById = (id: string): VehicleTypeCategory | undefined => {
  return VEHICLE_TYPES.find(t => t.id.toLowerCase() === id.toLowerCase());
};
