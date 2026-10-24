import React from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { BuildFlowProgress } from '../components/discovery/BuildFlowProgress';
import { FlowNavigationButtons } from '../components/discovery/FlowNavigationButtons';
import { ExperienceMode } from '../types';
import { Check, ShieldCheck, Cpu, Sparkles, BookOpen, Gauge, HelpCircle, Wrench, AlertTriangle } from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  const { experienceMode, setExperienceMode, navigateTo } = useApp();

  const handleSelectMode = (mode: ExperienceMode) => {
    setExperienceMode(mode);
  };

  const handleContinue = () => {
    navigateTo('/brands');
  };

  const handleBack = () => {
    navigateTo('/location/region');
  };

  const isBeginner = experienceMode === 'beginner';
  const isEnthusiast = experienceMode === 'enthusiast';

  return (
    <PageContainer
      eyebrow="STEP 02 • INFORMATION ARCHITECTURE"
      title="HOW DO YOU WANT TO BUILD?"
      subtitle="Choose your preferred technical depth. DriveForge adapts telemetry metrics, part descriptions, and fitment explanations to match your automotive background."
    >
      {/* Global Build Progress Stepper */}
      <BuildFlowProgress currentStep="experience" />

      {/* Two Visually Distinct Information Experiences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* ================= BEGINNER MODE CARD ================= */}
        <NeoCard
          interactive
          active={isBeginner}
          onClick={() => handleSelectMode('beginner')}
          className={`
            p-6 sm:p-8 space-y-6 flex flex-col justify-between transition-all duration-300 relative
            ${isBeginner
              ? 'border-2 border-[#171717] bg-white shadow-xl ring-2 ring-[#171717]/10'
              : 'border border-[#292927]/12 bg-[#FAFAF7] hover:bg-white hover:border-[#171717]/40 shadow-xs'
            }
          `}
        >
          <div className="space-y-6">
            {/* Top Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#28483D]/10 text-[#28483D] flex items-center justify-center border border-[#28483D]/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-black text-[#28483D] uppercase tracking-wider block">
                    GUIDED & INTUITIVE
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#171717] font-sans uppercase">
                    I'M NEW TO MODIFICATIONS
                  </h3>
                </div>
              </div>

              {isBeginner && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#28483D] text-[#FAFAF7] text-xs font-mono font-bold shadow-md">
                  <Check className="w-4 h-4" /> ACTIVE MODE
                </span>
              )}
            </div>

            {/* Philosophy */}
            <p className="text-sm font-bold text-[#28483D] font-sans">
              "Explain things simply and guide me through the process."
            </p>

            {/* Core Features */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono font-bold text-[#55534E] uppercase tracking-wider block">
                WHAT YOU WILL SEE:
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm font-sans text-[#383835]">
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#E8E2D8] text-[#171717] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong className="text-[#171717]">Plain-English explanations:</strong> "What does this part do?" and "Why would I need it?"</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#E8E2D8] text-[#171717] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong className="text-[#171717]">Visual comparisons:</strong> Clean diagrammatic representations rather than dense tables of numbers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#E8E2D8] text-[#171717] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong className="text-[#171717]">Guided safety checks:</strong> Instant green/yellow flags for road legality and daily comfort.</span>
                </li>
              </ul>
            </div>

            {/* Live Example Box: Performance Air Intake (Beginner view) */}
            <div className="p-4 rounded-2xl border border-[#292927]/12 space-y-2 bg-[#E8E2D8]">
              <span className="text-[10px] font-mono font-black text-[#28483D] uppercase tracking-wider">
                EXAMPLE COMPONENT PREVIEW: PERFORMANCE INTAKE
              </span>
              <p className="text-xs text-[#171717] font-sans leading-relaxed font-medium">
                "Helps your engine breathe easier. It improves how quickly the car responds when you step on the gas, and adds an exciting, sporty engine sound."
              </p>
              <div className="flex items-center gap-4 text-[11px] font-mono text-[#55534E] pt-1">
                <span>Sound Level: <strong className="text-[#171717] font-bold">Noticeable</strong></span>
                <span>•</span>
                <span>Install Ease: <strong className="text-[#1C6E42] font-bold">Beginner DIY (1 hr)</strong></span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#292927]/12">
            <div
              className={`
                w-full py-3 px-4 rounded-xl text-center text-xs font-mono font-bold transition-all
                ${isBeginner
                  ? 'bg-[#171717] text-[#FAFAF7] shadow-md'
                  : 'bg-[#E8E2D8] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/15'
                }
              `}
            >
              {isBeginner ? 'Beginner Information Mode Selected ✓' : 'Select Beginner Mode'}
            </div>
          </div>
        </NeoCard>

        {/* ================= ENTHUSIAST MODE CARD ================= */}
        <NeoCard
          interactive
          active={isEnthusiast}
          onClick={() => handleSelectMode('enthusiast')}
          className={`
            p-6 sm:p-8 space-y-6 flex flex-col justify-between transition-all duration-300 relative
            ${isEnthusiast
              ? 'border-2 border-[#171717] bg-white shadow-xl ring-2 ring-[#171717]/10'
              : 'border border-[#292927]/12 bg-[#FAFAF7] hover:bg-white hover:border-[#171717]/40 shadow-xs'
            }
          `}
        >
          <div className="space-y-6">
            {/* Top Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#B47A52]/10 text-[#B47A52] flex items-center justify-center border border-[#B47A52]/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-black text-[#B47A52] uppercase tracking-wider block">
                    TELEMETRY & CAD TOLERANCES
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#171717] font-sans uppercase">
                    I KNOW MY WAY AROUND CARS
                  </h3>
                </div>
              </div>

              {isEnthusiast && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#B47A52] text-[#FAFAF7] text-xs font-mono font-bold shadow-md">
                  <Check className="w-4 h-4" /> ACTIVE MODE
                </span>
              )}
            </div>

            {/* Philosophy */}
            <p className="text-sm font-bold text-[#8C5530] font-sans">
              "Show me detailed fitment, engineering and performance information."
            </p>

            {/* Core Features */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono font-bold text-[#55534E] uppercase tracking-wider block">
                WHAT YOU WILL SEE:
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm font-sans text-[#383835]">
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#E8E2D8] text-[#171717] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong className="text-[#171717]">Dimensional engineering:</strong> Fitment clearances, pitch diameters, and suspension travel deltas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#E8E2D8] text-[#171717] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong className="text-[#171717]">Calculated telemetry:</strong> Projected WHP/Torque RPM deltas and exhaust backpressure variances.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#E8E2D8] text-[#171717] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong className="text-[#171717]">Engineering trade-offs:</strong> Heat soak vulnerability, NVH (Noise, Vibration, Harshness) score shifts.</span>
                </li>
              </ul>
            </div>

            {/* Live Example Box: Performance Air Intake (Enthusiast view) */}
            <div className="p-4 rounded-2xl border border-[#292927]/12 space-y-2 bg-[#E8E2D8]">
              <span className="text-[10px] font-mono font-black text-[#B47A52] uppercase tracking-wider">
                EXAMPLE COMPONENT PREVIEW: PERFORMANCE INTAKE
              </span>
              <p className="text-xs text-[#171717] font-mono leading-relaxed font-medium">
                "Dry-flow synthetic media, CNC mandrel-bent 3.5\" T6 aluminum ducting, MAF housing calibration tolerance ±1.2%, closed-box thermal isolation shield."
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#55534E] pt-1">
                <div>Airflow: <strong className="text-[#171717] font-bold">+18% CFM</strong></div>
                <div>Dyno Delta: <strong className="text-[#1C6E42] font-bold">+8.4 WHP @ 6,200 RPM</strong></div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#292927]/12">
            <div
              className={`
                w-full py-3 px-4 rounded-xl text-center text-xs font-mono font-bold transition-all
                ${isEnthusiast
                  ? 'bg-[#171717] text-[#FAFAF7] shadow-md'
                  : 'bg-[#E8E2D8] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/15'
                }
              `}
            >
              {isEnthusiast ? 'Enthusiast Information Mode Selected ✓' : 'Select Enthusiast Mode'}
            </div>
          </div>
        </NeoCard>

      </div>

      {/* Navigation Footer */}
      <FlowNavigationButtons
        onBack={handleBack}
        onContinue={handleContinue}
        continueLabel="Continue to Brand Selection"
        backLabel="Back to Region"
        contextText={`Current Profile: ${isBeginner ? 'Beginner (Intuitive)' : 'Enthusiast (Telemetry)'}`}
      />
    </PageContainer>
  );
};
