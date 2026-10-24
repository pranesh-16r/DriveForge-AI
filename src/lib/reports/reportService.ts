import { Vehicle, Country, Region } from '../../types';
import { BuildState, BuildComponent } from '../../types/build';
import { BuildReport } from '../../types/reports';
import { Workshop } from '../workshops/workshopTypes';
import { PerformanceService } from '../../services/performanceService';

export class ReportService {
  /**
   * Generates a formal, professional BuildReport structure from live state.
   */
  public static generateBuildReport(params: {
    vehicle: Vehicle;
    buildState: BuildState;
    buildComponents: BuildComponent[];
    country: Country | null;
    region: Region | null;
    selectedWorkshop?: Workshop | null;
    aiRecommendationSummary?: string | null;
  }): BuildReport {
    const {
      vehicle,
      buildState,
      buildComponents,
      country,
      region,
      selectedWorkshop,
      aiRecommendationSummary
    } = params;

    const currency = region?.currency || country?.currency || 'USD';
    const currencySymbol = region?.currencySymbol || country?.currencySymbol || '$';

    // 1. Gather all verification requirements across components
    const verifications: BuildReport['verificationRequirements'] = [];
    if (buildState.verificationRequirements && buildState.verificationRequirements.length > 0) {
      buildState.verificationRequirements.forEach(vr => {
        verifications.push({
          id: vr.id,
          title: vr.title,
          description: vr.description,
          severity: vr.isSafetyCritical ? 'CRITICAL' : 'RECOMMENDED',
          componentName: vr.componentName
        });
      });
    }

    // If empty, add standard physical installation checks
    if (verifications.length === 0 && buildComponents.length > 0) {
      verifications.push({
        id: 'verif-wheel-torque',
        title: 'Hardware Torquing & Fastener Preload',
        description: 'Verify all chassis and suspension hardware with a calibrated torque wrench after 100 km test drive.',
        severity: 'RECOMMENDED'
      });
      verifications.push({
        id: 'verif-geometry',
        title: 'Laser Four-Wheel Kinematic Alignment',
        description: 'Perform digital 4-wheel caster, camber, and toe alignment to preserve tire life and high-speed stability.',
        severity: 'CRITICAL'
      });
    }

    // 2. Deterministic Performance Evaluation
    const performanceAnalysis = buildComponents.length > 0
      ? PerformanceService.calculateBuildPerformance(vehicle, buildComponents, buildState)
      : undefined;

    const totalPowerGain = buildComponents.reduce((sum, c) => sum + (c.powerGainHp || 0), 0);
    const totalWeightDelta = buildComponents.reduce((sum, c) => sum + (c.weightDeltaKg || 0), 0);
    const baselinePower = vehicle.baselinePowerHp;
    const projectedPower = baselinePower + totalPowerGain;
    const baselineWeight = vehicle.weightKg;
    const projectedWeight = baselineWeight + totalWeightDelta;
    const baseline060 = (vehicle as any).zeroToSixtySec || 3.9;
    const projected060 = Math.max(2.4, Number((baseline060 - (totalPowerGain / 150) * 0.3).toFixed(1)));

    // 3. Status determination
    let status: BuildReport['compatibilitySummary']['status'] = 'COMPLIANT';
    let homologationStatus: BuildReport['homologationStatus'] = 'HOMOLOGATED';
    if (buildState.compatibilitySummary.notCompatibleCount > 0) {
      status = 'CONFLICT_DETECTED';
      homologationStatus = 'REVIEW_REQUIRED';
    } else if (buildState.compatibilitySummary.verificationRequiredCount > 0 || buildState.compatibilitySummary.conditionalCount > 0) {
      status = 'REVIEW_REQUIRED';
      homologationStatus = 'CONDITIONALLY_APPROVED';
    }

    const reportId = `DF-REP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;
    const generatedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const partsCostUSD = buildState.costSummary?.partsMin || buildComponents.reduce((s, c) => s + (c.estimatedPartCost?.min || 0), 0);
    const laborCostUSD = buildState.costSummary?.laborMin || buildComponents.reduce((s, c) => s + (c.estimatedInstallationCost?.min || 0), 0);
    const totalCostUSD = buildState.costSummary?.totalMin || (partsCostUSD + laborCostUSD);

    return {
      reportId,
      generatedDate,
      buildId: buildState.buildId || 'DF-BUILD-001',
      buildName: buildState.buildName || 'Custom Physical Modification Blueprint',
      version: 1,
      vehicle,
      country,
      region,
      components: buildComponents,
      costSummary: {
        partsCostUSD,
        laborCostUSD,
        totalCostUSD,
        regionalDisplayParts: buildState.costSummary?.partsDisplay || `${currencySymbol}${partsCostUSD.toLocaleString()}`,
        regionalDisplayLabor: buildState.costSummary?.laborDisplay || `${currencySymbol}${laborCostUSD.toLocaleString()}`,
        regionalDisplayTotal: buildState.costSummary?.totalDisplay || `${currencySymbol}${totalCostUSD.toLocaleString()}`,
        currency,
        currencySymbol
      },
      compatibilitySummary: {
        compatibleCount: buildState.compatibilitySummary.compatibleCount,
        conditionalCount: buildState.compatibilitySummary.conditionalCount,
        conflictCount: buildState.compatibilitySummary.notCompatibleCount,
        verificationRequiredCount: buildState.compatibilitySummary.verificationRequiredCount,
        status
      },
      performanceAnalysis,
      performanceSummary: {
        baselinePowerHp: baselinePower,
        projectedPowerHp: projectedPower,
        powerGainHp: totalPowerGain,
        baselineWeightKg: baselineWeight,
        projectedWeightKg: projectedWeight,
        weightDeltaKg: totalWeightDelta,
        baselineZeroToSixty: baseline060,
        projectedZeroToSixty: projected060
      },
      homologationStatus,
      verificationRequirements: verifications,
      aiRecommendations: aiRecommendationSummary ? {
        summary: aiRecommendationSummary,
        concerns: [
          'Monitor intake air temperatures during high-ambient track sessions.',
          'Verify brake fluid moisture saturation prior to track day.'
        ],
        nextSteps: [
          'Schedule installation consultation with an independent certified workshop.',
          'Double check wheel offset clearances against front brake caliper bridge.'
        ]
      } : undefined,
      workshop: selectedWorkshop ? {
        workshop: selectedWorkshop,
        matchLevel: 'GOOD MATCH',
        servicesMatched: selectedWorkshop.services
      } : undefined,
      disclaimer: 'DriveForge AI provides vehicle modification planning, visualization and estimated analysis. Compatibility, pricing, performance and installation information may vary by vehicle condition, component specification, installer and region. Safety-critical modifications should be physically verified and professionally installed where appropriate.'
    };
  }
}
