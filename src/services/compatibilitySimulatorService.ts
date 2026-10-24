import {
  EnginePlatform,
  TestablePart,
  SimulationConfig,
  CompatibilitySimulationResult,
  SimulationPreset,
  DiagnosticCheckItem
} from '../types/compatibilitySimulator';

export const ENGINE_PLATFORMS: EnginePlatform[] = [
  {
    id: 'eng-bmw-s58',
    code: 'S58B30T0',
    name: 'BMW 3.0L S58 Twin-Turbocharged Inline-6',
    manufacturer: 'BMW M GmbH',
    displacementL: 3.0,
    cylinders: 'Inline-6 (Closed Deck)',
    aspiration: 'twin_turbocharged',
    factoryHp: 523,
    factoryTorqueLbFt: 479,
    compressionRatio: 9.3,
    maxStockBoostPsi: 18.5,
    maxSafeStockBoostPsi: 28.0,
    stockFuelLimitHp: 680,
    stockRodLimitWtq: 720,
    flangeType: 'BMW Twin-Monoscroll Flange',
    ecuArchitecture: 'Bosch MG1CS024 (Encrypted Bench Unlock)',
    recommendedFuelOctane: 93,
    compatibleVehicleIds: ['bmw-m3-competition', 'bmw-m4-competition', 'bmw-m2'],
    description: 'High-revving closed-deck engine with 3D-printed cylinder head core, forged crankshaft, and wire-arc sprayed cylinder liners. Unrivaled tuning ceiling.'
  },
  {
    id: 'eng-toyota-b58',
    code: 'B58B30O1',
    name: 'Toyota / BMW 3.0L B58 Twin-Scroll Turbo Inline-6',
    manufacturer: 'BMW / Toyota GR',
    displacementL: 3.0,
    cylinders: 'Inline-6 (Closed Deck)',
    aspiration: 'turbocharged',
    factoryHp: 382,
    factoryTorqueLbFt: 368,
    compressionRatio: 10.2,
    maxStockBoostPsi: 14.5,
    maxSafeStockBoostPsi: 24.0,
    stockFuelLimitHp: 540,
    stockRodLimitWtq: 580,
    flangeType: 'Twin-Scroll T4 / Integrated Head Flange',
    ecuArchitecture: 'Bosch MG1CS201',
    recommendedFuelOctane: 93,
    compatibleVehicleIds: ['toyota-gr-supra'],
    description: 'Legendary inline-6 workhorse with integrated water-to-air charge cooler and forged internals capable of 600+ HP on pump fuel.'
  },
  {
    id: 'eng-porsche-40-na',
    code: 'MA2.75',
    name: 'Porsche 4.0L Naturally Aspirated Flat-6',
    manufacturer: 'Porsche Motorsport',
    displacementL: 4.0,
    cylinders: 'Horizontally Opposed Boxer-6',
    aspiration: 'naturally_aspirated',
    factoryHp: 518,
    factoryTorqueLbFt: 342,
    compressionRatio: 13.3,
    maxStockBoostPsi: 0,
    maxSafeStockBoostPsi: 0,
    stockFuelLimitHp: 560,
    stockRodLimitWtq: 380,
    flangeType: 'Equal-Length Atmospheric Exhaust Flange',
    ecuArchitecture: 'Bosch SDI21',
    recommendedFuelOctane: 93,
    compatibleVehicleIds: ['porsche-911-gt3-rs', 'porsche-718-gt4-rs'],
    description: 'Motorsport-derived atmospheric engine with rigid valvetrain, individual throttle bodies, titanium connecting rods, and a 9,000 RPM redline.'
  },
  {
    id: 'eng-porsche-taycan-electric',
    code: 'J1-DUAL-EV',
    name: 'Porsche Dual Permanent Magnet Synchronous Motors',
    manufacturer: 'Porsche AG',
    displacementL: 0,
    cylinders: 'None (800V Hairpin Stator EV)',
    aspiration: 'electric',
    factoryHp: 750,
    factoryTorqueLbFt: 774,
    compressionRatio: 0,
    maxStockBoostPsi: 0,
    maxSafeStockBoostPsi: 0,
    stockFuelLimitHp: 0,
    stockRodLimitWtq: 850,
    flangeType: 'Direct Inverter High-Voltage Busbar',
    ecuArchitecture: 'Porsche Powertrain Domain Controller (800V Architecture)',
    recommendedFuelOctane: 0,
    compatibleVehicleIds: ['porsche-taycan-turbo-s'],
    description: 'Dual electric motors running hairpin-wound stators with 2-speed rear axle transmission. No internal combustion components.'
  },
  {
    id: 'eng-nissan-vr38',
    code: 'VR38DETT',
    name: 'Nissan 3.8L Handcrafted Twin-Turbo V6',
    manufacturer: 'Nissan (Takumi Guild)',
    displacementL: 3.8,
    cylinders: '60° V6 (Plasma Sprayed Bores)',
    aspiration: 'twin_turbocharged',
    factoryHp: 600,
    factoryTorqueLbFt: 481,
    compressionRatio: 9.0,
    maxStockBoostPsi: 15.0,
    maxSafeStockBoostPsi: 22.0,
    stockFuelLimitHp: 650,
    stockRodLimitWtq: 620,
    flangeType: 'Nissan IHI Twin Turbo Turbine Flange',
    ecuArchitecture: 'Hitachi Dual Core High-Speed ECU',
    recommendedFuelOctane: 93,
    compatibleVehicleIds: ['nissan-gtr-nismo'],
    description: 'Iconic GT-R heart assembled in clean-room conditions by Takumi master craftsmen. Handles high boost with dual throttle bodies.'
  },
  {
    id: 'eng-nissan-rb26',
    code: 'RB26DETT',
    name: 'Nissan 2.6L Twin-Turbocharged Inline-6',
    manufacturer: 'Nissan Motorsport (NISMO)',
    displacementL: 2.6,
    cylinders: 'Inline-6 (Cast Iron Block)',
    aspiration: 'twin_turbocharged',
    factoryHp: 327,
    factoryTorqueLbFt: 293,
    compressionRatio: 8.5,
    maxStockBoostPsi: 12.0,
    maxSafeStockBoostPsi: 20.0,
    stockFuelLimitHp: 450,
    stockRodLimitWtq: 480,
    flangeType: 'T28 Dual Flange',
    ecuArchitecture: 'Nissan OEM JECS 8-Bit / Standalone Haltech',
    recommendedFuelOctane: 93,
    compatibleVehicleIds: ['nissan-skyline-gtr-r34'],
    description: 'Legendary cast-iron Godzilla block with individual throttle bodies. Ceramic turbine wheels on stock turbos limit factory boost.'
  },
  {
    id: 'eng-honda-k20c1',
    code: 'K20C1',
    name: 'Honda 2.0L VTEC Turbocharged Inline-4',
    manufacturer: 'Honda Motor Co.',
    displacementL: 2.0,
    cylinders: 'Inline-4 (Die-Cast Aluminum)',
    aspiration: 'turbocharged',
    factoryHp: 315,
    factoryTorqueLbFt: 310,
    compressionRatio: 9.8,
    maxStockBoostPsi: 20.0,
    maxSafeStockBoostPsi: 26.0,
    stockFuelLimitHp: 410,
    stockRodLimitWtq: 380,
    flangeType: 'Integrated Cylinder Head Exhaust Port / TD04 Flange',
    ecuArchitecture: 'Keihin / Bosch ECU',
    recommendedFuelOctane: 93,
    compatibleVehicleIds: ['honda-civic-type-r-fl5'],
    description: 'Compact mono-scroll turbocharged 4-cylinder with sodium-filled exhaust valves and internal cooling oil jets.'
  },
  {
    id: 'eng-toyota-fa24',
    code: 'FA24D',
    name: 'Subaru / Toyota 2.4L Atmospheric Boxer-4',
    manufacturer: 'Subaru / Toyota GR',
    displacementL: 2.4,
    cylinders: 'Horizontally Opposed 4 (D-4S Dual Injection)',
    aspiration: 'naturally_aspirated',
    factoryHp: 228,
    factoryTorqueLbFt: 184,
    compressionRatio: 12.5,
    maxStockBoostPsi: 0,
    maxSafeStockBoostPsi: 0,
    stockFuelLimitHp: 280,
    stockRodLimitWtq: 220,
    flangeType: 'Boxer Header Port Flange',
    ecuArchitecture: 'Denso Dual-ECU D-4S',
    recommendedFuelOctane: 93,
    compatibleVehicleIds: ['toyota-gr86'],
    description: 'Naturally aspirated high-compression boxer pairing port and direct injection. Sensitive to forced induction cylinder pressures.'
  },
  {
    id: 'eng-audi-ea825',
    code: 'EA825',
    name: 'Audi Sport 4.0L Bi-Turbo Hot-V V8',
    manufacturer: 'Audi Sport GmbH',
    displacementL: 4.0,
    cylinders: '90° V8 (Hot-V Configuration)',
    aspiration: 'twin_turbocharged',
    factoryHp: 621,
    factoryTorqueLbFt: 627,
    compressionRatio: 9.7,
    maxStockBoostPsi: 22.0,
    maxSafeStockBoostPsi: 30.0,
    stockFuelLimitHp: 780,
    stockRodLimitWtq: 780,
    flangeType: 'Audi Hot-V Integrated Turbine Housing',
    ecuArchitecture: 'Bosch MG1CS008 Dual-ECU',
    recommendedFuelOctane: 93,
    compatibleVehicleIds: ['audi-rs6-avant', 'audi-rsq8'],
    description: 'Hot-V arrangement with twin twin-scroll turbos inside the cylinder bank V for zero spool delay and huge torque reserves.'
  }
];

export const TESTABLE_PARTS: TestablePart[] = [
  // --- TURBOCHARGERS ---
  {
    id: 'part-turbo-pure800',
    name: 'Pure Turbos Pure800 Stage 2 Hybrid Turbocharger',
    category: 'turbocharger',
    brand: 'Pure Turbos',
    partNumber: 'PT-HYBRID-800',
    priceUSD: 4400,
    description: 'Direct-fit hybrid turbocharger with point-milled billet compressor wheel and high-flow Inconel turbine wheel.',
    maxHpSupport: 850,
    ratedBoostRangePsi: [18, 36],
    flangeType: 'OEM Twin-Scroll / Hybrid Factory Housing',
    requiredAspiration: ['turbocharged', 'twin_turbocharged'],
    incompatibleAspirations: ['electric'],
    recommendedSupportingMods: [
      'ECU Stage 2 Flash Tune with Boost Recalibration',
      'High-Flow Cast Downpipes or Catless Race Pipes',
      'Upgraded High-Pressure Fuel Pump (HPFP) for E85',
      'High-Performance Heat Exchanger / Charge Cooler'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'part-turbo-garrett-g30-770',
    name: 'Garrett G-Series G30-770 Dual Ceramic Ball Bearing Turbo',
    category: 'turbocharger',
    brand: 'Garrett Motion',
    partNumber: 'GAR-G30-770-V',
    priceUSD: 3150,
    description: 'Next-gen aerodynamic compressor wheel spinning up to 165,000 RPM on water-cooled dual ceramic ball bearings.',
    maxHpSupport: 770,
    ratedBoostRangePsi: [15, 38],
    flangeType: 'V-Band / T4 Twin-Scroll Inlet',
    requiredAspiration: ['turbocharged', 'twin_turbocharged'],
    incompatibleAspirations: ['electric'],
    recommendedSupportingMods: [
      'Custom T4 or V-Band Turbo Exhaust Manifold',
      'External 44mm or 50mm Wastegate with Dump Tube',
      'Standalone or Unlocked ECU Calibration',
      'Upgraded Injectors and High-Pressure Fuel Pump'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'part-turbo-borgwarner-efr9280',
    name: 'BorgWarner EFR 9280 SuperCore Motorsport Turbo',
    category: 'turbocharger',
    brand: 'BorgWarner',
    partNumber: 'BW-EFR-9280',
    priceUSD: 4100,
    description: 'Gamma-Ti titanium aluminide turbine wheel for instantaneous transient boost response at up to 1100 HP flow rates.',
    maxHpSupport: 1100,
    ratedBoostRangePsi: [20, 42],
    flangeType: 'T4 Twin-Scroll Divided',
    requiredAspiration: ['turbocharged', 'twin_turbocharged'],
    incompatibleAspirations: ['electric'],
    recommendedSupportingMods: [
      'Forged Connecting Rods & Low-Compression Pistons',
      'Dual High-Flow Fuel Pumps & Port Injection Kit',
      'Heavy-Duty Multi-Plate Clutch / Upgraded Transaxle',
      'Full Race 3.5" Titanium Exhaust System'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'part-turbo-hks-gtiii-rs',
    name: 'HKS GTIII-RS Twin Turbine Bolt-On Kit',
    category: 'turbocharger',
    brand: 'HKS Motorsport',
    partNumber: 'HKS-11004-AN015',
    priceUSD: 5600,
    description: 'Pair of precision billet actuator-type turbochargers engineered specifically for multi-cylinder twin-turbo GT platforms.',
    maxHpSupport: 900,
    ratedBoostRangePsi: [14, 30],
    flangeType: 'Twin Bolt-On Turbine Housing',
    requiredAspiration: ['twin_turbocharged'],
    incompatibleAspirations: ['electric', 'naturally_aspirated'],
    recommendedSupportingMods: [
      'Reinforced Actuator Wastegates',
      'Dual Intake Suction Pipes & Intercooler Upgrade',
      '1050cc Fuel Injectors & High-Volume Fuel Rails'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
  },

  // --- SUPERCHARGERS ---
  {
    id: 'part-sc-whipple-30',
    name: 'Whipple 3.0L Gen 5 Twin-Screw Supercharger Kit',
    category: 'supercharger',
    brand: 'Whipple Superchargers',
    partNumber: 'WHP-GEN5-3000',
    priceUSD: 8900,
    description: 'Positive displacement twin-screw supercharger delivering instantaneous boost off-idle for large displacement or NA conversions.',
    maxHpSupport: 950,
    ratedBoostRangePsi: [8, 22],
    flangeType: 'Direct Lower Intake Manifold Runner',
    requiredAspiration: ['naturally_aspirated'],
    incompatibleAspirations: ['electric'],
    recommendedSupportingMods: [
      'Upgraded Crank Pulley & Heavy Duty Serpentine Belt',
      'High-Capacity Dual-Pass Heat Exchanger',
      'Forged Piston Lower Compression Conversion'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
  },

  // --- EXHAUST & POWERTRAIN ---
  {
    id: 'part-exh-akrapovic-ti',
    name: 'Akrapovič Evolution Titanium Valved Exhaust System',
    category: 'exhaust',
    brand: 'Akrapovič',
    partNumber: 'AKR-EVO-TI-99',
    priceUSD: 8650,
    description: 'Full titanium exhaust with integrated electronic acoustic valves and carbon fiber exhaust tips.',
    maxHpSupport: 1200,
    ratedBoostRangePsi: [0, 45],
    flangeType: 'OEM Header / Downpipe Slip-Fit',
    requiredAspiration: ['naturally_aspirated', 'turbocharged', 'twin_turbocharged', 'supercharged'],
    incompatibleAspirations: ['electric'],
    recommendedSupportingMods: [
      'High-Flow Catalytic Converters or Test Pipes'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'part-int-eventuri-cf',
    name: 'Eventuri Sealed Carbon Fiber Cold Air Intake',
    category: 'intake',
    brand: 'Eventuri',
    partNumber: 'EVE-CF-INT-V2',
    priceUSD: 2950,
    description: 'Reverse mounted cone filter inside an aerodynamic pre-preg carbon fiber venturi housing.',
    maxHpSupport: 900,
    ratedBoostRangePsi: [0, 40],
    flangeType: 'OEM MAF / Turbo Inlet Duct',
    requiredAspiration: ['naturally_aspirated', 'turbocharged', 'twin_turbocharged', 'supercharged'],
    incompatibleAspirations: ['electric'],
    recommendedSupportingMods: [
      'ECU MAF Flow Scaling Calibration'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'part-fuel-dorch-hpfp',
    name: 'Dorch Engineering Stage 2 High-Pressure Fuel Pump',
    category: 'fuel_system',
    brand: 'Dorch Engineering',
    partNumber: 'DORCH-HPFP-STG2',
    priceUSD: 1650,
    description: 'Enables safe continuous fuel rail pressure (up to 250 bar) on high-ethanol E85 blends without fuel pressure drop.',
    maxHpSupport: 750,
    ratedBoostRangePsi: [15, 36],
    flangeType: 'Cam-Driven Mechanical Pump Flange',
    requiredAspiration: ['turbocharged', 'twin_turbocharged'],
    incompatibleAspirations: ['electric'],
    recommendedSupportingMods: [
      'Ethanol Content Sensor (FlexFuel Kit)',
      'Low-Pressure Fuel Pump (LPFP) in-tank upgrade'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
  },

  // --- BRAKES & WHEELS (FITMENT TESTING) ---
  {
    id: 'part-brk-carbon-ceramic-410',
    name: 'Surface Transforms 410mm Carbon Ceramic Brake Kit',
    category: 'brakes',
    brand: 'Surface Transforms',
    partNumber: 'ST-CCM-410',
    priceUSD: 14200,
    description: 'Continuous 3D woven carbon fiber ceramic matrix discs paired with forged monobloc calipers.',
    maxHpSupport: 1500,
    ratedBoostRangePsi: [0, 0],
    flangeType: 'Axle Hub Upright',
    requiredAspiration: ['naturally_aspirated', 'turbocharged', 'twin_turbocharged', 'supercharged', 'electric'],
    incompatibleAspirations: [],
    minWheelSizeInches: 20,
    recommendedSupportingMods: [
      'High-Temperature Motul RBF660 Brake Fluid',
      'Minimum 20-inch Wheel Clearance Diameter'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'part-whl-bbs-fir-cl',
    name: 'BBS FI-R Forged Center-Lock Monoblock Wheels',
    category: 'wheels',
    brand: 'BBS Motorsport',
    partNumber: 'FIR-CL-2021',
    priceUSD: 11400,
    description: 'Forged aerospace aluminum wheels with relief cutouts directly inside the wheel spokes.',
    maxHpSupport: 1500,
    ratedBoostRangePsi: [0, 0],
    flangeType: 'Centerlock Spline Hub',
    requiredAspiration: ['naturally_aspirated', 'turbocharged', 'twin_turbocharged', 'supercharged', 'electric'],
    incompatibleAspirations: [],
    boltPattern: 'Centerlock',
    recommendedSupportingMods: [
      'Factory Centerlock Hub Assembly or Certified Spline Adapter',
      '3/4" Precision Torque Wrench (600 Nm Rated)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80'
  }
];

export const PRESET_SIMULATION_SCENARIOS: SimulationPreset[] = [
  {
    id: 'preset-s58-pure800',
    title: 'BMW S58 + Pure800 Hybrid Turbo',
    subtitle: 'High-Demand Track & Drag Setup',
    badge: 'Popular Simulation',
    badgeColor: 'blue',
    engineId: 'eng-bmw-s58',
    partId: 'part-turbo-pure800',
    targetBoostPsi: 28,
    fuelBlend: 'e85_flex',
    hasUpgradedDownpipe: true,
    hasUpgradedHpfp: true,
    hasUpgradedIntercooler: true,
    hasEcuTune: true,
    hasForgedInternals: false,
    hasClutchUpgrade: true
  },
  {
    id: 'preset-porsche-na-pure800',
    title: 'Porsche GT3 RS (4.0L NA) + Pure800 Turbo',
    subtitle: 'Extreme Architecture Mismatch Check',
    badge: 'Incompatible Warning',
    badgeColor: 'red',
    engineId: 'eng-porsche-40-na',
    partId: 'part-turbo-pure800',
    targetBoostPsi: 15,
    fuelBlend: 'pump_93',
    hasUpgradedDownpipe: false,
    hasUpgradedHpfp: false,
    hasUpgradedIntercooler: false,
    hasEcuTune: false,
    hasForgedInternals: false,
    hasClutchUpgrade: false
  },
  {
    id: 'preset-b58-garrett',
    title: 'Toyota GR Supra (B58) + Garrett G30-770',
    subtitle: '700+ WHP Highway Weapon Build',
    badge: 'Supported With Mods',
    badgeColor: 'amber',
    engineId: 'eng-toyota-b58',
    partId: 'part-turbo-garrett-g30-770',
    targetBoostPsi: 26,
    fuelBlend: 'e85_flex',
    hasUpgradedDownpipe: true,
    hasUpgradedHpfp: true,
    hasUpgradedIntercooler: true,
    hasEcuTune: true,
    hasForgedInternals: false,
    hasClutchUpgrade: false
  },
  {
    id: 'preset-taycan-pure800',
    title: 'Porsche Taycan (Electric) + Pure800 Turbo',
    subtitle: 'Physical & Thermodynamic Impossibility',
    badge: 'Fatal Conflict',
    badgeColor: 'crimson',
    engineId: 'eng-porsche-taycan-electric',
    partId: 'part-turbo-pure800',
    targetBoostPsi: 18,
    fuelBlend: 'pump_93',
    hasUpgradedDownpipe: false,
    hasUpgradedHpfp: false,
    hasUpgradedIntercooler: false,
    hasEcuTune: false,
    hasForgedInternals: false,
    hasClutchUpgrade: false
  },
  {
    id: 'preset-vr38-hks-twins',
    title: 'Nissan GT-R VR38 + HKS GTIII-RS Twin Turbos',
    subtitle: 'Direct Bolt-On Supercar Slayer',
    badge: 'Verified Compatible',
    badgeColor: 'green',
    engineId: 'eng-nissan-vr38',
    partId: 'part-turbo-hks-gtiii-rs',
    targetBoostPsi: 21,
    fuelBlend: 'pump_93',
    hasUpgradedDownpipe: true,
    hasUpgradedHpfp: true,
    hasUpgradedIntercooler: true,
    hasEcuTune: true,
    hasForgedInternals: false,
    hasClutchUpgrade: true
  },
  {
    id: 'preset-fa24-supercharger',
    title: 'Toyota GR86 (FA24) + Whipple 3.0L Supercharger',
    subtitle: 'High-Compression Positive Displacement Check',
    badge: 'Requires Decompression',
    badgeColor: 'amber',
    engineId: 'eng-toyota-fa24',
    partId: 'part-sc-whipple-30',
    targetBoostPsi: 9,
    fuelBlend: 'pump_93',
    hasUpgradedDownpipe: true,
    hasUpgradedHpfp: false,
    hasUpgradedIntercooler: true,
    hasEcuTune: true,
    hasForgedInternals: false,
    hasClutchUpgrade: false
  }
];

export class CompatibilitySimulatorService {
  public static getEngines(): EnginePlatform[] {
    return ENGINE_PLATFORMS;
  }

  public static getParts(): TestablePart[] {
    return TESTABLE_PARTS;
  }

  public static getPresets(): SimulationPreset[] {
    return PRESET_SIMULATION_SCENARIOS;
  }

  public static getEngineById(id: string): EnginePlatform | undefined {
    return ENGINE_PLATFORMS.find(e => e.id === id);
  }

  public static getPartById(id: string): TestablePart | undefined {
    return TESTABLE_PARTS.find(p => p.id === id);
  }

  /**
   * Primary Telemetry Simulation Engine:
   * Computes multi-physics compatibility between engine architecture and component
   */
  public static simulate(config: SimulationConfig): CompatibilitySimulationResult {
    const engine = this.getEngineById(config.engineId) || ENGINE_PLATFORMS[0];
    const part = this.getPartById(config.partId) || TESTABLE_PARTS[0];

    const warnings: string[] = [];
    const recommendations: string[] = [];
    const requiredMods: string[] = [];

    // ==========================================
    // 1. FATAL ARCHITECTURAL CHECK: ELECTRIC VS COMBUSTION
    // ==========================================
    if (engine.aspiration === 'electric') {
      const isCombustionPart = ['turbocharger', 'supercharger', 'exhaust', 'intake', 'fuel_system'].includes(part.category);
      if (isCombustionPart) {
        return {
          status: 'critical_failure_risk',
          statusBadge: 'FATAL CONFLICT: ELECTRIC POWERTRAIN',
          statusColor: 'crimson',
          title: `Severe Conflict: ${part.name} on ${engine.name}`,
          summary: `Electric powertrains have zero combustion chambers, exhaust manifolds, or air intake tracts. ${part.name} cannot mechanically interface with an 800V electric stator.`,
          confidenceScore: 99,
          telemetry: {
            baselineHp: engine.factoryHp,
            projectedHp: engine.factoryHp,
            deltaHp: 0,
            baselineTorqueLbFt: engine.factoryTorqueLbFt,
            projectedTorqueLbFt: engine.factoryTorqueLbFt,
            deltaTorqueLbFt: 0,
            fuelDutyCyclePct: 0,
            exhaustGasTempC: 22,
            cylinderPressureBar: 0,
            effectiveBoostPsi: 0,
            safetyFactor: 0,
            spoolRpm: 0
          },
          checks: {
            physicalFitment: {
              id: 'c1',
              title: 'Physical Flange Fitment',
              status: 'failed',
              metric: 'No Mounting Bosses',
              detail: 'No turbo flange, downpipe, or intake ducting exists on an electric drive unit.'
            },
            thermodynamicAspiration: {
              id: 'c2',
              title: 'Thermodynamic Expansion Cycle',
              status: 'failed',
              metric: '0.00 CFM Exhaust Gas',
              detail: 'Turbochargers require hot expanding exhaust gas to spool the turbine. Electric motors produce zero exhaust gas.'
            },
            fuelDelivery: {
              id: 'c3',
              title: 'Fuel Delivery & Flow Headroom',
              status: 'failed',
              metric: 'No Hydrocarbon Fuel System',
              detail: 'Vehicle is powered exclusively by high-voltage lithium battery pack.'
            },
            mechanicalInternals: {
              id: 'c4',
              title: 'Mechanical Yield & Cylinder Pressure',
              status: 'failed',
              metric: 'Zero Cylinders',
              detail: 'No pistons, rods, or cylinder heads exist in this powertrain.'
            },
            thermalManagement: {
              id: 'c5',
              title: 'Thermal Dissipation & EGT',
              status: 'passed',
              metric: 'Cooling Loop Normal',
              detail: 'Inverter cooling circuit unaffected.'
            },
            drivetrainTorque: {
              id: 'c6',
              title: 'Drivetrain Torque Limit',
              status: 'passed',
              metric: `${engine.factoryTorqueLbFt} lb-ft Direct`,
              detail: 'Factory transaxle operates within OEM parameters.'
            }
          },
          warnings: ['Attempting to install forced induction onto an electric powertrain will result in zero physical attachment points and complete system invalidity.'],
          recommendations: ['For electric vehicles, focus upgrades on suspension coilovers, aero downforce, lightweight forged wheels, and high-temp ceramic brake compounds.'],
          requiredMods: ['Must select a gasoline internal combustion engine (ICE) platform.'],
          isTransferableToBuild: false
        };
      }
    }

    // ==========================================
    // 2. FORCED INDUCTION ON NATURALLY ASPIRATED HIGH-COMPRESSION CHECK
    // ==========================================
    const isTurboOrSC = part.category === 'turbocharger' || part.category === 'supercharger';
    const isHighCompressionNA = engine.aspiration === 'naturally_aspirated' && engine.compressionRatio >= 12.0;

    if (isTurboOrSC && isHighCompressionNA && !config.hasForgedInternals) {
      warnings.push(`Engine features extreme factory static compression of ${engine.compressionRatio}:1. Applying forced induction without forged low-compression pistons (9.5:1) risks instantaneous high-RPM detonation, pre-ignition knock, and bent connecting rods.`);
      requiredMods.push('Low-Compression Forged Pistons (Drop from 13.3:1 down to 9.5:1)');
      requiredMods.push('Custom Turbo Exhaust Manifold & Downpipe Plumbing');
      requiredMods.push('Standalone Engine Management with Closed-Loop Knock Detection');
      requiredMods.push('Upgraded Fuel Injectors & High-Flow Fuel Pump');
    }

    // ==========================================
    // 3. BOOST PRESSURE & MECHANICAL CALCULATION
    // ==========================================
    const targetBoost = isTurboOrSC ? config.targetBoostPsi : 0;
    
    // Octane Multiplier
    let octaneMultiplier = 1.0;
    if (config.fuelBlend === 'pump_91') octaneMultiplier = 0.90;
    if (config.fuelBlend === 'pump_93') octaneMultiplier = 1.0;
    if (config.fuelBlend === 'race_100') octaneMultiplier = 1.08;
    if (config.fuelBlend === 'e85_flex') octaneMultiplier = 1.18;

    // Power Gain Calculation
    let projectedHp = engine.factoryHp;
    let projectedTorque = engine.factoryTorqueLbFt;
    let spoolRpm = 2400;

    if (part.category === 'turbocharger') {
      const boostDelta = Math.max(0, targetBoost - engine.maxStockBoostPsi);
      const hpPerPsi = engine.displacementL * 14.5;
      const rawGain = (boostDelta * hpPerPsi + 75) * octaneMultiplier;
      
      // Hardware bottlenecks
      let tuningEfficiency = 0.50; // if no tune
      if (config.hasEcuTune) tuningEfficiency += 0.35;
      if (config.hasUpgradedDownpipe) tuningEfficiency += 0.08;
      if (config.hasUpgradedIntercooler) tuningEfficiency += 0.07;

      const effectiveGain = Math.min(part.maxHpSupport - engine.factoryHp, rawGain * tuningEfficiency);
      projectedHp = Math.round(engine.factoryHp + effectiveGain);
      projectedTorque = Math.round(engine.factoryTorqueLbFt + (effectiveGain * 0.92));
      spoolRpm = part.id.includes('pure800') ? 2950 : part.id.includes('garrett') ? 3400 : 3800;
    } else if (part.category === 'supercharger') {
      const rawGain = (targetBoost * 22 + 90) * octaneMultiplier;
      projectedHp = Math.round(engine.factoryHp + rawGain);
      projectedTorque = Math.round(engine.factoryTorqueLbFt + (rawGain * 1.05));
      spoolRpm = 1200; // Instant boost
    } else if (part.category === 'exhaust') {
      projectedHp = Math.round(engine.factoryHp + 18);
      projectedTorque = Math.round(engine.factoryTorqueLbFt + 22);
    } else if (part.category === 'intake') {
      projectedHp = Math.round(engine.factoryHp + 24);
      projectedTorque = Math.round(engine.factoryTorqueLbFt + 18);
    } else if (part.category === 'fuel_system') {
      projectedHp = Math.round(engine.factoryHp + (config.hasEcuTune ? 35 : 0));
      projectedTorque = Math.round(engine.factoryTorqueLbFt + (config.hasEcuTune ? 40 : 0));
    }

    const deltaHp = projectedHp - engine.factoryHp;
    const deltaTorque = projectedTorque - engine.factoryTorqueLbFt;

    // Fuel Duty Cycle calculation
    const baseFuelFlowRequired = (projectedHp * 5.8) / (config.fuelBlend === 'e85_flex' ? 0.72 : 1.0);
    const availableFuelFlow = engine.stockFuelLimitHp * 5.8 * (config.hasUpgradedHpfp ? 1.45 : 1.0);
    let fuelDutyCycle = Math.round((baseFuelFlowRequired / availableFuelFlow) * 75);
    fuelDutyCycle = Math.min(130, Math.max(45, fuelDutyCycle));

    // Exhaust Gas Temp (EGT) calculation
    let egt = 760;
    if (targetBoost > 20) egt += (targetBoost - 20) * 12;
    if (!config.hasUpgradedDownpipe && isTurboOrSC) egt += 55;
    if (!config.hasUpgradedIntercooler && isTurboOrSC) egt += 40;
    if (config.fuelBlend === 'e85_flex') egt -= 65; // Ethanol cooling effect
    if (fuelDutyCycle > 95) egt += 75; // Lean condition causes high heat
    egt = Math.round(Math.min(1080, Math.max(680, egt)));

    // Cylinder pressure & safety factor
    const peakCylinderPressure = Math.round(110 + (targetBoost * 3.8) * (engine.compressionRatio / 10.0));
    const rodYieldThreshold = (engine.stockRodLimitWtq * 1.35);
    const currentTorqueLoad = projectedTorque * (config.hasForgedInternals ? 0.65 : 1.0);
    const safetyFactor = Math.round((rodYieldThreshold / Math.max(1, currentTorqueLoad)) * 100) / 100;

    // ==========================================
    // 4. DIAGNOSTIC CHECKS FORMULATION
    // ==========================================
    let physicalFitmentStatus: 'passed' | 'warning' | 'failed' = 'passed';
    let physicalMetric = 'Bolt-on Compatible';
    let physicalDetail = `Flange matched to ${engine.flangeType}.`;

    if (part.category === 'turbocharger') {
      if (engine.aspiration === 'naturally_aspirated') {
        physicalFitmentStatus = 'failed';
        physicalMetric = 'Custom Manifold Required';
        physicalDetail = `Atmospheric header ports on ${engine.name} do not feature factory turbine mounting studs. Custom turbo manifold fabrication required.`;
      } else if (part.flangeType.includes('OEM') || part.flangeType.includes(engine.flangeType)) {
        physicalFitmentStatus = 'passed';
        physicalMetric = 'Direct Factory Flange Bolt-On';
        physicalDetail = `Replaces factory turbocharger directly into OEM oil/coolant lines and manifold studs.`;
      } else {
        physicalFitmentStatus = 'warning';
        physicalMetric = 'Flange Adapter or T4 Manifold Needed';
        physicalDetail = `Part uses ${part.flangeType} which differs slightly from ${engine.flangeType}. Requires aftermarket inlet adapter.`;
      }
    } else if (part.category === 'wheels') {
      if (part.boltPattern === 'Centerlock') {
        const isPorscheCenterlock = engine.compatibleVehicleIds.some(v => v.includes('gt3') || v.includes('gt4'));
        if (isPorscheCenterlock) {
          physicalFitmentStatus = 'passed';
          physicalMetric = 'OEM Center-Lock Spline Fit';
          physicalDetail = 'Matches Porsche Motorsport factory center-lock hub mechanism.';
        } else {
          physicalFitmentStatus = 'failed';
          physicalMetric = '5-Lug Hub Incompatibility';
          physicalDetail = 'Chassis uses traditional 5-lug PCD studs. Center-lock wheels cannot mount without certified center-lock hub conversion kit.';
          warnings.push('Wheel mounting geometry mismatch: Center-lock spline wheels require hub conversion.');
        }
      }
    }

    // Thermodynamic Aspiration check
    let thermoStatus: 'passed' | 'warning' | 'failed' = 'passed';
    let thermoMetric = 'Volumetric Match Balanced';
    let thermoDetail = `Engine displacement of ${engine.displacementL}L matches compressor flow map.`;

    if (isTurboOrSC && engine.aspiration === 'naturally_aspirated' && !config.hasForgedInternals) {
      thermoStatus = 'failed';
      thermoMetric = `Static Compression ${engine.compressionRatio}:1 Too High`;
      thermoDetail = `At ${targetBoost} PSI, effective dynamic compression ratio exceeds 24.5:1. Severe risk of violent pre-ignition knock.`;
    } else if (targetBoost > engine.maxSafeStockBoostPsi && !config.hasForgedInternals) {
      thermoStatus = 'warning';
      thermoMetric = `${targetBoost} PSI Exceeds OEM Internals Ceiling (${engine.maxSafeStockBoostPsi} PSI)`;
      thermoDetail = `Sustained high boost will strain stock head bolts and fire-ring gaskets.`;
      warnings.push(`Target boost of ${targetBoost} PSI exceeds factory safe margin of ${engine.maxSafeStockBoostPsi} PSI. ARP head studs recommended.`);
    }

    // Fuel Delivery check
    let fuelStatus: 'passed' | 'warning' | 'failed' = 'passed';
    let fuelMetric = `${fuelDutyCycle}% Injector Duty Cycle`;
    let fuelDetail = 'Fuel rail pressure remains stable within safety margins.';

    if (fuelDutyCycle > 100) {
      fuelStatus = 'failed';
      fuelMetric = `${fuelDutyCycle}% (Severe Fuel Starvation / Lean Condition)`;
      fuelDetail = `Stock fuel pump flow cannot satisfy ${projectedHp} HP on ${config.fuelBlend.replace('_', ' ').toUpperCase()}. High risk of cylinder lean-out melting pistons.`;
      warnings.push('CRITICAL: Fuel system capacity exceeded! Install upgraded High-Pressure Fuel Pump (HPFP) immediately.');
      requiredMods.push('High-Pressure Fuel Pump (HPFP) Upgrade (e.g., Dorch Stage 2 or Spool FX-180)');
    } else if (fuelDutyCycle > 85) {
      fuelStatus = 'warning';
      fuelMetric = `${fuelDutyCycle}% Duty Cycle (Marginal Headroom)`;
      fuelDetail = 'Injectors operating close to maximum open time. Upgraded HPFP recommended for hot ambient conditions.';
      if (!config.hasUpgradedHpfp) {
        recommendations.push('Add an upgraded High-Pressure Fuel Pump to lower injector duty cycle below 75%.');
      }
    }

    // Mechanical Internals check
    let mechStatus: 'passed' | 'warning' | 'failed' = 'passed';
    let mechMetric = `${safetyFactor}x Structural Margin`;
    let mechDetail = 'Connecting rods, wrist pins, and ring lands operate within tensile yield limits.';

    if (safetyFactor < 0.95 && !config.hasForgedInternals) {
      mechStatus = 'failed';
      mechMetric = `${safetyFactor}x (Imminent Rod Bending / Piston Cracking)`;
      mechDetail = `Torque of ${projectedTorque} lb-ft exceeds stock connecting rod tensile threshold (${engine.stockRodLimitWtq} lb-ft).`;
      warnings.push(`Extreme cylinder pressure: Torque load exceeds factory rod limit. Forged H-Beam rods required.`);
      requiredMods.push('Forged H-Beam Connecting Rods (Rated to 900+ lb-ft)');
      requiredMods.push('Forged 2618 Alloy Pistons');
    } else if (safetyFactor < 1.15 && !config.hasForgedInternals) {
      mechStatus = 'warning';
      mechMetric = `${safetyFactor}x (Reduced Longevity Margin)`;
      mechDetail = 'Internals under heavy thermal and mechanical stress. Avoid sustained high-gear drag pulls in 6th/7th gear.';
    }

    // Thermal Management check
    let thermalStatus: 'passed' | 'warning' | 'failed' = 'passed';
    let thermalMetric = `${egt}°C Exhaust Gas Temp`;
    let thermalDetail = 'Heat rejection remains below turbine housing thermal fatigue limit (<920°C).';

    if (egt > 960) {
      thermalStatus = 'failed';
      thermalMetric = `${egt}°C (Critical Thermal Overrun)`;
      thermalDetail = 'Exhaust gas temperatures will warp turbine housings and degrade valve seats.';
      warnings.push(`Extreme EGT of ${egt}°C: High-flow downpipes and upgraded charge cooler required to shed heat.`);
      requiredMods.push('High-Flow Catless/Sport-Cat Downpipes');
      requiredMods.push('Upgraded Dual-Core Charge Air Cooler / Intercooler');
    } else if (egt > 890) {
      thermalStatus = 'warning';
      thermalMetric = `${egt}°C (Elevated Heat Soak)`;
      thermalDetail = 'Sustained track sessions will cause heat-soak timing retard. Upgraded heat exchanger recommended.';
      if (!config.hasUpgradedIntercooler) {
        recommendations.push('Install upgraded heat exchanger to reduce intake charge air temps by up to 15°C.');
      }
    }

    // Drivetrain & Clutch check
    let driveStatus: 'passed' | 'warning' | 'failed' = 'passed';
    let driveMetric = 'Torque Within Clutches Limit';
    let driveDetail = 'Transmission clutches hold torque without clutch slip.';

    if (projectedTorque > 620 && !config.hasClutchUpgrade) {
      driveStatus = 'warning';
      driveMetric = `${projectedTorque} lb-ft Exceeds Stock Clutch Clamping Force`;
      driveDetail = 'Factory dual-clutch / manual clutch disc may slip under maximum torque spike at 3,500 RPM.';
      recommendations.push('Recalibrate transmission TCU clutch line clamping pressure or install upgraded dual-clutch basket.');
    }

    // Required mods additions
    if (isTurboOrSC && !config.hasEcuTune) {
      requiredMods.push('ECU Calibration / Custom Dyno Remap with Boost Control');
    }
    if (isTurboOrSC && !config.hasUpgradedDownpipe) {
      recommendations.push('High-flow downpipe reduces exhaust backpressure and drops turbo spool threshold by 350 RPM.');
    }

    // ==========================================
    // 5. OVERALL STATUS DETERMINATION
    // ==========================================
    let overallStatus: CompatibilitySimulationResult['status'] = 'fully_compatible';
    let statusBadge = 'VERIFIED COMPATIBLE: DIRECT BOLT-ON';
    let statusColor: CompatibilitySimulationResult['statusColor'] = 'green';
    let title = `${part.name} is Compatible with ${engine.name}`;
    let summary = `All diagnostic checks passed. The chosen component operates safely within the mechanical, thermal, and fuel delivery limits of this engine platform.`;

    if (physicalFitmentStatus === 'failed' || thermoStatus === 'failed') {
      if (engine.aspiration === 'naturally_aspirated' && isTurboOrSC) {
        overallStatus = 'mechanically_incompatible';
        statusBadge = 'INCOMPATIBLE: NA COMPRESSION & MANIFOLD CONFLICT';
        statusColor = 'red';
        title = `Severe Architecture Conflict: Turbo on High-Compression NA`;
        summary = `${engine.name} possesses 13.3:1 static compression and equal-length atmospheric headers. Direct turbo installation without major internal decompression will result in catastrophic pre-ignition.`;
      } else {
        overallStatus = 'mechanically_incompatible';
        statusBadge = 'PHYSICAL / MECHANICAL FITMENT CONFLICT';
        statusColor = 'red';
        title = `Fitment Incompatibility Detected`;
        summary = `The selected part cannot physically or mechanically mount onto this platform without custom fabrication and hub conversion.`;
      }
    } else if (fuelStatus === 'failed' || mechStatus === 'failed' || thermalStatus === 'failed') {
      overallStatus = 'critical_failure_risk';
      statusBadge = 'CRITICAL FAILURE RISK: ENGINE DAMAGE HAZARD';
      statusColor = 'crimson';
      title = `Hardware Overload Hazard: Internal Limits Exceeded`;
      summary = `While physical mounting may be possible, operating at this target boost level will breach fuel injector flow limits, connecting rod tensile yield strength, or thermal limits.`;
    } else if (requiredMods.length > 0 || warnings.length > 0) {
      overallStatus = 'compatible_with_mods';
      statusBadge = 'COMPATIBLE WITH SUPPORTING MODS REQUIRED';
      statusColor = 'amber';
      title = `Compatible: Supporting Hardware Required`;
      summary = `${part.name} operates successfully on the ${engine.code} platform provided supporting ECU calibration, fueling, and downpipes are addressed.`;
    }

    const confidenceScore = overallStatus === 'fully_compatible' ? 98 : overallStatus === 'compatible_with_mods' ? 95 : 92;

    return {
      status: overallStatus,
      statusBadge,
      statusColor,
      title,
      summary,
      confidenceScore,
      telemetry: {
        baselineHp: engine.factoryHp,
        projectedHp,
        deltaHp,
        baselineTorqueLbFt: engine.factoryTorqueLbFt,
        projectedTorqueLbFt: projectedTorque,
        deltaTorqueLbFt: deltaTorque,
        fuelDutyCyclePct: fuelDutyCycle,
        exhaustGasTempC: egt,
        cylinderPressureBar: peakCylinderPressure,
        effectiveBoostPsi: targetBoost,
        safetyFactor,
        spoolRpm
      },
      checks: {
        physicalFitment: {
          id: 'c1',
          title: 'Physical Flange & Clearance',
          status: physicalFitmentStatus,
          metric: physicalMetric,
          detail: physicalDetail
        },
        thermodynamicAspiration: {
          id: 'c2',
          title: 'Thermodynamics & Compression',
          status: thermoStatus,
          metric: thermoMetric,
          detail: thermoDetail
        },
        fuelDelivery: {
          id: 'c3',
          title: 'Fuel Delivery & Flow Headroom',
          status: fuelStatus,
          metric: fuelMetric,
          detail: fuelDetail
        },
        mechanicalInternals: {
          id: 'c4',
          title: 'Connecting Rods & Cylinder Pressure',
          status: mechStatus,
          metric: mechMetric,
          detail: mechDetail
        },
        thermalManagement: {
          id: 'c5',
          title: 'Exhaust Heat & EGT Dissipation',
          status: thermalStatus,
          metric: thermalMetric,
          detail: thermalDetail
        },
        drivetrainTorque: {
          id: 'c6',
          title: 'Transmission & Clutch Capacity',
          status: driveStatus,
          metric: driveMetric,
          detail: driveDetail
        }
      },
      warnings,
      recommendations,
      requiredMods,
      isTransferableToBuild: overallStatus === 'fully_compatible' || overallStatus === 'compatible_with_mods'
    };
  }
}
