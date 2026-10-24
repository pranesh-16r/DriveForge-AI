import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  X, 
  ArrowRight, 
  Layers, 
  Zap, 
  DollarSign
} from 'lucide-react';
import { Vehicle, ModificationComponent } from '../../types';
import { useApp } from '../../context/AppContext';

interface MiniBuildSummaryProps {
  vehicle: Vehicle;
  components: ModificationComponent[];
  onRemoveComponent: (componentId: string) => void;
  onComposeBuild: () => void;
  onClearBuild: () => void;
}

export const MiniBuildSummary: React.FC<MiniBuildSummaryProps> = ({
  vehicle,
  components,
  onRemoveComponent,
  onComposeBuild,
  onClearBuild
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { buildState, selectedRegion, selectedCountry } = useApp();

  const totalHpGain = components.reduce((sum, c) => sum + (c.powerGainHp || 0), 0);
  const cost = buildState.costSummary;
  const regionLabel = selectedRegion ? `${selectedRegion.name} (${selectedRegion.code})` : 'Global Baseline';

  if (components.length === 0) {
    return (
      <div className="p-3.5 rounded-2xl neo-panel border border-white/10 bg-[#111317]/90 backdrop-blur-md flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg neo-inset flex items-center justify-center text-gray-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-gray-400 block">PHYSICAL BUILD • EMPTY</span>
            <span className="text-white font-sans font-bold">Select parts to begin your build plan</span>
          </div>
        </div>
        <span className="text-[11px] text-gray-500">0 Items Selected</span>
      </div>
    );
  }

  return (
    <div className="rounded-[22px] neo-panel border border-[#0070F3]/40 bg-[#12141A]/95 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300">
      
      {/* Top Collapsible Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0070F3] text-white flex items-center justify-center font-mono font-black text-xs shadow-md">
            {components.length}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-wider">
                ACTIVE PHYSICAL BUILD
              </span>
              {totalHpGain > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5" />
                  +{totalHpGain} HP
                </span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white font-sans line-clamp-1">
              {vehicle.make} {vehicle.model} • {components.length} {components.length === 1 ? 'Part' : 'Parts'}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block font-mono">
            <span className="text-[10px] text-gray-400 block uppercase">Est. Regional Total</span>
            <span className="text-sm font-black text-white">
              {cost.totalDisplay}
            </span>
          </div>

          <div className="w-7 h-7 rounded-lg neo-button flex items-center justify-center text-gray-400 hover:text-white">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expandable Part List & Actions */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-white/5 animate-in fade-in duration-200">
          {/* Selected Part Chips */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {buildState.components.map((part) => (
              <div 
                key={part.id}
                className="p-2 rounded-xl bg-[#0E1014] neo-inset border border-white/5 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0070F3]" />
                  <span className="text-white font-sans font-medium truncate">
                    {part.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono hidden md:inline">
                    ({part.category.toUpperCase()})
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-gray-300">
                    {part.estimatedTotalCost.display}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveComponent(part.componentId);
                    }}
                    className="w-5 h-5 rounded-md hover:bg-white/10 text-gray-400 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                    title="Remove component"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Investment Subtotal Breakdown */}
          <div className="p-3 rounded-xl bg-[#0E1014] neo-inset border border-white/5 space-y-1 text-xs font-mono">
            <div className="flex items-center justify-between text-gray-400">
              <span>Estimated Hardware Parts:</span>
              <span className="font-bold text-white">{cost.partsDisplay}</span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Estimated Labor ({cost.totalInstallHours} hrs):</span>
              <span className="font-bold text-[#0070F3]">{cost.laborDisplay}</span>
            </div>
            <div className="pt-1.5 mt-1 border-t border-white/10 flex items-center justify-between text-white font-bold">
              <span>Regional Estimate ({regionLabel}):</span>
              <span className="text-sm font-black text-[#10B981]">{cost.totalDisplay}</span>
            </div>
          </div>

          {/* Build Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onClearBuild}
              className="py-2 px-3 rounded-xl neo-button text-xs font-mono text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              Reset Build
            </button>

            <button
              onClick={onComposeBuild}
              className="py-2 px-3 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#0070F3]/30"
            >
              <span>Physical Build View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
