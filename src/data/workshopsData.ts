import { Workshop } from '../lib/workshops/workshopTypes';

export const WORKSHOPS_DIRECTORY: Workshop[] = [
  // ==========================================
  // INDIA — TAMIL NADU (in-tamil-nadu)
  // ==========================================
  {
    id: 'tn-race-concepts-chennai',
    name: 'Apex Precision Auto Lab',
    address: 'Plot 42, Industrial Estate, Guindy',
    city: 'Chennai',
    region: 'Tamil Nadu',
    regionId: 'in-tamil-nadu',
    country: 'India',
    countryId: 'india',
    latitude: 13.0067,
    longitude: 80.2023,
    phone: '+91 44 2250 1890',
    website: 'https://example-tuners.in/apex-chennai',
    rating: null, // Honest: unrated demo
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Alignment',
      'Brake Installation',
      'Wheel & Tyre Installation',
      'Exhaust Installation'
    ],
    specialties: ['Corner Balancing', 'Track Day Geometry', 'Big Brake Upgrades'],
    supportedVehicleTypes: ['Sedan', 'Hatchback', 'Sports Car', 'Coupe'],
    installationCapabilities: ['4-Wheel Laser Alignment Rack', '2-Post Lift', 'Corner Weighting Scales'],
    openingHours: {
      openNow: true,
      display: 'Mon–Sat: 09:30 – 18:30',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },
  {
    id: 'tn-coimbatore-motorsport',
    name: 'Coimbatore Dyno & Race Engineering',
    address: '84 Avinashi Road, Peelamedu',
    city: 'Coimbatore',
    region: 'Tamil Nadu',
    regionId: 'in-tamil-nadu',
    country: 'India',
    countryId: 'india',
    latitude: 11.0256,
    longitude: 76.9984,
    phone: '+91 422 257 8812',
    website: 'https://example-tuners.in/cbe-motorsport',
    rating: null,
    reviewCount: null,
    services: [
      'ECU Tuning',
      'Performance Tuning',
      'Exhaust Installation',
      'Intake Installation',
      'Intercooler Installation',
      'Cooling System Work',
      'Fabrication'
    ],
    specialties: ['Hub Dyno Calibrations', 'Custom Downpipes', 'Turbocharged Airflow'],
    supportedVehicleTypes: ['Sedan', 'Coupe', 'Track / Race', 'Sport Compact'],
    installationCapabilities: ['All-Wheel Hub Dyno', 'TIG Welding Station', 'Wideband Air-Fuel Sensors'],
    openingHours: {
      openNow: false,
      display: 'Mon–Sat: 10:00 – 19:00',
      statusText: 'CLOSED'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },
  {
    id: 'tn-madurai-aero-works',
    name: 'South Coast Aero & Bodycraft',
    address: '15 Ring Road Bypass, Mattuthavani',
    city: 'Madurai',
    region: 'Tamil Nadu',
    regionId: 'in-tamil-nadu',
    country: 'India',
    countryId: 'india',
    latitude: 9.9482,
    longitude: 78.1568,
    phone: '+91 452 249 1120',
    website: 'https://example-tuners.in/madurai-aero',
    rating: null,
    reviewCount: null,
    services: [
      'Body Kit Installation',
      'Spoiler Installation',
      'Wheel & Tyre Installation',
      'Electrical / Interior Installation'
    ],
    specialties: ['Aero Splitter Mounting', 'Widebody Flaring', 'Custom Carbon Bracing'],
    supportedVehicleTypes: ['Sedan', 'Coupe', 'SUV'],
    installationCapabilities: ['Heated Paint Booth', 'Fiberglass Mold Bench', 'Precision Alignment Jigs'],
    openingHours: {
      openNow: true,
      display: 'Mon–Sat: 09:00 – 18:00',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'UNVERIFIED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // INDIA — KARNATAKA (in-karnataka)
  // ==========================================
  {
    id: 'ka-bangalore-performance',
    name: 'Silicon Valley Performance Works',
    address: '112/4 Hosur Main Road, Koramangala',
    city: 'Bengaluru',
    region: 'Karnataka',
    regionId: 'in-karnataka',
    country: 'India',
    countryId: 'india',
    latitude: 12.9352,
    longitude: 77.6245,
    phone: '+91 80 4112 7900',
    website: 'https://example-tuners.in/bengaluru-perf',
    rating: null,
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Brake Installation',
      'Alignment',
      'ECU Tuning',
      'Performance Tuning',
      'Exhaust Installation',
      'Intake Installation'
    ],
    specialties: ['Euro Vehicle Tuning', 'Track Alignment', 'High-Flow Exhausts'],
    supportedVehicleTypes: ['Sedan', 'Coupe', 'Hatchback', 'Sports Car'],
    installationCapabilities: ['4-Wheel Alignment', 'Chassis Dyno', 'Smoke Tester', 'Multi-Vehicle Lifts'],
    openingHours: {
      openNow: true,
      display: 'Mon–Sat: 09:30 – 19:30',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },
  {
    id: 'ka-mysore-motorworks',
    name: 'Chamundi Custom Fabrications',
    address: '56 Hunsur Road, Vijayanagar',
    city: 'Mysuru',
    region: 'Karnataka',
    regionId: 'in-karnataka',
    country: 'India',
    countryId: 'india',
    latitude: 12.3168,
    longitude: 76.6214,
    phone: '+91 821 241 5590',
    rating: null,
    reviewCount: null,
    services: [
      'Body Kit Installation',
      'Spoiler Installation',
      'Fabrication',
      'Exhaust Installation',
      'Wheel & Tyre Installation'
    ],
    specialties: ['Exhaust Headers', 'Roll Bar Bracing', 'Custom Bracketry'],
    supportedVehicleTypes: ['SUV', 'Sedan', 'Coupe'],
    installationCapabilities: ['Mandrel Tube Bender', 'TIG Welder', 'Lift'],
    openingHours: {
      openNow: false,
      display: 'Mon–Fri: 09:00 – 18:00',
      statusText: 'CLOSED'
    },
    verificationStatus: 'UNVERIFIED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // INDIA — KERALA (in-kerala)
  // ==========================================
  {
    id: 'kl-kochi-stance-lab',
    name: 'Malabar Chassis & Stance Lab',
    address: 'Kaloor–Kadavanthra Road',
    city: 'Kochi',
    region: 'Kerala',
    regionId: 'in-kerala',
    country: 'India',
    countryId: 'india',
    latitude: 9.9816,
    longitude: 76.2999,
    phone: '+91 484 220 8891',
    website: 'https://example-tuners.in/kochi-stance',
    rating: null,
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Wheel & Tyre Installation',
      'Alignment',
      'Brake Installation'
    ],
    specialties: ['Air Suspension Calibration', 'Camber Geometry', 'Staggered Wheel Fitment'],
    supportedVehicleTypes: ['Hatchback', 'Sedan', 'Coupe'],
    installationCapabilities: ['Hunter 3D Alignment', 'Bead-Blaster Tyre Station', 'Scissor Lift'],
    openingHours: {
      openNow: true,
      display: 'Mon–Sat: 09:00 – 19:00',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },
  {
    id: 'kl-calicut-speed-tech',
    name: 'Kozhikode Performance Syndicate',
    address: 'NH 66 Bypass, Thondayad',
    city: 'Kozhikode',
    region: 'Kerala',
    regionId: 'in-kerala',
    country: 'India',
    countryId: 'india',
    latitude: 11.2618,
    longitude: 75.8142,
    phone: '+91 495 274 0019',
    rating: null,
    reviewCount: null,
    services: [
      'ECU Tuning',
      'Performance Tuning',
      'Intake Installation',
      'Intercooler Installation',
      'Exhaust Installation'
    ],
    specialties: ['Diesel Remapping', 'Stage 2 Bolt-On Packages'],
    supportedVehicleTypes: ['Sedan', 'SUV', 'Hatchback'],
    installationCapabilities: ['OBD Flashing Bench', 'Boost Leak Smoke Machine'],
    openingHours: {
      openNow: true,
      display: 'Mon–Sat: 10:00 – 18:30',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // INDIA — MAHARASHTRA (in-maharashtra)
  // ==========================================
  {
    id: 'mh-mumbai-speed-lab',
    name: 'Western Express Motorsport & Dyno',
    address: 'Western Express Highway, Andheri East',
    city: 'Mumbai',
    region: 'Maharashtra',
    regionId: 'in-maharashtra',
    country: 'India',
    countryId: 'india',
    latitude: 19.1136,
    longitude: 72.8697,
    phone: '+91 22 2839 9000',
    website: 'https://example-tuners.in/mumbai-motorsport',
    rating: null,
    reviewCount: null,
    services: [
      'Brake Installation',
      'Suspension Installation',
      'Coilover Installation',
      'ECU Tuning',
      'Performance Tuning',
      'Exhaust Installation',
      'Alignment'
    ],
    specialties: ['Brembo & AP Racing Retrofits', 'Bespoke Map Calibrations', 'KW Suspension Setup'],
    supportedVehicleTypes: ['Sports Car', 'Coupe', 'Sedan', 'SUV'],
    installationCapabilities: ['Maha AWD Dyno', 'Corner Weighting', 'Tungsten Inert Gas Welder'],
    openingHours: {
      openNow: true,
      display: 'Mon–Sat: 10:00 – 20:00',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },
  {
    id: 'mh-pune-automotive-tech',
    name: 'Deccan Chassis & Track Works',
    address: 'MIDC Phase 2, Hinjewadi',
    city: 'Pune',
    region: 'Maharashtra',
    regionId: 'in-maharashtra',
    country: 'India',
    countryId: 'india',
    latitude: 18.5913,
    longitude: 73.7389,
    phone: '+91 20 6670 1234',
    rating: null,
    reviewCount: null,
    services: [
      'Wheel & Tyre Installation',
      'Suspension Installation',
      'Body Kit Installation',
      'Fabrication',
      'Cooling System Work'
    ],
    specialties: ['Track Prepared Civics & Miata', 'High-Capacity Aluminium Radiators'],
    supportedVehicleTypes: ['Coupe', 'Sedan', 'Hatchback', 'Track / Race'],
    installationCapabilities: ['Hydraulic Alignment Bed', 'Custom Tube Notcher'],
    openingHours: {
      openNow: false,
      display: 'Mon–Fri: 09:00 – 18:00',
      statusText: 'CLOSED'
    },
    verificationStatus: 'UNVERIFIED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // USA — CALIFORNIA (us-california)
  // ==========================================
  {
    id: 'us-ca-apex-irvine',
    name: 'Precision Apex Motorworks',
    address: '1420 Motorsport Way',
    city: 'Irvine',
    region: 'California',
    regionId: 'us-california',
    country: 'United States',
    countryId: 'usa',
    latitude: 33.6846,
    longitude: -117.8265,
    phone: '+1 (949) 555-0192',
    website: 'https://example-ca-tuners.com/apex-irvine',
    rating: null,
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Alignment',
      'Brake Installation',
      'Wheel & Tyre Installation',
      'Exhaust Installation'
    ],
    specialties: ['KW & Öhlins 7-Post Setup', 'Track Geometry', 'Forged Monoblock Calipers'],
    supportedVehicleTypes: ['Sports Car', 'Coupe', 'Sedan', 'Track / Race'],
    installationCapabilities: ['Hunter Hawkeye Elite Alignment', 'Corner Balance Scales', 'Rotary In-Ground Lifts'],
    openingHours: {
      openNow: true,
      display: 'Mon–Fri: 08:00 – 17:30',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },
  {
    id: 'us-ca-dyno-concept-torrance',
    name: 'Pacific Coast Dyno Calibration',
    address: '22800 Hawthorne Blvd',
    city: 'Torrance',
    region: 'California',
    regionId: 'us-california',
    country: 'United States',
    countryId: 'usa',
    latitude: 33.8189,
    longitude: -118.3531,
    phone: '+1 (310) 555-0148',
    website: 'https://example-ca-tuners.com/pcd-torrance',
    rating: null,
    reviewCount: null,
    services: [
      'ECU Tuning',
      'Performance Tuning',
      'Intake Installation',
      'Intercooler Installation',
      'Cooling System Work',
      'Exhaust Installation'
    ],
    specialties: ['Dynojet AWD Load-Bearing Tuning', 'E85 Flex Fuel Calibrations', 'CARB-Legal Bolt-Ons'],
    supportedVehicleTypes: ['Sport Compact', 'Coupe', 'Sedan', 'Sports Car'],
    installationCapabilities: ['Dynojet 424xLC2 AWD Dyno', 'Dual Lambda Widebands', 'Knock Detection Headphones'],
    openingHours: {
      openNow: true,
      display: 'Mon–Fri: 09:00 – 18:00',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },
  {
    id: 'us-ca-bay-aero-fremont',
    name: 'Silicon Bay Aero & Composite Lab',
    address: '44200 Warm Springs Blvd',
    city: 'Fremont',
    region: 'California',
    regionId: 'us-california',
    country: 'United States',
    countryId: 'usa',
    latitude: 37.4947,
    longitude: -121.9287,
    phone: '+1 (510) 555-0182',
    rating: null,
    reviewCount: null,
    services: [
      'Body Kit Installation',
      'Spoiler Installation',
      'Fabrication',
      'Wheel & Tyre Installation'
    ],
    specialties: ['Dry Carbon Wings', 'Chassis-Mounted Splitters', 'Wide-Arched Bodycraft'],
    supportedVehicleTypes: ['Sports Car', 'Coupe', 'Sedan'],
    installationCapabilities: ['Autoclave Composite Repair', 'Precision Fastener Rivnut Tooling'],
    openingHours: {
      openNow: false,
      display: 'Mon–Fri: 08:30 – 17:00',
      statusText: 'CLOSED'
    },
    verificationStatus: 'UNVERIFIED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // USA — TEXAS (us-texas)
  // ==========================================
  {
    id: 'us-tx-lonestar-dallas',
    name: 'Lone Star Boost & Performance',
    address: '11500 North Central Expressway',
    city: 'Dallas',
    region: 'Texas',
    regionId: 'us-texas',
    country: 'United States',
    countryId: 'usa',
    latitude: 32.9067,
    longitude: -96.7686,
    phone: '+1 (214) 555-0177',
    website: 'https://example-tx-tuners.com/lonestar',
    rating: null,
    reviewCount: null,
    services: [
      'ECU Tuning',
      'Performance Tuning',
      'Exhaust Installation',
      'Intake Installation',
      'Intercooler Installation',
      'Cooling System Work',
      'Brake Installation'
    ],
    specialties: ['Twin Turbo Systems', 'High-Output Fuel Rails', 'Quarter-Mile Drag Setup'],
    supportedVehicleTypes: ['Sports Car', 'Coupe', 'Sedan', 'SUV'],
    installationCapabilities: ['Mainline 2000HP Hub Dyno', 'Flow Bench', 'Smoke Diagnostic'],
    openingHours: {
      openNow: true,
      display: 'Mon–Sat: 08:00 – 18:00',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },
  {
    id: 'us-tx-austin-chassis-works',
    name: 'Circuit Chassis & Track Support',
    address: '8900 FM 973, Del Valle',
    city: 'Austin',
    region: 'Texas',
    regionId: 'us-texas',
    country: 'United States',
    countryId: 'usa',
    latitude: 30.1328,
    longitude: -97.6411,
    phone: '+1 (512) 555-0129',
    rating: null,
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Alignment',
      'Brake Installation',
      'Wheel & Tyre Installation'
    ],
    specialties: ['COTA Track Day Prep', 'Corner Weight Balancing', 'Brake Ducts & Fluid Flush'],
    supportedVehicleTypes: ['Sports Car', 'Coupe', 'Track / Race'],
    installationCapabilities: ['Hunter Road Force Balancer', 'Longacre Wireless Scales', '4-Post Alignment'],
    openingHours: {
      openNow: true,
      display: 'Mon–Fri: 08:30 – 17:30',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // USA — FLORIDA (us-florida)
  // ==========================================
  {
    id: 'us-fl-miami-speed-lab',
    name: 'South Beach Speed & Stance',
    address: '2200 NW 27th Ave',
    city: 'Miami',
    region: 'Florida',
    regionId: 'us-florida',
    country: 'United States',
    countryId: 'usa',
    latitude: 25.7972,
    longitude: -80.2415,
    phone: '+1 (305) 555-0164',
    website: 'https://example-fl-tuners.com/miami-speed',
    rating: null,
    reviewCount: null,
    services: [
      'Body Kit Installation',
      'Spoiler Installation',
      'Wheel & Tyre Installation',
      'Suspension Installation',
      'Exhaust Installation'
    ],
    specialties: ['Exotic Body Styling', 'Deep Concave Forged Wheels', 'Titanium Valved Exhausts'],
    supportedVehicleTypes: ['Sports Car', 'Coupe', 'Sedan'],
    installationCapabilities: ['Touchless Tire Changer', 'Composite Molding Cleanroom', 'Scissor Lift'],
    openingHours: {
      openNow: true,
      display: 'Mon–Sat: 09:00 – 18:00',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },
  {
    id: 'us-fl-orlando-turbo-tech',
    name: 'Sunshine State Dyno & Turbo',
    address: '4500 S Orange Blossom Trail',
    city: 'Orlando',
    region: 'Florida',
    regionId: 'us-florida',
    country: 'United States',
    countryId: 'usa',
    latitude: 28.4984,
    longitude: -81.3986,
    phone: '+1 (407) 555-0133',
    rating: null,
    reviewCount: null,
    services: [
      'ECU Tuning',
      'Performance Tuning',
      'Intake Installation',
      'Intercooler Installation',
      'Cooling System Work',
      'Brake Installation'
    ],
    specialties: ['High Ambient Heat Cooling Upgrades', 'Auxiliary Radiators', 'Custom Fueling'],
    supportedVehicleTypes: ['Sport Compact', 'Coupe', 'Sedan'],
    installationCapabilities: ['DynoJet 224x', 'MIG/TIG Station', 'Ultra-Sonic Injector Cleaner'],
    openingHours: {
      openNow: false,
      display: 'Mon–Fri: 09:00 – 17:00',
      statusText: 'CLOSED'
    },
    verificationStatus: 'UNVERIFIED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // USA — NEW YORK (us-new-york)
  // ==========================================
  {
    id: 'us-ny-metro-motorsport',
    name: 'Empire Track & Motorsport Engineering',
    address: '3200 Northern Blvd',
    city: 'Long Island City',
    region: 'New York',
    regionId: 'us-new-york',
    country: 'United States',
    countryId: 'usa',
    latitude: 40.7505,
    longitude: -73.9312,
    phone: '+1 (718) 555-0199',
    website: 'https://example-ny-tuners.com/empire',
    rating: null,
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Alignment',
      'Brake Installation',
      'ECU Tuning',
      'Performance Tuning',
      'Exhaust Installation'
    ],
    specialties: ['Pothole-Resilient Coilover Valving', 'High-Speed Brake Calipers', 'Euro ECU Tunes'],
    supportedVehicleTypes: ['Sports Car', 'Coupe', 'Sedan'],
    installationCapabilities: ['Flush-Mounted Alignment Rack', 'Mustang MD-AWD Dyno', 'Tire Pressure Telemetry'],
    openingHours: {
      openNow: true,
      display: 'Mon–Fri: 08:00 – 18:00',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // UK — ENGLAND (gb-england)
  // ==========================================
  {
    id: 'gb-eng-silverstone-race-prep',
    name: 'Silverstone Valley Race Engineering',
    address: 'Unit 7, Silverstone Technology Park',
    city: 'Towcester, Northamptonshire',
    region: 'England',
    regionId: 'gb-england',
    country: 'United Kingdom',
    countryId: 'uk',
    latitude: 52.0733,
    longitude: -1.0145,
    phone: '+44 1327 555021',
    website: 'https://example-uk-tuners.co.uk/silverstone',
    rating: null,
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Alignment',
      'Brake Installation',
      'Wheel & Tyre Installation',
      'Cooling System Work'
    ],
    specialties: ['Motorsport Valley Kinematics', 'Damper Re-valving', 'Endurance Brake Upgrades'],
    supportedVehicleTypes: ['Sports Car', 'Coupe', 'Track / Race', 'Sedan'],
    installationCapabilities: ['7-Post Rig Diagnostics', 'Optical Suspension Jig', 'Electronic Scales'],
    openingHours: {
      openNow: true,
      display: 'Mon–Fri: 08:30 – 17:30',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },
  {
    id: 'gb-eng-midlands-dyno',
    name: 'Midlands Calibration & Turbo Center',
    address: 'Birmingham Rd, Solihull',
    city: 'Birmingham',
    region: 'England',
    regionId: 'gb-england',
    country: 'United Kingdom',
    countryId: 'uk',
    latitude: 52.4128,
    longitude: -1.7782,
    phone: '+44 121 555 0834',
    website: 'https://example-uk-tuners.co.uk/midlands-dyno',
    rating: null,
    reviewCount: null,
    services: [
      'ECU Tuning',
      'Performance Tuning',
      'Exhaust Installation',
      'Intake Installation',
      'Intercooler Installation',
      'Fabrication'
    ],
    specialties: ['MOT-Compliant Sports Cats', 'Custom Downpipes', 'Direct Injection Calibration'],
    supportedVehicleTypes: ['Hatchback', 'Sedan', 'Coupe', 'Sport Compact'],
    installationCapabilities: ['Bapro 4WD Braked Dyno', 'Mandrel Exhaust Expander', 'TIG Welder'],
    openingHours: {
      openNow: true,
      display: 'Mon–Fri: 09:00 – 18:00',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // UK — SCOTLAND (gb-scotland)
  // ==========================================
  {
    id: 'gb-sct-knockhill-performance',
    name: 'Highland Circuit Dynamics',
    address: 'Dunfermline Enterprise Park',
    city: 'Edinburgh / Dunfermline',
    region: 'Scotland',
    regionId: 'gb-scotland',
    country: 'United Kingdom',
    countryId: 'uk',
    latitude: 56.0691,
    longitude: -3.4566,
    phone: '+44 1383 555092',
    rating: null,
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Alignment',
      'Brake Installation',
      'Wheel & Tyre Installation',
      'Exhaust Installation'
    ],
    specialties: ['Cold-Climate Damper Fluids', 'Anti-Corrosion Undercoating', 'Knockhill Setup'],
    supportedVehicleTypes: ['Coupe', 'Sedan', 'Hatchback', 'Sports Car'],
    installationCapabilities: ['Laser Alignment Rack', 'Subframe Centering Jigs', 'Brake Lathe'],
    openingHours: {
      openNow: false,
      display: 'Mon–Fri: 08:30 – 17:00',
      statusText: 'CLOSED'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // UK — WALES (gb-wales)
  // ==========================================
  {
    id: 'gb-wls-anglesey-tuner',
    name: 'Cambrian Motorsport & Chassis',
    address: 'Pinfold Lane, Industrial Park',
    city: 'Cardiff / Bridgend',
    region: 'Wales',
    regionId: 'gb-wales',
    country: 'United Kingdom',
    countryId: 'uk',
    latitude: 51.4816,
    longitude: -3.1791,
    phone: '+44 29 2055 5410',
    rating: null,
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Brake Installation',
      'ECU Tuning',
      'Intake Installation'
    ],
    specialties: ['Rally Tarmac Geometry', 'B-Road Compliance Tuning'],
    supportedVehicleTypes: ['Hatchback', 'Sport Compact', 'Coupe'],
    installationCapabilities: ['2-Post Hydraulic Lifts', 'ECU Calibration Tooling'],
    openingHours: {
      openNow: true,
      display: 'Mon–Fri: 09:00 – 17:30',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'UNVERIFIED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // UK — NORTHERN IRELAND (gb-northern-ireland)
  // ==========================================
  {
    id: 'gb-nir-kirkistown-works',
    name: 'Ulster Race & Road Tuning',
    address: 'Boucher Road Commercial Park',
    city: 'Belfast',
    region: 'Northern Ireland',
    regionId: 'gb-northern-ireland',
    country: 'United Kingdom',
    countryId: 'uk',
    latitude: 54.5824,
    longitude: -5.9612,
    phone: '+44 28 9055 5288',
    rating: null,
    reviewCount: null,
    services: [
      'Brake Installation',
      'Suspension Installation',
      'Alignment',
      'Exhaust Installation',
      'Performance Tuning'
    ],
    specialties: ['Tarmac Circuit Handling', 'Bespoke Braided Brake Lines'],
    supportedVehicleTypes: ['Sedan', 'Coupe', 'Hatchback'],
    installationCapabilities: ['4-Wheel Laser Alignment', 'Hydraulic Brake Bleeder'],
    openingHours: {
      openNow: true,
      display: 'Mon–Fri: 08:30 – 17:00',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // AUSTRALIA — NEW SOUTH WALES (au-nsw)
  // ==========================================
  {
    id: 'au-nsw-sydney-precision',
    name: 'Eastern Creek Motorsport & Dyno',
    address: '18 Motorsport Lane, Eastern Creek',
    city: 'Sydney',
    region: 'New South Wales',
    regionId: 'au-nsw',
    country: 'Australia',
    countryId: 'australia',
    latitude: -33.8055,
    longitude: 150.8712,
    phone: '+61 2 9672 5500',
    website: 'https://example-au-tuners.com.au/eastern-creek',
    rating: null,
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Alignment',
      'Brake Installation',
      'Wheel & Tyre Installation',
      'ECU Tuning',
      'Performance Tuning'
    ],
    specialties: ['WTAC Time Attack Preparation', 'ADR Engineering Compliance', 'Billet Engine Packaging'],
    supportedVehicleTypes: ['Sports Car', 'Coupe', 'Sedan', 'Track / Race'],
    installationCapabilities: ['Mainline AWD Hub Dyno', 'Corner Weighting Hubs', '3D Laser Alignment'],
    openingHours: {
      openNow: true,
      display: 'Mon–Fri: 08:00 – 17:30',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },
  {
    id: 'au-nsw-wollongong-chassis',
    name: 'Illawarra Chassis & Aero Lab',
    address: '42 Princes Highway, Fairy Meadow',
    city: 'Wollongong',
    region: 'New South Wales',
    regionId: 'au-nsw',
    country: 'Australia',
    countryId: 'australia',
    latitude: -34.3941,
    longitude: 150.8924,
    phone: '+61 2 4284 5519',
    rating: null,
    reviewCount: null,
    services: [
      'Body Kit Installation',
      'Spoiler Installation',
      'Exhaust Installation',
      'Fabrication',
      'Wheel & Tyre Installation'
    ],
    specialties: ['Custom Titanium Exhausts', 'Underbody Diffusers', 'ADR Sound Compliance'],
    supportedVehicleTypes: ['Coupe', 'Sedan', 'Sport Compact'],
    installationCapabilities: ['TIG Inverter Welder', 'Hydraulic Post Lift', 'Sheet Metal Brake'],
    openingHours: {
      openNow: false,
      display: 'Mon–Fri: 08:30 – 17:00',
      statusText: 'CLOSED'
    },
    verificationStatus: 'UNVERIFIED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // AUSTRALIA — VICTORIA (au-victoria)
  // ==========================================
  {
    id: 'au-vic-melbourne-motorsport',
    name: 'Sandown Precision Automotive',
    address: '88 Princes Highway, Springvale',
    city: 'Melbourne',
    region: 'Victoria',
    regionId: 'au-victoria',
    country: 'Australia',
    countryId: 'australia',
    latitude: -37.9542,
    longitude: 145.1528,
    phone: '+61 3 9548 5520',
    website: 'https://example-au-tuners.com.au/sandown-auto',
    rating: null,
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Alignment',
      'Brake Installation',
      'ECU Tuning',
      'Performance Tuning',
      'Intake Installation'
    ],
    specialties: ['Sandown Circuit Geometry', 'VASS Certification Inspections', 'Dyno Remapping'],
    supportedVehicleTypes: ['Sports Car', 'Coupe', 'Sedan'],
    installationCapabilities: ['4-Wheel In-Ground Alignment', 'Dyno Dynamics AWD', 'Corner Balance Scales'],
    openingHours: {
      openNow: true,
      display: 'Mon–Fri: 08:00 – 17:30',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // AUSTRALIA — QUEENSLAND (au-queensland)
  // ==========================================
  {
    id: 'au-qld-brisbane-boost',
    name: 'Queensland Turbo & Chassis Works',
    address: '15 Kingston Road, Underwood',
    city: 'Brisbane',
    region: 'Queensland',
    regionId: 'au-queensland',
    country: 'Australia',
    countryId: 'australia',
    latitude: -27.5912,
    longitude: 153.1147,
    phone: '+61 7 3341 5566',
    website: 'https://example-au-tuners.com.au/qld-turbo',
    rating: null,
    reviewCount: null,
    services: [
      'ECU Tuning',
      'Performance Tuning',
      'Intercooler Installation',
      'Cooling System Work',
      'Exhaust Installation',
      'Suspension Installation'
    ],
    specialties: ['High Heat Tropical Intercooling', 'Custom Billet Radiators', 'E85 Calibration'],
    supportedVehicleTypes: ['Sedan', 'Coupe', 'SUV', 'Sports Car'],
    installationCapabilities: ['Mainline AWD Dyno', 'Thermal Imaging Camera', 'TIG Welder'],
    openingHours: {
      openNow: true,
      display: 'Mon–Sat: 08:00 – 17:00',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  },

  // ==========================================
  // AUSTRALIA — WESTERN AUSTRALIA (au-western-australia)
  // ==========================================
  {
    id: 'au-wa-perth-performance',
    name: 'Barbagallo Track & Performance',
    address: '24 Hector Street West, Osborne Park',
    city: 'Perth',
    region: 'Western Australia',
    regionId: 'au-western-australia',
    country: 'Australia',
    countryId: 'australia',
    latitude: -31.8953,
    longitude: 115.8118,
    phone: '+61 8 9445 5580',
    rating: null,
    reviewCount: null,
    services: [
      'Suspension Installation',
      'Coilover Installation',
      'Alignment',
      'Brake Installation',
      'Wheel & Tyre Installation',
      'Exhaust Installation'
    ],
    specialties: ['Wanneroo Raceway Chassis Setup', 'High-Temperature Brake Fluid Bleeds'],
    supportedVehicleTypes: ['Sports Car', 'Coupe', 'Sedan'],
    installationCapabilities: ['Hunter 3D Alignment', 'Corner Weighting Scales', 'Heavy-Duty 2-Post Lifts'],
    openingHours: {
      openNow: true,
      display: 'Mon–Fri: 08:00 – 17:00',
      statusText: 'OPEN NOW'
    },
    verificationStatus: 'SOURCE LISTED',
    source: 'Demo Workshop Directory'
  }
];

export function getWorkshopsByRegion(regionId: string): Workshop[] {
  return WORKSHOPS_DIRECTORY.filter(w => w.regionId.toLowerCase() === regionId.toLowerCase());
}

export function getWorkshopsByCountry(countryId: string): Workshop[] {
  return WORKSHOPS_DIRECTORY.filter(w => w.countryId.toLowerCase() === countryId.toLowerCase());
}
