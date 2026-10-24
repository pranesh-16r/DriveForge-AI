import { CategoryType, ModificationComponent as BaseModificationComponent } from './index';
import { CameraTargetId, ModificationCategoryNavId } from '../lib/3d/camera';

export type InstallationDifficulty = 'bolt_on' | 'moderate' | 'professional_required';

export type CompatibilityStatus = 
  | 'compatible' 
  | 'conditionally_compatible' 
  | 'not_compatible' 
  | 'verification_required';

export type VerificationStatus = 
  | 'verified' 
  | 'verification_required' 
  | 'requires_dyno' 
  | 'track_only';

export interface VisualAssetConfig {
  type: 'spoiler' | 'wheel' | 'brake' | 'exhaust' | 'suspension_stance' | 'splitter' | 'hood' | 'lights' | 'interior';
  supported: boolean;
  assetNotice?: string;
  spoilerType?: 'stock' | 'ducktail' | 'gt_wing' | 'drag';
  rimColor?: string;
  caliperColor?: string;
  exhaustColor?: string;
  exhaustType?: 'dual_titanium' | 'quad_carbon' | 'stock';
  rideHeightDrop?: number; // 0 to 1
  camberDelta?: number; // degrees
  hasRaceSplitter?: boolean;
  hasCarbonHood?: boolean;
}

export interface SupportedVehiclesRule {
  makes?: string[];
  models?: string[];
  generations?: string[];
  engineTypes?: ('turbo' | 'twin_turbo' | 'naturally_aspirated' | 'supercharged' | 'electric')[];
  drivetrains?: ('AWD' | 'RWD' | 'FWD')[];
  excludedModels?: string[];
  universal?: boolean;
  minWheelSizeInches?: number;
  requiresECUReflash?: boolean;
  requiresTrackAlignment?: boolean;
}

export interface ComponentCompatibilityResult {
  status: CompatibilityStatus;
  badgeLabel: string;
  explanation: string;
  warningConditions?: string[];
  isFitmentGuaranteed: boolean;
}

export interface ExtendedModificationComponent extends BaseModificationComponent {
  subCategory: string;
  image: string;
  purpose: string;
  supportedVehicles: SupportedVehiclesRule;
  compatibilityRules: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  estimatedPrice: {
    minUSD: number;
    maxUSD: number;
    displayUSD: string;
  };
  installationEstimate: {
    hours: number;
    estimatedLaborUSD: number;
    difficulty: InstallationDifficulty;
    difficultyLabel: string;
  };
  installationDifficulty: InstallationDifficulty;
  performanceImpact?: string;
  handlingImpact?: string;
  weightImpact?: string;
  visualAsset?: VisualAssetConfig;
  cameraTarget: CameraTargetId;
  verificationStatus: VerificationStatus;
  beginnerExplanation: string;
  expertExplanation: string;
  whyUsersInstall?: string;
  tradeoffs?: string;
}
