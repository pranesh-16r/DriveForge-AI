import { Vehicle } from '../../types';
import { BuildComponent } from '../../types/build';
import {
  Workshop,
  WorkshopMatchResult,
  WorkshopMatchLevel,
  BuildInstallationRequirements,
  ComponentServiceRequirement
} from './workshopTypes';

/**
 * Maps build components to required workshop services, capabilities, and verification checks.
 */
export function extractBuildInstallationRequirements(
  vehicle: Vehicle,
  buildComponents: BuildComponent[]
): BuildInstallationRequirements {
  const requirements: ComponentServiceRequirement[] = [];
  const requiredServicesSet = new Set<string>();
  const verificationSet = new Set<string>();

  let hasHighComplexity = false;
  let hasModerateComplexity = false;

  buildComponents.forEach(bc => {
    const raw = bc.rawComponent;
    const cat = (raw?.category || bc.category || '').toLowerCase();
    const name = (raw?.name || bc.name || '').toLowerCase();
    const subCat = (raw?.subCategory || '').toLowerCase();

    const services: string[] = [];
    let safetyCritical = false;

    // 1. Suspension & Coilovers
    if (cat === 'suspension' || subCat.includes('coilover') || name.includes('coilover') || name.includes('spring')) {
      services.push('Suspension Installation');
      services.push('Alignment');
      if (name.includes('coilover')) {
        services.push('Coilover Installation');
        hasHighComplexity = true;
      } else {
        hasModerateComplexity = true;
      }
      safetyCritical = true;
      verificationSet.add('4-Wheel Alignment Verification');
      verificationSet.add('Suspension Travel & Fender Clearance');
    }

    // 2. Brakes
    if (cat === 'brakes' || name.includes('brake') || name.includes('caliper') || name.includes('rotor')) {
      services.push('Brake Installation');
      safetyCritical = true;
      if (name.includes('big brake') || name.includes('bbk') || name.includes('6-piston') || name.includes('4-piston')) {
        hasHighComplexity = true;
        verificationSet.add('Caliper-to-Spoke Barrel Clearance Check');
        verificationSet.add('Brake Hydraulic Bleed & Pressure Test');
      } else {
        hasModerateComplexity = true;
        verificationSet.add('Brake Pad Bedding & Fluid Flush');
      }
    }

    // 3. Wheels & Tyres
    if (cat === 'wheels_tires' || name.includes('wheel') || name.includes('tyre') || name.includes('tire')) {
      services.push('Wheel & Tyre Installation');
      services.push('Alignment');
      verificationSet.add('Wheel Offset & Inner Strut Clearance');
      verificationSet.add('Lug Nut Torque to OEM Spec');
      hasModerateComplexity = true;
    }

    // 4. Exhaust
    if (cat === 'exhaust' || name.includes('exhaust') || name.includes('downpipe') || name.includes('cat-back') || name.includes('header')) {
      services.push('Exhaust Installation');
      if (name.includes('downpipe') || name.includes('header')) {
        services.push('Fabrication');
        hasHighComplexity = true;
        verificationSet.add('Exhaust Hanger Clearance & Heat Shielding');
      } else {
        hasModerateComplexity = true;
      }
    }

    // 5. Powertrain, Intake, Intercooler
    if (cat === 'powertrain' || name.includes('intake') || name.includes('intercooler') || name.includes('turbo') || name.includes('radiator')) {
      if (name.includes('intake')) services.push('Intake Installation');
      if (name.includes('intercooler')) {
        services.push('Intercooler Installation');
        services.push('Cooling System Work');
        hasHighComplexity = true;
        verificationSet.add('Coupler Boost Leak & Charge Pipe Fitment');
      }
      if (name.includes('radiator') || name.includes('oil cooler')) {
        services.push('Cooling System Work');
        hasModerateComplexity = true;
        verificationSet.add('Coolant/Oil Circuit Leak Check');
      }
      if (services.length === 0) {
        services.push('Performance Tuning');
      }
    }

    // 6. Electronics & ECU Tuning
    if (cat === 'electronics' || name.includes('tune') || name.includes('ecu') || name.includes('reflash') || name.includes('cobb')) {
      services.push('ECU Tuning');
      services.push('Performance Tuning');
      hasHighComplexity = true;
      verificationSet.add('Dyno Baseline & Air-Fuel Ratio Telemetry');
    }

    // 7. Aerodynamics & Exterior
    if (cat === 'aerodynamics' || cat === 'exterior' || name.includes('splitter') || name.includes('wing') || name.includes('diffuser') || name.includes('spoiler')) {
      services.push('Body Kit Installation');
      if (name.includes('wing') || name.includes('spoiler')) {
        services.push('Spoiler Installation');
      }
      if (name.includes('chassis mounted') || name.includes('splitter')) {
        services.push('Fabrication');
        verificationSet.add('Aero Downforce Chassis Anchor Integrity');
      }
      hasModerateComplexity = true;
    }

    // 8. Interior / Safety
    if (cat === 'interior' || name.includes('seat') || name.includes('harness') || name.includes('cage') || name.includes('gauge')) {
      services.push('Electrical / Interior Installation');
      if (name.includes('cage') || name.includes('bar')) {
        services.push('Fabrication');
        safetyCritical = true;
      }
    }

    // Fallback if generic
    if (services.length === 0) {
      services.push('Performance Tuning');
    }

    services.forEach(s => requiredServicesSet.add(s));

    requirements.push({
      componentId: bc.componentId,
      componentName: raw?.name || bc.name,
      category: raw?.category || bc.category,
      requiredServices: services,
      isSafetyCritical: safetyCritical
    });
  });

  const requiredServices = Array.from(requiredServicesSet);
  const verificationItems = Array.from(verificationSet);

  let complexityLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  if (hasHighComplexity || buildComponents.length >= 4) {
    complexityLevel = 'HIGH';
  } else if (hasModerateComplexity || buildComponents.length >= 2) {
    complexityLevel = 'MODERATE';
  }

  return {
    vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    componentCount: buildComponents.length,
    requiredServices,
    complexityLevel,
    verificationCount: verificationItems.length,
    verificationItems,
    requirements
  };
}

/**
 * Matches a list of workshops against the user's active build requirements.
 */
export function matchWorkshopsToBuild(
  workshops: Workshop[],
  buildComponents: BuildComponent[],
  vehicle?: Vehicle
): WorkshopMatchResult[] {
  // If no build components, return UNKNOWN matches
  if (buildComponents.length === 0) {
    return workshops.map(workshop => ({
      workshop,
      matchLevel: 'UNKNOWN' as WorkshopMatchLevel,
      matchedServices: [],
      missingServices: [],
      matchReason: 'No components in physical build to evaluate installation match.',
      matchScore: 0,
      supportedComponentsCount: 0,
      totalComponentsCount: 0
    }));
  }

  const dummyVehicle: Vehicle = vehicle || {
    id: 'unknown',
    make: 'Generic',
    model: 'Vehicle',
    year: 2024,
    trim: '',
    engine: '',
    baselinePowerHp: 300,
    baselineTorqueLbFt: 300,
    weightKg: 1400,
    drivetrain: 'RWD',
    transmission: 'Manual',
    priceMsrpUSD: 35000,
    imageUrl: '',
    colorHex: '#fff',
    chassisCode: '',
    description: ''
  };

  const buildReqs = extractBuildInstallationRequirements(dummyVehicle, buildComponents);
  const allRequiredServices = buildReqs.requiredServices;

  return workshops.map(workshop => {
    const workshopServices = new Set(workshop.services.map(s => s.toLowerCase()));

    // Evaluate matched services
    const matchedServices = allRequiredServices.filter(req => 
      workshopServices.has(req.toLowerCase())
    );

    const missingServices = allRequiredServices.filter(req => 
      !workshopServices.has(req.toLowerCase())
    );

    // Evaluate how many components are fully supported
    let supportedComponentsCount = 0;
    buildReqs.requirements.forEach(cr => {
      const allSupported = cr.requiredServices.every(s => 
        workshopServices.has(s.toLowerCase())
      );
      if (allSupported) {
        supportedComponentsCount++;
      }
    });

    const coverageRatio = allRequiredServices.length > 0 
      ? matchedServices.length / allRequiredServices.length 
      : 0;

    let matchLevel: WorkshopMatchLevel = 'UNKNOWN';
    let matchScore = Math.round(coverageRatio * 100);
    let matchReason = '';

    if (coverageRatio >= 0.70 || (allRequiredServices.length <= 2 && coverageRatio === 1)) {
      matchLevel = 'GOOD MATCH';
      const serviceSummary = matchedServices.slice(0, 3).map(s => s.replace(' Installation', '')).join(', ');
      matchReason = `Supports ${serviceSummary} required by your current build.`;
    } else if (coverageRatio > 0) {
      matchLevel = 'PARTIAL MATCH';
      const supportedSummary = matchedServices.map(s => s.replace(' Installation', '')).join(', ');
      const missingSummary = missingServices.slice(0, 2).map(s => s.replace(' Installation', '')).join(' or ');
      matchReason = `Supports ${supportedSummary}; ${missingSummary} may require a separate specialist.`;
    } else {
      matchLevel = 'UNKNOWN';
      matchReason = 'Service information does not list the primary installation capabilities for this build.';
      matchScore = 10;
    }

    return {
      workshop,
      matchLevel,
      matchedServices,
      missingServices,
      matchReason,
      matchScore,
      supportedComponentsCount,
      totalComponentsCount: buildComponents.length
    };
  }).sort((a, b) => {
    // Sort primarily by match score (highest match first), then distance if available
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    if (a.workshop.distance != null && b.workshop.distance != null) {
      return a.workshop.distance - b.workshop.distance;
    }
    return 0;
  });
}
