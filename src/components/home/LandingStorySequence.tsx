import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ChevronRight, Eye, ShieldCheck, Wrench, BarChart3, CheckCircle2, RotateCw } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StoryStage {
  step: string;
  headline: string;
  tagline: string;
  narrative: string;
  accent: string;
  accentBg: string;
  image: string;
  highlightPart: string;
  specs: { label: string; value: string }[];
  rotY: number;
  scale: number;
}

const STORY_STAGES: StoryStage[] = [
  {
    step: '01',
    headline: 'YOUR CAR.',
    tagline: 'Grounded in Real Factory Engineering.',
    narrative: 'Every modification begins with your vehicle’s factory DNA—curb weight distribution, suspension kinematics, hub offset tolerances, and factory cooling capacity.',
    accent: '#28483D', // Forest
    accentBg: 'rgba(40, 72, 61, 0.12)',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    highlightPart: 'OEM CHASSIS & HUB GEOMETRY',
    specs: [
      { label: 'PLATFORM', value: 'OEM Factory Spec' },
      { label: 'CHASSIS DYNAMICS', value: 'Verified Geometry' },
      { label: 'CALIBRATION', value: 'Factory Baseline' }
    ],
    rotY: -8,
    scale: 1.0,
  },
  {
    step: '02',
    headline: 'YOUR VISION.',
    tagline: 'Track-Ready, Canyon Runner, or Refined Daily.',
    narrative: 'Configure your goals with purpose. DriveForge tailors component recommendations based on whether your priority is unsprung weight reduction, downforce balance, or thermal stability.',
    accent: '#B47A52', // Copper
    accentBg: 'rgba(180, 122, 82, 0.14)',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    highlightPart: 'AERODYNAMIC & CAMBER ENVELOPE',
    specs: [
      { label: 'BUILD INTENT', value: 'Targeted Performance' },
      { label: 'THERMAL ENVELOPE', value: 'High Endurance' },
      { label: 'RIDE DYNAMICS', value: 'Adjustable Damping' }
    ],
    rotY: 4,
    scale: 1.05,
  },
  {
    step: '03',
    headline: 'YOUR BUILD.',
    tagline: 'Real Components from Proven Manufacturers.',
    narrative: 'No generic parts. Explore forged mono-block wheels, 2-way adjustable coilovers, titanium exhaust manifolds, and slotted carbon-ceramic brake systems with real dimensions.',
    accent: '#292927', // Graphite
    accentBg: 'rgba(41, 41, 39, 0.12)',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    highlightPart: 'FORGED WHEEL & BRAKE ROTOR STACK',
    specs: [
      { label: 'COMPONENT STACK', value: 'Modular Integration' },
      { label: 'PART ACCURACY', value: 'True Dimensions' },
      { label: 'FITMENT TOLERANCE', value: 'Hub & Caliper Clear' }
    ],
    rotY: 14,
    scale: 1.1,
  },
  {
    step: '04',
    headline: 'YOUR PLAN.',
    tagline: 'Total Cost of Ownership & Regional Labor.',
    narrative: 'Plan before you spend. Estimate parts acquisition, localized workshop installation hours, and required alignment or ECU tuning expenses in your specific territory.',
    accent: '#B8644A', // Terracotta
    accentBg: 'rgba(184, 100, 74, 0.14)',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    highlightPart: 'INSTALLATION COMPLEXITY: TIER 3',
    specs: [
      { label: 'LABOR REGION', value: 'Localized Estimate' },
      { label: 'INSTALLATION COMPLEXITY', value: 'Level 3 Professional' },
      { label: 'CONTINGENCY', value: 'Transparent Pricing' }
    ],
    rotY: -2,
    scale: 1.04,
  },
  {
    step: '05',
    headline: 'YOUR DECISION.',
    tagline: 'Certified Confidence Before Spending Money.',
    narrative: 'Receive an exhaustive digital engineering report with build health verification, expected horsepower gains, weight savings, and verified workshop discovery.',
    accent: '#557B76', // Soft Teal
    accentBg: 'rgba(85, 123, 118, 0.14)',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    highlightPart: 'BUILD HEALTH CERTIFIED: 94%',
    specs: [
      { label: 'BUILD HEALTH', value: 'Verified Green' },
      { label: 'REPORT EXPORT', value: 'Engineering Grade' },
      { label: 'WORKSHOP PAIRING', value: 'Specialized Match' }
    ],
    rotY: 0,
    scale: 1.08,
  }
];

export const LandingStorySequence: React.FC = () => {
  const { navigateTo } = useApp();
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const vehicleVisualRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);

  const currentStage = STORY_STAGES[activeStageIdx];

  useEffect(() => {
    const container = containerRef.current;
    const pinWrapper = pinWrapperRef.current;
    if (!container || !pinWrapper) return;

    // Configure GSAP ScrollTrigger to pin the section and drive vehicle rotation & typography transitions
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=2400',
      pin: pinWrapper,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // Determine active stage from progress: 5 stages (0-0.2, 0.2-0.4, 0.4-0.6, 0.6-0.8, 0.8-1.0)
        const stageIdx = Math.min(STORY_STAGES.length - 1, Math.floor(p * STORY_STAGES.length));
        setActiveStageIdx(stageIdx);

        // Vehicle continuous 3D rotation and perspective shift linked to scroll progress
        if (vehicleVisualRef.current) {
          const stage = STORY_STAGES[stageIdx];
          const localProgress = (p * STORY_STAGES.length) % 1;
          const targetRotY = stage.rotY + (localProgress - 0.5) * 8;
          const targetScale = stage.scale + Math.sin(p * Math.PI) * 0.05;

          gsap.to(vehicleVisualRef.current, {
            rotationY: targetRotY,
            scale: targetScale,
            duration: 0.3,
            ease: 'power1.out',
            overwrite: 'auto',
          });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const jumpToStage = (idx: number) => {
    setActiveStageIdx(idx);
    if (containerRef.current) {
      const scrollPos =
        containerRef.current.offsetTop + (idx / STORY_STAGES.length) * 2400;
      window.scrollTo({
        top: scrollPos,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full bg-[#F4F1EA]">
      {/* Pinned Viewport Container */}
      <div
        ref={pinWrapperRef}
        className="w-full min-h-screen flex flex-col justify-between py-12 px-4 sm:px-8 lg:px-16 border-t border-[#292927]/10"
      >
        <div className="max-w-7xl mx-auto w-full space-y-8 flex-1 flex flex-col justify-between">
          
          {/* Header & Scrubber Navigation */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#292927]/10 pb-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#B47A52] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B47A52] animate-pulse" />
                  CINEMATIC AUTOMOTIVE SEQUENCE
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-[#171717] tracking-[-0.04em] uppercase font-sans mt-1">
                  THE DRIVEFORGE STORY
                </h2>
              </div>

              {/* Progress Telemetry Readout */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-mono text-[#5A5955] uppercase">SCROLL PROGRESS</p>
                  <p className="text-sm font-mono font-black text-[#171717]">
                    {Math.round(scrollProgress * 100)}% / STAGE {currentStage.step}
                  </p>
                </div>
                <div className="w-24 h-1.5 bg-[#E8E2D8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#171717] transition-all duration-100 ease-out rounded-full"
                    style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stage Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {STORY_STAGES.map((s, idx) => {
                const isActive = activeStageIdx === idx;
                return (
                  <button
                    key={s.step}
                    onClick={() => jumpToStage(idx)}
                    className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                      isActive
                        ? 'bg-[#171717] text-[#FAFAF7] border-[#171717] shadow-sm'
                        : 'bg-white/80 text-[#5A5955] border-[#292927]/10 hover:bg-[#E8E2D8] hover:text-[#171717]'
                    }`}
                  >
                    <span className="opacity-60">{s.step}</span>
                    <span>{s.headline.replace('.', '')}</span>
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: s.accent }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Visual & Editorial Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAFAF7] rounded-3xl p-6 sm:p-10 border border-[#292927]/10 shadow-[0_12px_40px_rgba(23,23,23,0.06)] relative overflow-hidden">
            
            {/* Background Stage Indicator Watermark */}
            <div
              className="absolute -right-8 -bottom-12 text-[180px] font-black text-[#292927]/[0.03] select-none pointer-events-none font-sans"
              style={{ lineHeight: 1 }}
            >
              {currentStage.step}
            </div>

            {/* Left Column: Bold Editorial Typography & High-Contrast Narrative */}
            <div ref={typographyRef} className="lg:col-span-6 space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: currentStage.accent }}
                  >
                    STAGE {currentStage.step} OF 05
                  </span>
                  <span className="text-[11px] font-mono text-[#5A5955] uppercase">
                    {currentStage.highlightPart}
                  </span>
                </div>

                <h3 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#171717] tracking-[-0.05em] uppercase font-sans leading-none">
                  {currentStage.headline}
                </h3>

                <p
                  className="text-lg sm:text-xl font-bold font-sans pt-1"
                  style={{ color: currentStage.accent }}
                >
                  {currentStage.tagline}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#3A3935] leading-relaxed font-sans font-medium">
                {currentStage.narrative}
              </p>

              {/* Technical Specifications Readout */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#292927]/10">
                {currentStage.specs.map(spec => (
                  <div
                    key={spec.label}
                    className="p-3 rounded-xl bg-white border border-[#292927]/10 shadow-xs"
                  >
                    <p className="text-[10px] font-mono text-[#5A5955] uppercase tracking-wider font-semibold">
                      {spec.label}
                    </p>
                    <p className="text-xs font-bold text-[#171717] font-sans mt-0.5">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigateTo('/brands')}
                  className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] text-xs font-bold font-sans tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>EXPLORE STAGE {currentStage.step}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => jumpToStage((activeStageIdx + 1) % STORY_STAGES.length)}
                  className="text-xs font-bold text-[#5A5955] hover:text-[#171717] transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-black/5"
                >
                  <span>ADVANCE MILESTONE</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: High-Fidelity Automotive Visual with 3D Scroll Rotation */}
            <div className="lg:col-span-6 relative aspect-[16/11] rounded-2xl overflow-hidden bg-[#E8E2D8] border border-[#292927]/10 group [perspective:1200px]">
              
              <div
                ref={vehicleVisualRef}
                className="w-full h-full relative transition-transform duration-300 ease-out will-change-transform"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src={currentStage.image}
                  alt={currentStage.headline}
                  className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.98]"
                />
                
                {/* Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                
                {/* Interactive Hotspot Beacon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-full animate-ping opacity-40"
                      style={{ backgroundColor: currentStage.accent }}
                    />
                    <div
                      className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                      style={{ backgroundColor: currentStage.accent }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>

                {/* Telemetry Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[#FAFAF7] text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 font-bold flex items-center gap-1.5">
                    <RotateCw className="w-3 h-3 text-[#B47A52] animate-spin" style={{ animationDuration: '8s' }} />
                    {currentStage.highlightPart}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-1 rounded bg-black/50 backdrop-blur-md">
                    DELTA SYNC ACTIVE
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Footer Scroll Directive */}
          <div className="flex items-center justify-between text-xs text-[#5A5955] font-mono border-t border-[#292927]/10 pt-3">
            <span>SCROLL OR USE CONTROLS TO ADVANCE STAGES</span>
            <span className="hidden sm:inline">GSAP SCROLLTRIGGER ENGINE LINKED</span>
          </div>

        </div>
      </div>
    </div>
  );
};
