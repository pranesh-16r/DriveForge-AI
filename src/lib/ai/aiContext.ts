import { Vehicle, Country, Region, ExperienceMode } from '../../types';
import { BuildState, BuildComponent } from '../../types/build';
import { ExtendedModificationComponent, CompatibilityStatus } from '../../types/modification';
import { MODIFICATION_COMPONENTS } from '../../data/modificationComponents';
import { WORKSHOPS_DIRECTORY } from '../../data/workshopsData';
import { matchWorkshopsToBuild } from '../workshops/workshopMatchingService';
import { CompatibilityService } from '../../services/compatibilityService';
import { PricingService } from '../../services/pricingService';
import { InstallationService } from '../../services/installationService';
import { BuildAnalysisService } from '../../services/buildAnalysisService';

export interface AIComponentSummary {
  id: string;
  name: string;
  category: string;
  brand: string;
  priceEstimate: string;
  laborHours: number;
  powerGainHp: number;
  weightDeltaKg: number;
  compatibility: CompatibilityStatus;
  notes?: string;
}

export interface DriveForgeAIContext {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    variant: string;
    year: number;
    engine: string;
    drivetrain: string;
    powerHp: number;
    torqueLbFt: number;
    weightKg: number;
    chassisCode: string;
    color: string;
  };
  location: {
    country: string;
    countryCode: string;
    region: string;
    regionCode: string;
    currency: string;
    currencySymbol: string;
  };
  experienceMode: ExperienceMode;
  build: {
    id: string;
    name: string;
    componentCount: number;
    healthStatus: 'GOOD' | 'REVIEW' | 'ATTENTION';
    healthHeadline: string;
    components: AIComponentSummary[];
  };
  activeComponent?: {
    id: string;
    name: string;
    category: string;
    brand: string;
    description: string;
    powerGainHp: number;
    weightDeltaKg: number;
    priceEstimate: string;
    installDifficulty: string;
    specifications: Record<string, string>;
  } | null;
  activeWorkshop?: {
    id: string;
    name: string;
    city: string;
    region: string;
    country: string;
    services: string[];
    specialties: string[];
    capabilities: string[];
    matchLevel: string;
    matchReason: string;
    supportedComponents: string[];
    missingServices: string[];
  } | null;
  compatibility: {
    overallStatus: 'compatible' | 'review' | 'attention';
    passedCount: number;
    conditionalCount: number;
    conflictCount: number;
    issues: {
      componentName: string;
      status: string;
      message: string;
      recommendation?: string;
    }[];
  };
  cost: {
    currency: string;
    currencySymbol: string;
    partsMin: number;
    partsMax: number;
    partsFormatted: string;
    laborMin: number;
    laborMax: number;
    laborFormatted: string;
    totalMin: number;
    totalMax: number;
    totalFormatted: string;
    confidence: string;
  };
  performance: {
    stockHp: number;
    projectedHpMin: number;
    projectedHpMax: number;
    deltaHpMin: number;
    deltaHpMax: number;
    stockTorqueNm: number;
    projectedTorqueMinNm: number;
    projectedTorqueMaxNm: number;
    stockWeightKg: number;
    projectedWeightKg: number;
    weightDeltaKg: number;
    acceleration0to100StockSec?: number;
    acceleration0to100ProjMinSec?: number;
    acceleration0to100ProjMaxSec?: number;
    corneringStability: string;
    rideComfort: string;
    steeringResponse: string;
    thermalRisk: 'Low' | 'Moderate' | 'High';
    torqueLoadRisk: 'Low' | 'Moderate' | 'High';
    confidence: string;
  };
  verificationRequirements: {
    id: string;
    title: string;
    description: string;
    componentId?: string;
    componentName?: string;
    severity: 'critical' | 'recommended' | 'informational';
  }[];
}

/**
 * Builds a normalized, structured AI context from the application's actual BuildState
 */
export function buildAIContext(
  vehicle: Vehicle,
  buildState: BuildState,
  buildComponents: BuildComponent[],
  country: Country | null,
  region: Region | null,
  experienceMode: ExperienceMode = 'beginner',
  activeComponentId?: string | null,
  activeWorkshopId?: string | null
): DriveForgeAIContext {
  const currency = region?.currency || country?.currency || 'USD';
  const currencySymbol = region?.currencySymbol || country?.currencySymbol || '$';

  // 1. Resolve full component entities
  const fullComponents: ExtendedModificationComponent[] = buildComponents
    .map(bc => bc.rawComponent || MODIFICATION_COMPONENTS.find(c => c.id === bc.componentId)!)
    .filter(Boolean);

  // 2. Compatibility evaluation
  const compatResults = fullComponents.map(comp => 
    CompatibilityService.evaluate(comp, vehicle, experienceMode)
  );

  const passedCount = compatResults.filter(r => r.status === 'compatible').length;
  const conditionalCount = compatResults.filter(r => r.status === 'conditionally_compatible' || r.status === 'verification_required').length;
  const conflictCount = compatResults.filter(r => r.status === 'not_compatible').length;

  const overallStatus = conflictCount > 0 ? 'attention' : conditionalCount > 0 ? 'review' : 'compatible';

  const issues = compatResults
    .filter(r => r.status !== 'compatible')
    .map((r, idx) => ({
      componentName: fullComponents[idx]?.name || 'Component',
      status: r.status,
      message: r.explanation || r.warningConditions.join(', ') || 'Fitment check required',
      recommendation: r.fitmentNotes || 'Verify mechanical clearances prior to installation'
    }));

  // 3. Pricing & Labor calculations using Phase 6 services
  let partsMin = 0;
  let partsMax = 0;
  let laborMin = 0;
  let laborMax = 0;

  const componentSummaries: AIComponentSummary[] = fullComponents.map((comp, idx) => {
    const partCost = PricingService.calculateRegionalPartCost(comp, country, region);
    const installCost = InstallationService.calculateRegionalInstallationCost(comp, vehicle, country, region);
    
    partsMin += partCost.min;
    partsMax += partCost.max;
    laborMin += installCost.min;
    laborMax += installCost.max;

    const compat = compatResults[idx];

    return {
      id: comp.id,
      name: comp.name,
      category: comp.category,
      brand: comp.brand,
      priceEstimate: partCost.display,
      laborHours: comp.installationEstimate?.hours || 1.5,
      powerGainHp: comp.powerGainHp || 0,
      weightDeltaKg: comp.weightDeltaKg || 0,
      compatibility: compat?.status || 'compatible',
      notes: comp.compatibilityNotes
    };
  });

  const totalMin = partsMin + laborMin;
  const totalMax = partsMax + laborMax;

  // 4. Performance analysis using Phase 7 calculation engine
  const perfAnalysis = BuildAnalysisService.analyze(vehicle, buildComponents, buildState);

  // 5. Active component context (if specified)
  let activeCompSummary = null;
  if (activeComponentId) {
    const found = MODIFICATION_COMPONENTS.find(c => c.id === activeComponentId);
    if (found) {
      const partCost = PricingService.calculateRegionalPartCost(found, country, region);
      activeCompSummary = {
        id: found.id,
        name: found.name,
        category: found.category,
        brand: found.brand,
        description: found.description,
        powerGainHp: found.powerGainHp || 0,
        weightDeltaKg: found.weightDeltaKg || 0,
        priceEstimate: partCost.display,
        installDifficulty: found.installationDifficulty || 'bolt_on',
        specifications: found.specifications || {}
      };
    }
  }

  // Active Workshop Context (Phase 9)
  let activeWorkshopSummary = null;
  if (activeWorkshopId) {
    const foundWorkshop = WORKSHOPS_DIRECTORY.find(w => w.id === activeWorkshopId);
    if (foundWorkshop) {
      const [matched] = matchWorkshopsToBuild([foundWorkshop], buildComponents, vehicle);
      activeWorkshopSummary = {
        id: foundWorkshop.id,
        name: foundWorkshop.name,
        city: foundWorkshop.city,
        region: foundWorkshop.region,
        country: foundWorkshop.country,
        services: foundWorkshop.services,
        specialties: foundWorkshop.specialties,
        capabilities: foundWorkshop.installationCapabilities,
        matchLevel: matched?.matchLevel || 'UNKNOWN',
        matchReason: matched?.matchReason || '',
        supportedComponents: matched?.matchedServices || [],
        missingServices: matched?.missingServices || []
      };
    }
  }

  // 6. Verification requirements extraction
  const verificationRequirements = perfAnalysis.verificationRequirements.map(v => ({
    id: v.id,
    title: v.title,
    description: v.description,
    componentId: v.id,
    componentName: v.triggerComponent,
    severity: (v.isSafetyCritical ? 'critical' : 'recommended') as 'critical' | 'recommended' | 'informational'
  }));

  // Build Health Headline
  const healthStatus = conflictCount > 0 ? 'ATTENTION' : conditionalCount > 0 ? 'REVIEW' : 'GOOD';
  const healthHeadline = healthStatus === 'GOOD'
    ? 'All selected physical components show verified mechanical fitment.'
    : healthStatus === 'REVIEW'
    ? `${conditionalCount} component(s) require physical clearance or calibration verification.`
    : `${conflictCount} component(s) have mechanical conflict or mounting incompatibility.`;

  return {
    vehicle: {
      id: vehicle.id,
      brand: vehicle.make,
      model: vehicle.model,
      variant: vehicle.trim || 'Standard',
      year: vehicle.year,
      engine: vehicle.engine,
      drivetrain: vehicle.drivetrain,
      powerHp: vehicle.baselinePowerHp,
      torqueLbFt: vehicle.baselineTorqueLbFt,
      weightKg: vehicle.weightKg,
      chassisCode: vehicle.chassisCode || 'OEM',
      color: vehicle.colorHex || '#C0C0C0'
    },
    location: {
      country: country?.name || 'India',
      countryCode: country?.code || 'IN',
      region: region?.name || 'Tamil Nadu',
      regionCode: region?.code || 'IN-TN',
      currency,
      currencySymbol
    },
    experienceMode,
    build: {
      id: buildState.buildId,
      name: buildState.buildName || `${vehicle.year} ${vehicle.make} ${vehicle.model} Build`,
      componentCount: buildComponents.length,
      healthStatus,
      healthHeadline,
      components: componentSummaries
    },
    activeComponent: activeCompSummary,
    activeWorkshop: activeWorkshopSummary,
    compatibility: {
      overallStatus,
      passedCount,
      conditionalCount,
      conflictCount,
      issues
    },
    cost: {
      currency,
      currencySymbol,
      partsMin,
      partsMax,
      partsFormatted: PricingService.formatCompactRange(partsMin, partsMax, currencySymbol, currency),
      laborMin,
      laborMax,
      laborFormatted: PricingService.formatCompactRange(laborMin, laborMax, currencySymbol, currency),
      totalMin,
      totalMax,
      totalFormatted: PricingService.formatCompactRange(totalMin, totalMax, currencySymbol, currency),
      confidence: fullComponents.length > 0 ? 'ESTIMATED' : 'KNOWN DATA'
    },
    performance: {
      stockHp: perfAnalysis.power.stockHp,
      projectedHpMin: perfAnalysis.power.projectedMinHp,
      projectedHpMax: perfAnalysis.power.projectedMaxHp,
      deltaHpMin: perfAnalysis.power.estimatedGainMinHp,
      deltaHpMax: perfAnalysis.power.estimatedGainMaxHp,
      stockTorqueNm: perfAnalysis.torque.stockNm,
      projectedTorqueMinNm: perfAnalysis.torque.projectedMinNm,
      projectedTorqueMaxNm: perfAnalysis.torque.projectedMaxNm,
      stockWeightKg: perfAnalysis.weight.stockKg,
      projectedWeightKg: perfAnalysis.weight.projectedKg,
      weightDeltaKg: perfAnalysis.weight.deltaKg,
      acceleration0to100StockSec: perfAnalysis.acceleration.stockZeroTo100Seconds,
      acceleration0to100ProjMinSec: perfAnalysis.acceleration.projectedZeroTo100MinSeconds,
      acceleration0to100ProjMaxSec: perfAnalysis.acceleration.projectedZeroTo100MaxSeconds,
      corneringStability: perfAnalysis.handling.corneringStability,
      rideComfort: perfAnalysis.handling.rideComfort,
      steeringResponse: perfAnalysis.handling.steeringResponse,
      thermalRisk: perfAnalysis.thermal.thermalLoadIndex === 'critical' || perfAnalysis.thermal.thermalLoadIndex === 'high' ? 'High' : perfAnalysis.thermal.thermalLoadIndex === 'moderate' ? 'Moderate' : 'Low',
      torqueLoadRisk: perfAnalysis.reliability.concernLevel === 'REVIEW REQUIRED' ? 'High' : perfAnalysis.reliability.concernLevel === 'MODERATE CONCERN' ? 'Moderate' : 'Low',
      confidence: perfAnalysis.power.confidence
    },
    verificationRequirements
  };
}
