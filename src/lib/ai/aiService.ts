import { DriveForgeAIContext } from './aiContext';
import { buildSystemPrompt } from './aiPrompt';
import { validateAIResponse, parseStructuredSections, StructuredAIResponse } from './aiResponseParser';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AIResponse {
  text: string;
  provider: string;
  isFallback: boolean;
  structured?: StructuredAIResponse;
  telemetry?: {
    durationMs?: number;
  };
}

export interface AIProvider {
  id: string;
  name: string;
  generateResponse(
    context: DriveForgeAIContext,
    messages: AIMessage[]
  ): Promise<AIResponse>;
}

/**
 * DETERMINISTIC LOCAL ENGINEERING ASSISTANT
 * Evaluates actual BuildState, vehicle geometry, regional pricing,
 * compatibility verdicts, and performance deltas without calling external APIs.
 */
export class LocalEngineeringFallbackProvider implements AIProvider {
  public readonly id = 'local-engineering';
  public readonly name = 'Local Engineering Assistant';

  public async generateResponse(
    context: DriveForgeAIContext,
    messages: AIMessage[]
  ): Promise<AIResponse> {
    const startTime = Date.now();
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const query = lastUserMessage ? lastUserMessage.content.toLowerCase() : '';

    const text = this.answerDeterministicQuery(query, context);
    const validated = validateAIResponse(text, context);
    const structured = parseStructuredSections(validated.sanitizedText);

    return {
      text: validated.sanitizedText,
      provider: 'Local Engineering Assistant (Deterministic)',
      isFallback: true,
      structured,
      telemetry: {
        durationMs: Date.now() - startTime
      }
    };
  }

  private answerDeterministicQuery(query: string, context: DriveForgeAIContext): string {
    const { vehicle, build, compatibility, cost, performance, verificationRequirements, location, experienceMode, activeComponent } = context;

    // 0. Modification Advice queries
    if (
      query.includes('advice') ||
      query.includes('suggest') ||
      query.includes('prioritize') ||
      query.includes('roadmap') ||
      query.includes('what mod') ||
      query.includes('first mod') ||
      query.includes('modification advice')
    ) {
      if (build.components.length === 0) {
        return `**DIRECT ANSWER**
For an OEM stock **${vehicle.year} ${vehicle.brand} ${vehicle.model}** (${vehicle.chassisCode || 'Platform'}), the highest-return modification priority sequence is:

1. **High-Performance Tires & Brake Pads**: Establishes mechanical grip and eliminates thermal brake fade before adding power.
2. **Coilover Suspension & Sway Bars**: Lowers center of gravity, reduces body roll, and optimizes tire contact patch.
3. **High-Flow Intake & Cat-Back Exhaust**: Enhances airflow volumetric efficiency and exhaust scavenging.
4. **ECU Calibration (Stage 1)**: Maximizes output from bolt-on hardware with optimized boost and ignition timing.

**WHY**
Adding horsepower before addressing braking and lateral stability leads to heat saturation and reduced driver confidence.

**RECOMMENDATION**
Select suspension or braking components in the 3D Garage to build a solid chassis foundation.`;
      }

      return `**DIRECT ANSWER**
Based on your active "${build.name}" (${build.components.length} components), your build focuses on **${build.components.map(c => c.category).join(', ')}**.

**CHIEF ENGINEER ADVICE**
• **Supporting Hardware**: ${build.components.some(c => c.category === 'powertrain') ? 'Ensure oil cooling capacity and high-temp brake fluid are installed alongside engine bolt-ons.' : 'Consider pair-matching coilover spring rates with upgraded anti-roll bars.'}
• **Installation Priority**: Mount suspension and brakes first, allow 150 km of road settling, perform precision laser alignment, then calibrate engine software.
• **Reliability Margin**: Current drivetrain safety factor is estimated at **${performance.torqueLoadRisk === 'High' ? 'Cautionary (Torque limits approached)' : 'Optimal (>1.25x reserve)'}**.

**NEXT STEPS**
Verify component CAD clearance in the 3D Inspector before dispatching parts to the workshop.`;
    }

    // 0.1 Performance Upgrade Recommendations
    if (
      query.includes('performance upgrade') ||
      query.includes('upgrade recommendation') ||
      query.includes('upgrade path') ||
      query.includes('stage 1') ||
      query.includes('stage 2') ||
      query.includes('more horsepower') ||
      query.includes('power upgrade') ||
      query.includes('bang for buck') ||
      query.includes('gain 50')
    ) {
      return `**DIRECT ANSWER**
Here are the recommended performance upgrades for the **${vehicle.brand} ${vehicle.model}** (${vehicle.engine || 'Engine Platform'}):

**TIER 1 (Best HP & Response per Dollar):**
• **High-Flow Cold Air Intake**: +12 to +18 HP, reduces inlet air temperature (IAT).
• **Valvetronic Cat-Back Exhaust**: +8 to +15 HP, reduces backpressure while keeping highway drone low.
• **Stage 1 ECU Flash Tune**: +35 to +60 HP, optimizes fueling, boost mapping, and throttle response.

**TIER 2 (Thermal Headroom & Track Longevity):**
• **Upgraded Intercooler / Oil Cooler**: Eliminates heat soak during repeated acceleration runs.
• **Inverted Monotube Coilovers**: 20–30mm lowering with 32-way rebound damping adjustment.
• **Slotted Floating Two-Piece Rotors**: Saves 2.5 kg unsprung mass per corner and resists pad glazing.

**CURRENT PROJECTION**
• Stock Baseline: **${vehicle.powerHp} HP** / ${performance.stockTorqueNm} Nm
• With Recommended Staged Package: **${vehicle.powerHp + 65}–${vehicle.powerHp + 85} HP**
• 0–100 km/h Impact: -0.6s to -0.8s quicker than OEM factory time.`;
    }

    // 1. Compatibility queries
    if (query.includes('compatib') || query.includes('fit') || query.includes('work together') || query.includes('conflict')) {
      if (build.components.length === 0) {
        return `**DIRECT ANSWER**
Your build currently has no components selected, so your ${vehicle.year} ${vehicle.brand} ${vehicle.model} remains in stock factory configuration.

**RECOMMENDATION**
Select components in the 3D Garage or Build Blueprint to begin compatibility fitment verification.`;
      }

      if (compatibility.overallStatus === 'compatible') {
        return `**DIRECT ANSWER**
All ${build.components.length} components in your "${build.name}" are mechanically compatible with your ${vehicle.year} ${vehicle.brand} ${vehicle.model}.

**WHY**
CAD mounting dimensions, bolt patterns, and electronic bus protocols meet or exceed OEM tolerances for the ${vehicle.chassisCode} platform.

**CURRENT DATA**
- Total Components: ${build.components.length}
- Verified Fitment: ${compatibility.passedCount} Passed
- Hardware Conflicts: 0

**RECOMMENDATION**
Ensure hardware torque specifications and fluid levels are verified during workshop installation.`;
      } else {
        const issuesList = compatibility.issues.map(i => `• **${i.componentName}**: ${i.message}`).join('\n');
        return `**DIRECT ANSWER**
Your build has conditional fitment items requiring review (${compatibility.conditionalCount} conditional, ${compatibility.conflictCount} conflicts).

**WHY**
Certain components introduce mechanical clearances or calibration tolerances that cannot be guaranteed without physical workshop checks.

**CURRENT DATA**
${issuesList}

**VERIFICATION REQUIRED**
Resolve clearance and calibration requirements before proceeding with workshop installation.`;
      }
    }

    // 2. Cost / Pricing queries
    if (query.includes('cost') || query.includes('price') || query.includes('money') || query.includes('how much') || query.includes('budget') || query.includes('labor')) {
      if (build.components.length === 0) {
        return `**DIRECT ANSWER**
Current build cost is ${cost.currencySymbol}0 as no aftermarket components have been added yet.

**CURRENT DATA**
- Region: ${location.region}, ${location.country}
- Currency: ${location.currency} (${location.currencySymbol})

**RECOMMENDATION**
Add components to see estimated hardware prices and regional workshop installation rates.`;
      }

      return `**DIRECT ANSWER**
The total estimated project cost for your build in ${location.region} is **${cost.totalFormatted}**.

**WHY**
This estimate includes regional automotive import duties, freight logistics to ${location.country}, and standard certified workshop labor hours.

**CURRENT DATA**
- Hardware Components: ${cost.partsFormatted}
- Installation Labor: ${cost.laborFormatted}
- Total Estimate: **${cost.totalFormatted}**
- Confidence Level: ${cost.confidence} (Regional engineering model, not a retail quotation)

**RECOMMENDATION**
Request formal quotes from certified partner workshops prior to purchasing parts.`;
    }

    // 3. Power / Torque / Faster / Speed queries
    if (query.includes('power') || query.includes('torque') || query.includes('faster') || query.includes('horsepower') || query.includes('hp') || query.includes('speed') || query.includes('dyno')) {
      if (build.components.length === 0) {
        return `**DIRECT ANSWER**
Your ${vehicle.brand} ${vehicle.model} produces **${vehicle.powerHp} HP** and **${vehicle.torqueLbFt} lb-ft** torque in factory specification.

**RECOMMENDATION**
Consider an intake, high-flow exhaust, or ECU tune to unlock additional volumetric efficiency.`;
      }

      const powerContributors = build.components.filter(c => c.powerGainHp > 0);
      const contribStr = powerContributors.length > 0
        ? powerContributors.map(c => `• ${c.brand} ${c.name}: +${c.powerGainHp} HP`).join('\n')
        : '• No direct powertrain modifications in current build.';

      return `**DIRECT ANSWER**
DriveForge estimates a projected output of **${performance.projectedHpMin}–${performance.projectedHpMax} HP** (+${performance.deltaHpMin}–${performance.deltaHpMax} HP over stock ${vehicle.powerHp} HP).

**WHY**
Gains reflect dyno flow-bench tolerances and take into account component overlap restrictions (e.g. intake and exhaust pairing dynamics).

**CURRENT DATA**
- Stock Baseline: ${vehicle.powerHp} HP / ${performance.stockTorqueNm} Nm
- Projected Power: **${performance.projectedHpMin}–${performance.projectedHpMax} HP**
- Projected Torque: **${performance.projectedTorqueMinNm}–${performance.projectedTorqueMaxNm} Nm**
- Power Contributors:
${contribStr}

**RECOMMENDATION**
${performance.torqueLoadRisk === 'High' ? 'Drivetrain torque limits are approached; upgrade clutch or transmission cooling.' : 'Engine calibration should be validated on a chassis dynamometer with wideband O2 monitoring.'}`;
    }

    // 4. Acceleration / 0-100 queries
    if (query.includes('0-100') || query.includes('0 to 100') || query.includes('accelerat') || query.includes('quarter mile') || query.includes('drag')) {
      if (!performance.acceleration0to100StockSec) {
        return `**DIRECT ANSWER**
Factory acceleration benchmarks are estimated around 7.5–9.0s depending on launch surface and tire condition.

**CURRENT DATA**
- Power gain: +${performance.deltaHpMin}–${performance.deltaHpMax} HP
- Weight delta: ${performance.weightDeltaKg > 0 ? '+' : ''}${performance.weightDeltaKg} kg`;
      }

      return `**DIRECT ANSWER**
DriveForge estimates a 0–100 km/h acceleration range of **${performance.acceleration0to100ProjMinSec?.toFixed(1)}–${performance.acceleration0to100ProjMaxSec?.toFixed(1)} seconds** versus stock **${performance.acceleration0to100StockSec.toFixed(1)} seconds**.

**WHY**
Calculated using modified power-to-weight ratio (${((performance.projectedHpMin / performance.projectedWeightKg) * 1000).toFixed(1)} W/kg) and front-axle traction limits on ${vehicle.drivetrain} platform.

**CURRENT DATA**
- Stock 0–100 km/h: ${performance.acceleration0to100StockSec.toFixed(1)}s
- Projected Range: ${performance.acceleration0to100ProjMinSec?.toFixed(1)}–${performance.acceleration0to100ProjMaxSec?.toFixed(1)}s
- Real-World Disclaimer: Acceleration depends heavily on tire compound, ambient temperature, and launch surface grip.`;
    }

    // 5. Handling / Suspension / Ride comfort queries
    if (query.includes('handling') || query.includes('comfort') || query.includes('suspension') || query.includes('ride') || query.includes('corner') || query.includes('coilover')) {
      return `**DIRECT ANSWER**
Overall handling characteristics are projected to show **${performance.corneringStability.toUpperCase()}** cornering stability, **${performance.steeringResponse.toUpperCase()}** steering response, and **${performance.rideComfort.toUpperCase()}** daily ride comfort.

**WHY**
${experienceMode === 'beginner' 
  ? 'Stiffer springs and upgraded dampers reduce body roll through quick turns, but transfer more road bumps and expansion joints into the cabin.' 
  : 'Lowering the vehicle center of gravity and increasing roll stiffness reduces lateral weight transfer. High-speed damping controls chassis pitch, while increased spring rates yield firmer NVH characteristics.'}

**CURRENT DATA**
- Cornering Stability: ${performance.corneringStability}
- Steering Response: ${performance.steeringResponse}
- Ride Comfort: ${performance.rideComfort}
- Chassis Weight Delta: ${performance.weightDeltaKg > 0 ? '+' : ''}${performance.weightDeltaKg} kg

**RECOMMENDATION**
A complete 4-wheel precision laser alignment (toe, camber, and caster) is mandatory immediately following suspension settling.`;
    }

    // 6. Build Order / What to install first queries
    if (query.includes('order') || query.includes('first') || query.includes('sequence') || query.includes('step') || query.includes('start with')) {
      if (build.components.length === 0) {
        return `**DIRECT ANSWER**
For a balanced build on a ${vehicle.brand} ${vehicle.model}, the recommended engineering sequence is:
1. High-performance tires & brake pads (baseline safety & grip)
2. Suspension & chassis braces (handling & stability)
3. Air intake & cat-back exhaust (airflow efficiency)
4. ECU calibration (optimizing fuel & timing for hardware)`;
      }

      return `**DIRECT ANSWER**
Based on the components currently in your "${build.name}", here is the recommended physical installation order:

**RECOMMENDATION**
1. **Chassis & Suspension Hardware**: Install coilovers and strut bars first so the chassis geometry can settle.
2. **Wheels & Brakes**: Mount wheels and verify caliper barrel clearance with suspension unloaded and loaded.
3. **Powertrain Airflow Hardware**: Fit cold air intake, intercooler, or downpipe hardware.
4. **ECU Calibration / Tune**: Always flash ECU calibration *last* so engine timing accounts for all installed intake/exhaust modifications.

**WHY**
Installing powertrain upgrades before supporting suspension or cooling hardware can lead to thermal bottlenecking or traction loss.`;
    }

    // 7. Verification requirements queries
    if (query.includes('verification') || query.includes('check') || query.includes('inspect') || query.includes('why') && query.includes('review')) {
      if (verificationRequirements.length === 0) {
        return `**DIRECT ANSWER**
Your build currently has **zero outstanding physical verification requirements**. All selected hardware is rated as direct bolt-on fitment.`;
      }

      const reqsList = verificationRequirements.map((v, i) => `${i + 1}. **${v.title}** (${v.severity.toUpperCase()}): ${v.description}`).join('\n');

      return `**DIRECT ANSWER**
Your build currently has **${verificationRequirements.length} verification item(s)** that must be physically measured or inspected:

**VERIFICATION REQUIRED**
${reqsList}

**WHY**
CAD models establish baseline dimensional fitment, but casting variations, brake caliper revisions, and sensor tolerances require physical workshop confirmation prior to torqueing hardware.`;
    }

    // 8. Risks / Thermal / Reliability queries
    if (query.includes('risk') || query.includes('thermal') || query.includes('reliable') || query.includes('reliability') || query.includes('break') || query.includes('damage')) {
      return `**DIRECT ANSWER**
Thermal stress risk for your current setup is assessed at **${performance.thermalRisk.toUpperCase()}**, and drivetrain torque load risk is assessed at **${performance.torqueLoadRisk.toUpperCase()}**.

**WHY**
Increased cylinder pressures from bolt-on modifications generate higher exhaust gas temperatures (EGT) and oil thermal loads.

**CURRENT DATA**
- Thermal Stress Rating: ${performance.thermalRisk}
- Drivetrain Torque Load Rating: ${performance.torqueLoadRisk}
- Projected Output: ${performance.projectedHpMin}–${performance.projectedHpMax} HP

**RECOMMENDATION**
${performance.thermalRisk === 'High' 
  ? 'Add an upgraded aluminum radiator or auxiliary oil cooler before sustained track driving.' 
  : 'Maintain 5,000 km synthetic oil change intervals and monitor coolant temperatures during track sessions.'}`;
    }

    // 9. Explain build queries
    if (query.includes('explain') || query.includes('summary') || query.includes('overview') || query.includes('tell me about my build')) {
      if (build.components.length === 0) {
        return `**DIRECT ANSWER**
Your build is currently in its factory baseline configuration for the ${vehicle.year} ${vehicle.brand} ${vehicle.model} (${vehicle.variant}). It delivers ${vehicle.powerHp} HP with standard ${vehicle.drivetrain} drivetrain.`;
      }

      const compSummary = build.components.map(c => `• **${c.brand} ${c.name}** (${c.category}): ${c.powerGainHp > 0 ? `+${c.powerGainHp} HP, ` : ''}${c.priceEstimate}`).join('\n');

      return `**DIRECT ANSWER**
Your "${build.name}" consists of **${build.componentCount} physical components** engineered for the ${vehicle.year} ${vehicle.brand} ${vehicle.model}.

**CURRENT DATA**
${compSummary}

**PERFORMANCE & COST SUMMARY**
- Power Delta: +${performance.deltaHpMin}–${performance.deltaHpMax} HP (${performance.projectedHpMin}–${performance.projectedHpMax} HP total)
- Weight Delta: ${performance.weightDeltaKg > 0 ? '+' : ''}${performance.weightDeltaKg} kg
- Regional Estimate (${location.region}): ${cost.totalFormatted} (Hardware + Labor)
- Build Health: **${build.healthStatus}**

**RECOMMENDATION**
Review the Build Analysis matrix or ask about specific components for detailed CAD fitment data.`;
    }

    // 10. Legal / Homologation / Street Legal queries
    if (query.includes('legal') || query.includes('police') || query.includes('fine') || query.includes('pass inspection') || query.includes('street legal') || query.includes('road legal')) {
      return `**DIRECT ANSWER**
DriveForge evaluates mechanical fitment and physical thermodynamics, not statutory motor vehicle homologation.

**WHY**
Vehicle modification regulations, noise limits (dB), and exhaust emissions standards vary substantially across ${location.country} (${location.region}) and municipal jurisdictions.

**RECOMMENDATION**
Consult your local motor vehicle inspection authority or transport department before installing decat downpipes, dark window tints, or extreme wheel offsets.`;
    }

    // 11. Specific Component Query (e.g. exhaust, intake, coilovers, brakes)
    if (activeComponent) {
      return `**DIRECT ANSWER**
Regarding the **${activeComponent.brand} ${activeComponent.name}** (${activeComponent.category}):
This component provides an estimated **${activeComponent.powerGainHp > 0 ? `+${activeComponent.powerGainHp} HP` : 'chassis stability improvement'}** with an estimated regional price of **${activeComponent.priceEstimate}**.

**WHY**
${activeComponent.description}

**CURRENT DATA**
- Brand & Model: ${activeComponent.brand} ${activeComponent.name}
- Category: ${activeComponent.category}
- Installation Difficulty: ${activeComponent.installDifficulty}
- Weight Delta: ${activeComponent.weightDeltaKg > 0 ? '+' : ''}${activeComponent.weightDeltaKg} kg

**RECOMMENDATION**
Ensure compatibility with your current wheel offset and suspension travel limits.`;
    }

    // Fallback default answer referencing the exact vehicle and build
    return `**DIRECT ANSWER**
Regarding your inquiry about the ${vehicle.year} ${vehicle.brand} ${vehicle.model}:
Your current build "${build.name}" includes ${build.componentCount} component(s) with an overall health status of **${build.healthStatus}**.

**CURRENT DATA**
- Baseline Vehicle: ${vehicle.year} ${vehicle.brand} ${vehicle.model} (${vehicle.engine})
- Projected Power: ${performance.projectedHpMin}–${performance.projectedHpMax} HP (+${performance.deltaHpMin}–${performance.deltaHpMax} HP)
- Regional Project Cost (${location.region}): ${cost.totalFormatted}
- Outstanding Verifications: ${verificationRequirements.length} item(s)

**RECOMMENDATION**
You can ask me about compatibility, regional part pricing, installation order, handling impact, or specific component clearances.`;
  }
}

/**
 * GEMINI SERVER PROVIDER
 * Proxies requests securely through our server API endpoint /api/ai/chief-engineer
 */
export class GeminiServerProvider implements AIProvider {
  public readonly id = 'gemini-server';
  public readonly name = 'DriveForge AI Chief Engineer (Gemini)';

  public async generateResponse(
    context: DriveForgeAIContext,
    messages: AIMessage[]
  ): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch('/api/ai/chief-engineer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context,
          messages
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || data.fallbackRequired) {
        throw new Error(data.error || 'Server indicated fallback required');
      }

      const rawText = data.text;
      const validated = validateAIResponse(rawText, context);
      const structured = parseStructuredSections(validated.sanitizedText);

      return {
        text: validated.sanitizedText,
        provider: 'DriveForge AI (Gemini 3.8 Flash)',
        isFallback: false,
        structured,
        telemetry: {
          durationMs: Date.now() - startTime
        }
      };
    } catch (err) {
      console.warn('[AI Service] Gemini server request failed or unavailable, falling back to Local Engineering Assistant:', err);
      // Seamlessly fall back to local engineering engine
      const localProvider = new LocalEngineeringFallbackProvider();
      return await localProvider.generateResponse(context, messages);
    }
  }
}

/**
 * Factory for acquiring the active AI provider
 */
export function getAIProvider(): AIProvider {
  return new GeminiServerProvider();
}

/**
 * Context-aware questions tailored to the exact vehicle and physical components in the build
 */
export function getSuggestedQuestions(context: DriveForgeAIContext): string[] {
  const { build, vehicle, compatibility, verificationRequirements, location, performance, activeWorkshop } = context;
  const suggestions: string[] = [];

  // Active Workshop inquiries take priority
  if (activeWorkshop) {
    suggestions.push(`Can ${activeWorkshop.name} install all the components in my active build?`);
    suggestions.push(`What technical questions should I ask ${activeWorkshop.name} before dropping off my car?`);
    suggestions.push(`What verification tests should the technician run after installing my setup?`);
    if (activeWorkshop.missingServices.length > 0) {
      suggestions.push(`Why might I need a separate specialist for ${activeWorkshop.missingServices[0]}?`);
    }
    return suggestions.slice(0, 4);
  }

  if (build.components.length === 0) {
    suggestions.push(`What are the best starter modifications for my ${vehicle.brand} ${vehicle.model}?`);
    suggestions.push(`What is the recommended installation order for a daily street build?`);
    suggestions.push(`How much headroom does the factory ${vehicle.engine} engine hold?`);
    suggestions.push(`How does my vehicle compare to other ${vehicle.drivetrain} platforms?`);
    return suggestions;
  }

  // If there are verification requirements
  if (verificationRequirements.length > 0) {
    suggestions.push(`Why does my build require physical verification?`);
  }

  // If there are powertrain or exhaust mods
  const hasPowertrain = build.components.some(c => c.category === 'powertrain' || c.category === 'exhaust');
  if (hasPowertrain) {
    suggestions.push(`Will this build cause ECU check engine lights or heat soak?`);
    suggestions.push(`What is the estimated horsepower and torque gain over stock?`);
  }

  // If there are suspension mods
  const hasSuspension = build.components.some(c => c.category === 'suspension');
  if (hasSuspension) {
    suggestions.push(`How will these coilovers affect daily ride comfort vs track stability?`);
  }

  // If there are wheels or brakes
  const hasWheelsOrBrakes = build.components.some(c => c.category === 'wheels_tires' || c.category === 'brakes');
  if (hasWheelsOrBrakes) {
    suggestions.push(`Does my wheel setup have sufficient brake caliper clearance?`);
  }

  // Cost and installation
  suggestions.push(`What is my total estimated cost including workshop labor in ${location.region}?`);
  suggestions.push(`Which component should I install first in this build?`);

  // Risk and reliability
  if (performance.thermalRisk !== 'Low' || performance.torqueLoadRisk !== 'Low') {
    suggestions.push(`What are the thermal and drivetrain risks of this configuration?`);
  }

  // Beginner plain explanation
  suggestions.push(`Explain my build in simple terms.`);

  // Return up to 4 most relevant suggestions
  return suggestions.slice(0, 4);
}

/**
 * Main public entrypoint for querying the Chief Engineer
 */
export async function askChiefEngineer(
  context: DriveForgeAIContext,
  messages: AIMessage[],
  customProvider?: AIProvider
): Promise<AIResponse> {
  const provider = customProvider || getAIProvider();
  return await provider.generateResponse(context, messages);
}
