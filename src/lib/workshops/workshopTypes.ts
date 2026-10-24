import { Vehicle } from '../../types';
import { BuildComponent } from '../../types/build';

export type WorkshopVerificationStatus = 
  | 'VERIFIED'
  | 'SOURCE LISTED'
  | 'UNVERIFIED'
  | 'UNKNOWN';

export type WorkshopMatchLevel = 
  | 'GOOD MATCH'
  | 'PARTIAL MATCH'
  | 'UNKNOWN';

export interface WorkshopOpeningHours {
  openNow?: boolean | null;
  display?: string; // e.g. "Mon–Fri: 08:30 – 18:00"
  statusText?: 'OPEN NOW' | 'CLOSED' | 'HOURS UNAVAILABLE';
}

export interface Workshop {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string; // matches Region name, e.g. "Tamil Nadu", "California", "England", "New South Wales"
  regionId: string; // matches Region id, e.g. "in-tamil-nadu", "us-california"
  country: string; // matches Country name, e.g. "India", "United States", "United Kingdom", "Australia"
  countryId: string; // e.g. "india", "usa", "uk", "australia"
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  rating: number | null; // Do not fabricate! Null means "Rating unavailable"
  reviewCount: number | null;
  services: string[];
  specialties: string[];
  supportedVehicleTypes: string[];
  installationCapabilities: string[];
  openingHours?: WorkshopOpeningHours;
  verificationStatus: WorkshopVerificationStatus;
  source: string; // e.g. "Demo Workshop Directory", "OpenStreetMap", "Google Places"
  distance?: number | null; // calculated in km if user location is available
}

export interface ComponentServiceRequirement {
  componentId: string;
  componentName: string;
  category: string;
  requiredServices: string[];
  isSafetyCritical: boolean;
}

export interface BuildInstallationRequirements {
  vehicleName: string;
  componentCount: number;
  requiredServices: string[];
  complexityLevel: 'LOW' | 'MODERATE' | 'HIGH';
  verificationCount: number;
  verificationItems: string[];
  requirements: ComponentServiceRequirement[];
}

export interface WorkshopMatchResult {
  workshop: Workshop;
  matchLevel: WorkshopMatchLevel;
  matchedServices: string[];
  missingServices: string[];
  matchReason: string;
  matchScore: number; // 0 to 100 for deterministic ranking
  supportedComponentsCount: number;
  totalComponentsCount: number;
}
