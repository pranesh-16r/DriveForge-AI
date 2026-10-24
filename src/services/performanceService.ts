import { Vehicle } from '../types';
import { BuildComponent, BuildState } from '../types/build';
import {
  PowerAnalysis,
  TorqueAnalysis,
  WeightAnalysis,
  AccelerationAnalysis,
  HandlingAnalysis,
  BrakingAnalysis,
  ThermalAnalysis,
  ReliabilityAnalysis,
  FuelEfficiencyAnalysis,
  ComponentMatrixRow,
  InstallationSummary,
  BuildPerformanceAnalysis
} from '../types/analysis';
import { RecommendationService } from './recommendationService';

// Known baseline 0-100 km/h acceleration lookup by vehicle ID / model
const KNOWN_ZERO_TO_HUNDRED: Record<string, number> = {
  'porsche-911-gt3-rs': 3.2,
  'porsche-718-gt4-rs': 3.4,
  'porsche-taycan-turbo-s': 2.8,
  'bmw-m3-competition': 3.5,
  'bmw-m4-competition': 3.5,
  'bmw-m340i-xdrive': 4.4,
  'toyota-gr-supra-30': 3.9,
  'toyota-gr-yaris': 5.2,
  'mazda-mx5-miata': 6.5,
  'chevrolet-corvette-z06': 2.6,
  'honda-civic-type-r': 5.3,
  'nissan-gt-r-nismo': 2.7
};

export class PerformanceService {
  /**
   * Primary entry point: Calculates comprehensive performance intelligence
   */
  public static calculateBuildPerformance(
    vehicle: Vehicle,
    components: BuildComponent[],
    buildState: BuildState
  ): BuildPerformanceAnalysis {
    const power = this.calculatePowerImpact(vehicle, components);
    const torque = this.calculateTorqueImpact(vehicle, components, power);
    const weight = this.calculateWeightImpact(vehicle, components);
    const acceleration = this.calculateAccelerationEstimate(vehicle, power, weight);
    const handling = this.calculateHandlingImpact(vehicle, components);
    const braking = this.calculateBrakingImpact(vehicle, components);
    const thermal = this.calculateThermalImpact(vehicle, components, power.estimatedGainMaxHp);
    const reliability = this.calculateReliabilityAnalysis(vehicle, components, power.estimatedGainMaxHp);
    const fuelEfficiency = this.calculateFuelEfficiencyImpact(vehicle, components, power.estimatedGainMaxHp);
    const matrix = this.buildComponentMatrix(components);
    const installation = this.calculateInstallationSummary(components);

    // Build Health & Recommendations via RecommendationService
    const { health, verificationRequirements, recommendations } = 
      RecommendationService.generateRecommendations(vehicle, components, buildState, thermal, braking, handling);

    return {
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      buildId: buildState.buildId,
      buildName: buildState.buildName,
      timestamp: new Date().toISOString(),
      health,
      power,
      torque,
      weight,
      acceleration,
      handling,
      braking,
      thermal,
      reliability,
      fuelEfficiency,
      matrix,
      verificationRequirements,
      recommendations,
      installation
    };
  }

  /**
   * 1. Power Analysis
   */
  public static calculatePowerImpact(vehicle: Vehicle, components: BuildComponent[]): PowerAnalysis {
    const stockHp = vehicle.baselinePowerHp || 300;
    const powerContributors: PowerAnalysis['contributors'] = [];

    let totalRawMinHp = 0;
    let totalRawMaxHp = 0;

    components.forEach((c) => {
      const raw = c.rawComponent;
      const nominalHp = raw.powerGainHp || 0;

      if (nominalHp > 0) {
        // Range estimation: dyno tolerances represent ±15% variance
        const minHp = Math.max(1, Math.round(nominalHp * 0.85));
        const maxHp = Math.round(nominalHp * 1.15);

        totalRawMinHp += minHp;
        totalRawMaxHp += maxHp;

        powerContributors.push({
          componentId: c.componentId,
          name: c.name,
          brand: c.brand,
          minHp,
          maxHp,
          confidence: 'ESTIMATED',
          note: raw.category === 'powertrain' ? 'Dyno map calibrated' : 'Flow enhancement'
        });
      }
    });

    // Diminishing returns calculation if multiple airflow mods are present
    let estimatedGainMinHp = totalRawMinHp;
    let estimatedGainMaxHp = totalRawMaxHp;
    let overlapNotice: string | undefined = undefined;

    if (powerContributors.length > 2) {
      // Flow bottlenecks mean gains do not sum linearly without ECU re-scaling
      estimatedGainMinHp = Math.round(totalRawMinHp * 0.9);
      estimatedGainMaxHp = Math.round(totalRawMaxHp * 0.95);
      overlapNotice = 'Cumulative airflow gains may exhibit diminishing returns unless mapped collectively on an eddy-current dynamometer.';
    }

    const projectedMinHp = stockHp + estimatedGainMinHp;
    const projectedMaxHp = stockHp + estimatedGainMaxHp;
    const percentageGainMin = Number(((estimatedGainMinHp / stockHp) * 100).toFixed(1));
    const percentageGainMax = Number(((estimatedGainMaxHp / stockHp) * 100).toFixed(1));

    return {
      stockHp,
      estimatedGainMinHp,
      estimatedGainMaxHp,
      projectedMinHp,
      projectedMaxHp,
      percentageGainMin,
      percentageGainMax,
      confidence: powerContributors.length > 0 ? 'ESTIMATED' : 'KNOWN DATA',
      source: powerContributors.length > 0 
        ? 'Deterministic airflow & combustion model based on manufacturer dyno sweeps' 
        : 'OEM factory dynamometer specification',
      overlapNotice,
      contributors: powerContributors
    };
  }

  /**
   * 2. Torque Analysis
   */
  public static calculateTorqueImpact(
    vehicle: Vehicle,
    components: BuildComponent[],
    power: PowerAnalysis
  ): TorqueAnalysis {
    const stockLbFt = vehicle.baselineTorqueLbFt || 300;
    // Standard metric conversion: 1 lb-ft = 1.35582 Nm
    const stockNm = Math.round(stockLbFt * 1.35582);

    const torqueContributors: TorqueAnalysis['contributors'] = [];
    let totalRawMinNm = 0;
    let totalRawMaxNm = 0;

    components.forEach((c) => {
      const raw = c.rawComponent;
      const nominalHp = raw.powerGainHp || 0;

      if (nominalHp > 0) {
        // Naturally aspirated vs forced induction torque correlation
        const isTurbo = vehicle.engine.toLowerCase().includes('turbo') || vehicle.engine.toLowerCase().includes('supercharged');
        const torqueMultiplier = isTurbo ? 1.4 : 1.1; // Nm per hp gain

        const minNm = Math.round(nominalHp * torqueMultiplier * 0.85);
        const maxNm = Math.round(nominalHp * torqueMultiplier * 1.15);

        totalRawMinNm += minNm;
        totalRawMaxNm += maxNm;

        torqueContributors.push({
          componentId: c.componentId,
          name: c.name,
          brand: c.brand,
          minNm,
          maxNm,
          confidence: 'ESTIMATED'
        });
      }
    });

    const estimatedGainMinNm = totalRawMinNm;
    const estimatedGainMaxNm = totalRawMaxNm;
    const projectedMinNm = stockNm + estimatedGainMinNm;
    const projectedMaxNm = stockNm + estimatedGainMaxNm;
    const percentageGainMin = Number(((estimatedGainMinNm / stockNm) * 100).toFixed(1));
    const percentageGainMax = Number(((estimatedGainMaxNm / stockNm) * 100).toFixed(1));

    return {
      stockLbFt,
      stockNm,
      estimatedGainMinNm,
      estimatedGainMaxNm,
      projectedMinNm,
      projectedMaxNm,
      percentageGainMin,
      percentageGainMax,
      confidence: torqueContributors.length > 0 ? 'ESTIMATED' : 'KNOWN DATA',
      source: 'Calculated torque curve derivation from volumetric airflow delta',
      contributors: torqueContributors,
      beginnerExplanation: 'Torque is the physical twisting force that pushes you back into your seat. Upgrades increase low-end and mid-range pulling power.',
      enthusiastExplanation: 'Torque output is governed by cylinder brake mean effective pressure (BMEP). Gains vary with intake air temperature (IAT), fuel octane rating, and ignition advance curves.'
    };
  }

  /**
   * 3. Weight Analysis
   */
  public static calculateWeightImpact(vehicle: Vehicle, components: BuildComponent[]): WeightAnalysis {
    const stockKg = vehicle.weightKg || 1500;
    let deltaKg = 0;
    let sprungDeltaKg = 0;
    let unsprungDeltaKg = 0;

    const contributors: WeightAnalysis['contributors'] = [];

    components.forEach((c) => {
      const raw = c.rawComponent;
      const weightDelta = raw.weightDeltaKg || 0;

      if (weightDelta !== 0) {
        deltaKg += weightDelta;

        // Categorize sprung vs unsprung mass
        const isUnsprung = 
          raw.category === 'wheels_tires' || 
          raw.category === 'brakes' || 
          raw.subCategory.toLowerCase().includes('wheel') ||
          raw.subCategory.toLowerCase().includes('rotor') ||
          raw.subCategory.toLowerCase().includes('caliper');

        if (isUnsprung) {
          unsprungDeltaKg += weightDelta;
        } else {
          sprungDeltaKg += weightDelta;
        }

        contributors.push({
          componentId: c.componentId,
          name: c.name,
          deltaKg: weightDelta,
          type: isUnsprung ? 'unsprung' : 'sprung',
          confidence: 'ESTIMATED'
        });
      }
    });

    const projectedKg = Math.round((stockKg + deltaKg) * 10) / 10;

    let explanation = 'Weight reduction enhances power-to-weight ratio, braking distances, and directional change responsiveness.';
    if (unsprungDeltaKg < 0) {
      explanation += ` Notably, saving ${Math.abs(unsprungDeltaKg).toFixed(1)} kg of unsprung rotational mass significantly improves damper response and road-surface tracking.`;
    }

    return {
      stockKg,
      deltaKg: Math.round(deltaKg * 10) / 10,
      projectedKg,
      confidence: contributors.length > 0 ? 'ESTIMATED' : 'KNOWN DATA',
      source: 'Component bill of materials weight differentials against OEM assemblies',
      sprungDeltaKg: Math.round(sprungDeltaKg * 10) / 10,
      unsprungDeltaKg: Math.round(unsprungDeltaKg * 10) / 10,
      contributors,
      explanation
    };
  }

  /**
   * 4. Acceleration 0-100 km/h Analysis
   */
  public static calculateAccelerationEstimate(
    vehicle: Vehicle,
    power: PowerAnalysis,
    weight: WeightAnalysis
  ): AccelerationAnalysis {
    const stockZeroTo100 = KNOWN_ZERO_TO_HUNDRED[vehicle.id] || (
      vehicle.baselinePowerHp ? Number((1000 / (vehicle.baselinePowerHp * 0.7)).toFixed(1)) : undefined
    );

    if (!stockZeroTo100) {
      return {
        available: false,
        confidence: 'VERIFICATION REQUIRED',
        source: 'Insufficient baseline acceleration telemetry',
        disclaimer: '0–100 km/h estimate unavailable with current baseline data. Professional GPS VBox verification recommended.'
      };
    }

    // Power to weight ratio calculation
    const stockRatio = power.stockHp / (weight.stockKg / 1000);
    const avgProjectedHp = (power.projectedMinHp + power.projectedMaxHp) / 2;
    const projectedRatio = avgProjectedHp / (weight.projectedKg / 1000);

    // Physics acceleration factor: Time scales inversely with sqrt of power-to-weight ratio
    const ratioDelta = Math.sqrt(stockRatio / projectedRatio);

    // Grip limitations: street tires reach traction limits below 3.0s unless AWD
    const isAWD = vehicle.drivetrain === 'AWD';
    const tractionFloor = isAWD ? 2.5 : 3.1;

    let rawProjectedTime = stockZeroTo100 * ratioDelta;
    if (rawProjectedTime < tractionFloor) {
      rawProjectedTime = tractionFloor + (rawProjectedTime - tractionFloor) * 0.5;
    }

    const projectedMin = Number(Math.max(tractionFloor, rawProjectedTime - 0.15).toFixed(1));
    const projectedMax = Number(Math.max(projectedMin + 0.1, rawProjectedTime + 0.15).toFixed(1));
    const deltaMin = Number((stockZeroTo100 - projectedMax).toFixed(1));
    const deltaMax = Number((stockZeroTo100 - projectedMin).toFixed(1));

    return {
      available: true,
      stockZeroTo100Seconds: stockZeroTo100,
      projectedZeroTo100MinSeconds: projectedMin,
      projectedZeroTo100MaxSeconds: projectedMax,
      deltaSecondsMin: deltaMin,
      deltaSecondsMax: deltaMax,
      confidence: 'ESTIMATED',
      source: 'Deterministic kinetic acceleration model based on dynamic power-to-weight ratio and drivetrain traction limits',
      disclaimer: 'Estimate based on available power and weight data. Real-world acceleration depends on tyre compound, ambient temperature, launch surface friction coefficient, and transmission calibration.'
    };
  }

  /**
   * 5. Handling & Dynamics Analysis
   */
  public static calculateHandlingImpact(vehicle: Vehicle, components: BuildComponent[]): HandlingAnalysis {
    let hasSuspension = false;
    let hasWheels = false;
    let hasAero = false;

    const factors: HandlingAnalysis['factors'] = [];

    components.forEach((c) => {
      const cat = c.rawComponent.category;
      if (cat === 'suspension') {
        hasSuspension = true;
        factors.push({
          component: c.name,
          factor: 'Spring Rate & Low-Speed Damping',
          effect: 'Reduces body roll during high-speed transitions and lowers centre of gravity'
        });
      }
      if (cat === 'wheels_tires') {
        hasWheels = true;
        factors.push({
          component: c.name,
          factor: 'Contact Patch & Unsprung Mass',
          effect: 'Improves mechanical lateral grip and transient turn-in sharpness'
        });
      }
      if (cat === 'aerodynamics') {
        hasAero = true;
        factors.push({
          component: c.name,
          factor: 'Axle Downforce',
          effect: 'Stabilizes high-speed directional stability over 120 km/h'
        });
      }
    });

    const overallRating = (hasSuspension || hasWheels || hasAero) ? 'improved' : 'neutral';
    const rideComfort = hasSuspension ? 'reduced' : 'neutral';
    const corneringStability = (hasSuspension || hasAero) ? 'improved' : 'neutral';
    const steeringResponse = (hasSuspension || hasWheels) ? 'improved' : 'neutral';

    const beginnerExplanation = hasSuspension
      ? 'Suspension and wheel upgrades sharpen cornering and reduce body sway, but will make the ride feel firmer over road bumps.'
      : 'No major handling alterations planned. The vehicle will retain its factory ride quality and comfort dynamics.';

    const enthusiastExplanation = hasSuspension
      ? 'Lowering ride height shifts the vehicle roll center closer to the center of gravity, reducing roll moment. Monotube dampers with digressive valving control transient pitch and yaw.'
      : 'Chassis kinematics remain within OEM compliance limits without increased bush deflection or altered camber curves.';

    return {
      overallRating,
      rideComfort,
      corneringStability,
      steeringResponse,
      beginnerExplanation,
      enthusiastExplanation,
      factors
    };
  }

  /**
   * 6. Braking Analysis
   */
  public static calculateBrakingImpact(vehicle: Vehicle, components: BuildComponent[]): BrakingAnalysis {
    const brakeComponents = components.filter(c => 
      c.rawComponent.category === 'brakes' || 
      c.name.toLowerCase().includes('brake') || 
      c.rawComponent.subCategory.toLowerCase().includes('brake')
    );

    const hasBrakeModifications = brakeComponents.length > 0;

    return {
      hasBrakeModifications,
      thermalEndurance: hasBrakeModifications ? 'improved' : 'neutral',
      pedalFirmness: hasBrakeModifications ? 'improved' : 'neutral',
      stoppingPerformanceImpact: hasBrakeModifications
        ? 'Repeated high-temperature fade resistance is significantly enhanced. Ultimate single-stop stopping distance remains limited by tyre friction coefficient.'
        : 'Factory braking system retained. Adequate for street driving; track use requires monitoring fluid boiling points.',
      safetyNotice: 'DriveForge never guarantees stopping distance. Always have brake components installed and torque-verified by a certified master technician.',
      verificationRequired: hasBrakeModifications,
      confidence: hasBrakeModifications ? 'ESTIMATED' : 'KNOWN DATA',
      items: brakeComponents.map(c => c.name)
    };
  }

  /**
   * 7. Thermal Analysis
   */
  public static calculateThermalImpact(
    vehicle: Vehicle,
    components: BuildComponent[],
    maxHpGain: number
  ): ThermalAnalysis {
    let thermalLoadIndex: ThermalAnalysis['thermalLoadIndex'] = 'low';
    let coolingRequirement: ThermalAnalysis['coolingRequirement'] = 'sufficient_oem';
    const recommendations: string[] = [];

    if (maxHpGain > 60) {
      thermalLoadIndex = 'critical';
      coolingRequirement = 'mandatory_upgrade';
      recommendations.push('High-capacity all-aluminum radiator recommended');
      recommendations.push('Auxiliary oil cooler required for sustained track stints');
      recommendations.push('High-temp DOT 4 / 5.1 brake fluid (dry boiling point > 310°C)');
    } else if (maxHpGain > 25) {
      thermalLoadIndex = 'moderate';
      coolingRequirement = 'recommended_upgrade';
      recommendations.push('Verify coolant condition and thermostat operation');
      recommendations.push('High-flow charge-air intercooler recommended for forced induction engines');
    } else {
      recommendations.push('OEM cooling capacity is sufficient for typical street and spirited driving');
    }

    return {
      thermalLoadIndex,
      coolingRequirement,
      explanation: maxHpGain > 25
        ? 'Increased combustion output generates higher cylinder head and oil temperatures. Ensuring adequate thermal dissipation prevents heat soak and ECU knock-induced timing retardation.'
        : 'Thermal loads remain within standard OEM heat exchanger margins.',
      verificationRequired: thermalLoadIndex !== 'low',
      confidence: 'ESTIMATED',
      recommendations
    };
  }

  /**
   * 8. Reliability Analysis
   */
  public static calculateReliabilityAnalysis(
    vehicle: Vehicle,
    components: BuildComponent[],
    maxHpGain: number
  ): ReliabilityAnalysis {
    const stressFactors: ReliabilityAnalysis['stressFactors'] = [];

    let concernLevel: ReliabilityAnalysis['concernLevel'] = 'LOW CONCERN';

    if (maxHpGain > 50) {
      concernLevel = 'REVIEW REQUIRED';
      stressFactors.push({
        area: 'Powertrain & Drivetrain',
        level: 'Elevated',
        details: 'Transmission clutch packs and dual-mass flywheel will experience higher peak torque loads during full-throttle shifts.'
      });
      stressFactors.push({
        area: 'Engine Internals',
        level: 'Moderate',
        details: 'Peak cylinder pressures will increase; strict synthetic oil change intervals (every 5,000 km) are recommended.'
      });
    } else if (maxHpGain > 20) {
      concernLevel = 'MODERATE CONCERN';
      stressFactors.push({
        area: 'Engine Thermals',
        level: 'Moderate',
        details: 'Minor thermal increase during aggressive driving; OEM safeguards remain active.'
      });
    }

    const hasStiffSuspension = components.some(c => c.rawComponent.category === 'suspension');
    if (hasStiffSuspension) {
      stressFactors.push({
        area: 'Chassis Bushings & Ball Joints',
        level: 'Moderate',
        details: 'Stiffer damping transmits more high-frequency road vibrations into OEM rubber subframe bushings.'
      });
    }

    if (stressFactors.length === 0) {
      stressFactors.push({
        area: 'Overall Platform',
        level: 'Low',
        details: 'Modifications operate within factory safety margins and design tolerances.'
      });
    }

    return {
      concernLevel,
      summary: concernLevel === 'REVIEW REQUIRED'
        ? 'Significant performance increases place additional stress on drivetrain and cooling components. Scheduled preventative maintenance is essential.'
        : concernLevel === 'MODERATE CONCERN'
        ? 'Moderate mechanical demands. Recommended to observe shorter oil service intervals and high-octane fuel.'
        : 'Standard mechanical demands with negligible impact on everyday factory reliability.',
      stressFactors
    };
  }

  /**
   * 9. Fuel Efficiency Analysis
   */
  public static calculateFuelEfficiencyImpact(
    vehicle: Vehicle,
    components: BuildComponent[],
    maxHpGain: number
  ): FuelEfficiencyAnalysis {
    let impact: FuelEfficiencyAnalysis['impact'] = 'Minimal Change';
    let explanation = 'Aerodynamic and lightweight enhancements offset minor airflow changes under cruising conditions.';

    if (maxHpGain > 40) {
      impact = 'Potential Reduction';
      explanation = 'Higher peak boost pressure and enriched target air-fuel ratios (AFR) at wide-open throttle will consume more fuel during spirited driving.';
    } else if (components.some(c => c.rawComponent.category === 'powertrain')) {
      impact = 'Potential Reduction';
      explanation = 'Performance calibrations optimize power delivery over lean-burn economy parameters.';
    }

    return {
      impact,
      explanation,
      disclaimer: 'Actual fuel consumption depends primarily on driver throttle application, traffic conditions, tyre pressures, and fuel octane quality.'
    };
  }

  /**
   * 10. Component Impact Matrix
   */
  public static buildComponentMatrix(components: BuildComponent[]): ComponentMatrixRow[] {
    return components.map((c) => {
      const raw = c.rawComponent;
      const cat = raw.category;

      let powerSymbol = '—';
      let powerLabel = 'Neutral';
      let torqueSymbol = '—';
      let torqueLabel = 'Neutral';
      let weightSymbol = '—';
      let weightLabel = 'Neutral';
      let handlingSymbol = '—';
      let handlingLabel = 'Neutral';
      let brakingSymbol = '—';
      let brakingLabel = 'Neutral';
      let comfortSymbol = '—';
      let comfortLabel = 'Neutral';
      let thermalSymbol = '—';
      let thermalLabel = 'Neutral';

      // Power & Torque
      if (raw.powerGainHp && raw.powerGainHp > 40) {
        powerSymbol = '+++';
        powerLabel = 'High Gain';
        torqueSymbol = '+++';
        torqueLabel = 'High Gain';
        thermalSymbol = '++';
        thermalLabel = 'Increased Heat';
      } else if (raw.powerGainHp && raw.powerGainHp > 15) {
        powerSymbol = '++';
        powerLabel = 'Moderate Gain';
        torqueSymbol = '++';
        torqueLabel = 'Moderate Gain';
        thermalSymbol = '+';
        thermalLabel = 'Slight Heat';
      } else if (raw.powerGainHp && raw.powerGainHp > 0) {
        powerSymbol = '+';
        powerLabel = 'Mild Gain';
        torqueSymbol = '+';
        torqueLabel = 'Mild Gain';
      }

      // Weight
      if (raw.weightDeltaKg && raw.weightDeltaKg < -5) {
        weightSymbol = '+++';
        weightLabel = 'Major Saving';
      } else if (raw.weightDeltaKg && raw.weightDeltaKg < 0) {
        weightSymbol = '+';
        weightLabel = 'Lightweight';
      } else if (raw.weightDeltaKg && raw.weightDeltaKg > 3) {
        weightSymbol = '-';
        weightLabel = 'Added Weight';
      }

      // Handling & Comfort
      if (cat === 'suspension') {
        handlingSymbol = '+++';
        handlingLabel = 'Significantly Sharpened';
        comfortSymbol = '--';
        comfortLabel = 'Firmer Ride';
      } else if (cat === 'wheels_tires') {
        handlingSymbol = '++';
        handlingLabel = 'Sharper Turn-in';
        comfortSymbol = '-';
        comfortLabel = 'Lower Profile';
      } else if (cat === 'aerodynamics') {
        handlingSymbol = '+';
        handlingLabel = 'High Speed Downforce';
      }

      // Braking
      if (cat === 'brakes') {
        brakingSymbol = '+++';
        brakingLabel = 'High Thermal Fade Resistance';
      }

      // Installation difficulty
      let difficulty: ComponentMatrixRow['installDifficulty'] = 'Medium';
      if (raw.installationDifficulty === 'professional_required') {
        difficulty = 'Specialist';
      } else if (raw.installationDifficulty === 'moderate') {
        difficulty = 'Medium';
      } else {
        difficulty = 'Low';
      }

      return {
        componentId: c.componentId,
        name: c.name,
        brand: c.brand,
        category: cat.toUpperCase(),
        powerSymbol,
        powerLabel,
        torqueSymbol,
        torqueLabel,
        weightSymbol,
        weightLabel,
        handlingSymbol,
        handlingLabel,
        brakingSymbol,
        brakingLabel,
        comfortSymbol,
        comfortLabel,
        thermalSymbol,
        thermalLabel,
        installDifficulty: difficulty
      };
    });
  }

  /**
   * 11. Installation Summary
   */
  public static calculateInstallationSummary(components: BuildComponent[]): InstallationSummary {
    let highestComplexity: InstallationSummary['highestComplexity'] = 'LOW';
    let totalInstallHours = 0;

    components.forEach((c) => {
      totalInstallHours += c.rawComponent.installHours || 1;
      const diff = c.rawComponent.installationDifficulty;
      if (diff === 'professional_required') {
        highestComplexity = 'SPECIALIST';
      } else if (diff === 'moderate' && highestComplexity !== 'SPECIALIST') {
        highestComplexity = 'HIGH';
      } else if (highestComplexity === 'LOW') {
        highestComplexity = 'MEDIUM';
      }
    });

    const reasons: Record<string, string> = {
      SPECIALIST: 'Build contains modifications requiring calibrated workshop hoists, alignment benches, ECU flash tools, or brake pressure bleeding.',
      HIGH: 'Multiple mechanical subassemblies require dismounting, torque-wrench verification, and subsequent suspension geometry alignment.',
      MEDIUM: 'Straightforward bolt-on installations requiring standard automotive hand tools and basic mechanical familiarity.',
      LOW: 'Simple plug-and-play or aesthetic components requiring minimal disassembly.'
    };

    return {
      highestComplexity,
      reason: reasons[highestComplexity] || reasons.MEDIUM,
      totalInstallHours: Number(totalInstallHours.toFixed(1))
    };
  }
}
