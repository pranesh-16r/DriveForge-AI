import { ModificationComponent } from '../types';

export const COMPONENTS: ModificationComponent[] = [
  {
    id: 'akrapovic-titanium-slip-on',
    name: 'Akrapovič Evolution Titanium Exhaust System',
    category: 'exhaust',
    brand: 'Akrapovič',
    partNumber: 'S-PO/TI/15H',
    priceUSD: 8450,
    installHours: 3.5,
    powerGainHp: 18,
    weightDeltaKg: -11.2,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Direct bolt-on replacement for factory exhaust headers. Retains factory valve control electronics.',
    description: 'High-grade ultra-lightweight titanium alloy system featuring hand-crafted carbon fiber tailpipes and integrated exhaust flap acoustic management.',
    specifications: {
      'Material': 'Proprietary Titanium Alloy',
      'Weight Savings': '11.2 kg (-42% vs OEM)',
      'Acoustic Pitch': 'High-RPM Titanium Resonant Frequency',
      'ECU Requirement': 'Optional (Factory Valve Plug-and-Play)'
    },
    featured: true
  },
  {
    id: 'brembo-gt-s-monobloc-kit',
    name: 'Brembo GT-S 6-Piston 380mm Brake System',
    category: 'brakes',
    brand: 'Brembo',
    partNumber: '1N1.9038A',
    priceUSD: 5200,
    installHours: 4.0,
    powerGainHp: 0,
    weightDeltaKg: -4.8,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Requires minimum 19-inch wheel clearance. Includes stainless steel braided lines.',
    description: 'Billet aluminium 6-piston monobloc caliper kit with hard-anodized black finish and two-piece floating slotted discs.',
    specifications: {
      'Caliper Type': '6-Piston Aluminum Monobloc',
      'Disc Diameter': '380mm x 34mm Slotted 2-Piece',
      'Thermal Heat Limit': '850°C Heavy Duty Friction Pad',
      'Fluid Included': 'Brembo LCF 600 Plus Dot 4'
    },
    featured: true
  },
  {
    id: 'ohlins-road-track-coilovers',
    name: 'Öhlins Road & Track DFV Coilover Kit',
    category: 'suspension',
    brand: 'Öhlins',
    partNumber: 'POS 5S00',
    priceUSD: 3890,
    installHours: 5.0,
    powerGainHp: 0,
    weightDeltaKg: -3.5,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Includes height-adjustable spring perches and 20-click rebound/compression dampers.',
    description: 'Dual Flow Valve technology provides ultra-fast oil displacement adjustments during sudden bumps, preserving tire contact patch.',
    specifications: {
      'Damping System': 'Dual Flow Valve (DFV) Patented',
      'Spring Rate Front': '90 N/mm Linear',
      'Spring Rate Rear': '110 N/mm Linear',
      'Height Range': '-10mm to -35mm Adjustable'
    },
    featured: true
  },
  {
    id: 'eventuri-carbon-intake',
    name: 'Eventuri Sealed Carbon Fiber Intake System',
    category: 'powertrain',
    brand: 'Eventuri',
    partNumber: 'EVE-S58-CF-INT',
    priceUSD: 2850,
    installHours: 2.0,
    powerGainHp: 24,
    weightDeltaKg: -2.1,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Smooth unrestrictive velocity stack design drops air intake temps by up to 12°C under sustained load.',
    description: 'Patent-pending inverted cone filter housing acts as a smooth aerodynamic funneled venturi, eliminating turbo lag.',
    specifications: {
      'Airflow Gain': '+34% CFM over OEM airbox',
      'Filter Element': 'Dry High-Flow Synthetic Cone',
      'Housing': '100% Pre-preg Autoclave Carbon Fiber',
      'Dyno Proven Gain': '+24 WHP at 6,400 RPM'
    },
    featured: true
  },
  {
    id: 'bbs-fi-r-forged-wheels',
    name: 'BBS FI-R Forged Center-Lock Wheel Set',
    category: 'wheels_tires',
    brand: 'BBS',
    partNumber: 'FIR-2021-CL',
    priceUSD: 11200,
    installHours: 1.5,
    powerGainHp: 0,
    weightDeltaKg: -14.6,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Designed for center-lock hub geometry or 5x112 PCD applications. Lightest mass in class.',
    description: 'Engineered specifically for extreme motorsports with mass-relief holes directly machined inside the wheel spokes.',
    specifications: {
      'Construction': '1-Piece Forged Aerospace Aluminum 6091',
      'Front Spec': '20 x 9.5J ET45 (7.8 kg/wheel)',
      'Rear Spec': '21 x 12.0J ET48 (9.2 kg/wheel)',
      'Load Rating': '750 kg per corner'
    },
    featured: true
  },
  {
    id: 'cobb-accessport-v3',
    name: 'COBB Accessport V3 ECU Flash Manager',
    category: 'electronics',
    brand: 'COBB',
    partNumber: 'AP3-BMW-004',
    priceUSD: 1450,
    installHours: 0.5,
    powerGainHp: 65,
    weightDeltaKg: 0,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Plug and play via OBD-II port. Includes Stage 1 93 Octane and E30 ethanol blend map profiles.',
    description: 'In-vehicle full-color gauge display, diagnostic code reader, high-resolution datalogger, and customizable map switcher.',
    specifications: {
      'Interface': 'High-Res Full Color Screen with Auto Dimming',
      'Data Logging': 'Up to 35 Engine Monitor Parameters simultaneously',
      'Safety Monitoring': 'Automatic Ignition Timing Knock Retard Safeguard',
      'Map Switching': 'On-The-Fly Mode Select via Steering Controls'
    },
    featured: true
  },
  {
    id: 'vorsteiner-carbon-aero-kit',
    name: 'Vorsteiner VRS Carbon Fiber Aerodynamic Aero Package',
    category: 'aerodynamics',
    brand: 'Vorsteiner',
    partNumber: 'VRS-CF-AERO-992',
    priceUSD: 14800,
    installHours: 6.5,
    powerGainHp: 0,
    weightDeltaKg: -6.0,
    compatibilityRating: 'verificationRequired',
    compatibilityNotes: 'Adds 145kg downforce at 240km/h. Requires precision alignment with factory bumper mounts.',
    description: 'Autoclave pre-preg 2x2 weave carbon front splitter, side skirts, active rear diffuser, and swan-neck wing blade.',
    specifications: {
      'Downforce Delta': '+145 kg at 240 km/h',
      'Material': '2x2 Weave Pre-Preg Carbon Fiber Gloss Finish',
      'Wind Tunnel': 'Tested and Verified CFD Aerodynamic Balance',
      'Included Hardware': 'Titanium Fasteners & Bonding Adhesive'
    }
  }
];
