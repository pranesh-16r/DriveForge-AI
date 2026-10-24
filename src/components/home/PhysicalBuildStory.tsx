import React from 'react';
import { FeatureSection } from './FeatureSection';
import { NeoCard } from '../ui/NeoCard';
import { NeoButton } from '../ui/NeoButton';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Clock,
  Wrench,
  CheckCircle2,
  Calendar,
  DollarSign,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const STAGES = [
  {
    step: 'STAGE 01',
    title: 'Acoustics & Exhaust Gas Evacuation',
    parts: 'Akrapovič Evolution Titanium System',
    laborHours: 3.5,
    difficulty: 'Direct Bolt-on',
    color: '#0070F3'
  },
  {
    step: 'STAGE 02',
    title: 'Damping Kinetics & Ride Height Geometry',
    parts: 'Öhlins Road & Track Dual Flow Valve Kit',
    laborHours: 5.0,
    difficulty: 'Alignment Required',
    color: '#3B82F6'
  },
  {
    step: 'STAGE 03',
    title: 'Thermal Friction & Monobloc Deceleration',
    parts: 'Brembo GT-S 6-Piston 380mm Monobloc Calipers',
    laborHours: 4.0,
    difficulty: 'Hydraulic Bleeding',
    color: '#60A5FA'
  }
];

export const PhysicalBuildStory: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <FeatureSection
      id="physical-build"
      stepNumber="05"
      category="STAGED WORKSHOP BLUEPRINT"
      title="PLAN THE PHYSICAL BUILD"
      subtitle="Turn selected components into a structured Physical Build."
      description="Avoid chaotic garage downtime. DriveForge transforms your chosen parts into a phased, logical installation schedule that workshops can quote and execute with surgical precision."
    >
      <div className="space-y-6">
        
        {/* Stages Horizontal Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STAGES.map((stage, idx) => (
            <NeoCard
              key={stage.step}
              variant="raised"
              radius="24"
              className="p-6 flex flex-col justify-between space-y-4 border border-[#292927]/12 bg-[#FAFAF7] hover:bg-white hover:border-[#171717]/30 shadow-xs transition-all relative overflow-hidden"
            >
              {/* Step indicator top border */}
              <div 
                className="absolute top-0 left-0 right-0 h-1" 
                style={{ backgroundColor: stage.color }} 
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-black text-[#28483D]">{stage.step}</span>
                  <span className="text-[#55534E] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#28483D]" /> {stage.laborHours}h Labor
                  </span>
                </div>

                <h3 className="text-base font-black text-[#171717] font-sans">
                  {stage.title}
                </h3>

                <p className="text-xs text-[#55534E] font-mono pt-1">
                  Primary Component: <span className="text-[#171717] font-bold">{stage.parts}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-[#292927]/10 flex items-center justify-between text-xs font-mono">
                <span className="text-[#55534E] font-medium">Execution:</span>
                <span className="text-[#171717] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1C6E42]" />
                  {stage.difficulty}
                </span>
              </div>
            </NeoCard>
          ))}
        </div>

        {/* Staged Summary Bar */}
        <NeoCard variant="panel" radius="24" className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#292927]/15 bg-[#FAFAF7]">
          <div className="flex flex-wrap items-center gap-6 text-center sm:text-left">
            <div>
              <span className="text-[10px] font-mono text-[#55534E] uppercase font-bold block">Total Phased Labor</span>
              <span className="text-lg font-mono font-black text-[#171717]">12.5 Workshop Hours</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-[#292927]/15" />
            <div>
              <span className="text-[10px] font-mono text-[#55534E] uppercase font-bold block">Installation Risk Factor</span>
              <span className="text-lg font-mono font-black text-[#1C6E42]">Low (Direct Fitment)</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-[#292927]/15" />
            <div>
              <span className="text-[10px] font-mono text-[#55534E] uppercase font-bold block">Downloadable Spec</span>
              <span className="text-lg font-mono font-black text-[#171717]">Certified PDF Blueprint</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NeoButton
              variant="outline"
              size="md"
              onClick={() => navigateTo('/projects')}
              icon={<Layers className="w-4 h-4 text-[#28483D]" />}
            >
              Saved Projects
            </NeoButton>
            <NeoButton
              variant="primary"
              size="md"
              onClick={() => navigateTo('/build')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Create Your Plan
            </NeoButton>
          </div>
        </NeoCard>

      </div>
    </FeatureSection>
  );
};
