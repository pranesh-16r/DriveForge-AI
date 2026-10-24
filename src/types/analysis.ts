import { Vehicle } from './index';
import { BuildComponent } from './build';
import { ExtendedModificationComponent } from './modification';

export type ConfidenceLevel = 
  | 'KNOWN DATA' 
  | 'ESTIMATED' 
  | 'ASSUMPTION' 
  | 'USER INPUT' 
  | 'VERIFICATION REQUIRED';

export interface PowerAnalysis {
  stockHp: number;
  estimatedGainMinHp: number;
  estimatedGainMaxHp: number;
  projectedMinHp: number;
  projectedMaxHp: number;
  percentageGainMin: number;
  percentageGainMax: number;
  confidence: ConfidenceLevel;
  source: string;
  overlapNotice?: string;
  contributors: {
    componentId: string;
    name: string;
    brand: string;
    minHp: number;
    maxHp: number;
    confidence: ConfidenceLevel;
    note?: string;
  }[];
}

export interface TorqueAnalysis {
  stockLbFt: number;
  stockNm: number;
  estimatedGainMinNm: number;
  estimatedGainMaxNm: number;
  projectedMinNm: number;
  projectedMaxNm: number;
  percentageGainMin: number;
  percentageGainMax: number;
  confidence: ConfidenceLevel;
  source: string;
  contributors: {
    componentId: string;
    name: string;
    brand: string;
    minNm: number;
    maxNm: number;
    confidence: ConfidenceLevel;
  }[];
  beginnerExplanation: string;
  enthusiastExplanation: string;
}

export interface WeightAnalysis {
  stockKg: number;
  deltaKg: number;
  projectedKg: number;
  confidence: ConfidenceLevel;
  source: string;
  sprungDeltaKg: number;
  unsprungDeltaKg: number;
  contributors: {
    componentId: string;
    name: string;
    deltaKg: number;
    type: 'sprung' | 'unsprung';
    confidence: ConfidenceLevel;
  }[];
  explanation: string;
}

export interface AccelerationAnalysis {
  available: boolean;
  stockZeroTo100Seconds?: number;
  projectedZeroTo100MinSeconds?: number;
  projectedZeroTo100MaxSeconds?: number;
  deltaSecondsMin?: number;
  deltaSecondsMax?: number;
  confidence: ConfidenceLevel;
  source: string;
  disclaimer: string;
}

export interface HandlingAnalysis {
  overallRating: 'improved' | 'neutral' | 'reduced' | 'unknown';
  rideComfort: 'improved' | 'neutral' | 'reduced' | 'unknown';
  corneringStability: 'improved' | 'neutral' | 'reduced' | 'unknown';
  steeringResponse: 'improved' | 'neutral' | 'reduced' | 'unknown';
  beginnerExplanation: string;
  enthusiastExplanation: string;
  factors: {
    component: string;
    factor: string;
    effect: string;
  }[];
}

export interface BrakingAnalysis {
  hasBrakeModifications: boolean;
  thermalEndurance: 'improved' | 'neutral' | 'reduced' | 'unknown';
  pedalFirmness: 'improved' | 'neutral' | 'reduced' | 'unknown';
  stoppingPerformanceImpact: string;
  safetyNotice: string;
  verificationRequired: boolean;
  confidence: ConfidenceLevel;
  items: string[];
}

export interface ThermalAnalysis {
  thermalLoadIndex: 'low' | 'moderate' | 'high' | 'critical';
  coolingRequirement: 'sufficient_oem' | 'recommended_upgrade' | 'mandatory_upgrade';
  explanation: string;
  verificationRequired: boolean;
  confidence: ConfidenceLevel;
  recommendations: string[];
}

export interface ReliabilityAnalysis {
  concernLevel: 'LOW CONCERN' | 'MODERATE CONCERN' | 'REVIEW REQUIRED';
  summary: string;
  stressFactors: {
    area: string;
    level: 'Low' | 'Moderate' | 'Elevated';
    details: string;
  }[];
}

export interface FuelEfficiencyAnalysis {
  impact: 'Potential Improvement' | 'Potential Reduction' | 'Minimal Change' | 'Unknown';
  explanation: string;
  disclaimer: string;
}

export interface ComponentMatrixRow {
  componentId: string;
  name: string;
  brand: string;
  category: string;
  powerSymbol: string;
  powerLabel: string;
  torqueSymbol: string;
  torqueLabel: string;
  weightSymbol: string;
  weightLabel: string;
  handlingSymbol: string;
  handlingLabel: string;
  brakingSymbol: string;
  brakingLabel: string;
  comfortSymbol: string;
  comfortLabel: string;
  thermalSymbol: string;
  thermalLabel: string;
  installDifficulty: 'Low' | 'Medium' | 'High' | 'Specialist';
}

export interface VerificationRequirementItem {
  id: string;
  title: string;
  category: string;
  description: string;
  whyItMatters: string;
  isSafetyCritical: boolean;
  actionRequired: string;
  triggerComponent: string;
}

export interface EngineeringRecommendationItem {
  id: string;
  category: 'Safety' | 'Alignment' | 'Powertrain' | 'Thermal' | 'Wheel & Tire' | 'Braking';
  title: string;
  recommendation: string;
  priority: 'HIGH' | 'MEDIUM' | 'INFO';
  triggerComponent: string;
  reasoning: string;
}

export interface InstallationSummary {
  highestComplexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'SPECIALIST';
  reason: string;
  totalInstallHours: number;
}

export interface BuildPerformanceAnalysis {
  vehicleId: string;
  vehicleName: string;
  buildId: string;
  buildName: string;
  timestamp: string;
  health: {
    status: 'GOOD' | 'REVIEW' | 'ATTENTION';
    headline: string;
    description: string;
    reasons: string[];
  };
  power: PowerAnalysis;
  torque: TorqueAnalysis;
  weight: WeightAnalysis;
  acceleration: AccelerationAnalysis;
  handling: HandlingAnalysis;
  braking: BrakingAnalysis;
  thermal: ThermalAnalysis;
  reliability: ReliabilityAnalysis;
  fuelEfficiency: FuelEfficiencyAnalysis;
  matrix: ComponentMatrixRow[];
  verificationRequirements: VerificationRequirementItem[];
  recommendations: EngineeringRecommendationItem[];
  installation: InstallationSummary;
}
