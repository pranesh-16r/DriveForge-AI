import { Vehicle, CategoryType } from './index';
import { ExtendedModificationComponent, CompatibilityStatus, InstallationDifficulty, VerificationStatus } from './modification';

export type BuildHealthStatus = 'GOOD' | 'REVIEW' | 'ATTENTION';

export type CostConfidenceLevel = 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE';

export type PriceSourceType = 'Indicative Regional Estimate' | 'Demo Regional Estimate' | 'Verified Supplier' | 'Live Source';

export interface RegionalCostRange {
  min: number;
  max: number;
  display: string;
}

export interface ComponentFitmentData {
  boltPattern?: string;
  wheelDiameterInches?: number;
  wheelWidthInches?: number;
  offsetMm?: number;
  brakeClearanceMm?: number;
  mountingPointType?: string;
  bodyGeneration?: string;
  engineConfiguration?: string;
  dimensions?: string;
  material?: string;
}

export interface BuildComponent {
  id: string;
  componentId: string;
  vehicleId: string;
  category: CategoryType;
  name: string;
  brand: string;
  partNumber: string;
  subCategory: string;
  image: string;
  quantity: number;
  
  // Compatibility & Fitment
  compatibilityStatus: CompatibilityStatus;
  compatibilityReason: string;
  fitmentNotes: string;
  fitmentDetails: ComponentFitmentData;
  isFitmentGuaranteed: boolean;
  warningConditions: string[];
  
  // Regional Cost Breakdown
  estimatedPartCost: RegionalCostRange;
  estimatedInstallationCost: RegionalCostRange & { hours: number; laborRateHourly: number };
  estimatedTotalCost: RegionalCostRange;
  currency: string;
  currencySymbol: string;
  costConfidence: CostConfidenceLevel;
  priceSourceType: PriceSourceType;
  
  // Engineering Impacts
  installationDifficulty: InstallationDifficulty;
  installationDifficultyLabel: string;
  performanceImpact?: string;
  weightImpact?: string;
  handlingImpact?: string;
  powerGainHp: number;
  weightDeltaKg: number;
  verificationStatus: VerificationStatus;
  
  // Explanations
  beginnerExplanation: string;
  expertExplanation: string;
  
  // Metadata & Sequencing
  recommendedOrder: number;
  recommendedOrderReason: string;
  userNotes?: string;
  previewState?: boolean;
  
  // Underlying Raw Data
  rawComponent: ExtendedModificationComponent;
}

export interface BuildNote {
  id: string;
  text: string;
  createdAt: string;
  author?: string;
}

export interface VerificationRequirement {
  id: string;
  componentId: string;
  componentName: string;
  category: CategoryType;
  title: string;
  description: string;
  isSafetyCritical: boolean;
  actionRequired: string;
}

export interface BuildCostSummary {
  currency: string;
  currencySymbol: string;
  locale: string;
  partsMin: number;
  partsMax: number;
  partsDisplay: string;
  laborMin: number;
  laborMax: number;
  laborDisplay: string;
  totalMin: number;
  totalMax: number;
  totalDisplay: string;
  totalInstallHours: number;
  sourceType: PriceSourceType;
  confidence: CostConfidenceLevel;
  disclaimer: string;
}

export interface BuildCompatibilitySummary {
  compatibleCount: number;
  conditionalCount: number;
  notCompatibleCount: number;
  verificationRequiredCount: number;
  totalComponents: number;
  allCompatible: boolean;
  hasIncompatible: boolean;
}

export interface BuildHealthReport {
  status: BuildHealthStatus;
  badgeLabel: string;
  headline: string;
  description: string;
  issues: string[];
}

export interface BuildWarning {
  id: string;
  componentId: string;
  componentName: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

export interface RecommendedOrderStep {
  stepNumber: number;
  category: CategoryType;
  categoryLabel: string;
  componentNames: string[];
  reason: string;
}

export interface VehicleRevalidationNotice {
  requiresReview: boolean;
  previousVehicleName?: string;
  currentVehicleName: string;
  affectedComponentsCount: number;
  message: string;
}

export interface BuildState {
  buildId: string;
  buildName: string;
  buildVersion: string;
  selectedVehicle: Vehicle;
  selectedCountryId: string;
  selectedRegionId: string;
  currency: string;
  currencySymbol: string;
  experienceMode: 'beginner' | 'enthusiast';
  
  // Components in Physical Build
  components: BuildComponent[];
  
  // Computed Summaries
  costSummary: BuildCostSummary;
  compatibilitySummary: BuildCompatibilitySummary;
  buildHealth: BuildHealthReport;
  warnings: BuildWarning[];
  verificationRequirements: VerificationRequirement[];
  recommendedOrder: RecommendedOrderStep[];
  
  // Build Notes
  notes: BuildNote[];
  
  // Vehicle Change Revalidation Flag
  revalidationNotice: VehicleRevalidationNotice | null;
  
  lastUpdated: string;
}
