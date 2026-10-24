import React from 'react';
import { motion } from 'motion/react';
import { NeoCard } from '../ui/NeoCard';
import { PrimaryCTA } from './PrimaryCTA';
import { SecondaryCTA } from './SecondaryCTA';
import { Cpu, ShieldCheck, Gauge } from 'lucide-react';

export interface FinalCTAProps {
  onStartBuild: () => void;
  onExploreGarage: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onStartBuild,
  onExploreGarage
}) => {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-radial from-[#28483D]/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        <NeoCard
          variant="panel"
          radius="28"
          className="p-8 sm:p-14 text-center space-y-8 border border-[#292927]/15 bg-[#FAFAF7] relative overflow-hidden shadow-xl"
        >
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#292927_1px,transparent_1px),linear-gradient(to_bottom,#292927_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.03] pointer-events-none" />

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8E2D8] text-xs font-mono font-extrabold text-[#28483D] border border-[#28483D]/25">
            <Cpu className="w-3.5 h-3.5" />
            ENGINEER YOUR BUILD WITH DRIVEFORGE AI
          </div>

          {/* Heading */}
          <div className="relative z-10 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-[#171717] tracking-tight uppercase font-sans leading-tight">
              READY TO ENGINEER <br />
              <span className="text-[#28483D]">
                YOUR BUILD?
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#4A4843] font-medium font-sans max-w-xl mx-auto leading-relaxed">
              Plan, visualize, and analyze real-world performance components with physical fitment tolerance before making a purchase.
            </p>
          </div>

          {/* Actions */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <PrimaryCTA onClick={onStartBuild} size="lg" label="START BUILD" />
            <SecondaryCTA onClick={onExploreGarage} size="lg" label="EXPLORE GARAGE" />
          </div>

          {/* Guarantees */}
          <div className="relative z-10 pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-bold text-[#4A4843] border-t border-[#292927]/12">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#28483D]" />
              Authentic Component Specs
            </span>
            <span className="hidden sm:inline text-[#292927]/30">•</span>
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#28483D]" />
              Dyno-Trained Physics
            </span>
            <span className="hidden sm:inline text-[#292927]/30">•</span>
            <span>No Unnecessary Garage Downtime</span>
          </div>
        </NeoCard>
      </div>
    </section>
  );
};
