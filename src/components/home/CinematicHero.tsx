import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Box, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';

export interface CinematicHeroProps {
  onStartBuild: () => void;
  onExploreGarage: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onStartBuild,
  onExploreGarage
}) => {
  const { activeVehicle } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const carVisualRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [headlightsActive, setHeadlightsActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeadlightsActive(true);
    }, 1200);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(
        carVisualRef.current,
        { opacity: 0, scale: 0.96, x: 40 },
        { opacity: 1, scale: 1, x: 0, duration: 1.2, ease: 'power2.out' },
        '-=0.8'
      );
    }, heroRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#F4F1EA] text-[#171717] pt-12 pb-10 px-4 sm:px-8 lg:px-16 select-none"
    >
      {/* 1. Cinematic Background Video / Atmospheric Studio Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover filter contrast-[1.08] brightness-[0.92] transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-30' : 'opacity-0'
          }`}
          poster="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-through-a-tunnel-41712-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Fallback & Atmosphere: Soft Warm Ivory Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1EA] via-[#F4F1EA]/75 to-[#F4F1EA]/50 backdrop-blur-[2px]" />
        
        {/* Subtle Warm Studio Ambient Light Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#D6C09A]/20 via-[#B47A52]/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* 2. Top Minimal Bar */}
      <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono tracking-wider text-[#292927] uppercase pt-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#28483D] animate-pulse" />
          <span className="font-bold text-[#171717]">AUTOMOTIVE PLANNING INTELLIGENCE</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-bold">
          <span>PHYSICAL VERIFICATION PROTOCOL</span>
          <span>·</span>
          <span>CERTIFIED OEM TOLERANCES</span>
        </div>
      </div>

      {/* 3. Center Hero Editorial Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-8">
        
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-[#B47A52] font-bold block">
              ENGINEER YOUR BUILD
            </span>
            
            <h1
              ref={headlineRef}
              className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#171717] tracking-[-0.045em] uppercase font-sans leading-[0.98]"
            >
              DRIVEFORGE <span className="text-[#28483D]">AI</span>
            </h1>
          </div>

          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl text-[#292927] font-semibold leading-relaxed max-w-xl font-sans"
          >
            Plan, visualize and analyze your vehicle modification before you spend.
          </p>

          {/* Action Buttons */}
          <div
            ref={ctaRef}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <button
              onClick={onStartBuild}
              className="px-8 py-4 rounded-xl bg-[#171717] text-[#FAFAF7] font-bold text-sm font-sans tracking-wide hover:bg-[#28483D] shadow-[0_8px_24px_-4px_rgba(23,23,23,0.2)] hover:shadow-[0_12px_28px_-4px_rgba(40,72,61,0.3)] transition-all flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>START BUILD</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreGarage}
              className="px-8 py-4 rounded-xl bg-[#FAFAF7] border border-[#292927]/18 text-[#171717] font-bold text-sm font-sans tracking-wide hover:bg-white hover:border-[#292927]/30 shadow-[0_4px_16px_rgba(23,23,23,0.06)] transition-all flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Box className="w-4 h-4 text-[#B47A52]" />
              <span>EXPLORE GARAGE</span>
            </button>
          </div>

          {/* Key Principles Tagline */}
          <div className="pt-4 flex items-center gap-3 text-xs font-mono font-bold text-[#292927]">
            <span>SEE</span>
            <span>→</span>
            <span>UNDERSTAND</span>
            <span>→</span>
            <span>VERIFY</span>
            <span>→</span>
            <span>PLAN</span>
            <span>→</span>
            <span>ANALYZE</span>
            <span>→</span>
            <span>EXECUTE</span>
          </div>

        </div>

        {/* Right Column: Hero Vehicle Visual */}
        <div
          ref={carVisualRef}
          className="lg:col-span-5 relative flex flex-col items-center justify-center"
        >
          <div className="relative w-full max-w-lg aspect-[16/10] rounded-2xl bg-[#E8E2D8] border border-[#292927]/15 p-4 shadow-xl overflow-hidden group">
            {/* Background vehicle imagery */}
            <img
              src={(activeVehicle as any)?.heroImage || activeVehicle?.imageUrl || "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"}
              alt="DriveForge OEM Platform Hero"
              className="w-full h-full object-cover rounded-xl filter contrast-[1.04] brightness-[0.98] transition-transform duration-700 group-hover:scale-105"
            />

            {/* Headlight Ray Animation */}
            {headlightsActive && (
              <div className="absolute top-1/2 left-1/4 w-48 h-32 bg-gradient-to-r from-amber-200/40 via-white/20 to-transparent blur-2xl pointer-events-none transform -translate-y-1/2 transition-opacity duration-1000 animate-pulse" />
            )}

            {/* Inset Vehicle Stamp */}
            <div className="absolute bottom-6 left-6 right-6 p-3 rounded-xl bg-[#FAFAF7]/95 backdrop-blur-md border border-[#292927]/15 flex items-center justify-between text-xs shadow-md">
              <div>
                <p className="font-extrabold text-[#171717] font-sans">
                  {activeVehicle?.year || 2024} {activeVehicle?.make || 'Porsche'} {activeVehicle?.model || '911 GT3 RS'}
                </p>
                <p className="text-[10px] font-mono font-bold text-[#292927]">
                  {activeVehicle?.engine || '4.0L Atmospheric Flat-6'} · {activeVehicle?.baselinePowerHp || 518} HP
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#28483D] text-[#FAFAF7] font-mono text-[10px] font-bold shadow-xs">
                FACTORY BASELINE
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bottom Scroll Indicator */}
      <div className="relative z-10 w-full flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-widest uppercase text-[#292927]">
          <span>SCROLL FOR BUILD STORY</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#B47A52]" />
        </div>
      </div>
    </section>
  );
};
