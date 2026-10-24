export type AspirationType =
  | 'naturally_aspirated'
  | 'turbocharged'
  | 'twin_turbocharged'
  | 'supercharged'
  | 'electric';

export interface EnginePlatform {
  id: string;
  code: string;
  name: string;
  manufacturer: string;
  displacementL: number;
  cylinders: string;
  aspiration: AspirationType;
  factoryHp: number;
  factoryTorqueLbFt: number;
  compressionRatio: number;
  maxStockBoostPsi: number;
  maxSafeStockBoostPsi: number;
  stockFuelLimitHp: number;
  stockRodLimitWtq: number;
  flangeType: string;
  ecuArchitecture: string;
  recommendedFuelOctane: number;
  compatibleVehicleIds: string[];
  description: string;
}

export type TestablePartCategory =
  | 'turbocharger'
  | 'supercharger'
  | 'exhaust'
  | 'intake'
  | 'fuel_system'
  | 'cooling'
  | 'brakes'
  | 'wheels';

export interface TestablePart {
  id: string;
  name: string;
  category: TestablePartCategory;
  brand: string;
  partNumber: string;
  priceUSD: number;
  description: string;
  maxHpSupport: number;
  ratedBoostRangePsi: [number, number]; // [min, max]
  flangeType: string;
  requiredAspiration: AspirationType[];
  incompatibleAspirations: AspirationType[];
  minWheelSizeInches?: number;
  boltPattern?: string;
  recommendedSupportingMods: string[];
  imageUrl?: string;
}

export type FuelBlend = 'pump_91' | 'pump_93' | 'e85_flex' | 'race_100';

export interface SimulationConfig {
  engineId: string;
  partId: string;
  targetBoostPsi: number;
  fuelBlend: FuelBlend;
  hasUpgradedDownpipe: boolean;
  hasUpgradedHpfp: boolean;
  hasUpgradedIntercooler: boolean;
  hasEcuTune: boolean;
  hasForgedInternals: boolean;
  hasClutchUpgrade: boolean;
}

export type CompatibilityStatusLevel =
  | 'fully_compatible'
  | 'compatible_with_mods'
  | 'conditional_verification'
  | 'mechanically_incompatible'
  | 'critical_failure_risk';

export interface DiagnosticCheckItem {
  id: string;
  title: string;
  status: 'passed' | 'warning' | 'failed';
  metric: string;
  detail: string;
}

export interface CompatibilitySimulationResult {
  status: CompatibilityStatusLevel;
  statusBadge: string;
  statusColor: 'green' | 'amber' | 'blue' | 'red' | 'crimson';
  title: string;
  summary: string;
  confidenceScore: number;
  
  // Engineering Telemetry
  telemetry: {
    baselineHp: number;
    projectedHp: number;
    deltaHp: number;
    baselineTorqueLbFt: number;
    projectedTorqueLbFt: number;
    deltaTorqueLbFt: number;
    fuelDutyCyclePct: number;
    exhaustGasTempC: number;
    cylinderPressureBar: number;
    effectiveBoostPsi: number;
    safetyFactor: number;
    spoolRpm: number;
  };

  // Diagnostic Phase Checks
  checks: {
    physicalFitment: DiagnosticCheckItem;
    thermodynamicAspiration: DiagnosticCheckItem;
    fuelDelivery: DiagnosticCheckItem;
    mechanicalInternals: DiagnosticCheckItem;
    thermalManagement: DiagnosticCheckItem;
    drivetrainTorque: DiagnosticCheckItem;
  };

  warnings: string[];
  recommendations: string[];
  requiredMods: string[];
  isTransferableToBuild: boolean;
}

export interface SimulationPreset {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  engineId: string;
  partId: string;
  targetBoostPsi: number;
  fuelBlend: FuelBlend;
  hasUpgradedDownpipe: boolean;
  hasUpgradedHpfp: boolean;
  hasUpgradedIntercooler: boolean;
  hasEcuTune: boolean;
  hasForgedInternals: boolean;
  hasClutchUpgrade: boolean;
}
