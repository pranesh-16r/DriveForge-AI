import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, currentRegion } = useApp();

  return (
    <footer className="w-full bg-[#E8E2D8]/70 border-t border-[#292927]/10 py-16 text-[#4A4843] font-sans mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-[#292927]/10 pb-12">
          
          {/* Brand Info & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div
              onClick={() => navigateTo('/')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#171717] text-[#FAFAF7] flex items-center justify-center font-bold text-xs">
                DF
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-[#171717] tracking-tight font-sans uppercase">
                  DRIVEFORGE
                </span>
                <span className="text-xs font-mono font-bold text-[#28483D]">
                  AI
                </span>
              </div>
            </div>

            <p className="text-xs text-[#5A5955] leading-relaxed max-w-sm font-sans">
              "Plan, visualize and analyze your vehicle modification before you spend."
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAFAF7] border border-[#292927]/10 text-xs font-mono text-[#292927]">
              <MapPin className="w-3.5 h-3.5 text-[#B47A52]" />
              <span>REGION: {currentRegion.name} ({currentRegion.code})</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold text-[#171717] uppercase tracking-wider">PLATFORM</p>
            <ul className="space-y-2 text-xs font-medium text-[#5A5955]">
              <li><button onClick={() => navigateTo('/build')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Physical Build</button></li>
              <li><button onClick={() => navigateTo('/garage')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">3D Garage Studio</button></li>
              <li><button onClick={() => navigateTo('/marketplace')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Editorial Marketplace</button></li>
              <li><button onClick={() => navigateTo('/learning')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Learning Magazine</button></li>
              <li><button onClick={() => navigateTo('/workshops')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Workshop Discovery</button></li>
            </ul>
          </div>

          {/* Discovery */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold text-[#171717] uppercase tracking-wider">DISCOVERY</p>
            <ul className="space-y-2 text-xs font-medium text-[#5A5955]">
              <li><button onClick={() => navigateTo('/brands')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Choose Manufacturer</button></li>
              <li><button onClick={() => navigateTo('/vehicles/type')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Body Styles</button></li>
              <li><button onClick={() => navigateTo('/vehicles')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Vehicle Models</button></li>
              <li><button onClick={() => navigateTo('/experience')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Experience Mode</button></li>
              <li><button onClick={() => navigateTo('/location')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Territory & Currency</button></li>
            </ul>
          </div>

          {/* Intelligence & Documents */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold text-[#171717] uppercase tracking-wider">ENGINEERING</p>
            <ul className="space-y-2 text-xs font-medium text-[#5A5955]">
              <li><button onClick={() => navigateTo('/ai-engineer')} className="hover:text-[#28483D] transition-colors cursor-pointer text-left">AI Chief Engineer</button></li>
              <li><button onClick={() => navigateTo('/vault')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Build Vault Archive</button></li>
              <li><button onClick={() => navigateTo('/reports')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Certification Reports</button></li>
              <li><button onClick={() => navigateTo('/build/analysis')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Build Dynamics Matrix</button></li>
              <li><button onClick={() => navigateTo('/build/performance')} className="hover:text-[#171717] transition-colors cursor-pointer text-left">Dyno & Telemetry</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5A5955]">
          <p className="leading-relaxed max-w-2xl text-center md:text-left">
            DriveForge AI provides planning, visualization and estimated analysis. Physical compatibility, installation and safety should be professionally verified where appropriate.
          </p>
          <p className="shrink-0">
            © {new Date().getFullYear()} DRIVEFORGE AI. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
};
