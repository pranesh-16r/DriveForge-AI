import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CinematicHero,
  LandingStory,
  LandingStorySequence,
  HowDriveForgeWorks,
  VehicleStory,
  ModificationStory,
  CompatibilityStory,
  PhysicalBuildStory,
  PerformanceStory,
  AIEngineerStory,
  WorkshopStory,
  FinalCTA
} from '../components/home';
import { LoadingOverlay } from '../components/ui';

export const HomePage: React.FC = () => {
  const { navigateTo } = useApp();
  const [showAnalysisDemo, setShowAnalysisDemo] = useState(false);

  const handleStartBuild = () => {
    navigateTo('/location');
  };

  const handleExploreGarage = () => {
    navigateTo('/garage');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F4F1EA] text-[#171717]">
      {/* 01 — FIRST SCREEN: CINEMATIC AUTOMOTIVE HERO */}
      <CinematicHero
        onStartBuild={handleStartBuild}
        onExploreGarage={handleExploreGarage}
      />

      {/* 03 — LANDING STORY SECTION: GSAP SCROLLTRIGGER ORCHESTRATION */}
      <LandingStory />

      {/* 04 — HOW DRIVEFORGE WORKS: HORIZONTAL 6-STAGE CINEMATIC SEQUENCE */}
      <HowDriveForgeWorks />

      {/* 05 — OEM PLATFORM BASELINE EXPLORATION */}
      <VehicleStory />

      {/* 06 — EXPLORE REAL MODIFICATION SPECS */}
      <ModificationStory />

      {/* 07 — FITMENT & BLUEPRINT VERIFICATION */}
      <CompatibilityStory />

      {/* 08 — PHYSICAL BUILD STACK */}
      <PhysicalBuildStory />

      {/* 09 — POWER & THERMODYNAMICS ANALYSIS */}
      <PerformanceStory />

      {/* 10 — AI CHIEF ENGINEER DESK PREVIEW */}
      <AIEngineerStory />

      {/* 11 — REGIONAL WORKSHOP MATCHING */}
      <WorkshopStory />

      {/* 12 — FINAL CALL TO ACTION */}
      <FinalCTA
        onStartBuild={handleStartBuild}
        onExploreGarage={handleExploreGarage}
      />

      {/* Floating Telemetry Analysis Launcher */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowAnalysisDemo(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] text-xs font-mono font-bold tracking-wider shadow-xl transition-all cursor-pointer flex items-center gap-2 border border-white/20"
        >
          <span className="w-2 h-2 rounded-full bg-[#B47A52] animate-ping" />
          <span>RUN BUILD ANALYSIS TELEMETRY</span>
        </button>
      </div>

      {/* LoadingOverlay State Machine Modal */}
      <LoadingOverlay
        isOpen={showAnalysisDemo}
        onClose={() => setShowAnalysisDemo(false)}
        onComplete={() => {
          setTimeout(() => {
            setShowAnalysisDemo(false);
            navigateTo('/analysis');
          }, 600);
        }}
        vehicleName="2022 Honda Civic 1.5L Turbo"
        componentCount={5}
      />
    </div>
  );
};


