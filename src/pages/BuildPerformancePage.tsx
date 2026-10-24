import React from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { Zap, TrendingUp, Gauge, Flame, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

export const BuildPerformancePage: React.FC = () => {
  const {
    activeVehicle,
    selectedComponents,
    projectedPowerHp,
    totalPowerGainHp,
    projectedWeightKg,
    totalWeightDeltaKg,
    navigateTo
  } = useApp();

  // Calculated metrics
  const powerToWeightHpPerTon = Math.round((projectedPowerHp / (projectedWeightKg / 1000)));
  const baselinePowerToWeight = Math.round((activeVehicle.baselinePowerHp / (activeVehicle.weightKg / 1000)));
  const estZeroToSixty = (3.2 - (totalPowerGainHp * 0.005) - (Math.abs(totalWeightDeltaKg) * 0.003)).toFixed(2);

  return (
    <PageContainer
      eyebrow="DYNO & TELEMETRY SIMULATION"
      title="Dyno Simulation & Performance Matrix"
      subtitle={`Virtual dynamometer curves and performance metrics for ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}.`}
      action={
        <NeoButton variant="primary" onClick={() => navigateTo('/reports')} icon={<Activity className="w-4 h-4" />}>
          Export Dyno Report
        </NeoButton>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Dyno Visualization Simulation Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 17 — PERFORMANCE STORY: Vehicle Silhouette with Expandable Hotspots */}
          <div className="p-8 rounded-[28px] neo-panel border border-[#292927]/10 bg-[#FAFAF7] space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#292927]/8 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#B47A52] uppercase">
                  17 • PERFORMANCE DYNAMICS STORY
                </span>
                <h3 className="text-2xl font-black text-[#171717] font-sans">
                  Holistic Vehicle Telemetry Impact
                </h3>
              </div>
              <span className="text-xs font-mono text-[#5A5955]">
                CLICK METRICS TO EXPAND
              </span>
            </div>

            {/* Silhouette Centerstage */}
            <div className="relative aspect-[16/9] w-full rounded-2xl bg-[#E8E2D8]/40 border border-[#292927]/8 flex items-center justify-center p-6 overflow-hidden">
              <img
                src={(activeVehicle as any).heroImage || activeVehicle.imageUrl}
                alt={(activeVehicle as any).name || `${activeVehicle.make} ${activeVehicle.model}`}
                className="max-h-56 w-auto object-contain filter contrast-105"
              />

              {/* 4 Interactive Hotspots around vehicle */}
              {/* Top-Left: POWER */}
              <div className="absolute top-4 left-4 max-w-xs">
                <details className="group cursor-pointer">
                  <summary className="list-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAFAF7] border border-[#28483D]/30 shadow-md text-xs font-mono font-bold text-[#28483D] hover:bg-[#28483D] hover:text-[#FAFAF7] transition-all">
                    <span>⚡ POWER +{totalPowerGainHp || 18} HP</span>
                    <span className="text-[10px] opacity-70 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-2 p-3 rounded-xl bg-[#FAFAF7]/95 backdrop-blur-md border border-[#292927]/10 text-xs text-[#383835] font-sans shadow-lg animate-in fade-in">
                    Volumetric airflow and high-flow exhaust reduction diminish backpressure, elevating peak torque across the mid-to-high RPM sweep.
                  </div>
                </details>
              </div>

              {/* Bottom-Left: WEIGHT */}
              <div className="absolute bottom-4 left-4 max-w-xs">
                <details className="group cursor-pointer">
                  <summary className="list-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAFAF7] border border-[#B47A52]/30 shadow-md text-xs font-mono font-bold text-[#B47A52] hover:bg-[#B47A52] hover:text-[#FAFAF7] transition-all">
                    <span>⚖ WEIGHT {totalWeightDeltaKg <= 0 ? `${totalWeightDeltaKg} KG` : `+${totalWeightDeltaKg} KG`}</span>
                    <span className="text-[10px] opacity-70 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-2 p-3 rounded-xl bg-[#FAFAF7]/95 backdrop-blur-md border border-[#292927]/10 text-xs text-[#383835] font-sans shadow-lg animate-in fade-in">
                    Forged monoblock alloy construction strips unsprung rotating mass at all four corners, sharpening steering response and turn-in agility.
                  </div>
                </details>
              </div>

              {/* Top-Right: HANDLING */}
              <div className="absolute top-4 right-4 max-w-xs text-right">
                <details className="group cursor-pointer">
                  <summary className="list-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAFAF7] border border-[#557B76]/30 shadow-md text-xs font-mono font-bold text-[#557B76] hover:bg-[#557B76] hover:text-[#FAFAF7] transition-all">
                    <span>🏎 HANDLING ↑</span>
                    <span className="text-[10px] opacity-70 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-2 p-3 rounded-xl bg-[#FAFAF7]/95 backdrop-blur-md border border-[#292927]/10 text-xs text-[#383835] font-sans shadow-lg text-left animate-in fade-in">
                    Lowered roll center and elevated spring rates dramatically curb lateral body lean during aggressive threshold cornering.
                  </div>
                </details>
              </div>

              {/* Bottom-Right: THERMAL LOAD */}
              <div className="absolute bottom-4 right-4 max-w-xs text-right">
                <details className="group cursor-pointer">
                  <summary className="list-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAFAF7] border border-[#B8644A]/30 shadow-md text-xs font-mono font-bold text-[#B8644A] hover:bg-[#B8644A] hover:text-[#FAFAF7] transition-all">
                    <span>🔥 THERMAL LOAD ↑</span>
                    <span className="text-[10px] opacity-70 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-2 p-3 rounded-xl bg-[#FAFAF7]/95 backdrop-blur-md border border-[#292927]/10 text-xs text-[#383835] font-sans shadow-lg text-left animate-in fade-in">
                    Increased boost pressure raises cylinder head temperatures. Slotted vented rotors and dual-core radiator upgrades mitigate track brake fade.
                  </div>
                </details>
              </div>

            </div>
          </div>

          <NeoCard variant="panel" radius="28" className="p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#2A2F38] pb-4">
              <div>
                <p className="text-xs font-mono font-bold text-[#0070F3] uppercase">VIRTUAL DYNO GRAPH</p>
                <h3 className="text-2xl font-black text-white font-sans">Power & Torque Delivery Curves</h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#0070F3]" /> Projected HP</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#10B981]" /> Baseline HP</span>
              </div>
            </div>

            {/* Simulated Dyno Visual Graphic */}
            <div className="h-64 neo-inset rounded-2xl p-6 relative flex items-end justify-between overflow-hidden">
              {/* Background RPM Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#20242B_1px,transparent_1px),linear-gradient(to_bottom,#20242B_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30 pointer-events-none" />

              {/* Curve Simulation Bars */}
              {[200, 260, 320, 410, 480, 530, projectedPowerHp - 20, projectedPowerHp, projectedPowerHp - 15].map((hp, i) => {
                const heightPercent = (hp / 800) * 100;
                return (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-2 group w-8">
                    <div
                      className="w-full bg-gradient-to-t from-[#0051B3] to-[#0070F3] rounded-t-lg transition-all duration-500 shadow-[0_0_12px_rgba(0,112,243,0.4)] group-hover:from-[#0070F3] group-hover:to-[#38BDF8]"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] font-mono text-gray-400">{(i + 1) * 1000} RPM</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="neo-inset p-3 rounded-xl">
                <span className="text-gray-400 block text-[10px] uppercase">PEAK POWER</span>
                <span className="text-lg font-bold text-[#0070F3]">{projectedPowerHp} HP</span>
              </div>
              <div className="neo-inset p-3 rounded-xl">
                <span className="text-gray-400 block text-[10px] uppercase">HORSEPOWER GAIN</span>
                <span className="text-lg font-bold text-[#10B981]">+{totalPowerGainHp} HP</span>
              </div>
              <div className="neo-inset p-3 rounded-xl">
                <span className="text-gray-400 block text-[10px] uppercase">PWR/WT RATIO</span>
                <span className="text-lg font-bold text-white">{powerToWeightHpPerTon} HP/TON</span>
              </div>
              <div className="neo-inset p-3 rounded-xl">
                <span className="text-gray-400 block text-[10px] uppercase">EST 0-60 MPH</span>
                <span className="text-lg font-bold text-white">{estZeroToSixty}s</span>
              </div>
            </div>
          </NeoCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <NeoCard variant="panel" radius="28" className="p-6 space-y-5">
            <h3 className="text-lg font-bold text-white font-sans">Power-to-Weight Matrix</h3>

            <div className="space-y-4">
              <ProgressIndicator
                value={(powerToWeightHpPerTon / 500) * 100}
                label="POWER-TO-WEIGHT"
                sublabel={`${powerToWeightHpPerTon} HP/TON`}
                color="blue"
              />

              <ProgressIndicator
                value={88}
                label="CORNERING LATERAL G"
                sublabel="1.38 G Peak"
                color="green"
              />

              <ProgressIndicator
                value={94}
                label="BRAKING THERMAL ENDURANCE"
                sublabel="Fade Resistance High"
                color="blue"
              />
            </div>

            <div className="pt-2">
              <NeoButton
                variant="primary"
                fullWidth
                onClick={() => navigateTo('/reports')}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Generate Certified Build Report
              </NeoButton>
            </div>
          </NeoCard>
        </div>

      </div>
    </PageContainer>
  );
};
