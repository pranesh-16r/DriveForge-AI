import { Vehicle, Country, Region } from '../types';
import { ExtendedModificationComponent, CategoryType } from '../types';
import {
  BuildState,
  BuildComponent,
  BuildCostSummary,
  BuildCompatibilitySummary,
  BuildHealthReport,
  BuildWarning,
  VerificationRequirement,
  RecommendedOrderStep,
  VehicleRevalidationNotice
} from '../types/build';
import { PricingService } from './pricingService';
import { InstallationService } from './installationService';
import { CompatibilityService } from './compatibilityService';

export class BuildService {
  /**
   * Standard automotive engineering build order hierarchy.
   */
  private static readonly CATEGORY_ORDER_MAP: Record<CategoryType, { order: number; label: string; reason: string }> = {
    brakes: {
      order: 1,
      label: 'Phase 1: Braking & Thermal Management',
      reason: 'Upgraded stopping power and heat dissipation are essential prior to increasing horsepower and cornering speeds.'
    },
    suspension: {
      order: 2,
      label: 'Phase 2: Suspension Kinematics & Stance',
      reason: 'Establishes proper ride height, roll center, and camber geometry before finalizing wheel width and offset fitment.'
    },
    chassis: {
      order: 2,
      label: 'Phase 2: Chassis Bracing & Rigidity',
      reason: 'Reduces flex to optimize suspension geometry consistency.'
    },
    wheels_tires: {
      order: 3,
      label: 'Phase 3: Wheels & Tire Fitment',
      reason: 'Must clear upgraded brake calipers and suspension perches; provides mechanical grip for increased engine output.'
    },
    powertrain: {
      order: 4,
      label: 'Phase 4: Powertrain & Induction',
      reason: 'Engine output increases safely after chassis, braking, and tire grip thresholds have been engineered.'
    },
    exhaust: {
      order: 4,
      label: 'Phase 4: Exhaust & Thermal Scavenging',
      reason: 'Optimizes backpressure and turbo spool in coordination with powertrain modifications.'
    },
    electronics: {
      order: 5,
      label: 'Phase 5: ECU Software Calibration & Dyno',
      reason: 'Fine-tunes fuel trims, ignition timing, and boost pressure to match installed hardware.'
    },
    aerodynamics: {
      order: 6,
      label: 'Phase 6: Aerodynamics & Downforce Balancing',
      reason: 'Balances front splitter suction with rear wing angle of attack for high-speed track stability.'
    },
    exterior: {
      order: 6,
      label: 'Phase 6: Aerodynamics & Downforce Balancing',
      reason: 'Balances front splitter suction with rear wing angle of attack for high-speed track stability.'
    },
    interior: {
      order: 7,
      label: 'Phase 7: Cockpit & Driver Telemetry',
      reason: 'Safety equipment and telemetry clusters installed to monitor physical build benchmarks.'
    }
  };

  /**
   * Convert an ExtendedModificationComponent into a full BuildComponent
   */
  public static createBuildComponent(
    component: ExtendedModificationComponent,
    vehicle: Vehicle,
    country: Country | null,
    region: Region | null,
    experienceMode: 'beginner' | 'enthusiast' = 'beginner'
  ): BuildComponent {
    // 1. Regional Pricing
    const partCost = PricingService.calculateRegionalPartCost(component, country, region);

    // 2. Regional Installation
    const installCost = InstallationService.calculateRegionalInstallationCost(component, vehicle, country, region);

    // 3. Total for this component
    const totalMin = partCost.min + installCost.min;
    const totalMax = partCost.max + installCost.max;
    const totalDisplay = `${PricingService.formatCurrency(totalMin, partCost.currency, partCost.currencySymbol)} – ${PricingService.formatCurrency(totalMax, partCost.currency, partCost.currencySymbol)}`;

    // 4. Compatibility
    const compat = CompatibilityService.evaluate(component, vehicle, experienceMode);

    // 5. Sequence ordering
    const orderConfig = this.CATEGORY_ORDER_MAP[component.category] || {
      order: 5,
      label: 'Component Integration',
      reason: 'Install according to workshop schedule.'
    };

    return {
      id: `bc-${component.id}`,
      componentId: component.id,
      vehicleId: vehicle.id,
      category: component.category,
      name: component.name,
      brand: component.brand,
      partNumber: component.partNumber,
      subCategory: component.subCategory,
      image: component.image,
      quantity: 1,

      compatibilityStatus: compat.status,
      compatibilityReason: compat.explanation,
      fitmentNotes: compat.fitmentNotes,
      fitmentDetails: compat.fitmentDetails,
      isFitmentGuaranteed: compat.isFitmentGuaranteed,
      warningConditions: compat.warningConditions,

      estimatedPartCost: {
        min: partCost.min,
        max: partCost.max,
        display: partCost.display
      },
      estimatedInstallationCost: {
        min: installCost.min,
        max: installCost.max,
        display: installCost.display,
        hours: installCost.hours,
        laborRateHourly: installCost.laborRateHourly
      },
      estimatedTotalCost: {
        min: totalMin,
        max: totalMax,
        display: totalDisplay
      },
      currency: partCost.currency,
      currencySymbol: partCost.currencySymbol,
      costConfidence: partCost.confidence,
      priceSourceType: partCost.sourceType,

      installationDifficulty: component.installationDifficulty || 'moderate',
      installationDifficultyLabel: installCost.difficultyLabel,
      performanceImpact: component.performanceImpact,
      weightImpact: component.weightImpact,
      handlingImpact: component.handlingImpact,
      powerGainHp: component.powerGainHp || 0,
      weightDeltaKg: component.weightDeltaKg || 0,
      verificationStatus: component.verificationStatus || 'verified',

      beginnerExplanation: compat.beginnerExplanation,
      expertExplanation: compat.expertExplanation,

      recommendedOrder: orderConfig.order,
      recommendedOrderReason: orderConfig.reason,

      rawComponent: component
    };
  }

  /**
   * Aggregates build cost summary from list of BuildComponent items.
   */
  public static calculateCostSummary(
    components: BuildComponent[],
    country: Country | null,
    region: Region | null
  ): BuildCostSummary {
    const currency = region?.currency || country?.currency || 'USD';
    const currencySymbol = region?.currencySymbol || country?.currencySymbol || '$';
    const locale = region?.locale || 'en-US';

    if (components.length === 0) {
      return {
        currency,
        currencySymbol,
        locale,
        partsMin: 0,
        partsMax: 0,
        partsDisplay: PricingService.formatCurrency(0, currency, currencySymbol),
        laborMin: 0,
        laborMax: 0,
        laborDisplay: PricingService.formatCurrency(0, currency, currencySymbol),
        totalMin: 0,
        totalMax: 0,
        totalDisplay: PricingService.formatCurrency(0, currency, currencySymbol),
        totalInstallHours: 0,
        sourceType: 'Indicative Regional Estimate',
        confidence: 'HIGH CONFIDENCE',
        disclaimer: 'Prices are indicative estimates and may vary by supplier, customs import tariffs, and local workshop rates.'
      };
    }

    let partsMin = 0;
    let partsMax = 0;
    let laborMin = 0;
    let laborMax = 0;
    let totalInstallHours = 0;

    for (const c of components) {
      partsMin += c.estimatedPartCost.min;
      partsMax += c.estimatedPartCost.max;
      laborMin += c.estimatedInstallationCost.min;
      laborMax += c.estimatedInstallationCost.max;
      totalInstallHours += c.estimatedInstallationCost.hours;
    }

    const totalMin = partsMin + laborMin;
    const totalMax = partsMax + laborMax;

    return {
      currency,
      currencySymbol,
      locale,
      partsMin,
      partsMax,
      partsDisplay: `${PricingService.formatCurrency(partsMin, currency, currencySymbol)} – ${PricingService.formatCurrency(partsMax, currency, currencySymbol)}`,
      laborMin,
      laborMax,
      laborDisplay: `${PricingService.formatCurrency(laborMin, currency, currencySymbol)} – ${PricingService.formatCurrency(laborMax, currency, currencySymbol)}`,
      totalMin,
      totalMax,
      totalDisplay: `${PricingService.formatCurrency(totalMin, currency, currencySymbol)} – ${PricingService.formatCurrency(totalMax, currency, currencySymbol)}`,
      totalInstallHours: Math.round(totalInstallHours * 10) / 10,
      sourceType: 'Indicative Regional Estimate',
      confidence: components.some(c => c.costConfidence === 'LOW CONFIDENCE') ? 'MEDIUM CONFIDENCE' : 'HIGH CONFIDENCE',
      disclaimer: 'Prices are indicative regional estimates and may vary by supplier availability, import duty variations, and workshop rate adjustments.'
    };
  }

  /**
   * Aggregates compatibility statistics
   */
  public static calculateCompatibilitySummary(components: BuildComponent[]): BuildCompatibilitySummary {
    let compatibleCount = 0;
    let conditionalCount = 0;
    let notCompatibleCount = 0;
    let verificationRequiredCount = 0;

    for (const c of components) {
      switch (c.compatibilityStatus) {
        case 'compatible':
          compatibleCount++;
          break;
        case 'conditionally_compatible':
          conditionalCount++;
          break;
        case 'not_compatible':
          notCompatibleCount++;
          break;
        case 'verification_required':
          verificationRequiredCount++;
          break;
      }
    }

    return {
      compatibleCount,
      conditionalCount,
      notCompatibleCount,
      verificationRequiredCount,
      totalComponents: components.length,
      allCompatible: components.length > 0 && compatibleCount === components.length,
      hasIncompatible: notCompatibleCount > 0
    };
  }

  /**
   * Evaluates Build Health (GOOD, REVIEW, ATTENTION) based on objective engineering criteria.
   */
  public static evaluateBuildHealth(
    components: BuildComponent[],
    compatSummary: BuildCompatibilitySummary
  ): BuildHealthReport {
    if (components.length === 0) {
      return {
        status: 'GOOD',
        badgeLabel: 'BUILD READY',
        headline: 'Physical Build Plan Initialized',
        description: 'No components currently selected. Choose verified parts from the 3D Garage or Catalog to plan your build.',
        issues: []
      };
    }

    const issues: string[] = [];

    if (compatSummary.notCompatibleCount > 0) {
      issues.push(`${compatSummary.notCompatibleCount} component(s) are mechanically or electronically incompatible with the selected vehicle platform.`);
    }

    if (compatSummary.verificationRequiredCount > 0) {
      issues.push(`${compatSummary.verificationRequiredCount} component(s) require physical chassis measurement or manufacturer VIN verification before purchase.`);
    }

    if (compatSummary.conditionalCount > 0) {
      issues.push(`${compatSummary.conditionalCount} component(s) have prerequisite requirements (such as wheel clearance, DME unlocks, or laser alignments).`);
    }

    if (compatSummary.notCompatibleCount > 0) {
      return {
        status: 'ATTENTION',
        badgeLabel: 'ATTENTION REQUIRED',
        headline: 'Incompatible Modifications Detected',
        description: 'Your physical build contains modifications that conflict with the baseline vehicle architecture. Review or replace incompatible parts before proceeding.',
        issues
      };
    }

    if (compatSummary.verificationRequiredCount > 0 || compatSummary.conditionalCount > 0) {
      return {
        status: 'REVIEW',
        badgeLabel: 'REVIEW RECOMMENDED',
        headline: 'Prerequisites & Verification Needed',
        description: 'Components are viable, but specific clearances, alignment setups, or dyno checks must be verified prior to installation.',
        issues
      };
    }

    return {
      status: 'GOOD',
      badgeLabel: 'OPTIMAL FITMENT',
      headline: 'All Modifications Verified Compatible',
      description: 'All selected components possess verified direct-fit engineering records for your vehicle generation. Ready for installation scheduling.',
      issues: []
    };
  }

  /**
   * Extracts all distinct warnings from build components
   */
  public static extractWarnings(components: BuildComponent[]): BuildWarning[] {
    const warnings: BuildWarning[] = [];

    for (const c of components) {
      if (c.warningConditions && c.warningConditions.length > 0) {
        for (const w of c.warningConditions) {
          warnings.push({
            id: `warn-${c.id}-${Math.abs(w.length * 31)}`,
            componentId: c.componentId,
            componentName: c.name,
            severity: c.compatibilityStatus === 'not_compatible' ? 'high' : 'medium',
            title: `${c.brand} ${c.subCategory} Fitment Note`,
            description: w
          });
        }
      }
    }

    return warnings;
  }

  /**
   * Collects all verification requirements across the build
   */
  public static collectVerificationRequirements(
    components: BuildComponent[],
    vehicle: Vehicle
  ): VerificationRequirement[] {
    const requirements: VerificationRequirement[] = [];

    for (const c of components) {
      const evalResult = CompatibilityService.evaluate(c.rawComponent, vehicle);
      if (evalResult.verificationRequirements && evalResult.verificationRequirements.length > 0) {
        requirements.push(...evalResult.verificationRequirements);
      }
    }

    return requirements;
  }

  /**
   * Resolves recommended physical build order steps
   */
  public static resolveRecommendedOrder(components: BuildComponent[]): RecommendedOrderStep[] {
    if (components.length === 0) return [];

    const grouped = new Map<number, { category: CategoryType; label: string; reason: string; items: string[] }>();

    for (const c of components) {
      const orderConfig = this.CATEGORY_ORDER_MAP[c.category] || {
        order: 5,
        label: 'General Modifications',
        reason: 'Install per workshop sequence.'
      };

      if (!grouped.has(orderConfig.order)) {
        grouped.set(orderConfig.order, {
          category: c.category,
          label: orderConfig.label,
          reason: orderConfig.reason,
          items: [c.name]
        });
      } else {
        const existing = grouped.get(orderConfig.order)!;
        if (!existing.items.includes(c.name)) {
          existing.items.push(c.name);
        }
      }
    }

    // Sort steps numerically
    const sortedSteps = Array.from(grouped.entries())
      .sort(([a], [b]) => a - b)
      .map(([_, data], index) => ({
        stepNumber: index + 1,
        category: data.category,
        categoryLabel: data.label,
        componentNames: data.items,
        reason: data.reason
      }));

    return sortedSteps;
  }

  /**
   * Revalidates an entire build when the active vehicle is changed.
   * Returns revalidated components and a revalidation notice.
   */
  public static revalidateBuildForVehicle(
    currentComponents: BuildComponent[],
    newVehicle: Vehicle,
    country: Country | null,
    region: Region | null,
    experienceMode: 'beginner' | 'enthusiast'
  ): { components: BuildComponent[]; notice: VehicleRevalidationNotice | null } {
    if (currentComponents.length === 0) {
      return { components: [], notice: null };
    }

    let affectedCount = 0;

    const revalidatedComponents = currentComponents.map(c => {
      const updated = this.createBuildComponent(c.rawComponent, newVehicle, country, region, experienceMode);
      if (updated.compatibilityStatus !== c.compatibilityStatus) {
        affectedCount++;
      }
      return updated;
    });

    const hasIncompatible = revalidatedComponents.some(c => c.compatibilityStatus === 'not_compatible');
    const hasVerification = revalidatedComponents.some(c => c.compatibilityStatus === 'verification_required');

    const notice: VehicleRevalidationNotice = {
      requiresReview: affectedCount > 0 || hasIncompatible || hasVerification,
      currentVehicleName: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model}`,
      affectedComponentsCount: affectedCount,
      message: hasIncompatible
        ? `Selected vehicle changed to ${newVehicle.make} ${newVehicle.model}. Some parts in your build are incompatible with this platform.`
        : `Selected vehicle changed to ${newVehicle.make} ${newVehicle.model}. Compatibility statuses and fitments have been automatically re-verified.`
    };

    return {
      components: revalidatedComponents,
      notice
    };
  }

  /**
   * Constructs the full state object from components and current context.
   */
  public static buildFullState(
    components: BuildComponent[],
    vehicle: Vehicle,
    country: Country | null,
    region: Region | null,
    experienceMode: 'beginner' | 'enthusiast',
    existingState?: Partial<BuildState>
  ): BuildState {
    const costSummary = this.calculateCostSummary(components, country, region);
    const compatibilitySummary = this.calculateCompatibilitySummary(components);
    const buildHealth = this.evaluateBuildHealth(components, compatibilitySummary);
    const warnings = this.extractWarnings(components);
    const verificationRequirements = this.collectVerificationRequirements(components, vehicle);
    const recommendedOrder = this.resolveRecommendedOrder(components);

    return {
      buildId: existingState?.buildId || 'DF-BUILD-001',
      buildName: existingState?.buildName || `${vehicle.make} ${vehicle.model} Track Spec`,
      buildVersion: existingState?.buildVersion || 'v1.0',
      selectedVehicle: vehicle,
      selectedCountryId: country?.id || 'india',
      selectedRegionId: region?.id || 'in-tamil-nadu',
      currency: costSummary.currency,
      currencySymbol: costSummary.currencySymbol,
      experienceMode,
      components,
      costSummary,
      compatibilitySummary,
      buildHealth,
      warnings,
      verificationRequirements,
      recommendedOrder,
      notes: existingState?.notes || [
        {
          id: 'note-default-1',
          text: 'Schedule alignment and corner balancing after coilover installation settles.',
          createdAt: new Date().toLocaleDateString()
        }
      ],
      revalidationNotice: existingState?.revalidationNotice || null,
      lastUpdated: new Date().toISOString()
    };
  }
}
