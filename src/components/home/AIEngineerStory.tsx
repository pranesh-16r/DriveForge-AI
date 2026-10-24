import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FeatureSection } from './FeatureSection';
import { NeoCard } from '../ui/NeoCard';
import { NeoButton } from '../ui/NeoButton';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Sparkles,
  Cpu,
  CornerDownLeft,
  CheckCircle2,
  Gauge,
  Thermometer,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface PromptPreset {
  id: string;
  question: string;
  response: string;
  diagnostics: {
    compatibilityScore: number;
    thermalRisk: string;
    ecuRequirement: string;
  };
}

const PRESETS: PromptPreset[] = [
  {
    id: 'brakes',
    question: 'Will 380mm monobloc calipers clear 20-inch factory alloys without wheel spacers?',
    response: 'Affirmative. 380mm Brembo GT-S calipers provide +4.8mm lateral clearance to the inner spoke profile of the OEM 992.1 GT3 forged wheels. No hub spacers or modified studs are required.',
    diagnostics: {
      compatibilityScore: 98,
      thermalRisk: 'Low (-35°C vs OEM)',
      ecuRequirement: 'None (Factory ABS Profile Compatible)'
    }
  },
  {
    id: 'exhaust',
    question: 'Does the Akrapovič Evolution exhaust cause catalytic efficiency CEL codes?',
    response: 'The titanium slip-on retains factory primary catalytic scrubbers. Secondary backpressure is reduced by 14%, remaining inside the DME closed-loop lambda control window without throwing check engine lights.',
    diagnostics: {
      compatibilityScore: 100,
      thermalRisk: 'Optimal (-45°C Header Zone)',
      ecuRequirement: 'Optional (Recommended for +18 HP Stage 1)'
    }
  },
  {
    id: 'suspension',
    question: 'What damper rebound settings are recommended for track day sessions on Michelin Cup 2 tyres?',
    response: 'For high-frequency rumble strips, calibrate front Öhlins DFV to 7 clicks from full stiff, and rear to 9 clicks. Set front camber to -2.3° to prevent outer shoulder tire degradation.',
    diagnostics: {
      compatibilityScore: 95,
      thermalRisk: 'Normal (Dual Flow Valve Active)',
      ecuRequirement: 'Requires 4-Wheel Laser Alignment'
    }
  }
];

export const AIEngineerStory: React.FC = () => {
  const { navigateTo } = useApp();
  const [activePreset, setActivePreset] = useState<PromptPreset>(PRESETS[0]);

  return (
    <FeatureSection
      id="ai-engineer"
      stepNumber="07"
      category="NEURAL TELEMETRY SYSTEM"
      title="ASK YOUR AI CHIEF ENGINEER"
      subtitle="Get build-aware engineering guidance."
      description="Trained on thousands of technical service bulletins, motorsport telemetry files, and component tolerance matrices. Ask questions about your specific vehicle and build composition."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Prompt Presets */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-[#4A4843] font-bold pl-1">
            Simulated Engineering Inquiries
          </p>

          <div className="space-y-2.5">
            {PRESETS.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setActivePreset(preset)}
                  className={`
                    w-full text-left p-4 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col gap-1.5
                    ${isSelected
                      ? 'neo-raised-active bg-[#E8E2D8] border-2 border-[#171717] shadow-sm'
                      : 'neo-raised bg-[#FAFAF7] hover:border-[#171717]/30 border border-[#292927]/15'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-[#28483D] font-extrabold uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Inquiry Preset</span>
                  </div>
                  <p className="text-sm text-[#171717] font-sans font-bold line-clamp-2">
                    "{preset.question}"
                  </p>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl neo-inset bg-[#E8E2D8]/50 border border-[#292927]/12 space-y-2 text-xs text-[#4A4843]">
            <span className="font-mono text-[#28483D] font-extrabold block uppercase">
              Build-Aware Context Engine
            </span>
            <p className="leading-relaxed font-medium">
              When logged in, the AI Chief Engineer automatically analyzes your active components, chassis code, and local weather/altitude.
            </p>
          </div>
        </div>

        {/* Right: AI Terminal Window */}
        <div className="lg:col-span-7">
          <NeoCard variant="panel" radius="28" className="p-6 sm:p-7 space-y-5 border border-[#292927]/15 bg-[#FAFAF7] shadow-lg">
            
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between border-b border-[#292927]/12 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs font-mono font-black text-[#171717] tracking-wider uppercase">
                  CHIEF ENGINEER NEURAL KERNEL
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#171717] font-bold bg-[#E8E2D8] px-2 py-0.5 rounded border border-[#292927]/15">
                LATENCY 42ms
              </span>
            </div>

            {/* Conversation Flow */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePreset.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* User Inquiry Message */}
                <div className="p-3.5 rounded-2xl bg-[#E8E2D8] border border-[#292927]/15 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#4A4843] font-bold uppercase">
                    <span>Engineer Inquiry</span>
                  </div>
                  <p className="text-sm font-sans font-bold text-[#171717]">
                    {activePreset.question}
                  </p>
                </div>

                {/* AI Response Message */}
                <div className="p-4 rounded-2xl bg-[#FAFAF7] border-2 border-[#28483D]/30 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#28483D] font-extrabold flex items-center gap-1.5">
                      <Bot className="w-4 h-4" /> Chief AI Engineer
                    </span>
                    <span className="text-[#10B981] font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Telemetry
                    </span>
                  </div>

                  <p className="text-sm font-sans text-[#171717] font-medium leading-relaxed">
                    {activePreset.response}
                  </p>

                  {/* Diagnostic Pill Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#292927]/10 text-[11px] font-mono">
                    <div className="p-2.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/10">
                      <span className="text-[#4A4843] font-bold block">Fitment Index</span>
                      <span className="text-[#171717] font-black">{activePreset.diagnostics.compatibilityScore}% Safe</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/10">
                      <span className="text-[#4A4843] font-bold block">Thermal Delta</span>
                      <span className="text-[#28483D] font-black">{activePreset.diagnostics.thermalRisk}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/10">
                      <span className="text-[#4A4843] font-bold block">ECU Status</span>
                      <span className="text-[#171717] font-black">{activePreset.diagnostics.ecuRequirement}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Simulated Input Field & Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full relative flex items-center bg-[#E8E2D8]/60 border border-[#292927]/15 rounded-2xl px-4 py-3 text-xs font-mono text-[#4A4843] font-medium">
                <span>Ask about spring rates, brake cooling, or ECU tunes...</span>
              </div>
              <NeoButton
                variant="primary"
                size="md"
                onClick={() => navigateTo('/ai-engineer')}
                className="shrink-0 w-full sm:w-auto"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Launch AI Suite
              </NeoButton>
            </div>

          </NeoCard>
        </div>

      </div>
    </FeatureSection>
  );
};
