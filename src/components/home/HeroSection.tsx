import React, { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../utils/gsapSetup';
import { HeroVehicle } from './HeroVehicle';
import { PrimaryCTA } from './PrimaryCTA';
import { SecondaryCTA } from './SecondaryCTA';
import { Vehicle } from '../../types';
import { Shield, Sparkles, Cpu } from 'lucide-react';

export interface HeroSectionProps {
  vehicle?: Vehicle;
  onStartBuild: () => void;
  onExploreGarage: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  vehicle,
  onStartBuild,
  onExploreGarage
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const vehicleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // 1. Identity badge appears
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -12, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5 }
      )
      // 2. Hero typography reveals
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.65 },
        '-=0.25'
      )
      // 3. Vehicle visual enters smoothly
      .fromTo(
        vehicleRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        '-=0.45'
      )
      // 4. Supporting copy appears
      .fromTo(
        copyRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.45'
      )
      // 5. CTA becomes active
      .fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.45 },
        '-=0.3'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col justify-center items-center pt-8 pb-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Dynamic Background Light */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-[#0070F3]/15 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E222A_1px,transparent_1px),linear-gradient(to_bottom,#1E222A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] opacity-20 pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8">
        
        {/* 1. Los Santos Customs Identity Pill */}
        <div ref={badgeRef} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#181B20] text-xs font-mono font-bold text-gray-300 border border-white/10 shadow-sm backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-[#FFB800] animate-ping" />
          <span className="text-[#FFB800] uppercase tracking-wider">LOS SANTOS CUSTOMS</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400 font-sans tracking-wide">WORKSHOP HOIST BAY 04</span>
        </div>

        {/* 2. Hero Typography */}
        <div className="space-y-3 max-w-4xl">
          <h1 
            ref={titleRef}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-[-0.04em] uppercase font-sans leading-[1.02]"
          >
            WHAT'S WRONG WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFD066] to-white">HER NOW?</span>
          </h1>

          {/* 4. Supporting Copy */}
          <p 
            ref={copyRef}
            className="text-base sm:text-lg md:text-xl text-gray-400 font-sans max-w-2xl mx-auto font-normal leading-[1.72] tracking-[-0.011em]"
          >
            San Andreas' premier automotive chop shop, performance tuning garage, and underground vehicle customiser. Respray pearlescent coats, install twin turbos, drop slammed coilovers, and test dyno fitment with real engineering physics.
          </p>
        </div>

        {/* 5. CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4 pt-1">
          <PrimaryCTA onClick={onStartBuild} size="lg" label="START CUSTOM BUILD" />
          <SecondaryCTA onClick={onExploreGarage} size="lg" label="EXPLORE 3D GARAGE" />
        </div>

        {/* 3. Hero Vehicle Visual */}
        <div ref={vehicleRef} className="w-full pt-4 sm:pt-6">
          <HeroVehicle vehicle={vehicle} onVehicleClick={onExploreGarage} />
        </div>

        {/* Engineering Reliability Micro-Indicators */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#FFB800]" />
            EMS STAGE 1-4 COMPLIANT
          </span>
          <span className="hidden sm:inline text-gray-700">•</span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            REAL-TIME DYNO PREDICTIONS
          </span>
          <span className="hidden sm:inline text-gray-700">•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            100% BULLETPROOF TIRES & NEONS
          </span>
        </div>

      </div>
    </section>
  );
};
