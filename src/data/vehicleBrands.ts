import { VehicleBrand } from '../types';

export const VEHICLE_BRANDS: VehicleBrand[] = [
  {
    id: 'porsche',
    name: 'Porsche',
    country: 'Germany',
    vehicleTypes: ['sports-car', 'supercar', 'suv'],
    modelsCount: 4,
    description: 'Iconic motorsport engineering defined by rear and mid-engine balance, telepathic steering, and precision atmospheric and bi-turbo flat engines.',
    logoText: 'PORSCHE',
    foundedYear: 1931,
    accentColor: '#D97706'
  },
  {
    id: 'bmw',
    name: 'BMW M',
    country: 'Germany',
    vehicleTypes: ['sedan', 'coupe', 'sports-car', 'suv'],
    modelsCount: 4,
    description: 'The benchmark in front-engine rear-drive chassis balance, powered by legendary high-revving S58 twin-turbo straight-six and twin-turbo V8 engines.',
    logoText: '///M',
    foundedYear: 1916,
    accentColor: '#0070F3'
  },
  {
    id: 'toyota',
    name: 'Toyota GR',
    country: 'Japan',
    vehicleTypes: ['sports-car', 'hatchback', 'sedan', 'coupe'],
    modelsCount: 4,
    description: 'Gazoo Racing motorsport pedigree focused on analog driver engagement, lightweight homologation specials, and high-strength turbocharged platforms.',
    logoText: 'GR',
    foundedYear: 1937,
    accentColor: '#EF4444'
  },
  {
    id: 'audi',
    name: 'Audi Sport',
    country: 'Germany',
    vehicleTypes: ['sedan', 'sports-car', 'supercar', 'suv'],
    modelsCount: 4,
    description: 'Mastery of mechanical Quattro all-wheel traction, high-output five-cylinder turbo and twin-turbo V8 platforms with immense tuning headroom.',
    logoText: 'RS',
    foundedYear: 1909,
    accentColor: '#E11D48'
  },
  {
    id: 'honda',
    name: 'Honda / Acura',
    country: 'Japan',
    vehicleTypes: ['hatchback', 'sedan', 'sports-car', 'supercar'],
    modelsCount: 4,
    description: 'Championship-winning front-wheel drive record holders and hybrid twin-turbo mid-engine supercars engineered around high-RPM VTEC architectures.',
    logoText: 'TYPE R',
    foundedYear: 1948,
    accentColor: '#DC2626'
  },
  {
    id: 'nissan',
    name: 'Nissan NISMO',
    country: 'Japan',
    vehicleTypes: ['supercar', 'sports-car', 'coupe', 'sedan'],
    modelsCount: 4,
    description: 'Legendary GT-R and Z heritage combining ATTESA E-TS intelligent all-wheel drive, twin-turbo VR powerplants, and aggressive track aerodynamics.',
    logoText: 'NISMO',
    foundedYear: 1933,
    accentColor: '#B91C1C'
  }
];

export const getBrandById = (id: string): VehicleBrand | undefined => {
  return VEHICLE_BRANDS.find(b => b.id.toLowerCase() === id.toLowerCase());
};
