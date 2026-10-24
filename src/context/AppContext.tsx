import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Vehicle,
  ModificationComponent,
  RegionZone,
  ExperienceLevel,
  Country,
  Region,
  ExperienceMode,
  VehicleBrand,
  VehicleTypeCategory,
  UserProfile,
  BuildState,
  BuildComponent,
  BuildNote,
  VehicleRevalidationNotice
} from '../types';
import { VEHICLES } from '../data/vehicles';
import { COMPONENTS } from '../data/componentsData';
import { MODIFICATION_COMPONENTS } from '../data/modificationComponents';
import { COUNTRIES } from '../data/locations';
import { VEHICLE_BRANDS } from '../data/vehicleBrands';
import { VEHICLE_TYPES } from '../data/vehicleTypes';
import { EXPERIENCE_LEVELS } from '../data/experiences';
import { authService } from '../services/auth';
import { BuildService } from '../services/buildService';
import { ExtendedModificationComponent } from '../types/modification';
import { SavedBuild } from '../types/vault';
import { auth as firebaseAuth, onAuthStateChanged, saveUserBuildToFirestore } from '../lib/firebase';

export const REGIONS: RegionZone[] = [
  {
    id: 'in-tamil-nadu',
    name: 'Tamil Nadu (IN-TN)',
    code: 'IN-TN',
    currency: 'INR',
    currencySymbol: '₹',
    laborMultiplier: 0.45,
    shippingMultiplier: 1.25,
    avgHourlyLaborRateUSD: 35
  },
  {
    id: 'us-california',
    name: 'California (US-CA)',
    code: 'US-CA',
    currency: 'USD',
    currencySymbol: '$',
    laborMultiplier: 1.15,
    shippingMultiplier: 1.0,
    avgHourlyLaborRateUSD: 195
  },
  {
    id: 'gb-england',
    name: 'England (GB-ENG)',
    code: 'GB-ENG',
    currency: 'GBP',
    currencySymbol: '£',
    laborMultiplier: 1.05,
    shippingMultiplier: 0.95,
    avgHourlyLaborRateUSD: 175
  },
  {
    id: 'au-nsw',
    name: 'New South Wales (AU-NSW)',
    code: 'AU-NSW',
    currency: 'AUD',
    currencySymbol: 'A$',
    laborMultiplier: 1.10,
    shippingMultiplier: 1.15,
    avgHourlyLaborRateUSD: 165
  }
];

export { EXPERIENCE_LEVELS };

const DISCOVERY_STORAGE_KEY = 'driveforge_discovery_data_v3';
const BUILD_STORAGE_KEY = 'driveforge_build_state_v6';

interface DiscoveryStorageData {
  countryId?: string;
  regionId?: string;
  experienceMode?: ExperienceMode;
  brandId?: string;
  typeId?: string;
  vehicleId?: string;
}

interface StoredBuildData {
  buildId?: string;
  buildName?: string;
  componentIds?: string[];
  notes?: BuildNote[];
}

export interface AppContextType {
  // Discovery & Active Vehicle
  activeVehicle: Vehicle;
  setActiveVehicle: (vehicle: Vehicle) => void;
  selectedCountry: Country | null;
  selectedRegion: Region | null;
  experienceMode: ExperienceMode;
  selectedBrand: VehicleBrand | null;
  selectedVehicleType: VehicleTypeCategory | null;
  selectedModel: string | null;
  setSelectedCountry: (country: Country | null) => void;
  setSelectedRegion: (region: Region | null) => void;
  setExperienceMode: (mode: ExperienceMode) => void;
  setSelectedBrand: (brand: VehicleBrand | null) => void;
  setSelectedVehicleType: (type: VehicleTypeCategory | null) => void;
  setSelectedModel: (model: string | null) => void;
  resetDiscoveryFlow: () => void;

  // Phase 6 Physical Build State
  buildState: BuildState;
  buildComponents: BuildComponent[];
  selectedComponents: ModificationComponent[]; // backwards compatibility
  addComponentToBuild: (component: ModificationComponent | ExtendedModificationComponent) => void;
  removeComponentFromBuild: (componentId: string) => void;
  toggleComponentInBuild: (component: ModificationComponent | ExtendedModificationComponent) => void;
  updateBuildName: (name: string) => void;
  addBuildNote: (text: string) => void;
  editBuildNote: (id: string, text: string) => void;
  deleteBuildNote: (id: string) => void;
  dismissRevalidationNotice: () => void;
  clearBuild: () => void;
  loadSavedBuild: (saved: SavedBuild) => void;

  // Regional Zone & Navigation
  currentRegion: RegionZone;
  setRegion: (region: RegionZone) => void;
  experienceLevel: ExperienceLevel;
  setExperienceLevel: (level: ExperienceLevel) => void;
  currentPath: string;
  navigateTo: (path: string) => void;
  isRouteLoading: boolean;
  triggerRoutePreloader: (targetPath?: string) => void;
  closeRoutePreloader: () => void;
  buildTitle: string;
  setBuildTitle: (title: string) => void;

  // Computed Legacy Metrics
  totalPartCostUSD: number;
  totalInstallLaborUSD: number;
  totalBuildCostUSD: number;
  totalPowerGainHp: number;
  totalWeightDeltaKg: number;
  projectedPowerHp: number;
  projectedWeightKg: number;
  overallCompatibility: 'compatible' | 'verificationRequired' | 'conflict';

  // Auth State
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  setCurrentUser: (user: UserProfile | null) => void;
  logoutUser: () => void;

  // Phase 8 & 9 AI Chief Engineer Integration
  activeEngineerComponentId: string | null;
  setActiveEngineerComponentId: (id: string | null) => void;
  askEngineerAboutComponent: (componentId: string) => void;
  activeEngineerWorkshopId: string | null;
  setActiveEngineerWorkshopId: (id: string | null) => void;
  askEngineerAboutWorkshop: (workshopId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial discovery state from localStorage if available
  const initialDiscovery = useMemo<DiscoveryStorageData>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(DISCOVERY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  // Initial Country (defaults to India)
  const initialCountry = useMemo(() => {
    if (initialDiscovery.countryId) {
      const found = COUNTRIES.find(c => c.id === initialDiscovery.countryId);
      if (found) return found;
    }
    return COUNTRIES[0]; // India
  }, [initialDiscovery.countryId]);

  // Initial Region (defaults to Tamil Nadu)
  const initialRegion = useMemo(() => {
    if (initialDiscovery.regionId && initialCountry) {
      const found = initialCountry.regions.find(r => r.id === initialDiscovery.regionId);
      if (found) return found;
    }
    return initialCountry.regions[0] || null;
  }, [initialDiscovery.regionId, initialCountry]);

  // Initial Brand
  const initialBrand = useMemo(() => {
    if (initialDiscovery.brandId) {
      const found = VEHICLE_BRANDS.find(b => b.id === initialDiscovery.brandId);
      if (found) return found;
    }
    return VEHICLE_BRANDS[0];
  }, [initialDiscovery.brandId]);

  // Initial Type
  const initialVehicleType = useMemo(() => {
    if (initialDiscovery.typeId) {
      const found = VEHICLE_TYPES.find(t => t.id === initialDiscovery.typeId);
      if (found) return found;
    }
    return VEHICLE_TYPES[0];
  }, [initialDiscovery.typeId]);

  // Initial Active Vehicle
  const initialVehicle = useMemo(() => {
    if (initialDiscovery.vehicleId) {
      const found = VEHICLES.find(v => v.id === initialDiscovery.vehicleId);
      if (found) return found;
    }
    return VEHICLES[0];
  }, [initialDiscovery.vehicleId]);

  const [activeVehicle, setActiveVehicleState] = useState<Vehicle>(initialVehicle);
  const [selectedCountry, setSelectedCountryState] = useState<Country | null>(initialCountry);
  const [selectedRegion, setSelectedRegionState] = useState<Region | null>(initialRegion);
  const [experienceMode, setExperienceModeState] = useState<ExperienceMode>(
    initialDiscovery.experienceMode || 'beginner'
  );
  const [selectedBrand, setSelectedBrandState] = useState<VehicleBrand | null>(initialBrand);
  const [selectedVehicleType, setSelectedVehicleTypeState] = useState<VehicleTypeCategory | null>(initialVehicleType);
  const [selectedModel, setSelectedModel] = useState<string | null>(initialVehicle.model);

  // Derive RegionZone for backwards compatibility with the cost calculation engine
  const [currentRegion, setRegion] = useState<RegionZone>(() => {
    if (initialRegion) {
      return {
        id: initialRegion.id,
        name: `${initialRegion.name} (${initialRegion.code})`,
        code: initialRegion.code,
        currency: initialRegion.currency,
        currencySymbol: initialRegion.currencySymbol,
        laborMultiplier: initialRegion.laborMultiplier,
        shippingMultiplier: initialRegion.shippingMultiplier,
        avgHourlyLaborRateUSD: initialRegion.avgHourlyLaborRateUSD
      };
    }
    return REGIONS[0];
  });

  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(EXPERIENCE_LEVELS[0]);
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [isRouteLoading, setIsRouteLoading] = useState<boolean>(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [buildTitle, setBuildTitle] = useState<string>(() => `${initialVehicle.model} Physical Build Spec`);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());

  // Synchronize Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || 'DriveForge Builder',
          email: user.email || '',
          role: 'engineer',
          createdAt: new Date().toISOString(),
          avatarUrl: user.photoURL || undefined,
          savedBuildsCount: 1,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // ==========================================
  // PHASE 6 CENTRAL BUILD STATE INITIALIZATION
  // ==========================================
  const [buildId, setBuildId] = useState<string>('DF-BUILD-001');
  const [buildName, setBuildName] = useState<string>(() => `${initialVehicle.make} ${initialVehicle.model} Street Spec`);
  const [buildNotes, setBuildNotes] = useState<BuildNote[]>([
    {
      id: 'note-init-1',
      text: 'Schedule alignment and corner balancing after coilover installation settles.',
      createdAt: new Date().toLocaleDateString()
    }
  ]);
  const [revalidationNotice, setRevalidationNotice] = useState<VehicleRevalidationNotice | null>(null);

  // Initialize build components
  const [buildComponents, setBuildComponents] = useState<BuildComponent[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(BUILD_STORAGE_KEY);
        if (stored) {
          const parsed: StoredBuildData = JSON.parse(stored);
          if (parsed.componentIds && parsed.componentIds.length > 0) {
            const matched = MODIFICATION_COMPONENTS.filter(c => parsed.componentIds!.includes(c.id));
            if (matched.length > 0) {
              return matched.map(c =>
                BuildService.createBuildComponent(c, initialVehicle, initialCountry, initialRegion, initialDiscovery.experienceMode || 'beginner')
              );
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    // Default starter build: Akrapovic Titanium Exhaust & Brembo GTR Brakes
    const defaultParts = [MODIFICATION_COMPONENTS[0], MODIFICATION_COMPONENTS[2]].filter(Boolean);
    return defaultParts.map(c =>
      BuildService.createBuildComponent(c, initialVehicle, initialCountry, initialRegion, initialDiscovery.experienceMode || 'beginner')
    );
  });

  // Selected components for backwards compatibility with 3D scene & legacy helpers
  const selectedComponents = useMemo<ModificationComponent[]>(() => {
    return buildComponents.map(bc => bc.rawComponent);
  }, [buildComponents]);

  // Compute full reactive BuildState
  const buildState = useMemo<BuildState>(() => {
    return BuildService.buildFullState(
      buildComponents,
      activeVehicle,
      selectedCountry,
      selectedRegion,
      experienceMode,
      {
        buildId,
        buildName,
        notes: buildNotes,
        revalidationNotice
      }
    );
  }, [buildComponents, activeVehicle, selectedCountry, selectedRegion, experienceMode, buildId, buildName, buildNotes, revalidationNotice]);

  // Synchronize build state to localStorage and Firestore DB
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const data: StoredBuildData = {
        buildId,
        buildName,
        componentIds: buildComponents.map(c => c.componentId),
        notes: buildNotes
      };
      localStorage.setItem(BUILD_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage safe catch
    }

    if (currentUser?.id) {
      saveUserBuildToFirestore(currentUser.id, {
        id: buildId,
        name: buildName,
        vehicle: {
          id: activeVehicle.id,
          make: activeVehicle.make,
          model: activeVehicle.model,
          year: activeVehicle.year
        },
        componentIds: buildComponents.map(c => c.componentId),
        notes: buildNotes,
        updatedAt: new Date().toISOString()
      }).catch(err => console.warn('Firestore auto-save sync:', err));
    }
  }, [buildId, buildName, buildComponents, buildNotes, currentUser?.id, activeVehicle]);

  // Synchronize discovery state to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const data: DiscoveryStorageData = {
        countryId: selectedCountry?.id,
        regionId: selectedRegion?.id,
        experienceMode,
        brandId: selectedBrand?.id,
        typeId: selectedVehicleType?.id,
        vehicleId: activeVehicle?.id
      };
      localStorage.setItem(DISCOVERY_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage safe catch
    }
  }, [selectedCountry, selectedRegion, experienceMode, selectedBrand, selectedVehicleType, activeVehicle]);

  // Handle region and country changes: update pricing and labor across all build items
  useEffect(() => {
    setBuildComponents(prev =>
      prev.map(c =>
        BuildService.createBuildComponent(c.rawComponent, activeVehicle, selectedCountry, selectedRegion, experienceMode)
      )
    );
  }, [selectedCountry?.id, selectedRegion?.id, experienceMode]);

  // When Country changes, reset region if incompatible
  const setSelectedCountry = (country: Country | null) => {
    setSelectedCountryState(country);
    if (!country) {
      setSelectedRegionState(null);
      return;
    }
    if (selectedRegion && !country.regions.some(r => r.id === selectedRegion.id)) {
      const firstRegion = country.regions[0] || null;
      setSelectedRegionState(firstRegion);
      if (firstRegion) {
        setRegion({
          id: firstRegion.id,
          name: `${firstRegion.name} (${firstRegion.code})`,
          code: firstRegion.code,
          currency: firstRegion.currency,
          currencySymbol: firstRegion.currencySymbol,
          laborMultiplier: firstRegion.laborMultiplier,
          shippingMultiplier: firstRegion.shippingMultiplier,
          avgHourlyLaborRateUSD: firstRegion.avgHourlyLaborRateUSD
        });
      }
    }
  };

  const setSelectedRegion = (region: Region | null) => {
    setSelectedRegionState(region);
    if (region) {
      setRegion({
        id: region.id,
        name: `${region.name} (${region.code})`,
        code: region.code,
        currency: region.currency,
        currencySymbol: region.currencySymbol,
        laborMultiplier: region.laborMultiplier,
        shippingMultiplier: region.shippingMultiplier,
        avgHourlyLaborRateUSD: region.avgHourlyLaborRateUSD
      });
    }
  };

  const setExperienceMode = (mode: ExperienceMode) => {
    setExperienceModeState(mode);
    if (mode === 'beginner') {
      setExperienceLevel(EXPERIENCE_LEVELS[0]);
    } else {
      setExperienceLevel(EXPERIENCE_LEVELS[1]);
    }
  };

  const setSelectedBrand = (brand: VehicleBrand | null) => {
    setSelectedBrandState(brand);
    if (brand && activeVehicle) {
      const isVehicleMatching = VEHICLES.some(v => v.id === activeVehicle.id && v.brandId === brand.id);
      if (!isVehicleMatching) {
        const fallbackVehicle = VEHICLES.find(v => v.brandId === brand.id);
        if (fallbackVehicle) {
          setActiveVehicle(fallbackVehicle);
        }
      }
    }
  };

  const setSelectedVehicleType = (type: VehicleTypeCategory | null) => {
    setSelectedVehicleTypeState(type);
    if (type && activeVehicle) {
      const isTypeMatching = (activeVehicle as any).typeId === type.id;
      if (!isTypeMatching) {
        const fallbackVehicle = VEHICLES.find(v => (v as any).typeId === type.id);
        if (fallbackVehicle) {
          setActiveVehicle(fallbackVehicle);
        }
      }
    }
  };

  // Changing Active Vehicle triggers revalidation of build components
  const setActiveVehicle = (vehicle: Vehicle) => {
    const prevVehicle = activeVehicle;
    setActiveVehicleState(vehicle);
    setSelectedModel(vehicle.model);

    // If vehicle changed, revalidate build
    if (prevVehicle && prevVehicle.id !== vehicle.id && buildComponents.length > 0) {
      const { components: revalidated, notice } = BuildService.revalidateBuildForVehicle(
        buildComponents,
        vehicle,
        selectedCountry,
        selectedRegion,
        experienceMode
      );
      setBuildComponents(revalidated);
      setRevalidationNotice(notice);
    }
  };

  const resetDiscoveryFlow = () => {
    setSelectedCountryState(COUNTRIES[0]);
    setSelectedRegionState(COUNTRIES[0].regions[0]);
    setExperienceModeState('beginner');
    setSelectedBrandState(VEHICLE_BRANDS[0]);
    setSelectedVehicleTypeState(VEHICLE_TYPES[0]);
    setActiveVehicleState(VEHICLES[0]);
    setSelectedModel(VEHICLES[0].model);
  };

  const logoutUser = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const triggerRoutePreloader = (targetPath?: string) => {
    if (targetPath) {
      setPendingPath(targetPath);
    }
    setIsRouteLoading(true);
  };

  const closeRoutePreloader = () => {
    setIsRouteLoading(false);
    if (pendingPath) {
      navigateTo(pendingPath);
      setPendingPath(null);
    }
  };

  // ==========================================
  // PHYSICAL BUILD MODIFICATION HANDLERS
  // ==========================================
  const addComponentToBuild = (component: ModificationComponent | ExtendedModificationComponent) => {
    // Resolve extended modification component if necessary
    const extComp: ExtendedModificationComponent =
      'supportedVehicles' in component
        ? (component as ExtendedModificationComponent)
        : MODIFICATION_COMPONENTS.find(c => c.id === component.id) || (component as any);

    if (!buildComponents.some(c => c.componentId === extComp.id)) {
      const newBuildComp = BuildService.createBuildComponent(
        extComp,
        activeVehicle,
        selectedCountry,
        selectedRegion,
        experienceMode
      );
      setBuildComponents(prev => [...prev, newBuildComp]);
    }
  };

  const removeComponentFromBuild = (componentId: string) => {
    setBuildComponents(prev => prev.filter(c => c.componentId !== componentId && c.id !== componentId));
  };

  const toggleComponentInBuild = (component: ModificationComponent | ExtendedModificationComponent) => {
    const id = component.id;
    if (buildComponents.some(c => c.componentId === id || c.id === id)) {
      removeComponentFromBuild(id);
    } else {
      addComponentToBuild(component);
    }
  };

  const clearBuild = () => {
    setBuildComponents([]);
    setRevalidationNotice(null);
  };

  const updateBuildName = (name: string) => {
    setBuildName(name);
    setBuildTitle(name);
  };

  const addBuildNote = (text: string) => {
    if (!text.trim()) return;
    const newNote: BuildNote = {
      id: `note-${Date.now()}`,
      text: text.trim(),
      createdAt: new Date().toLocaleDateString()
    };
    setBuildNotes(prev => [newNote, ...prev]);
  };

  const editBuildNote = (id: string, text: string) => {
    setBuildNotes(prev => prev.map(n => (n.id === id ? { ...n, text } : n)));
  };

  const deleteBuildNote = (id: string) => {
    setBuildNotes(prev => prev.filter(n => n.id !== id));
  };

  const dismissRevalidationNotice = () => {
    setRevalidationNotice(null);
  };

  const loadSavedBuild = (saved: SavedBuild) => {
    if (saved.vehicle) {
      setActiveVehicleState(saved.vehicle);
      setSelectedModel(saved.vehicle.model);
    }
    if (saved.country) {
      setSelectedCountryState(saved.country);
    }
    if (saved.region) {
      setSelectedRegionState(saved.region);
    }
    if (saved.experienceMode) {
      setExperienceModeState(saved.experienceMode);
    }
    if (saved.buildName) {
      setBuildName(saved.buildName);
      setBuildTitle(saved.buildName);
    }
    if (saved.notes) {
      setBuildNotes(saved.notes);
    }
    if (saved.components && saved.components.length > 0) {
      setBuildComponents(saved.components);
    }
    setRevalidationNotice(null);
  };

  // Legacy calculations for backward-compatibility
  const totalPartCostUSD = useMemo(() => {
    return selectedComponents.reduce((sum, c) => sum + c.priceUSD, 0);
  }, [selectedComponents]);

  const totalInstallLaborUSD = useMemo(() => {
    const totalHours = selectedComponents.reduce((sum, c) => sum + c.installHours, 0);
    return Math.round(totalHours * currentRegion.avgHourlyLaborRateUSD * currentRegion.laborMultiplier);
  }, [selectedComponents, currentRegion]);

  const totalBuildCostUSD = totalPartCostUSD + totalInstallLaborUSD;

  const totalPowerGainHp = useMemo(() => {
    return selectedComponents.reduce((sum, c) => sum + c.powerGainHp, 0);
  }, [selectedComponents]);

  const totalWeightDeltaKg = useMemo(() => {
    return selectedComponents.reduce((sum, c) => sum + c.weightDeltaKg, 0);
  }, [selectedComponents]);

  const projectedPowerHp = activeVehicle.baselinePowerHp + totalPowerGainHp;
  const projectedWeightKg = activeVehicle.weightKg + totalWeightDeltaKg;

  const overallCompatibility = useMemo(() => {
    if (buildComponents.some(c => c.compatibilityStatus === 'not_compatible')) {
      return 'conflict';
    }
    if (buildComponents.some(c => c.compatibilityStatus === 'verification_required' || c.compatibilityStatus === 'conditionally_compatible')) {
      return 'verificationRequired';
    }
    return 'compatible';
  }, [buildComponents]);

  const [activeEngineerComponentId, setActiveEngineerComponentId] = useState<string | null>(null);
  const [activeEngineerWorkshopId, setActiveEngineerWorkshopId] = useState<string | null>(null);

  const askEngineerAboutComponent = (componentId: string) => {
    setActiveEngineerComponentId(componentId);
    setActiveEngineerWorkshopId(null);
    navigateTo('/ai-engineer');
  };

  const askEngineerAboutWorkshop = (workshopId: string) => {
    setActiveEngineerWorkshopId(workshopId);
    setActiveEngineerComponentId(null);
    navigateTo('/ai-engineer');
  };

  return (
    <AppContext.Provider
      value={{
        activeVehicle,
        setActiveVehicle,
        selectedComponents,
        addComponentToBuild,
        removeComponentFromBuild,
        toggleComponentInBuild,
        clearBuild,
        loadSavedBuild,
        buildState,
        buildComponents,
        updateBuildName,
        addBuildNote,
        editBuildNote,
        deleteBuildNote,
        dismissRevalidationNotice,
        currentRegion,
        setRegion,
        experienceLevel,
        setExperienceLevel,
        currentPath,
        navigateTo,
        isRouteLoading,
        triggerRoutePreloader,
        closeRoutePreloader,
        buildTitle,
        setBuildTitle,
        selectedCountry,
        selectedRegion,
        experienceMode,
        selectedBrand,
        selectedVehicleType,
        selectedModel,
        setSelectedCountry,
        setSelectedRegion,
        setExperienceMode,
        setSelectedBrand,
        setSelectedVehicleType,
        setSelectedModel,
        resetDiscoveryFlow,
        totalPartCostUSD,
        totalInstallLaborUSD,
        totalBuildCostUSD,
        totalPowerGainHp,
        totalWeightDeltaKg,
        projectedPowerHp,
        projectedWeightKg,
        overallCompatibility,
        currentUser,
        isAuthenticated: !!currentUser,
        isGuest: currentUser?.role === 'guest',
        setCurrentUser,
        logoutUser,
        activeEngineerComponentId,
        setActiveEngineerComponentId,
        askEngineerAboutComponent,
        activeEngineerWorkshopId,
        setActiveEngineerWorkshopId,
        askEngineerAboutWorkshop
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
