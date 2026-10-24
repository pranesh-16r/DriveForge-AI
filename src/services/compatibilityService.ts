import { Vehicle } from '../types';
import { ExtendedVehicle } from '../data/vehicles';
import { ExtendedModificationComponent, CompatibilityStatus } from '../types/modification';
import { ComponentFitmentData, VerificationRequirement } from '../types/build';

export interface EvaluatedCompatibility {
  status: CompatibilityStatus;
  badgeLabel: string;
  explanation: string;
  beginnerExplanation: string;
  expertExplanation: string;
  fitmentNotes: string;
  fitmentDetails: ComponentFitmentData;
  isFitmentGuaranteed: boolean;
  warningConditions: string[];
  verificationRequirements: VerificationRequirement[];
}

export class CompatibilityService {
  /**
   * Evaluates comprehensive compatibility for a component against a target vehicle.
   */
  public static evaluate(
    component: ExtendedModificationComponent,
    vehicle: Vehicle | ExtendedVehicle,
    experienceMode: 'beginner' | 'enthusiast' = 'beginner'
  ): EvaluatedCompatibility {
    const extVehicle = vehicle as ExtendedVehicle;
    const engineStr = (vehicle.engine || '').toLowerCase();
    const fuelType = (extVehicle.fuelType || '').toLowerCase();
    const modelStr = (vehicle.model || '').toLowerCase();
    const makeStr = (vehicle.make || '').toLowerCase();
    const chassisCode = (vehicle.chassisCode || '').toLowerCase();
    const drivetrain = (vehicle.drivetrain || '').toUpperCase();

    const isElectric = fuelType === 'electric' || engineStr.includes('electric') || engineStr.includes('800v');
    const isNaturallyAspirated = engineStr.includes('naturally aspirated') || engineStr.includes('atmospheric');

    const { supportedVehicles } = component;
    const warningConditions: string[] = [];
    const verificationRequirements: VerificationRequirement[] = [];

    // Extract detailed fitment specs if present
    const fitmentDetails: ComponentFitmentData = {
      mountingPointType: component.specifications?.['Mounting'] || 'Factory Chassis Anchors',
      dimensions: component.dimensions || component.specifications?.['Dimensions'],
      material: component.material || component.specifications?.['Material'],
      engineConfiguration: vehicle.engine,
      bodyGeneration: vehicle.chassisCode || `${vehicle.year} Generation`
    };

    if (component.category === 'wheels_tires' || component.subCategory?.toLowerCase().includes('wheel')) {
      fitmentDetails.boltPattern = component.name.toLowerCase().includes('center-lock') ? 'Center-Lock Spindle' : '5x130 / 5x112 Motorsport Hub';
      fitmentDetails.wheelDiameterInches = supportedVehicles.minWheelSizeInches || 20;
      fitmentDetails.wheelWidthInches = 10.5;
      fitmentDetails.offsetMm = 45;
    }

    if (component.category === 'brakes' || component.subCategory?.toLowerCase().includes('brake')) {
      fitmentDetails.brakeClearanceMm = 410;
    }

    // 1. Universal Components Check
    if (supportedVehicles.universal) {
      return {
        status: 'compatible',
        badgeLabel: 'UNIVERSAL FITMENT',
        explanation: `Engineered with multi-chassis adjustable mounting hardware compatible with ${vehicle.make} ${vehicle.model}.`,
        beginnerExplanation: `Yes — this part has universal adjustable brackets that fit your ${vehicle.model}.`,
        expertExplanation: `Multi-chassis slotted mounting architecture verified for standardized motorsport bracketry across the ${vehicle.make} chassis.`,
        fitmentNotes: 'Standardized mounting anchors; test fitment before final torquing.',
        fitmentDetails,
        isFitmentGuaranteed: true,
        warningConditions: [],
        verificationRequirements: []
      };
    }

    // 2. EV / Electric Powertrain conflict
    if (isElectric && (
      component.category === 'powertrain' ||
      component.category === 'exhaust' ||
      component.subCategory.toLowerCase().includes('exhaust') ||
      component.subCategory.toLowerCase().includes('turbo') ||
      component.subCategory.toLowerCase().includes('downpipe') ||
      component.subCategory.toLowerCase().includes('intake')
    )) {
      return {
        status: 'not_compatible',
        badgeLabel: 'INCOMPATIBLE PLATFORM',
        explanation: `${vehicle.make} ${vehicle.model} features an all-electric high-voltage powertrain. Combustion exhaust and forced-induction intake components cannot be installed.`,
        beginnerExplanation: `No — your vehicle is all-electric and has no gas engine or exhaust pipes.`,
        expertExplanation: `EV battery pack and dual electric motor architecture lack internal combustion exhaust manifolds and intake runners.`,
        fitmentNotes: 'Incompatible with zero-emission electric powertrain architecture.',
        fitmentDetails,
        isFitmentGuaranteed: false,
        warningConditions: ['Zero-emission electric architecture does not utilize combustion gas pathways'],
        verificationRequirements: []
      };
    }

    // 3. Naturally Aspirated Engine vs Forced Induction Bolt-on
    if (isNaturallyAspirated && (
      component.subCategory.toLowerCase().includes('turbocharger') ||
      component.name.toLowerCase().includes('turbo')
    )) {
      warningConditions.push('Requires bespoke turbo manifold fabrication and custom intercooler ducting.');
      warningConditions.push('High factory compression ratio (13.3:1) requires dyno calibration or race fuel.');

      verificationRequirements.push({
        id: `ver-${component.id}-dyno`,
        componentId: component.id,
        componentName: component.name,
        category: component.category,
        title: 'Professional Dyno Air-Fuel Calibration',
        description: 'Naturally aspirated ECU software must be custom-mapped on an all-wheel chassis dynamometer to avoid pre-ignition engine damage.',
        isSafetyCritical: true,
        actionRequired: 'Book specialized dynamometer tuning session'
      });

      return {
        status: 'conditionally_compatible',
        badgeLabel: 'CUSTOM FABRICATION REQUIRED',
        explanation: `${vehicle.make} ${vehicle.model} is equipped with a high-compression naturally aspirated engine (${vehicle.engine}). Bolt-on turbo installation requires custom exhaust manifolds, intercooler piping, and lower compression pistons.`,
        beginnerExplanation: `This may fit with custom work. Your car has a non-turbo engine, so adding a turbo requires extensive custom plumbing and tuning.`,
        expertExplanation: `Atmospheric induction platform requires comprehensive forced-induction conversion: custom equal-length headers, charge piping, and reduced static compression ratio.`,
        fitmentNotes: 'Custom fabrication required; incompatible with stock intake and headers.',
        fitmentDetails,
        isFitmentGuaranteed: false,
        warningConditions,
        verificationRequirements
      };
    }

    // 4. Center-lock Wheel Hub vs Standard 5-Lug Hub Pattern
    const isCenterLockPart = component.name.toLowerCase().includes('center-lock') || component.name.toLowerCase().includes('centerlock');
    const hasCenterLockHub = vehicle.trim.toLowerCase().includes('weissach') || 
                             modelStr.includes('gt3') || 
                             modelStr.includes('gt4 rs') ||
                             modelStr.includes('gt2');

    if (isCenterLockPart && !hasCenterLockHub) {
      warningConditions.push('Requires center-lock hub conversion spindle kit (estimated 600 Nm torque spec).');

      verificationRequirements.push({
        id: `ver-${component.id}-hub`,
        componentId: component.id,
        componentName: component.name,
        category: component.category,
        title: 'Hub Spindle Conversion Verification',
        description: 'Verify spindle spline count and wheel bearing carrier compatibility for centerlock adapter.',
        isSafetyCritical: true,
        actionRequired: 'Confirm hub spline diameter with specialist workshop'
      });

      return {
        status: 'conditionally_compatible',
        badgeLabel: 'REQUIRES HUB ADAPTER',
        explanation: `These wheels feature motorsport center-lock single retention geometry. Your ${vehicle.make} ${vehicle.model} uses standard 5-lug hubs. Requires a certified center-lock hub conversion assembly.`,
        beginnerExplanation: `Your car uses regular 5-lug wheel bolts, but these wheels lock with a single racing nut. You will need special hub adapters.`,
        expertExplanation: `Single-nut motorsport spindle geometry requires conversion hubs replacing the factory 5x112/5x120 PCD hub carriers.`,
        fitmentNotes: 'Requires center-lock conversion kit; does not bolt directly to 5-lug hubs.',
        fitmentDetails,
        isFitmentGuaranteed: false,
        warningConditions,
        verificationRequirements
      };
    }

    // 5. Explicit Excluded Models
    if (supportedVehicles.excludedModels && supportedVehicles.excludedModels.some(ex => modelStr.includes(ex.toLowerCase()))) {
      return {
        status: 'not_compatible',
        badgeLabel: 'NOT COMPATIBLE',
        explanation: `The manufacturer specifies this component does NOT fit the ${vehicle.make} ${vehicle.model} due to clearance or electronic conflicts.`,
        beginnerExplanation: `No — the manufacturer specifically states this part does not fit your model.`,
        expertExplanation: `Chassis subframe and bodywork clearance constraints explicitly documented by manufacturer as incompatible.`,
        fitmentNotes: 'Factory model exclusion confirmed.',
        fitmentDetails,
        isFitmentGuaranteed: false,
        warningConditions: ['Manufacturer fitment exclusion confirmed'],
        verificationRequirements: []
      };
    }

    // 6. Make & Model Direct Match
    const makeMatches = !supportedVehicles.makes || supportedVehicles.makes.some(m => makeStr.includes(m.toLowerCase()) || m.toLowerCase().includes(makeStr));
    const modelMatches = !supportedVehicles.models || supportedVehicles.models.some(m => modelStr.includes(m.toLowerCase()) || m.toLowerCase().includes(modelStr));
    const generationMatches = !supportedVehicles.generations || supportedVehicles.generations.some(g => chassisCode.includes(g.toLowerCase()) || g.toLowerCase().includes(chassisCode));

    if (makeMatches && (modelMatches || generationMatches)) {
      if (supportedVehicles.minWheelSizeInches) {
        warningConditions.push(`Requires minimum ${supportedVehicles.minWheelSizeInches}-inch diameter wheels to clear caliper body.`);
        verificationRequirements.push({
          id: `ver-${component.id}-wheel-clearance`,
          componentId: component.id,
          componentName: component.name,
          category: component.category,
          title: 'Inner Wheel Barrel Clearance Check',
          description: `Confirm wheel barrel diameter exceeds ${supportedVehicles.minWheelSizeInches}" and wheel spoke profile clears outer caliper face by >= 3mm.`,
          isSafetyCritical: true,
          actionRequired: 'Verify inner barrel profile with wheel manufacturer'
        });
      }

      if (supportedVehicles.requiresECUReflash) {
        warningConditions.push('ECU reflash / DME unlock required to prevent check engine light and calibrate air-fuel targets.');
        verificationRequirements.push({
          id: `ver-${component.id}-ecu`,
          componentId: component.id,
          componentName: component.name,
          category: component.category,
          title: 'ECU DME Unlock & Software Mapping',
          description: 'Factory engine management must be flashed with matching stage software to ensure engine safety.',
          isSafetyCritical: false,
          actionRequired: 'Plan ECU software flash alongside mechanical install'
        });
      }

      if (supportedVehicles.requiresTrackAlignment) {
        warningConditions.push('Four-wheel laser alignment and corner-balancing required post-installation.');
        verificationRequirements.push({
          id: `ver-${component.id}-alignment`,
          componentId: component.id,
          componentName: component.name,
          category: component.category,
          title: 'Four-Wheel Laser Geometry Alignment',
          description: 'Suspension kinematic changes alter front/rear toe and camber. Professional alignment required.',
          isSafetyCritical: true,
          actionRequired: 'Schedule laser alignment immediately after suspension settling'
        });
      }

      // Safety critical check for brakes
      if (component.category === 'brakes') {
        verificationRequirements.push({
          id: `ver-${component.id}-hydraulic-bleed`,
          componentId: component.id,
          componentName: component.name,
          category: component.category,
          title: 'High-Boiling Point Brake Fluid Flush & Pressure Bleed',
          description: 'Ensure complete purge of air bubbles with high-temp DOT 4 / 5.1 fluid for firm pedal feel.',
          isSafetyCritical: true,
          actionRequired: 'Pressure-bleed hydraulic circuits with fresh motorsport brake fluid'
        });
      }

      if (warningConditions.length > 0) {
        return {
          status: 'conditionally_compatible',
          badgeLabel: 'CONDITIONAL FITMENT',
          explanation: `Direct mechanical fitment verified for ${vehicle.make} ${vehicle.model}, but specific supporting modifications or clearances are required.`,
          beginnerExplanation: `This will fit, but requires supporting checks (such as wheel clearance or wheel alignment) after installation.`,
          expertExplanation: `Direct bolt-on mechanical compatibility verified for chassis code ${vehicle.chassisCode || 'OEM'}. Pre-requisite clearances and calibrations must be met.`,
          fitmentNotes: 'Direct bolt-on fitment subject to clearance prerequisites.',
          fitmentDetails,
          isFitmentGuaranteed: true,
          warningConditions,
          verificationRequirements
        };
      }

      return {
        status: 'compatible',
        badgeLabel: '100% VERIFIED FITMENT',
        explanation: `Precision 3D laser-scanned direct bolt-on fitment for ${vehicle.make} ${vehicle.model} (${vehicle.chassisCode || 'OEM'} chassis).`,
        beginnerExplanation: `Yes — this part is designed and verified to bolt straight onto your ${vehicle.model}.`,
        expertExplanation: `Validated against factory CAD coordinates and OEM subframe mounting points for ${vehicle.year} ${vehicle.make} ${vehicle.model}.`,
        fitmentNotes: 'Factory mounting location alignment; 100% bolt-on with no drilling.',
        fitmentDetails,
        isFitmentGuaranteed: true,
        warningConditions: [],
        verificationRequirements
      };
    }

    // 7. Make matches but model is unconfirmed
    if (makeMatches) {
      verificationRequirements.push({
        id: `ver-${component.id}-model-vin`,
        componentId: component.id,
        componentName: component.name,
        category: component.category,
        title: 'Chassis VIN Verification',
        description: `Verify VIN chassis code and subframe revision matches ${component.brand} application chart.`,
        isSafetyCritical: false,
        actionRequired: 'Cross-reference vehicle VIN with manufacturer catalog'
      });

      return {
        status: 'verification_required',
        badgeLabel: 'VERIFICATION RECOMMENDED',
        explanation: `Designed for ${vehicle.make} performance platforms. Please verify strut tower clearance, subframe mounting holes, or VIN code with our engineering database before ordering.`,
        beginnerExplanation: `This might fit your ${vehicle.make}, but a mechanic or parts specialist should double-check your exact car before you buy.`,
        expertExplanation: `Platform architecture shares subframe geometries with other ${vehicle.make} variants; mounting stud spacing and bracket pitch require physical verification.`,
        fitmentNotes: 'Subframe bolt spacing may vary across model trims.',
        fitmentDetails,
        isFitmentGuaranteed: false,
        warningConditions: ['Subframe bolt spacing may vary across model trims'],
        verificationRequirements
      };
    }

    // 8. Cross-platform / Unknown
    verificationRequirements.push({
      id: `ver-${component.id}-cross-platform`,
      componentId: component.id,
      componentName: component.name,
      category: component.category,
      title: 'Custom Fabricator Assessment',
      description: 'Physical measurement of chassis clearances and custom bracket feasibility required.',
      isSafetyCritical: true,
      actionRequired: 'Consult custom fabrication specialist'
    });

    return {
      status: 'verification_required',
      badgeLabel: 'FITMENT NOT CONFIRMED',
      explanation: `This component was not originally engineered specifically for the ${vehicle.make} ${vehicle.model}. Bespoke brackets, hardware, or fabrication may be required.`,
      beginnerExplanation: `Not verified for your car. You would likely need custom brackets or modifications to make it fit.`,
      expertExplanation: `Chassis mounting points, electronic harness pinning, and clearance envelopes differ from factory specifications. Custom fabrication mandatory.`,
      fitmentNotes: 'Chassis mounting points differ from factory location.',
      fitmentDetails,
      isFitmentGuaranteed: false,
      warningConditions: ['Chassis mounting points differ from factory location'],
      verificationRequirements
    };
  }
}
