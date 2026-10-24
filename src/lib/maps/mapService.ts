import { Workshop } from '../workshops/workshopTypes';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodeResult {
  address: string;
  coordinates: Coordinates;
  displayName: string;
}

export interface MapDirectionsOptions {
  from?: Coordinates | null;
  to: Coordinates;
  destinationName?: string;
  destinationAddress?: string;
}

export interface MapProvider {
  id: string;
  name: string;
  attribution: string;
  isConfigured(): boolean;
  searchNearbyWorkshops(
    coords: Coordinates,
    radiusKm: number,
    query?: string
  ): Promise<Workshop[]>;
  getDirectionsUrl(options: MapDirectionsOptions): string;
  geocode(query: string): Promise<Coordinates | null>;
  reverseGeocode(coords: Coordinates): Promise<string | null>;
}

/**
 * Calculates haversine distance between two coordinates in kilometers.
 * Accurate for regional workshop distance calculation.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Rounded to 1 decimal place
}

/**
 * Demo / Fallback Map Provider
 * Operates without external API keys using OpenStreetMap standards and deep links.
 */
export class DemoMapProvider implements MapProvider {
  id = 'demo-osm';
  name = 'Demo Workshop Directory & OpenStreetMap';
  attribution = '© OpenStreetMap contributors | Demo Workshop Directory';

  isConfigured(): boolean {
    return true; // Always available as reliable fallback
  }

  async searchNearbyWorkshops(
    _coords: Coordinates,
    _radiusKm: number,
    _query?: string
  ): Promise<Workshop[]> {
    // Uses regional directory data handled by WorkshopService
    return [];
  }

  getDirectionsUrl(options: MapDirectionsOptions): string {
    const { from, to, destinationName, destinationAddress } = options;
    const destQuery = destinationAddress 
      ? encodeURIComponent(`${destinationName ? destinationName + ', ' : ''}${destinationAddress}`)
      : `${to.latitude},${to.longitude}`;

    if (from) {
      return `https://www.google.com/maps/dir/?api=1&origin=${from.latitude},${from.longitude}&destination=${destQuery}&travelmode=driving`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${destQuery}`;
  }

  async geocode(query: string): Promise<Coordinates | null> {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { 'User-Agent': 'DriveForge-Workshop-Discovery/1.0' } }
      );
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
    } catch {
      // Fallback
    }
    return null;
  }

  async reverseGeocode(coords: Coordinates): Promise<string | null> {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
        { headers: { 'User-Agent': 'DriveForge-Workshop-Discovery/1.0' } }
      );
      const data = await resp.json();
      return data?.display_name || null;
    } catch {
      return null;
    }
  }
}

/**
 * Google Maps Provider Architecture
 * Activated when VITE_GOOGLE_MAPS_API_KEY is configured.
 */
export class GoogleMapsProvider implements MapProvider {
  id = 'google-maps';
  name = 'Google Maps Platform';
  attribution = 'Map data © Google';

  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async searchNearbyWorkshops(
    _coords: Coordinates,
    _radiusKm: number,
    _query?: string
  ): Promise<Workshop[]> {
    return [];
  }

  getDirectionsUrl(options: MapDirectionsOptions): string {
    const { from, to, destinationName, destinationAddress } = options;
    const dest = destinationAddress 
      ? encodeURIComponent(`${destinationName ? destinationName + ', ' : ''}${destinationAddress}`)
      : `${to.latitude},${to.longitude}`;
    
    if (from) {
      return `https://www.google.com/maps/dir/?api=1&origin=${from.latitude},${from.longitude}&destination=${dest}&travelmode=driving`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${dest}`;
  }

  async geocode(query: string): Promise<Coordinates | null> {
    if (!this.isConfigured()) return null;
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${this.apiKey}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.results && json.results[0]) {
        const loc = json.results[0].geometry.location;
        return { latitude: loc.lat, longitude: loc.lng };
      }
    } catch {
      // Fallback
    }
    return null;
  }

  async reverseGeocode(coords: Coordinates): Promise<string | null> {
    if (!this.isConfigured()) return null;
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${this.apiKey}`;
      const res = await fetch(url);
      const json = await res.json();
      return json.results?.[0]?.formatted_address || null;
    } catch {
      return null;
    }
  }
}

/**
 * Mapbox Provider Architecture
 * Activated when VITE_MAPBOX_ACCESS_TOKEN is configured.
 */
export class MapboxProvider implements MapProvider {
  id = 'mapbox';
  name = 'Mapbox GL';
  attribution = '© Mapbox © OpenStreetMap';

  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  isConfigured(): boolean {
    return Boolean(this.token && this.token.trim().length > 0);
  }

  async searchNearbyWorkshops(
    _coords: Coordinates,
    _radiusKm: number,
    _query?: string
  ): Promise<Workshop[]> {
    return [];
  }

  getDirectionsUrl(options: MapDirectionsOptions): string {
    const { from, to, destinationAddress } = options;
    if (from) {
      return `https://www.google.com/maps/dir/?api=1&origin=${from.latitude},${from.longitude}&destination=${to.latitude},${to.longitude}&travelmode=driving`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${destinationAddress ? encodeURIComponent(destinationAddress) : `${to.latitude},${to.longitude}`}`;
  }

  async geocode(query: string): Promise<Coordinates | null> {
    if (!this.isConfigured()) return null;
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${this.token}&limit=1`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.features && json.features[0]) {
        const [lng, lat] = json.features[0].center;
        return { latitude: lat, longitude: lng };
      }
    } catch {
      // Fallback
    }
    return null;
  }

  async reverseGeocode(coords: Coordinates): Promise<string | null> {
    if (!this.isConfigured()) return null;
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=${this.token}&limit=1`;
      const res = await fetch(url);
      const json = await res.json();
      return json.features?.[0]?.place_name || null;
    } catch {
      return null;
    }
  }
}

/**
 * Map Service Factory
 * Resolves active provider based on environment, always maintaining Demo fallback.
 */
export class MapService {
  private static instance: MapService;
  private currentProvider: MapProvider;

  private constructor() {
    const googleKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
    const mapboxToken = (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string) || '';

    if (googleKey.trim().length > 0) {
      this.currentProvider = new GoogleMapsProvider(googleKey);
    } else if (mapboxToken.trim().length > 0) {
      this.currentProvider = new MapboxProvider(mapboxToken);
    } else {
      this.currentProvider = new DemoMapProvider();
    }
  }

  public static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  public getProvider(): MapProvider {
    return this.currentProvider;
  }

  public isUsingDemo(): boolean {
    return this.currentProvider.id === 'demo-osm';
  }
}
