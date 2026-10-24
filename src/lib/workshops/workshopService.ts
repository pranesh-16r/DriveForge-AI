import { WORKSHOPS_DIRECTORY, getWorkshopsByRegion, getWorkshopsByCountry } from '../../data/workshopsData';
import { Workshop, WorkshopMatchResult, WorkshopMatchLevel } from './workshopTypes';
import { Coordinates, calculateHaversineDistanceKm, MapService } from '../maps/mapService';
import { matchWorkshopsToBuild } from './workshopMatchingService';
import { BuildComponent } from '../../types/build';
import { Vehicle } from '../../types';

export interface WorkshopSearchFilters {
  countryId?: string;
  regionId?: string;
  userCoords?: Coordinates | null;
  query?: string;
  serviceFilter?: string | 'ALL';
  buildMatchFilter?: WorkshopMatchLevel | 'ALL';
  openNowFilter?: boolean;
  vehicleType?: string | 'ALL';
  buildComponents?: BuildComponent[];
  vehicle?: Vehicle;
}

export class WorkshopService {
  /**
   * Search and filter workshops by region, user coordinates, keywords, services, and build match.
   */
  public static searchWorkshops(filters: WorkshopSearchFilters): {
    results: WorkshopMatchResult[];
    totalCount: number;
    hasUserDistance: boolean;
  } {
    const {
      countryId,
      regionId,
      userCoords,
      query,
      serviceFilter = 'ALL',
      buildMatchFilter = 'ALL',
      openNowFilter = false,
      vehicleType = 'ALL',
      buildComponents = [],
      vehicle
    } = filters;

    // 1. Base list scoped by selected region or country
    let baseWorkshops: Workshop[] = [];
    if (regionId) {
      baseWorkshops = getWorkshopsByRegion(regionId);
    }
    
    // If no workshops found for specific region, fallback to country
    if (baseWorkshops.length === 0 && countryId) {
      baseWorkshops = getWorkshopsByCountry(countryId);
    }

    // Ultimate fallback if empty: all directory workshops
    if (baseWorkshops.length === 0) {
      baseWorkshops = [...WORKSHOPS_DIRECTORY];
    }

    // 2. Augment with distances if user coordinates are available
    const hasUserDistance = Boolean(userCoords && userCoords.latitude && userCoords.longitude);
    const workshopsWithDistance = baseWorkshops.map(w => {
      let distance: number | null = null;
      if (hasUserDistance && userCoords) {
        distance = calculateHaversineDistanceKm(
          userCoords.latitude,
          userCoords.longitude,
          w.latitude,
          w.longitude
        );
      }
      return {
        ...w,
        distance
      };
    });

    // 3. Match against current build
    let matchedResults = matchWorkshopsToBuild(workshopsWithDistance, buildComponents, vehicle);

    // 4. Apply text search query
    if (query && query.trim().length > 0) {
      const q = query.trim().toLowerCase();
      matchedResults = matchedResults.filter(({ workshop }) => {
        const inName = workshop.name.toLowerCase().includes(q);
        const inCity = workshop.city.toLowerCase().includes(q);
        const inAddress = workshop.address.toLowerCase().includes(q);
        const inServices = workshop.services.some(s => s.toLowerCase().includes(q));
        const inSpecialties = workshop.specialties.some(s => s.toLowerCase().includes(q));
        return inName || inCity || inAddress || inServices || inSpecialties;
      });
    }

    // 5. Apply service filter
    if (serviceFilter && serviceFilter !== 'ALL') {
      const targetService = serviceFilter.toLowerCase();
      matchedResults = matchedResults.filter(({ workshop }) =>
        workshop.services.some(s => s.toLowerCase() === targetService)
      );
    }

    // 6. Apply build match level filter
    if (buildMatchFilter && buildMatchFilter !== 'ALL') {
      matchedResults = matchedResults.filter(r => r.matchLevel === buildMatchFilter);
    }

    // 7. Apply Open Now filter
    if (openNowFilter) {
      matchedResults = matchedResults.filter(({ workshop }) => workshop.openingHours?.openNow === true);
    }

    // 8. Apply Vehicle Type filter
    if (vehicleType && vehicleType !== 'ALL') {
      const targetType = vehicleType.toLowerCase();
      matchedResults = matchedResults.filter(({ workshop }) =>
        workshop.supportedVehicleTypes.some(vt => vt.toLowerCase().includes(targetType))
      );
    }

    return {
      results: matchedResults,
      totalCount: matchedResults.length,
      hasUserDistance
    };
  }

  /**
   * Get single workshop by ID
   */
  public static getWorkshopById(id: string): Workshop | undefined {
    return WORKSHOPS_DIRECTORY.find(w => w.id === id);
  }

  /**
   * Get all distinct services available in the workshop directory for filtering
   */
  public static getAllAvailableServices(): string[] {
    const serviceSet = new Set<string>();
    WORKSHOPS_DIRECTORY.forEach(w => {
      w.services.forEach(s => serviceSet.add(s));
    });
    return Array.from(serviceSet).sort();
  }

  /**
   * Get directions URL using the map service provider abstraction
   */
  public static getDirectionsUrl(workshop: Workshop, userCoords?: Coordinates | null): string {
    const provider = MapService.getInstance().getProvider();
    return provider.getDirectionsUrl({
      from: userCoords || null,
      to: { latitude: workshop.latitude, longitude: workshop.longitude },
      destinationName: workshop.name,
      destinationAddress: `${workshop.address}, ${workshop.city}`
    });
  }
}
