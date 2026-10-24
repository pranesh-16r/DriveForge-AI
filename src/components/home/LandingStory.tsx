import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ChevronRight, Cpu } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StoryStage {
  id: string;
  stepNumber: string;
  headline: string;
  subhead: string;
  description: string;
  accentColor: string;
  vehicleImage: string;
  telemetrySpecs: { label: string; value: string }[];
}

const STORY_STAGES: StoryStage[] = [
  {
    id: 'car',
    stepNumber: '01',
    headline: 'YOUR CAR.',
    subhead: 'Grounded in Real Factory Engineering.',
    description: 'Every modification begins with your vehicle’s factory DNA—curb weight distribution, suspension kinematics, hub offset tolerances, and factory cooling capacity.',
    accentColor: '#28483D', // Deep Racing Emerald
    vehicleImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    telemetrySpecs: [
      { label: 'OEM PLATFORM', value: 'FL5 Chassis Baseline' },
      { label: 'CURB WEIGHT', value: '1,430 kg Standard' },
      { label: 'BOLT PATTERN', value: '5x114.3 / CB 64.1mm' }
    ]
  },
  {
    id: 'vision',
    stepNumber: '02',
    headline: 'YOUR VISION.',
    subhead: 'Track-Ready, Canyon Runner, or Refined Daily.',
    description: 'Configure your goals with purpose. DriveForge tailors component recommendations based on whether your priority is unsprung weight reduction, downforce balance, or thermal stability.',
    accentColor: '#28483D', // Deep Racing Emerald
    vehicleImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    telemetrySpecs: [
      { label: 'BUILD INTENT', value: 'Track & Street Balance' },
      { label: 'TARGET DOWNFORCE', value: '+42 kg @ 160 km/h' },
      { label: 'DAMPING SPECS', value: '2-Way Adjustable' }
    ]
  },
  {
    id: 'build',
    stepNumber: '03',
    headline: 'YOUR BUILD.',
    subhead: 'Real Components from Proven Manufacturers.',
    description: 'No generic parts. Explore forged mono-block wheels, 2-way adjustable coilovers, titanium exhaust manifolds, and slotted carbon-ceramic brake systems with real dimensions.',
    accentColor: '#B47A52', // Warm Racing Copper
    vehicleImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    telemetrySpecs: [
      { label: 'FORGED WHEELS', value: '18x9.5 ET+45 Light-Weight' },
      { label: 'BRAKE MARGIN', value: '4.8mm Caliper Clear' },
      { label: 'EXHAUST SPEC', value: 'Titanium Valved CAT-Back' }
    ]
  },
  {
    id: 'plan',
    stepNumber: '04',
    headline: 'YOUR PLAN.',
    subhead: 'Total Cost of Ownership & Regional Labor.',
    description: 'Plan before you spend. Estimate parts acquisition, localized workshop installation hours, and required alignment or ECU tuning expenses in your specific territory.',
    accentColor: '#28483D', // Deep Racing Emerald
    vehicleImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    telemetrySpecs: [
      { label: 'PARTS BUDGET', value: '₹1.10L - ₹1.35L' },
      { label: 'REGIONAL LABOR', value: '₹18,000 - ₹22,000' },
      { label: 'INSTALL HOURS', value: '6.5 Pro Hours' }
    ]
  },
  {
    id: 'decision',
    stepNumber: '05',
    headline: 'YOUR DECISION.',
    subhead: 'Certified Confidence Before Spending Money.',
    description: 'Receive an exhaustive digital engineering report with build health verification, expected horsepower gains, weight savings, and verified workshop discovery.',
    accentColor: '#B47A52', // Warm Racing Copper
    vehicleImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    telemetrySpecs: [
      { label: 'BUILD HEALTH', value: 'VERIFIED GREEN ✓' },
      { label: 'POWER DELTA', value: '+14 HP / -14.8 kg' },
      { label: 'WORKSHOP PAIR', value: '3 Certified Partners' }
    ]
  }
];

export const LandingStory: React.FC = () => {
  const { navigateTo } = useApp();
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinnedContainerRef = useRef<HTMLDivElement>(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [scrollProgressPct, setScrollProgressPct] = useState(0);

  useEffect(() => {
    const triggerEl = triggerRef.current;
    const pinnedEl = pinnedContainerRef.current;
    if (!triggerEl || !pinnedEl) return;

    // Create optimized GSAP ScrollTrigger sequence
    const ctx = gsap.context(() => {
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top top',
          end: '+=3800',
          pin: pinnedEl,
          scrub: 1.2,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const newPct = Math.round(progress * 100);
            const stageIdx = Math.min(
              STORY_STAGES.length - 1,
              Math.floor(progress * STORY_STAGES.length)
            );

            setScrollProgressPct(prev => (prev !== newPct ? newPct : prev));
            setActiveStageIndex(prev => (prev !== stageIdx ? stageIdx : prev));
          }
        }
      });

      STORY_STAGES.forEach((_, idx) => {
        const textLayer = `.story-text-layer-${idx}`;
        const imageLayer = `.story-img-layer-${idx}`;

        scrollTimeline
          .to(textLayer, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power1.out',
            force3D: true
          })
          .to(
            imageLayer,
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: 'power1.out',
              force3D: true
            },
            '<'
          )
          .to(
            textLayer,
            {
              opacity: idx === STORY_STAGES.length - 1 ? 1 : 0,
              y: idx === STORY_STAGES.length - 1 ? 0 : -28,
              duration: 0.9,
              ease: 'power1.in',
              force3D: true
            },
            '+=0.6'
          );
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative w-full bg-[#F4F1EA] text-[#171717] border-t border-[#292927]/12">
      
      {/* Pinned Viewport Container */}
      <div
        ref={pinnedContainerRef}
        className="min-h-screen w-full flex flex-col justify-between py-10 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto"
      >
        
        {/* Top Story Header & Scrub Progress */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#292927]/12 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#28483D] animate-ping" />
                <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#B47A52]">
                  DRIVEFORGE CINEMATIC ARCHITECTURE
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#171717] tracking-[-0.03em] uppercase font-sans mt-1">
                ENGINEERING YOUR PHYSICAL BUILD
              </h2>
            </div>

            {/* Scroll Scrub Meter */}
            <div className="flex items-center gap-3 bg-[#FAFAF7] px-4 py-2 rounded-2xl border border-[#292927]/15 shrink-0 shadow-xs">
              <span className="text-xs font-mono font-bold text-[#292927] uppercase">
                SCROLL PROGRESS:
              </span>
              <span className="text-sm font-mono font-black text-[#171717]">
                {scrollProgressPct}%
              </span>
              <div className="w-20 h-2 bg-[#171717]/12 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#28483D] transition-all duration-300 ease-out"
                  style={{ width: `${scrollProgressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Step Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STORY_STAGES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveStageIndex(idx)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                  activeStageIndex === idx
                    ? 'bg-[#171717] text-[#FAFAF7] border-[#171717] shadow-sm'
                    : 'bg-[#FAFAF7] text-[#292927] border-[#292927]/12 hover:bg-[#E8E2D8] hover:text-[#171717]'
                }`}
              >
                <span className="opacity-70">{s.stepNumber}</span>
                <span>{s.headline.replace('.', '')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center Stage: Pinned Vehicle Imagery + Motion Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
          
          {/* Left Column: Motion Typography Layers */}
          <div className="lg:col-span-6 relative min-h-[320px] flex flex-col justify-center">
            {STORY_STAGES.map((stage, idx) => {
              const isActive = activeStageIndex === idx;
              return (
                <div
                  key={stage.id}
                  style={{ willChange: 'transform, opacity' }}
                  className={`story-text-layer-${idx} transition-all duration-700 ease-out ${
                    isActive
                      ? 'relative z-10 opacity-100 scale-100 pointer-events-auto'
                      : 'absolute inset-0 opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="space-y-4 max-w-xl">
                    <div className="space-y-1">
                      <span
                        className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold text-[#FAFAF7] uppercase tracking-wider mb-2 shadow-xs"
                        style={{ backgroundColor: stage.accentColor }}
                      >
                        STAGE {stage.stepNumber} OF 05
                      </span>
                      <h3 className="text-5xl sm:text-7xl font-black text-[#171717] tracking-[-0.05em] uppercase font-sans leading-none">
                        {stage.headline}
                      </h3>
                      <p className="text-base sm:text-xl font-bold font-sans pt-1" style={{ color: stage.accentColor }}>
                        {stage.subhead}
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-[#292927] leading-relaxed font-sans font-medium">
                      {stage.description}
                    </p>

                    {/* Telemetry Spec Readouts */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-[#292927]/12">
                      {stage.telemetrySpecs.map(spec => (
                        <div key={spec.label} className="p-3 rounded-xl bg-[#FAFAF7] border border-[#292927]/15 shadow-xs">
                          <p className="text-[10px] font-mono font-bold text-[#292927] uppercase">{spec.label}</p>
                          <p className="text-xs font-extrabold text-[#171717] font-sans mt-0.5 truncate">{spec.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => navigateTo('/brands')}
                        className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] text-xs font-bold font-sans tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span>COMMENCE BUILD STEP</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setActiveStageIndex((activeStageIndex + 1) % STORY_STAGES.length)}
                        className="px-4 py-3 rounded-xl bg-[#FAFAF7] hover:bg-[#E8E2D8] border border-[#292927]/15 text-[#171717] text-xs font-bold font-sans transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <span>NEXT</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Pinned Vehicle Imagery Studio */}
          <div className="lg:col-span-6 relative aspect-[16/11] rounded-3xl overflow-hidden bg-[#E8E2D8] border border-[#292927]/15 shadow-[0_20px_50px_rgba(23,23,23,0.08)] group">
            {STORY_STAGES.map((stage, idx) => {
              const isActive = activeStageIndex === idx;
              return (
                <div
                  key={stage.id}
                  style={{ willChange: 'transform, opacity' }}
                  className={`story-img-layer-${idx} absolute inset-0 transition-all duration-700 ease-out ${
                    isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                  }`}
                >
                  <img
                    src={stage.vehicleImage}
                    alt={stage.headline}
                    className="w-full h-full object-cover filter contrast-[1.04] brightness-[0.98]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Studio Badge Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[#FAFAF7] text-xs font-mono">
                    <span className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/25 flex items-center gap-1.5 font-bold">
                      <Cpu className="w-3.5 h-3.5 text-[#B47A52]" />
                      DRIVEFORGE 3D STUDIO
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-[11px] font-bold border border-white/15">
                      STAGE {stage.stepNumber} VERIFIED
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Guidance */}
        <div className="text-center text-xs font-mono font-bold text-[#292927] uppercase tracking-widest pt-2 border-t border-[#292927]/12">
          ↓ SCROLL DOWN TO EXPLORE COMPONENT FITMENT &amp; REGIONAL WORKSHOPS ↓
        </div>

      </div>
    </div>
  );
};
