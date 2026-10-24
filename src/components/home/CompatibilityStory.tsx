import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FeatureSection } from './FeatureSection';
import { NeoCard } from '../ui/NeoCard';
import { NeoButton } from '../ui/NeoButton';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Check,
  Disc,
  ArrowUpRight,
  Info,
  Zap
} from 'lucide-react';

interface VerificationCheck {
  id: string;
  name: string;
  category: string;
  status: 'verified' | 'clearance' | 'warning';
  tolerance: string;
  details: string;
}

const CHECKS: VerificationCheck[] = [
  {
    id: 'caliper-barrel',
    name: 'Brake Caliper to Wheel Barrel Clearance',
    category: 'Mechanical Clearance',
    status: 'verified',
    tolerance: '+6.2mm Radial / +4.8mm Lateral',
    details: 'Brembo 380mm rotor fits inside factory 20" forged alloy wheels without wheel spacers.'
  },
  {
    id: 'exhaust-flaps',
    name: 'Exhaust Flap Actuator CAN-Bus Voltage',
    category: 'Electrical Integration',
    status: 'verified',
    tolerance: '12.4V ± 0.2V Factory Protocol',
    details: 'Plug-and-play harness communicates seamlessly with factory driving mode switches.'
  },
  {
    id: 'suspension-camber',
    name: 'Front Track Camber & Ball Joint Travel',
    category: 'Suspension Geometry',
    status: 'clearance',
    tolerance: '-2.4° Target Camber (Within Safe Range)',
    details: 'Öhlins DFV coilovers retain factory anti-roll bar drop link geometry.'
  },
  {
    id: 'ecu-thermal',
    name: 'Thermal Load & Knock Threshold Headroom',
    category: 'Thermodynamics',
    status: 'verified',
    tolerance: 'Exhaust gas temp reduction -45°C',
    details: 'Titanium header flow reduces cylinder head backpressure at high engine load.'
  }
];

export const CompatibilityStory: React.FC = () => {
  const { navigateTo } = useApp();
  const [activeCheck, setActiveCheck] = useState<VerificationCheck>(CHECKS[0]);

  return (
    <FeatureSection
      id="fitment"
      stepNumber="04"
      category="GEOMETRY & CAN-BUS VERIFICATION"
      title="CHECK FITMENT"
      subtitle="Understand compatibility before you buy."
      description="Never discover a wheel rubs against a caliper or an exhaust throws an ECU fault after spending thousands of dollars. DriveForge AI verifies physical and electrical compatibility in advance."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Verification Checklist */}
        <div className="lg:col-span-6 space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-gray-400 pl-1">
            Real-Time Tolerance Checks
          </p>

          <div className="space-y-2.5">
            {CHECKS.map((check) => {
              const isSelected = activeCheck.id === check.id;
              return (
                <button
                  key={check.id}
                  type="button"
                  onClick={() => setActiveCheck(check)}
                  className={`
                    w-full text-left p-4 rounded-2xl transition-all duration-200 cursor-pointer flex items-start justify-between gap-3
                    ${isSelected
                      ? 'border-2 border-[#171717] bg-white shadow-md ring-2 ring-[#171717]/10'
                      : 'border border-[#292927]/12 bg-[#FAFAF7] hover:bg-white hover:border-[#171717]/30 shadow-xs'
                    }
                  `}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1C6E42]" />
                      <span className="text-sm font-black text-[#171717] font-sans">{check.name}</span>
                    </div>
                    <p className="text-xs text-[#55534E] font-mono font-medium">{check.category}</p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded bg-[#1C6E42]/15 text-[#1C6E42] border border-[#1C6E42]/30 text-[10px] font-mono font-black shrink-0">
                    VERIFIED
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigateTo('/compatibility')}
              className="w-full p-4 rounded-2xl border border-[#292927]/15 bg-[#E8E2D8] hover:bg-[#171717] hover:text-[#FAFAF7] text-[#171717] flex items-center justify-between group transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAFAF7] border border-[#292927]/15 flex items-center justify-center text-[#171717] group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-[#28483D]" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-mono font-black block uppercase tracking-wider">
                    Simulate Custom Part Fitment
                  </span>
                  <span className="text-[11px] font-sans font-medium block mt-0.5 opacity-80">
                    Test turbos, boost levels, fuels & engine constraints
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#28483D] group-hover:text-[#FAFAF7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right: Technical Telemetry Inspector Panel */}
        <div className="lg:col-span-6">
          <NeoCard variant="panel" radius="28" className="p-6 sm:p-7 space-y-6 border border-[#292927]/15 bg-[#FAFAF7]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#292927]/12 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#28483D]" />
                <h3 className="text-base font-black text-[#171717] font-sans">
                  Telemetry Fitment Matrix
                </h3>
              </div>
              <span className="text-xs font-mono font-black text-[#28483D] px-2.5 py-1 rounded-full bg-[#E8E2D8] border border-[#292927]/15">
                0 CONFLICTS DETECTED
              </span>
            </div>

            {/* Inspection Breakdown */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 space-y-1.5">
                <span className="text-[10px] font-mono text-[#55534E] font-bold uppercase">Inspected Component Parameter</span>
                <p className="text-base font-black text-[#171717] font-mono">{activeCheck.name}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 space-y-1">
                  <span className="text-[10px] font-mono text-[#55534E] font-bold uppercase">Tolerance Clearance</span>
                  <p className="text-sm font-mono font-black text-[#1C6E42]">{activeCheck.tolerance}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 space-y-1">
                  <span className="text-[10px] font-mono text-[#55534E] font-bold uppercase">Diagnostic Status</span>
                  <p className="text-sm font-mono font-black text-[#171717] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1C6E42]" /> Pass (OEM Cleared)
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 space-y-1.5">
                <span className="text-[10px] font-mono text-[#55534E] font-bold uppercase flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#28483D]" />
                  Chief Engineering Note
                </span>
                <p className="text-xs text-[#383835] font-sans font-medium leading-relaxed">
                  {activeCheck.details}
                </p>
              </div>
            </div>

            {/* Certification Footer */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#55534E] border-t border-[#292927]/12 font-medium">
              <span>DriveForge CAD/CAN-Bus Kernel v4.2</span>
              <span className="text-[#28483D] font-bold">ISO 9001 Compliance</span>
            </div>

          </NeoCard>
        </div>

      </div>
    </FeatureSection>
  );
};
