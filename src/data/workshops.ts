import { Workshop } from '../types';

export const WORKSHOPS: Workshop[] = [
  {
    id: 'west-coast-performance-lab',
    name: 'Apex Motorworks & Engineering Lab',
    region: 'North America - West',
    city: 'Los Angeles, CA',
    address: '1420 Motorsport Way, Irvine, CA 92618',
    rating: 4.9,
    reviewsCount: 184,
    masterCertifications: ['Porsche Motorsport Certified', 'Brembo Master Center', 'KW 7-Post Tuning'],
    hourlyLaborRateUSD: 185,
    phone: '+1 (949) 555-0192',
    specialties: ['Precision Suspension Alignment', 'Twin-Turbo ECU Dyno Tuning', 'Custom Titanium Fabrication']
  },
  {
    id: 'bavarian-engineering-haus',
    name: 'Bavarian Performance Haus',
    region: 'North America - East',
    city: 'Fairfield, NJ',
    address: '88 Commerce Road, Fairfield, NJ 07004',
    rating: 4.8,
    reviewsCount: 142,
    masterCertifications: ['BMW M Master Technicians', 'COBB ProTuner Gold', 'Akrapovič Certified Installer'],
    hourlyLaborRateUSD: 175,
    phone: '+1 (973) 555-0144',
    specialties: ['Custom Fuel Systems', 'S58/B58 Engine Calibration', 'Carbon Ceramic Brake Retrofits']
  },
  {
    id: 'tokyo-tuning-works',
    name: 'Tomei & GT-R Works Japan',
    region: 'Asia Pacific - Japan',
    city: 'Yokohama, Kanagawa',
    address: '3-12 Bay Area Drive, Yokohama, Japan',
    rating: 5.0,
    reviewsCount: 310,
    masterCertifications: ['NISMO Factory Specialist', 'HKS Technical Center', 'Endurance Race Prep'],
    hourlyLaborRateUSD: 160,
    phone: '+81 45-555-9012',
    specialties: ['VR38 Engine Overhaul', 'Center-Lock Conversion', 'Aero Wind-Tunnel Calibration']
  },
  {
    id: 'nuerburg-performance-center',
    name: 'Nürburgring Race Engineering GmbH',
    region: 'Europe - DACH',
    city: 'Nürburg, Germany',
    address: 'Hauptstraße 45, 53520 Nürburg, Germany',
    rating: 4.9,
    reviewsCount: 220,
    masterCertifications: ['Öhlins Official Service Center', 'Manthey Racing Partner', 'TÜV Certification Facility'],
    hourlyLaborRateUSD: 195,
    phone: '+49 2691 5550',
    specialties: ['Ring-Taxi Chassis Setup', 'Corner Balancing & Cornering Kinematics', 'TÜV Street Legal Homologation']
  }
];
