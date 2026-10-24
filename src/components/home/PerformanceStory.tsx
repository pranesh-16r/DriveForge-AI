import React, { useState } from 'react';
import { FeatureSection } from './FeatureSection';
import { NeoCard } from '../ui/NeoCard';
import { NeoButton } from '../ui/NeoButton';
import { useApp } from '../../context/AppContext';
import { REGIONS } from '../../data/locations';
import {
  TrendingUp,
  Gauge,
  Weight,
  DollarSign,
  Zap,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const PerformanceStory: React.FC = () => {
  const { currentRegion, setRegion, navigateTo } = useApp();

  // Simulated metrics for the baseline Porsche 911 GT3 RS with full stage modifications
  const baselineHp = 518;
  const gainHp = 34;
  const finalHp = baselineHp + gainHp;

  const baselineWeight = 1450;
  const weightDelta = -19.5;
  const finalWeight = baselineWeight + weightDelta;

  const partsTotal = 17540;
  const laborHours = 12.5;
  const laborCost = Math.round(laborHours * currentRegion.avgHourlyLaborRateUSD * currentRegion.laborMultiplier);
  const totalInvestment = partsTotal + laborCost;

  return (
    <FeatureSection
      id="impact"
      stepNumber="06"
      category="DYNO SIMULATION & BUDGET"
      title="UNDERSTAND THE IMPACT"
      subtitle="See estimated cost, installation requirements and performance impact."
      description="Calculate the true mathematical return on every dollar spent before purchasing hardware. Model horsepower gains, curb weight reduction, and regional workshop labor."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Performance & Dyno Forecast */}
        <div className="lg:col-span-7">
          <NeoCard variant="panel" radius="28" className="p-6 sm:p-7 space-y-6 border border-[#292927]/15 bg-[#FAFAF7]">
            
            <div className="flex items-center justify-between border-b border-[#292927]/12 pb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#28483D]" />
                <h3 className="text-base font-black text-[#171717] font-sans">
                  Projected Dyno Output & Power-to-Weight
                </h3>
              </div>
              <span className="text-xs font-mono font-black text-[#1C6E42] bg-[#1C6E42]/15 px-2.5 py-1 rounded-full border border-[#1C6E42]/30">
                +6.5% POWER GAIN
              </span>
            </div>

            {/* Dyno Visual Bar Comparison */}
            <div className="space-y-4">
              {/* Horsepower */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#55534E] font-bold">Peak Engine Power</span>
                  <div className="space-x-2">
                    <span className="text-[#737067] line-through">{baselineHp} HP OEM</span>
                    <span className="text-[#1C6E42] font-black text-sm">{finalHp} BHP PROJECTED</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-[#E0DDD5] rounded-full overflow-hidden p-0.5 border border-[#292927]/10 flex">
                  <div className="h-full bg-[#737067] rounded-l-full" style={{ width: '88%' }} />
                  <div className="h-full bg-[#1C6E42] rounded-r-full" style={{ width: '12%' }} />
                </div>
              </div>

              {/* Curb Weight */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#55534E] font-bold">Curb Mass Savings</span>
                  <div className="space-x-2">
                    <span className="text-[#737067]">{baselineWeight} kg Factory</span>
                    <span className="text-[#171717] font-black text-sm">{finalWeight} KG (-19.5kg)</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-[#E0DDD5] rounded-full overflow-hidden p-0.5 border border-[#292927]/10 flex">
                  <div className="h-full bg-[#28483D] rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              {/* Power to Weight Ratio */}
              <div className="p-4 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#55534E] font-bold uppercase block">Power to Weight Metric</span>
                  <span className="text-base font-mono font-black text-[#171717]">
                    386.1 BHP / TON <span className="text-[#1C6E42] text-xs font-bold">(+28.5 vs OEM)</span>
                  </span>
                </div>
                <Zap className="w-5 h-5 text-[#28483D]" />
              </div>
            </div>

          </NeoCard>
        </div>

        {/* Right: Regional Labor Cost Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <NeoCard variant="raised" radius="28" className="p-6 sm:p-7 space-y-5 border border-[#292927]/12 bg-[#FAFAF7]">
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#28483D] font-black uppercase">Estimated Investment</span>
                <span className="text-xs font-mono text-[#55534E] font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#28483D]" /> {currentRegion.name}
                </span>
              </div>
              <h4 className="text-2xl font-black font-mono text-[#171717]">
                ${totalInvestment.toLocaleString()} <span className="text-xs text-[#55534E] font-sans font-medium">Est. Total</span>
              </h4>
            </div>

            {/* Itemized lines */}
            <div className="space-y-2.5 pt-2 border-t border-[#292927]/12 text-xs font-mono">
              <div className="flex justify-between text-[#55534E] font-medium">
                <span>Hardware Components MSRP:</span>
                <span className="text-[#171717] font-bold">${partsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#55534E] font-medium">
                <span>Certified Workshop Labor ({laborHours}h):</span>
                <span className="text-[#171717] font-bold">${laborCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#55534E] font-medium">
                <span>Regional Labor Rate:</span>
                <span className="text-[#171717] font-bold">${currentRegion.avgHourlyLaborRateUSD}/hr</span>
              </div>
            </div>

            {/* Region Switcher */}
            <div className="pt-2">
              <label className="text-[10px] font-mono text-[#55534E] uppercase font-bold block mb-1.5">
                Switch Regional Labor Zone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REGIONS.slice(0, 4).map((reg) => (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => setRegion(reg)}
                    className={`
                      p-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer text-center
                      ${currentRegion.id === reg.id
                        ? 'bg-[#171717] text-[#FAFAF7] shadow-xs'
                        : 'bg-[#E8E2D8] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/15'
                      }
                    `}
                  >
                    {reg.code}
                  </button>
                ))}
              </div>
            </div>

            <NeoButton
              variant="primary"
              size="md"
              fullWidth
              onClick={() => navigateTo('/build')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Analyze Your Build
            </NeoButton>

          </NeoCard>
        </div>

      </div>
    </FeatureSection>
  );
};
