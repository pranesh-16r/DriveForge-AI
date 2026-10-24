import React, { useState } from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { PartCompatibilitySimulator } from '../components/compatibility/PartCompatibilitySimulator';
import { StanceCaliperSimulator } from '../components/compatibility/StanceCaliperSimulator';
import { useApp } from '../context/AppContext';
import { Cpu, Layers, Wrench, Bot, Sliders, ShieldCheck } from 'lucide-react';

export const CompatibilitySimulatorPage: React.FC = () => {
  const { activeVehicle, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'part' | 'stance'>('stance');

  return (
    <PageContainer
      eyebrow="ENGINEERING DIAGNOSTICS & TELEMETRY"
      title="Part & Stance Fitment Simulator"
      subtitle="Simulate thermodynamic, physical, fueling, and 3D wheel/brake clearance parameters for high-performance upgrade components before physical installation."
      action={
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigateTo('/projects')}
            className="px-4 py-2 rounded-2xl bg-[#E8E2D8] hover:bg-[#D6C09A]/40 text-xs font-mono font-bold text-[#171717] uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#28483D]" />
            <span>Project Dashboard</span>
          </button>
          
          <button
            type="button"
            onClick={() => navigateTo('/build')}
            className="px-4 py-2 rounded-2xl bg-[#171717] hover:bg-[#28483D] text-xs font-mono font-bold text-[#FAFAF7] uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Active Build</span>
          </button>
        </div>
      }
    >
      {/* Active Vehicle Info Header Banner */}
      {activeVehicle && (
        <div className="mb-6 p-4 rounded-3xl bg-[#FAFAF7] border border-[#292927]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#171717] border border-[#292927]/10 shrink-0">
              <img
                src={activeVehicle.imageUrl}
                alt={activeVehicle.model}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#28483D] text-[#FAFAF7] font-bold uppercase">
                  Active Garage Vehicle
                </span>
                <span className="text-xs font-mono text-[#5A5955]">
                  {activeVehicle.year} {activeVehicle.make}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#171717] font-sans">
                {activeVehicle.model} — {activeVehicle.trim}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigateTo('/garage')}
              className="text-xs font-mono text-[#171717] hover:text-[#28483D] px-3 py-1.5 rounded-xl bg-[#E8E2D8]/60 hover:bg-[#E8E2D8] border border-[#292927]/10 transition-all cursor-pointer"
            >
              Switch Vehicle
            </button>
            <button
              type="button"
              onClick={() => navigateTo('/ai-engineer')}
              className="text-xs font-mono text-[#28483D] hover:text-[#171717] px-3 py-1.5 rounded-xl bg-[#28483D]/10 hover:bg-[#28483D]/20 border border-[#28483D]/20 transition-all flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Engineer</span>
            </button>
          </div>
        </div>
      )}

      {/* Simulator Module Switcher Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#292927]/10 pb-3">
        <button
          onClick={() => setActiveTab('stance')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'stance'
              ? 'bg-[#171717] text-[#FAFAF7] shadow-sm'
              : 'bg-[#FAFAF7] text-[#5A5955] border border-[#292927]/10 hover:text-[#171717]'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#B47A52]" />
          <span>3D STANCE &amp; CALIPER CLEARANCE</span>
        </button>

        <button
          onClick={() => setActiveTab('part')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'part'
              ? 'bg-[#171717] text-[#FAFAF7] shadow-sm'
              : 'bg-[#FAFAF7] text-[#5A5955] border border-[#292927]/10 hover:text-[#171717]'
          }`}
        >
          <Cpu className="w-4 h-4 text-[#28483D]" />
          <span>ENGINE &amp; THERMODYNAMIC COMPATIBILITY</span>
        </button>
      </div>

      {/* Render Active Simulator */}
      {activeTab === 'stance' ? (
        <StanceCaliperSimulator />
      ) : (
        <PartCompatibilitySimulator />
      )}
    </PageContainer>
  );
};
