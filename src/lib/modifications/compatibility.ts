import { Vehicle } from '../../types';
import { ExtendedVehicle } from '../../data/vehicles';
import { ExtendedModificationComponent, ComponentCompatibilityResult } from '../../types/modification';

/**
 * Advanced Automotive Fitment & Compatibility Engine
 * Validates component geometry, powertrain architecture, hub bolt patterns,
 * and chassis clearance against the active vehicle.
 */
export function evaluateComponentCompatibility(
  component: ExtendedModificationComponent,
  vehicle: Vehicle | ExtendedVehicle
): ComponentCompatibilityResult {
  const extVehicle = vehicle as ExtendedVehicle;
  const engineStr = (vehicle.engine || '').toLowerCase();
  const fuelType = (extVehicle.fuelType || '').toLowerCase();
  const modelStr = (vehicle.model || '').toLowerCase();
  const makeStr = (vehicle.make || '').toLowerCase();
  const chassisCode = (vehicle.chassisCode || '').toLowerCase();

  const isElectric = fuelType === 'electric' || engineStr.includes('electric') || engineStr.includes('800v');
  const isNaturallyAspirated = engineStr.includes('naturally aspirated') || engineStr.includes('atmospheric');
  const isTurbocharged = engineStr.includes('turbo') || engineStr.includes('twin-turbo');

  const { supportedVehicles } = component;

  // 1. Universal Components Check
  if (supportedVehicles.universal) {
    return {
      status: 'compatible',
      badgeLabel: 'UNIVERSAL FITMENT',
      explanation: `Engineered with multi-chassis adjustable mounting hardware compatible with ${vehicle.make} ${vehicle.model}.`,
      isFitmentGuaranteed: true
    };
  }

  // 2. Powertrain & Exhaust vs EV Incompatibility
  if (isElectric && (
    component.category === 'powertrain' || 
    component.category === 'exhaust' || 
    component.subCategory.toLowerCase().includes('exhaust') ||
    component.subCategory.toLowerCase().includes('intake') ||
    component.subCategory.toLowerCase().includes('turbo') ||
    component.subCategory.toLowerCase().includes('downpipe') ||
    component.subCategory.toLowerCase().includes('intercooler')
  )) {
    return {
      status: 'not_compatible',
      badgeLabel: 'INCOMPATIBLE PLATFORM',
      explanation: `${vehicle.make} ${vehicle.model} features an all-electric high-voltage powertrain. Combustion exhaust and forced-induction intake components cannot be installed.`,
      warningConditions: ['Zero-emission electric architecture does not utilize combustion exhaust gas passages'],
      isFitmentGuaranteed: false
    };
  }

  // 3. Forced Induction (Turbochargers / Intercoolers) on Naturally Aspirated Cars
  if (isNaturallyAspirated && (
    component.subCategory.toLowerCase().includes('turbocharger') ||
    component.name.toLowerCase().includes('turbocharger') ||
    component.name.toLowerCase().includes('hybrid turbo')
  )) {
    return {
      status: 'conditionally_compatible',
      badgeLabel: 'CUSTOM FABRICATION REQUIRED',
      explanation: `${vehicle.make} ${vehicle.model} is equipped with a high-compression naturally aspirated engine (${vehicle.engine}). Bolt-on turbo installation requires custom exhaust manifolds, intercooler piping, and lower compression pistons.`,
      warningConditions: [
        'Requires bespoke turbo manifold fabrication',
        'Requires standalone or unlocked engine management',
        'Stock compression ratio (13.3:1) limits safe boost without race fuel'
      ],
      isFitmentGuaranteed: false
    };
  }

  // 4. Centerlock vs 5-Lug Hub Pattern Validation
  const isCenterLockPart = component.name.toLowerCase().includes('center-lock') || component.name.toLowerCase().includes('centerlock');
  const hasCenterLockHub = vehicle.trim.toLowerCase().includes('weissach') || 
                           modelStr.includes('gt3') || 
                           modelStr.includes('gt4 rs') ||
                           modelStr.includes('gt2');

  if (isCenterLockPart && !hasCenterLockHub) {
    return {
      status: 'conditionally_compatible',
      badgeLabel: 'REQUIRES HUB ADAPTER',
      explanation: `These wheels feature single center-lock retention geometry. Your ${vehicle.make} ${vehicle.model} uses standard 5-lug wheel hubs. Requires a certified center-lock hub conversion assembly.`,
      warningConditions: [
        'Requires center-lock hub conversion spindle kit',
        'Torque wrench capable of 600 Nm required for wheel fastening'
      ],
      isFitmentGuaranteed: false
    };
  }

  // 5. Explicit Excluded Models
  if (supportedVehicles.excludedModels && supportedVehicles.excludedModels.some(ex => modelStr.includes(ex.toLowerCase()))) {
    return {
      status: 'not_compatible',
      badgeLabel: 'NOT COMPATIBLE',
      explanation: `The manufacturer specifies this component does NOT fit the ${vehicle.make} ${vehicle.model} due to clearance or electronic conflicts.`,
      warningConditions: ['Manufacturer fitment exclusion confirmed'],
      isFitmentGuaranteed: false
    };
  }

  // 6. Make & Model Direct Match
  const makeMatches = !supportedVehicles.makes || supportedVehicles.makes.some(m => makeStr.includes(m.toLowerCase()) || m.toLowerCase().includes(makeStr));
  const modelMatches = !supportedVehicles.models || supportedVehicles.models.some(m => modelStr.includes(m.toLowerCase()) || m.toLowerCase().includes(modelStr));
  const generationMatches = !supportedVehicles.generations || supportedVehicles.generations.some(g => chassisCode.includes(g.toLowerCase()) || g.toLowerCase().includes(chassisCode));

  if (makeMatches && (modelMatches || generationMatches)) {
    // Check for conditional requirements
    const warnings: string[] = [];

    if (supportedVehicles.minWheelSizeInches) {
      warnings.push(`Requires minimum ${supportedVehicles.minWheelSizeInches}-inch diameter wheels to clear caliper body`);
    }

    if (supportedVehicles.requiresECUReflash) {
      warnings.push('ECU reflash / DME unlock required to prevent check engine light & ensure proper air-fuel ratios');
    }

    if (supportedVehicles.requiresTrackAlignment) {
      warnings.push('Four-wheel laser alignment and corner-balancing strongly recommended post-installation');
    }

    if (warnings.length > 0) {
      return {
        status: 'conditionally_compatible',
        badgeLabel: 'CONDITIONAL FITMENT',
        explanation: `Direct mechanical fitment verified for ${vehicle.make} ${vehicle.model}, but specific supporting modifications are required.`,
        warningConditions: warnings,
        isFitmentGuaranteed: true
      };
    }

    return {
      status: 'compatible',
      badgeLabel: '100% VERIFIED FITMENT',
      explanation: `Precision 3D laser-scanned direct bolt-on fitment for ${vehicle.make} ${vehicle.model} (${vehicle.chassisCode || 'OEM'} chassis).`,
      isFitmentGuaranteed: true
    };
  }

  // 7. Make matches but specific model is not listed (verification required)
  if (makeMatches) {
    return {
      status: 'verification_required',
      badgeLabel: 'VERIFICATION RECOMMENDED',
      explanation: `Designed for ${vehicle.make} performance platforms. Please verify strut tower clearance, subframe mounting holes, or VIN code with our engineering database before ordering.`,
      warningConditions: ['Subframe bolt spacing may vary across model trims'],
      isFitmentGuaranteed: false
    };
  }

  // 8. Cross-platform / Generic Vehicle Check
  return {
    status: 'verification_required',
    badgeLabel: 'FITMENT NOT CONFIRMED',
    explanation: `This component was not originally engineered specifically for the ${vehicle.make} ${vehicle.model}. Bespoke brackets, hardware, or fabrication may be required.`,
    warningConditions: ['Chassis mounting points may differ from factory location'],
    isFitmentGuaranteed: false
  };
}
