import React from 'react';
import { MarketplaceItem } from '../../lib/marketplace/marketplaceService';
import {
  Wrench,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  Clock,
  Eye,
  Check
} from 'lucide-react';

interface MarketplaceCardProps {
  item: MarketplaceItem;
  isInBuild: boolean;
  onViewDetails: (item: MarketplaceItem) => void;
  onCheckFitment: (item: MarketplaceItem) => void;
  onToggleBuild: (item: MarketplaceItem) => void;
  onViewBuild: () => void;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  item,
  isInBuild,
  onViewDetails,
  onCheckFitment,
  onToggleBuild,
  onViewBuild
}) => {
  const { component, compatibility, pricing, installation } = item;

  // Compatibility Badge Style
  let compatBadge = {
    bg: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />,
    label: 'COMPATIBLE'
  };

  if (compatibility.status === 'conditionally_compatible') {
    compatBadge = {
      bg: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />,
      label: 'CONDITIONAL'
    };
  } else if (compatibility.status === 'verification_required') {
    compatBadge = {
      bg: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30',
      icon: <Info className="w-3.5 h-3.5 text-[#38BDF8]" />,
      label: 'VERIFICATION REQ.'
    };
  } else if (compatibility.status === 'not_compatible') {
    compatBadge = {
      bg: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />,
      label: 'NOT COMPATIBLE'
    };
  }

  return (
    <div className="group rounded-[24px] neo-panel border border-white/10 bg-[#14161C] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-[#0070F3]/40 hover:shadow-xl hover:shadow-[#0070F3]/5">
      {/* Top Image & Badges */}
      <div className="relative w-full h-48 bg-[#0D0F13] overflow-hidden">
        {component.image ? (
          <img
            src={component.image}
            alt={component.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <Layers className="w-12 h-12 stroke-[1.2]" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#14161C] via-transparent to-black/40" />

        {/* Brand & Category Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/15">
            {component.brand}
          </span>
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono uppercase bg-[#0070F3]/80 backdrop-blur-md text-white font-bold">
            {component.category}
          </span>
        </div>

        {/* Compatibility Status Pill */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wide backdrop-blur-md border ${compatBadge.bg}`}>
            {compatBadge.icon}
            {compatBadge.label}
          </span>
        </div>

        {/* Part Number Chip */}
        {component.partNumber && (
          <div className="absolute bottom-2 left-3 z-10">
            <span className="text-[10px] font-mono text-gray-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-white/5">
              {component.partNumber}
            </span>
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-base font-black text-white font-sans tracking-tight leading-snug line-clamp-2">
            {component.name}
          </h3>

          <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed">
            {component.purpose || component.description}
          </p>
        </div>

        {/* Regional Price & Installation Matrix */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#0D0F13] neo-inset border border-white/5 text-xs font-mono">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-medium">Est. Part Cost</span>
              <span className="font-black text-white text-xs block truncate" title={pricing.display}>
                {pricing.display}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-medium">Labor ({installation.hours}h)</span>
              <span className="font-bold text-[#0070F3] text-xs block truncate" title={installation.display}>
                {installation.display}
              </span>
            </div>
          </div>

          {/* Difficulty & Verification Sub-meta */}
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-1">
            <span className="flex items-center gap-1">
              <Wrench className="w-3 h-3 text-gray-500" />
              {component.installationDifficulty ? component.installationDifficulty.replace('_', ' ') : 'Moderate'}
            </span>
            <span className="flex items-center gap-1 text-[#10B981]">
              <ShieldCheck className="w-3 h-3" />
              Verified Spec
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(item)}
              className="py-2.5 px-3 rounded-xl neo-button text-xs font-mono font-bold text-gray-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              VIEW DETAILS
            </button>

            <button
              onClick={() => onCheckFitment(item)}
              className="py-2.5 px-3 rounded-xl neo-button text-xs font-mono font-bold text-[#0070F3] hover:text-white border border-[#0070F3]/30 bg-[#0070F3]/5 hover:bg-[#0070F3]/15 transition-colors cursor-pointer"
            >
              CHECK FITMENT
            </button>
          </div>

          {isInBuild ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBuild(item)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-xs font-mono font-black flex items-center justify-center gap-1.5 cursor-pointer hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 transition-all"
                title="Click to remove from build"
              >
                <Check className="w-4 h-4" />
                <span>IN ACTIVE BUILD</span>
              </button>
              <button
                onClick={onViewBuild}
                className="py-2.5 px-3 rounded-xl neo-button text-xs font-mono font-bold text-white border border-white/15 hover:border-[#0070F3] transition-colors cursor-pointer flex items-center gap-1"
                title="Go to Physical Build page"
              >
                VIEW BUILD
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onToggleBuild(item)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs font-mono font-black flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0070F3]/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ADD TO BUILD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
