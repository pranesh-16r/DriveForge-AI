export * from './auth';
export * from './discovery';
export * from './modification';
export * from './build';

export type CategoryType = 
  | 'powertrain'
  | 'exhaust'
  | 'brakes'
  | 'suspension'
  | 'aerodynamics'
  | 'wheels_tires'
  | 'chassis'
  | 'electronics'
  | 'interior'
  | 'exterior';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  engine: string;
  baselinePowerHp: number;
  baselineTorqueLbFt: number;
  weightKg: number;
  drivetrain: 'AWD' | 'RWD' | 'FWD';
  transmission: string;
  priceMsrpUSD: number;
  imageUrl: string;
  colorHex: string;
  chassisCode: string;
  description: string;
}

export interface ModificationComponent {
  id: string;
  name: string;
  category: CategoryType;
  brand: string;
  partNumber: string;
  priceUSD: number;
  installHours: number;
  powerGainHp: number;
  weightDeltaKg: number;
  compatibilityRating: 'compatible' | 'verificationRequired' | 'conflict';
  compatibilityNotes: string;
  description: string;
  specifications: Record<string, string>;
  imageUrl?: string;
  featured?: boolean;
}

export interface VehicleBuild {
  id: string;
  title: string;
  vehicle: Vehicle;
  components: ModificationComponent[];
  regionId: string;
  experienceLevel: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  country: string;
  category: string;
  specialization: string;
  verifiedPartner: boolean;
  logoText: string;
  description: string;
}

export interface Workshop {
  id: string;
  name: string;
  region: string;
  city: string;
  address: string;
  rating: number;
  reviewsCount: number;
  masterCertifications: string[];
  hourlyLaborRateUSD: number;
  phone: string;
  specialties: string[];
}

export interface RegionZone {
  id: string;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  laborMultiplier: number;
  shippingMultiplier: number;
  avgHourlyLaborRateUSD: number;
}

export interface ExperienceLevel {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  recommendedFocus: string[];
  techDetailMode: 'standard' | 'advanced' | 'telemetry';
}

export interface AIChiefMessage {
  id: string;
  sender: 'user' | 'chief_engineer';
  timestamp: string;
  text: string;
  analysis?: {
    compatibilityScore: number;
    heatDissipationRisk: 'Low' | 'Moderate' | 'High';
    dynoGainProjectedHp: number;
    recommendation: string;
  };
}

export * from './analysis';
