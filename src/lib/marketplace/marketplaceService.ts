import { MODIFICATION_COMPONENTS } from '../../data/modificationComponents';
import { ExtendedModificationComponent, CompatibilityStatus, InstallationDifficulty } from '../../types/modification';
import { Vehicle, Country, Region, ExperienceMode } from '../../types';
import { CompatibilityService, EvaluatedCompatibility } from '../../services/compatibilityService';
import { PricingService } from '../../services/pricingService';
import { InstallationService } from '../../services/installationService';

export type MarketplaceCategory =
  | 'ALL'
  | 'EXTERIOR'
  | 'WHEELS'
  | 'BRAKES'
  | 'SUSPENSION'
  | 'PERFORMANCE'
  | 'INTERIOR';

export interface MarketplaceItem {
  component: ExtendedModificationComponent;
  compatibility: EvaluatedCompatibility;
  pricing: ReturnType<typeof PricingService.calculateRegionalPartCost>;
  installation: ReturnType<typeof InstallationService.calculateRegionalInstallationCost>;
  isCompatible: boolean;
}

export interface MarketplaceFilterOptions {
  query?: string;
  category?: MarketplaceCategory;
  compatibilityFilter?: 'ALL' | 'COMPATIBLE' | 'CONDITIONALLY_COMPATIBLE' | 'REVIEW';
  brand?: string | 'ALL';
  difficulty?: InstallationDifficulty | 'ALL';
  vehicle: Vehicle;
  country: Country | null;
  region: Region | null;
  experienceMode?: ExperienceMode;
}

export class MarketplaceService {
  /**
   * Maps Marketplace high-level categories to underlying component category tags.
   */
  public static mapCategory(comp: ExtendedModificationComponent): MarketplaceCategory {
    const cat = (comp.category || '').toLowerCase();
    const sub = (comp.subCategory || '').toLowerCase();

    if (cat === 'aerodynamics' || cat === 'exterior' || sub.includes('wing') || sub.includes('splitter') || sub.includes('diffuser')) {
      return 'EXTERIOR';
    }
    if (cat === 'wheels_tires' || cat === 'wheels' || sub.includes('wheel') || sub.includes('tire') || sub.includes('rim')) {
      return 'WHEELS';
    }
    if (cat === 'brakes' || sub.includes('brake') || sub.includes('rotor') || sub.includes('caliper')) {
      return 'BRAKES';
    }
    if (cat === 'suspension' || sub.includes('coilover') || sub.includes('spring') || sub.includes('sway')) {
      return 'SUSPENSION';
    }
    if (cat === 'powertrain' || cat === 'exhaust' || sub.includes('exhaust') || sub.includes('intake') || sub.includes('tune') || sub.includes('ecu') || sub.includes('downpipe')) {
      return 'PERFORMANCE';
    }
    if (cat === 'interior' || sub.includes('seat') || sub.includes('wheel') || sub.includes('harness')) {
      return 'INTERIOR';
    }
    return 'PERFORMANCE';
  }

  /**
   * Retrieves unique brands represented in the catalog.
   */
  public static getBrands(): string[] {
    const brands = new Set<string>();
    MODIFICATION_COMPONENTS.forEach(c => {
      if (c.brand) brands.add(c.brand);
    });
    return Array.from(brands).sort();
  }

  /**
   * Filters and evaluates marketplace items against the active vehicle and region.
   */
  public static searchMarketplace(options: MarketplaceFilterOptions): MarketplaceItem[] {
    const {
      query = '',
      category = 'ALL',
      compatibilityFilter = 'ALL',
      brand = 'ALL',
      difficulty = 'ALL',
      vehicle,
      country,
      region,
      experienceMode = 'beginner'
    } = options;

    const cleanQuery = query.toLowerCase().trim();

    return MODIFICATION_COMPONENTS.map(comp => {
      // Evaluate compatibility using existing Phase 6 engine
      const compatibility = CompatibilityService.evaluate(comp, vehicle, experienceMode);

      // Evaluate regional pricing using existing Phase 6 engine
      const pricing = PricingService.calculateRegionalPartCost(comp, country, region);

      // Evaluate regional installation using existing Phase 6 engine
      const installation = InstallationService.calculateRegionalInstallationCost(
        comp,
        vehicle,
        country,
        region
      );

      const isCompatible = compatibility.status === 'compatible' || compatibility.status === 'conditionally_compatible';

      return {
        component: comp,
        compatibility,
        pricing,
        installation,
        isCompatible
      };
    }).filter(item => {
      const comp = item.component;

      // 1. Category Filter
      if (category !== 'ALL') {
        const mappedCat = this.mapCategory(comp);
        if (mappedCat !== category) return false;
      }

      // 2. Brand Filter
      if (brand !== 'ALL' && comp.brand !== brand) {
        return false;
      }

      // 3. Difficulty Filter
      if (difficulty !== 'ALL') {
        const compDiff = comp.installationDifficulty || 'moderate';
        if (compDiff !== difficulty) return false;
      }

      // 4. Compatibility Filter
      if (compatibilityFilter !== 'ALL') {
        if (compatibilityFilter === 'COMPATIBLE' && item.compatibility.status !== 'compatible') {
          return false;
        }
        if (compatibilityFilter === 'CONDITIONALLY_COMPATIBLE' && item.compatibility.status !== 'conditionally_compatible') {
          return false;
        }
        if (compatibilityFilter === 'REVIEW' && (item.compatibility.status === 'compatible' || item.compatibility.status === 'conditionally_compatible')) {
          return false;
        }
      }

      // 5. Query Filter
      if (cleanQuery) {
        const nameMatch = comp.name.toLowerCase().includes(cleanQuery);
        const brandMatch = comp.brand.toLowerCase().includes(cleanQuery);
        const partMatch = (comp.partNumber || '').toLowerCase().includes(cleanQuery);
        const descMatch = (comp.description || '').toLowerCase().includes(cleanQuery);
        const purposeMatch = (comp.purpose || '').toLowerCase().includes(cleanQuery);
        if (!nameMatch && !brandMatch && !partMatch && !descMatch && !purposeMatch) {
          return false;
        }
      }

      return true;
    });
  }
}
