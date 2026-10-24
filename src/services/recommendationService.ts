import { Vehicle } from '../types';
import { BuildComponent, BuildState } from '../types/build';
import {
  ThermalAnalysis,
  BrakingAnalysis,
  HandlingAnalysis,
  VerificationRequirementItem,
  EngineeringRecommendationItem
} from '../types/analysis';

export interface HealthAndRecommendationsResult {
  health: {
    status: 'GOOD' | 'REVIEW' | 'ATTENTION';
    headline: string;
    description: string;
    reasons: string[];
  };
  verificationRequirements: VerificationRequirementItem[];
  recommendations: EngineeringRecommendationItem[];
}

export class RecommendationService {
  public static generateRecommendations(
    vehicle: Vehicle,
    components: BuildComponent[],
    buildState: BuildState,
    thermal: ThermalAnalysis,
    braking: BrakingAnalysis,
    handling: HandlingAnalysis
  ): HealthAndRecommendationsResult {
    const reasons: string[] = [];
    const verificationRequirements: VerificationRequirementItem[] = [];
    const recommendations: EngineeringRecommendationItem[] = [];

    let hasIncompatible = false;
    let hasConditional = false;
    let hasVerificationRequired = false;

    // Evaluate components
    components.forEach((c) => {
      const raw = c.rawComponent;
      const status = c.compatibilityStatus;

      if (status === 'not_compatible') {
        hasIncompatible = true;
        reasons.push(`${c.name}: Flagged as incompatible with ${vehicle.model} platform.`);
      } else if (status === 'conditionally_compatible') {
        hasConditional = true;
        reasons.push(`${c.name}: Requires conditional fitment verification.`);
      } else if (status === 'verification_required') {
        hasVerificationRequired = true;
        reasons.push(`${c.name}: Physical measurement needed before ordering.`);
      }

      // Check specific categories for verification requirements & recommendations
      if (raw.category === 'suspension') {
        verificationRequirements.push({
          id: `verify-align-${c.componentId}`,
          title: 'Four-Wheel Laser Alignment & Camber Calibration',
          category: 'Chassis Geometry',
          description: `After installing ${c.name}, suspension geometry (camber, caster, toe) will shift away from factory baseline.`,
          whyItMatters: 'Incorrect toe causes rapid inner tyre wear and unpredictable high-speed handling stability.',
          isSafetyCritical: true,
          actionRequired: 'Schedule professional 4-wheel computerized alignment 150–200 km post-install once spring settle occurs.',
          triggerComponent: c.name
        });

        recommendations.push({
          id: `rec-susp-${c.componentId}`,
          category: 'Alignment',
          title: 'Allow Damper Settling Period',
          recommendation: 'Allow coilover springs 150–200 km of road use to seat into rubber perches before locking final ride height.',
          priority: 'HIGH',
          triggerComponent: c.name,
          reasoning: 'Spring steel undergoes initial micro-settling during the first heat cycles.'
        });
      }

      if (raw.category === 'brakes') {
        verificationRequirements.push({
          id: `verify-brake-${c.componentId}`,
          title: 'Inner Wheel Barrel & Caliper Clearance Check',
          category: 'Braking Clearance',
          description: `Verify that ${c.name} maintains at least 3.0 mm of radial and axial clearance between the caliper face and wheel spokes.`,
          whyItMatters: 'Contact between wheel spokes and brake calipers causes catastrophic wheel lockup and brake failure.',
          isSafetyCritical: true,
          actionRequired: 'Print manufacturer 1:1 wheel fitment template and test fit inside current wheels prior to ordering.',
          triggerComponent: c.name
        });

        recommendations.push({
          id: `rec-brake-${c.componentId}`,
          category: 'Braking',
          title: 'Perform Thermal Pad Bed-In Procedure',
          recommendation: 'Perform 8–10 consecutive decelerations from 100 km/h to 20 km/h at moderate pressure without coming to a complete standstill.',
          priority: 'HIGH',
          triggerComponent: c.name,
          reasoning: 'Transfers an even microscopic friction boundary layer onto rotor surfaces, preventing uneven pad deposits and brake shudder.'
        });
      }

      if (raw.category === 'wheels_tires') {
        verificationRequirements.push({
          id: `verify-wheel-${c.componentId}`,
          title: 'Wheel Offset (ET) & Hub Bore Concentricity',
          category: 'Wheel Geometry',
          description: `Confirm PCD (pitch circle diameter) and center-bore concentricity for ${c.name}.`,
          whyItMatters: 'Non-hubcentric wheels cause high-speed harmonic steering wheel vibrations.',
          isSafetyCritical: true,
          actionRequired: 'Verify hub-centric ring fitment (e.g. 72.6mm to 66.5mm) and lug seat taper (cone vs ball seat).',
          triggerComponent: c.name
        });

        recommendations.push({
          id: `rec-wheel-${c.componentId}`,
          category: 'Wheel & Tire',
          title: 'Lug Bolt Torque Check at 100 km',
          recommendation: 'Re-torque all wheel fasteners with a calibrated torque wrench after the first 100 km of driving.',
          priority: 'HIGH',
          triggerComponent: c.name,
          reasoning: 'New alloy wheel mating surfaces settle against steel hubs under thermal expansion.'
        });
      }

      if (raw.category === 'powertrain' || raw.category === 'exhaust') {
        if (raw.powerGainHp && raw.powerGainHp > 20) {
          verificationRequirements.push({
            id: `verify-ecu-${c.componentId}`,
            title: 'Wideband Lambda Air-Fuel Ratio (AFR) Verification',
            category: 'Engine Calibration',
            description: `Verify air-fuel ratios and knock retard telemetry on an eddy-current dynamometer after installing ${c.name}.`,
            whyItMatters: 'Lean air-fuel mixtures under sustained boost can cause detonation and piston ring land failure.',
            isSafetyCritical: false,
            actionRequired: 'Log wideband lambda and ignition timing retard on quality 98 RON / 93 Octane fuel.',
            triggerComponent: c.name
          });

          recommendations.push({
            id: `rec-fuel-${c.componentId}`,
            category: 'Powertrain',
            title: 'Use High-Octane Premium Fuel Exclusively',
            recommendation: 'Ensure fuel tank is filled with 98+ RON (or 93+ AKI) fuel before wide-open throttle dyno validation.',
            priority: 'MEDIUM',
            triggerComponent: c.name,
            reasoning: 'Higher octane fuel prevents pre-ignition when cylinder pressures and intake charge temperatures are elevated.'
          });
        }
      }

      if (raw.category === 'aerodynamics') {
        recommendations.push({
          id: `rec-aero-${c.componentId}`,
          category: 'Safety',
          title: 'Balance High-Speed Aerodynamic Downforce',
          recommendation: 'When running high rear wing angles of attack, consider matching with a front splitter to prevent high-speed understeer.',
          priority: 'INFO',
          triggerComponent: c.name,
          reasoning: 'Rear downforce without front balance lifts the front axle slightly at speeds above 160 km/h.'
        });
      }
    });

    // Thermal recommendations
    if (thermal.coolingRequirement === 'mandatory_upgrade') {
      recommendations.push({
        id: 'rec-thermal-high',
        category: 'Thermal',
        title: 'Upgrade Heat Dissipation Systems',
        recommendation: 'Consider an auxiliary oil cooler and high-capacity radiator to sustain repeated track performance without heat soak.',
        priority: 'HIGH',
        triggerComponent: 'High Power Output',
        reasoning: 'Engine oil degrades significantly faster when sustained temperatures exceed 125°C.'
      });
    }

    // Determine Overall Build Health
    let status: HealthAndRecommendationsResult['health']['status'] = 'GOOD';
    let headline = 'All Physical Components Mechanically Verified';
    let description = 'Selected components pass physical fitment and chassis compatibility checks for this vehicle platform.';

    if (hasIncompatible) {
      status = 'ATTENTION';
      headline = 'Incompatible Component Flagged in Build';
      description = 'One or more components are not mechanically suited for this vehicle chassis and will require substitution.';
    } else if (hasConditional || hasVerificationRequired || verificationRequirements.length > 2) {
      status = 'REVIEW';
      headline = `${verificationRequirements.length} Engineering Verifications Recommended`;
      description = 'Build contains high-performance modifications requiring pre-purchase clearance checks or post-install geometry alignment.';
    }

    if (reasons.length === 0) {
      reasons.push('All components are bolt-on compatible with factory mounting locations.');
    }

    return {
      health: {
        status,
        headline,
        description,
        reasons
      },
      verificationRequirements,
      recommendations
    };
  }
}
