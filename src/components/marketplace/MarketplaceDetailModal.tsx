import React, { useState } from 'react';
import { MarketplaceItem } from '../../lib/marketplace/marketplaceService';
import { Vehicle } from '../../types';
import {
  X,
  Sparkles,
  Bot,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Car,
  Layers,
  Check,
  Scale,
  Gauge,
  Info
} from 'lucide-react';

interface MarketplaceDetailModalProps {
  item: MarketplaceItem | null;
  activeVehicle: Vehicle;
  isInBuild: boolean;
  onClose: () => void;
  onToggleBuild: (item: MarketplaceItem) => void;
  onPreviewInGarage: (item: MarketplaceItem) => void;
  onAskChiefEngineer: (componentId: string) => void;
}

export const MarketplaceDetailModal: React.FC<MarketplaceDetailModalProps> = ({
  item,
  activeVehicle,
  isInBuild,
  onClose,
  onToggleBuild,
  onPreviewInGarage,
  onAskChiefEngineer
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'fitment' | 'engineering'>('overview');
  const [garageNotice, setGarageNotice] = useState<string | null>(null);

  if (!item) return null;

  const { component, compatibility, pricing, installation } = item;

  const handleGarageClick = () => {
    if (component.visualAsset?.supported) {
      onPreviewInGarage(item);
    } else {
      setGarageNotice('3D mesh preview is currently unavailable for this specific hardware item. Visual stance geometry will load default OEM baseline in 3D Garage.');
      setTimeout(() => {
        onPreviewInGarage(item);
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-3xl my-8 bg-[#14171E] border border-white/15 rounded-[28px] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with image banner */}
        <div className="relative h-60 sm:h-72 w-full bg-[#0D0F13] overflow-hidden">
          {component.image ? (
            <img
              src={component.image}
              alt={component.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-700">
              <Layers className="w-16 h-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14171E] via-[#14171E]/40 to-black/60" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-gray-400 hover:text-white border border-white/10 transition-colors z-20 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
            <span className="px-3 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wider bg-black/80 text-white border border-white/20 shadow-md">
              {component.brand}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono uppercase bg-[#0070F3] text-white font-bold">
              {component.category}
            </span>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-6 right-6 space-y-1 z-10">
            <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
              {component.name}
            </h2>
            <p className="text-xs font-mono text-gray-300">
              Part No: {component.partNumber || 'OEM / Custom Motorsport'} • Target Vehicle: {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-[#101217] px-6 text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#0070F3] text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            SPECIFICATION OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('fitment')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'fitment'
                ? 'border-[#0070F3] text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            FITMENT & COMPATIBILITY
          </button>
          <button
            onClick={() => setActiveTab('engineering')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'engineering'
                ? 'border-[#0070F3] text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            DYNAMICS & VERIFICATION
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[55vh] overflow-y-auto">
          {garageNotice && (
            <div className="p-3.5 rounded-xl bg-[#0070F3]/10 border border-[#0070F3]/30 text-xs font-mono text-[#0070F3] flex items-center gap-2 animate-in fade-in">
              <Info className="w-4 h-4 shrink-0" />
              <span>{garageNotice}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Purpose & Description */}
              <div className="p-4 rounded-2xl neo-inset border border-white/5 space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-wider block">
                  ENGINEERING OBJECTIVE
                </span>
                <p className="text-sm text-gray-200 font-sans leading-relaxed">
                  {component.purpose || component.description}
                </p>
              </div>

              {/* Cost & Installation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl neo-panel border border-white/10 bg-[#0D0F14] space-y-1 text-xs font-mono">
                  <span className="text-[10px] text-gray-400 block uppercase">ESTIMATED REGIONAL PART COST</span>
                  <div className="text-xl font-black text-white">{pricing.display}</div>
                  <span className="text-[10px] text-gray-500 block pt-1">
                    Currency: {pricing.currency} • Source: {pricing.sourceType}
                  </span>
                </div>

                <div className="p-4 rounded-2xl neo-panel border border-white/10 bg-[#0D0F14] space-y-1 text-xs font-mono">
                  <span className="text-[10px] text-gray-400 block uppercase">ESTIMATED WORKSHOP LABOR</span>
                  <div className="text-xl font-black text-[#0070F3]">{installation.display}</div>
                  <span className="text-[10px] text-gray-500 block pt-1">
                    Standard Labor Time: ~{installation.hours} hours • {installation.difficultyLabel}
                  </span>
                </div>
              </div>

              {/* Hardware Specifications List */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                  HARDWARE SPECIFICATIONS
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {component.material && (
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-gray-500 block">Material</span>
                      <span className="font-bold text-gray-200">{component.material}</span>
                    </div>
                  )}
                  {component.dimensions && (
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-gray-500 block">Dimensions</span>
                      <span className="font-bold text-gray-200">{component.dimensions}</span>
                    </div>
                  )}
                  {component.weight && (
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-gray-500 block">Mass / Weight</span>
                      <span className="font-bold text-gray-200">{component.weight}</span>
                    </div>
                  )}
                  {component.powerGainHp !== 0 && (
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-gray-500 block">Power Output Delta</span>
                      <span className="font-bold text-[#10B981]">+{component.powerGainHp} HP</span>
                    </div>
                  )}
                  {component.weightDeltaKg !== 0 && (
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-gray-500 block">Weight Delta</span>
                      <span className="font-bold text-[#38BDF8]">{component.weightDeltaKg} kg</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fitment' && (
            <div className="space-y-5">
              {/* Fitment Status Banner */}
              <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2 ${
                compatibility.status === 'compatible'
                  ? 'bg-[#10B981]/10 border-[#10B981]/30 text-white'
                  : compatibility.status === 'conditionally_compatible'
                  ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-white'
                  : 'bg-red-500/10 border-red-500/30 text-white'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm uppercase">FITMENT EVALUATION</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/40 border border-white/20">
                    {compatibility.badgeLabel}
                  </span>
                </div>
                <p className="text-xs font-sans text-gray-200 leading-relaxed">
                  {compatibility.explanation}
                </p>
              </div>

              {/* Fitment Notes & Rules */}
              <div className="p-4 rounded-2xl neo-inset border border-white/5 space-y-2 text-xs font-mono">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  PHYSICAL MOUNTING & ARCHITECTURE
                </span>
                <p className="text-gray-300 font-sans leading-relaxed">
                  {component.compatibilityNotes || 'Direct bolt-on to OEM chassis mount points. No metal cutting or irreversible drilling required.'}
                </p>
                {component.compatibilityRules && (
                  <p className="text-gray-400 font-sans text-[11px] pt-1">
                    <strong className="text-white font-mono">Rules: </strong>
                    {component.compatibilityRules}
                  </p>
                )}
              </div>

              {/* Warning Conditions if any */}
              {compatibility.warningConditions.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-[#F59E0B] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    FITMENT PREREQUISITES & WARNINGS
                  </span>
                  <ul className="space-y-1 text-xs font-mono text-gray-300 list-disc pl-5">
                    {compatibility.warningConditions.map((cond, idx) => (
                      <li key={idx}>{cond}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'engineering' && (
            <div className="space-y-5">
              {/* Dynamic Impacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl neo-panel border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-wider block flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5" />
                    PERFORMANCE IMPACT
                  </span>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    {component.performanceImpact || 'Delivers optimized volumetric flow and reduced backpressure across the engine powerband.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl neo-panel border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider block flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    HANDLING & CHASSIS IMPACT
                  </span>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    {component.handlingImpact || 'Improves unsprung weight dynamics and steering turn-in responsiveness.'}
                  </p>
                </div>
              </div>

              {/* Physical Verification Checklist */}
              <div className="p-4 rounded-2xl neo-inset border border-white/5 space-y-3">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                  WORKSHOP VERIFICATION REQUIREMENTS
                </span>
                {compatibility.verificationRequirements && compatibility.verificationRequirements.length > 0 ? (
                  <div className="space-y-2">
                    {compatibility.verificationRequirements.map((req, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs font-mono space-y-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          {req.title}
                        </span>
                        <p className="text-gray-400 text-[11px] font-sans pl-5">
                          {req.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 font-mono">
                    Standard visual alignment and fastener torque verification recommended after 100 km road shake-down.
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Primary Actions */}
        <div className="p-5 border-t border-white/10 bg-[#101217] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleGarageClick}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl neo-button text-xs font-mono font-bold text-gray-200 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Car className="w-4 h-4 text-[#0070F3]" />
              PREVIEW IN GARAGE
            </button>

            <button
              onClick={() => onAskChiefEngineer(component.id)}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl neo-button text-xs font-mono font-bold text-[#0070F3] hover:text-white border border-[#0070F3]/30 bg-[#0070F3]/10 hover:bg-[#0070F3]/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              ASK CHIEF ENGINEER
            </button>
          </div>

          <div className="w-full sm:w-auto">
            {isInBuild ? (
              <button
                onClick={() => onToggleBuild(item)}
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:text-red-300 text-xs font-mono font-black flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                REMOVE FROM BUILD
              </button>
            ) : (
              <button
                onClick={() => onToggleBuild(item)}
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs font-mono font-black flex items-center justify-center gap-2 shadow-lg shadow-[#0070F3]/30 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4" />
                ADD TO PHYSICAL BUILD
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
