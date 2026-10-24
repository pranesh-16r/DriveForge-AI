export type ExperienceMode = 'beginner' | 'enthusiast';

export interface Region {
  id: string;
  name: string;
  countryId: string;
  code: string;
  currency: string;
  currencySymbol: string;
  avgHourlyLaborRateUSD: number;
  laborMultiplier: number;
  shippingMultiplier: number;
  locale: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  context: string;
  regions: Region[];
}

export interface VehicleBrand {
  id: string;
  name: string;
  country: string;
  vehicleTypes: string[];
  modelsCount: number;
  description: string;
  logoText: string;
  foundedYear?: number;
  accentColor?: string;
}

export interface VehicleTypeCategory {
  id: string;
  name: string;
  shortDescription: string;
  badge: string;
}

export interface VehicleModelItem {
  id: string;
  brandId: string;
  typeId: string;
  name: string;
  variant: string;
  generation: string;
  year: number;
  image: string;
  heroImage?: string;
  thumbnail?: string;
  engine: string;
  power: number; // in HP
  torque: number; // in LB-FT
  transmission: string;
  drivetrain: 'AWD' | 'RWD' | 'FWD';
  weight: number; // in KG
  fuelType: 'Gasoline' | 'Hybrid' | 'FlexFuel' | 'Electric';
  chassisCode: string;
  priceMsrpUSD: number;
  supportedModifications: string[];
  description: string;
}
