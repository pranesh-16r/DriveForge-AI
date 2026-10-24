import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Sliders,
  CheckCircle2,
  BarChart3,
  Layers,
  Wrench,
  ArrowRight
} from 'lucide-react';

interface StageCard {
  number: string;
  verb: string;
  tagline: string;
  description: string;
  accent: string;
  icon: React.ReactNode;
  previewVisual: string;
  route: string;
  metricLabel: string;
  metricValue: string;
}

export const HowDriveForgeWorks: React.FC = () => {
  const { navigateTo } = useApp();
  const [activeStep, setActiveStep] = useState(0);

  const stages: StageCard[] = [
    {
      number: '01',
      verb: 'CHOOSE',
      tagline: 'Your vehicle.',
      description: 'Select from certified manufacturer platforms (Porsche, BMW, Toyota, Honda, Ford) with accurate chassis codes, curb weights, and powertrain geometry.',
      accent: '#28483D',
      icon: <Car className="w-5 h-5" />,
      previewVisual: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
      route: '/brands',
      metricLabel: 'Platform Accuracy',
      metricValue: '100% OEM'
    },
    {
      number: '02',
      verb: 'MODIFY',
      tagline: 'Explore real components.',
      description: 'Explore true physical parts—monoblock forged wheels, multi-link coilovers, valved titanium exhausts, and high-temp brake kits from legitimate motorsport brands.',
      accent: '#B47A52',
      icon: <Sliders className="w-5 h-5" />,
      previewVisual: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      route: '/garage',
      metricLabel: 'Components Catalog',
      metricValue: '500+ Verified'
    },
    {
      number: '03',
      verb: 'VERIFY',
      tagline: 'Check compatibility.',
      description: 'Run our proprietary fitment solver: hub clearance, bolt pattern matching, brake caliper sweep radii, and suspension travel limits before spending money.',
      accent: '#28483D',
      icon: <CheckCircle2 className="w-5 h-5" />,
      previewVisual: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
      route: '/compatibility',
      metricLabel: 'Verification Protocol',
      metricValue: 'CAD Cleared'
    },
    {
      number: '04',
      verb: 'ANALYZE',
      tagline: 'Understand the impact.',
      description: 'Forecast the thermodynamic load, unsprung mass reduction, expected horsepower delta, and center-of-gravity shifts with clean engineering graphs.',
      accent: '#B47A52',
      icon: <BarChart3 className="w-5 h-5" />,
      previewVisual: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      route: '/build/analysis',
      metricLabel: 'Power & Dynamics',
      metricValue: '+18 HP / -12 KG'
    },
    {
      number: '05',
      verb: 'BUILD',
      tagline: 'Create your Physical Build.',
      description: 'Consolidate parts into a cohesive Physical Build. Review total estimated costs, localized labor expenses, and overall build health score.',
      accent: '#28483D',
      icon: <Layers className="w-5 h-5" />,
      previewVisual: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      route: '/build',
      metricLabel: 'Build Health',
      metricValue: '96% Optimal'
    },
    {
      number: '06',
      verb: 'EXECUTE',
      tagline: 'Find installation support.',
      description: 'Discover specialized workshops matching your specific suspension, alignment, or dyno tuning needs. Export an engineering-grade build specification report.',
      accent: '#B47A52',
      icon: <Wrench className="w-5 h-5" />,
      previewVisual: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
      route: '/workshops',
      metricLabel: 'Partner Workshops',
      metricValue: 'Regional Matches'
    }
  ];

  return (
    <section className="relative w-full py-20 px-4 sm:px-8 lg:px-16 bg-[#E8E2D8]/50 border-t border-[#292927]/12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#B47A52]">
              STEP-BY-STEP METHODOLOGY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#171717] tracking-[-0.04em] uppercase font-sans mt-1">
              HOW DRIVEFORGE WORKS
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#292927] font-semibold max-w-sm font-sans">
            A linear, engineering-backed pipeline from digital simulation to physical wrench time.
          </p>
        </div>

        {/* Horizontal Sequence Scroll Track */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((st, idx) => {
            const isHovered = activeStep === idx;

            return (
              <div
                key={st.number}
                onMouseEnter={() => setActiveStep(idx)}
                onClick={() => navigateTo(st.route)}
                className={`relative p-6 sm:p-8 rounded-3xl bg-[#FAFAF7] border transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-[0_4px_20px_rgba(23,23,23,0.04)] hover:shadow-[0_12px_32px_rgba(23,23,23,0.09)] transform hover:-translate-y-1 ${
                  isHovered ? 'border-[#28483D]/50 ring-1 ring-[#28483D]/20' : 'border-[#292927]/12'
                }`}
              >
                {/* Top Bar: Number + Icon */}
                <div className="flex items-center justify-between pb-4 border-b border-[#292927]/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-[#171717]">
                      {st.number}
                    </span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B47A52]">
                      PHASE
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#E8E2D8] flex items-center justify-center text-[#171717] group-hover:bg-[#28483D] group-hover:text-[#FAFAF7] transition-colors">
                    {st.icon}
                  </div>
                </div>

                {/* Center Content: Verb + Tagline + Body */}
                <div className="py-6 space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight font-sans uppercase">
                    {st.verb}
                  </h3>
                  <p className="text-xs font-mono font-extrabold text-[#28483D] uppercase tracking-wide">
                    {st.tagline}
                  </p>
                  <p className="text-xs text-[#292927] leading-relaxed pt-2 font-sans font-medium">
                    {st.description}
                  </p>
                </div>

                {/* Bottom Visual Thumbnail & Metric */}
                <div className="pt-4 border-t border-[#292927]/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[#292927] uppercase">{st.metricLabel}</p>
                    <p className="text-xs font-extrabold text-[#171717] font-sans">{st.metricValue}</p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#171717] group-hover:text-[#28483D] transition-colors">
                    <span>EXPLORE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Global Pipeline Footer CTA */}
        <div className="p-8 rounded-3xl bg-[#171717] text-[#FAFAF7] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-sans tracking-tight">
              Ready to engineer your real build?
            </h3>
            <p className="text-xs text-[#E8E2D8] font-sans max-w-lg font-medium">
              Start with certified factory OEM baseline specs, verify clearances, and estimate complete regional installation costs.
            </p>
          </div>

          <button
            onClick={() => navigateTo('/location')}
            className="px-8 py-3.5 rounded-xl bg-[#FAFAF7] text-[#171717] hover:bg-[#28483D] hover:text-[#FAFAF7] font-bold text-xs tracking-wider uppercase font-sans transition-all shrink-0 cursor-pointer shadow-md"
          >
            START YOUR BUILD →
          </button>
        </div>

      </div>
    </section>
  );
};
