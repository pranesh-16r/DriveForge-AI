import React from 'react';
import { 
  Check, 
  Plus, 
  Eye, 
  EyeOff, 
  Info, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Wrench, 
  Scale, 
  Zap, 
  Columns3
} from 'lucide-react';
import { ExtendedModificationComponent, ComponentCompatibilityResult } from '../../types/modification';
import { ExperienceMode } from '../../types';

interface ComponentCardProps {
  component: ExtendedModificationComponent;
  compatibility: ComponentCompatibilityResult;
  isInBuild: boolean;
  isPreviewing: boolean;
  isComparing: boolean;
  experienceMode: ExperienceMode;
  onToggleBuild: (component: ExtendedModificationComponent) => void;
  onTogglePreview: (component: ExtendedModificationComponent) => void;
  onOpenDetails: (component: ExtendedModificationComponent) => void;
  onToggleCompare: (component: ExtendedModificationComponent) => void;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  compatibility,
  isInBuild,
  isPreviewing,
  isComparing,
  experienceMode,
  onToggleBuild,
  onTogglePreview,
  onOpenDetails,
  onToggleCompare
}) => {
  const getCompatibilityBadge = () => {
    switch (compatibility.status) {
      case 'compatible':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
            <span>FITMENT VERIFIED</span>
          </span>
        );
      case 'conditionally_compatible':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
            <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
            <span>CONDITIONAL</span>
          </span>
        );
      case 'not_compatible':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
            <XCircle className="w-3 h-3 text-[#EF4444]" />
            <span>INCOMPATIBLE</span>
          </span>
        );
      case 'verification_required':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
            <Info className="w-3 h-3 text-[#38BDF8]" />
            <span>CHECK FITMENT</span>
          </span>
        );
    }
  };

  const explanation = experienceMode === 'beginner' 
    ? component.beginnerExplanation 
    : component.expertExplanation;

  return (
    <div 
      className={`group relative rounded-[22px] overflow-hidden neo-panel border transition-all duration-300 flex flex-col justify-between ${
        isInBuild 
          ? 'border-[#0070F3] shadow-[0_0_20px_rgba(0,112,243,0.25)] bg-[#13161C]' 
          : isPreviewing
            ? 'border-[#38BDF8]/70 shadow-[0_0_15px_rgba(56,189,248,0.2)] bg-[#13161C]'
            : 'border-white/10 hover:border-white/25 hover:shadow-xl bg-[#111317]'
      }`}
    >
      {/* Visual Indicator of Active Preview */}
      {isPreviewing && (
        <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded-full bg-[#0070F3] text-white text-[9px] font-mono font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
          <Eye className="w-2.5 h-2.5" />
          <span>3D PREVIEW</span>
        </div>
      )}

      {/* Top Image Section (Visual-First, Crisp Product Photo) */}
      <div 
        className="relative w-full h-44 bg-[#181B20] overflow-hidden cursor-pointer"
        onClick={() => onOpenDetails(component)}
      >
        <img 
          src={component.image} 
          alt={component.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-95 contrast-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Subtle dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-black/30 pointer-events-none" />

        {/* Brand & Subcategory Chip */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white tracking-wide">
            {component.brand}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300">
            {component.subCategory}
          </span>
        </div>

        {/* 3D Supported / Honest Tag */}
        {component.visualAsset?.supported ? (
          <div className="absolute bottom-2.5 left-3 z-10">
            <span className="px-2 py-0.5 rounded-md bg-[#0070F3]/30 backdrop-blur-md border border-[#0070F3]/50 text-[9px] font-mono text-[#38BDF8] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0070F3] animate-pulse" />
              3D Interactive
            </span>
          </div>
        ) : (
          <div className="absolute bottom-2.5 left-3 z-10">
            <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-mono text-gray-400">
              Spec Ready
            </span>
          </div>
        )}
      </div>

      {/* Middle Content Section */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Fitment Status Badge */}
          <div className="flex items-center justify-between gap-2">
            {getCompatibilityBadge()}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(component);
              }}
              title="Compare side-by-side"
              className={`p-1 rounded-md text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                isComparing 
                  ? 'bg-[#0070F3] text-white' 
                  : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              <Columns3 className="w-3 h-3" />
              <span className="hidden sm:inline">{isComparing ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>

          {/* Component Name */}
          <h4 
            onClick={() => onOpenDetails(component)}
            className="text-sm font-bold text-white font-sans line-clamp-1 hover:text-[#0070F3] transition-colors cursor-pointer"
            title={component.name}
          >
            {component.name}
          </h4>

          {/* Short Explanation (Adaptive to Beginner vs Enthusiast) */}
          <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Specs & Performance Impact Chips */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
            {component.powerGainHp > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                +{component.powerGainHp} HP
              </span>
            )}
            {component.weightDeltaKg !== 0 && (
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-1">
                <Scale className="w-3 h-3" />
                {component.weightDeltaKg > 0 ? `+${component.weightDeltaKg}` : component.weightDeltaKg} kg
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-400 flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              {component.installationEstimate.hours}h Install
            </span>
          </div>

          {/* Price & Cost Range */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Est. Hardware</span>
              <span className="text-sm font-black font-mono text-white">
                {component.estimatedPrice.displayUSD}
              </span>
            </div>
            <button
              onClick={() => onOpenDetails(component)}
              className="text-[11px] font-mono text-[#0070F3] hover:underline cursor-pointer"
            >
              Specs & Fitment →
            </button>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-2 grid grid-cols-2 gap-2">
          {/* 3D Preview Toggle Button */}
          <button
            onClick={() => onTogglePreview(component)}
            className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isPreviewing
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/50 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                : 'neo-button text-gray-300 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            {isPreviewing ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />}
            <span>{isPreviewing ? 'Dismiss' : 'Preview 3D'}</span>
          </button>

          {/* Add to Build Button */}
          <button
            onClick={() => onToggleBuild(component)}
            className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isInBuild
                ? 'bg-[#10B981] text-black font-black border border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'bg-[#0070F3] hover:bg-[#0060df] text-white border border-[#0070F3]/80'
            }`}
          >
            {isInBuild ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>In Build</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add Part</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
