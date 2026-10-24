import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { BuildComponent } from '../../types/build';
import { extractBuildInstallationRequirements } from '../../lib/workshops/workshopMatchingService';
import {
  Wrench,
  Car,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface InstallationRequestSummaryProps {
  vehicle: Vehicle;
  buildComponents: BuildComponent[];
  onFilterByBuild: () => void;
  onNavigateToBuild: () => void;
  isBuildFiltered: boolean;
}

export const InstallationRequestSummary: React.FC<InstallationRequestSummaryProps> = ({
  vehicle,
  buildComponents,
  onFilterByBuild,
  onNavigateToBuild,
  isBuildFiltered
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If no build components
  if (buildComponents.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-[#FAFAF7] border border-[#292927]/15 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/10 text-[#28483D] shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-[#171717] font-sans">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#4A4843] bg-[#E8E2D8] border border-[#292927]/12">
                STOCK OEM
              </span>
            </div>
            <p className="text-xs text-[#4A4843] font-sans font-medium mt-0.5 max-w-xl">
              Add modifications in your physical build plan to automatically match specialized suspension, dyno tuning, or brake installation workshops.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToBuild}
          className="px-4 py-2 rounded-xl bg-[#28483D] hover:bg-[#1E362E] text-[#FAFAF7] border border-[#28483D] text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <span>BUILD YOUR CAR</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const reqs = extractBuildInstallationRequirements(vehicle, buildComponents);

  return (
    <div className="p-5 rounded-2xl bg-[#FAFAF7] border border-[#292927]/15 shadow-sm space-y-4">
      {/* Top Banner: Vehicle & Highlights */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/10 text-[#28483D] shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-extrabold text-[#28483D] uppercase tracking-wider">
                ACTIVE INSTALLATION SPECIFICATION
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#292927]/30"></span>
              <span className="text-xs font-black text-[#171717] font-sans">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8E2D8] text-[#171717] border border-[#292927]/15">
                {reqs.componentCount} {reqs.componentCount === 1 ? 'MODIFICATION' : 'MODIFICATIONS'}
              </span>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  reqs.complexityLevel === 'HIGH'
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : reqs.complexityLevel === 'MODERATE'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-[#28483D]/10 text-[#28483D] border-[#28483D]/30'
                }`}
              >
                COMPLEXITY: {reqs.complexityLevel}
              </span>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#4A4843] bg-[#E8E2D8] border border-[#292927]/12">
                {reqs.verificationCount} VERIFICATION CHECKS
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Filter by Build */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={onFilterByBuild}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              isBuildFiltered
                ? 'bg-[#10B981] text-[#171717]'
                : 'bg-[#28483D] hover:bg-[#1E362E] text-[#FAFAF7]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBuildFiltered ? 'SHOWING MATCHING WORKSHOPS' : 'SHOW MATCHING WORKSHOPS'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-[#E8E2D8] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/15 transition-colors cursor-pointer shrink-0"
            title={isExpanded ? 'Collapse Details' : 'Expand Details'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Required Services Summary Pill Row */}
      <div className="flex items-center gap-2 flex-wrap pt-1 text-xs font-mono text-[#171717]">
        <span className="text-[10px] text-[#4A4843] uppercase tracking-wider font-bold">Required Services:</span>
        {reqs.requiredServices.map((service, i) => (
          <span
            key={i}
            className="px-2.5 py-0.5 rounded-lg bg-[#E8E2D8] border border-[#292927]/12 text-[11px] font-semibold text-[#171717]"
          >
            {service}
          </span>
        ))}
      </div>

      {/* Collapsible Deep Verification & Component Breakdown */}
      {isExpanded && (
        <div className="pt-4 border-t border-[#292927]/12 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
          {/* Component Requirements */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#4A4843] tracking-wider font-bold">
              PARTS REQUIRING PROFESSIONAL INSTALLATION:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
              {reqs.requirements.map(req => (
                <div
                  key={req.componentId}
                  className="p-2.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/12 flex items-center justify-between gap-2 text-xs font-mono"
                >
                  <div className="truncate">
                    <span className="font-black text-[#171717] truncate block">{req.componentName}</span>
                    <span className="text-[10px] text-[#4A4843] font-medium">
                      Requires: {req.requiredServices.join(', ')}
                    </span>
                  </div>
                  {req.isSafetyCritical && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-100 text-red-800 border border-red-300 shrink-0">
                      SAFETY CRITICAL
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Verification Requirements */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#4A4843] tracking-wider font-bold">
              INSTALLATION VERIFICATION ITEMS:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
              {reqs.verificationItems.map((item, i) => (
                <div
                  key={i}
                  className="p-2 rounded-xl bg-[#E8E2D8] border border-[#292927]/12 flex items-center gap-2 text-xs font-mono font-semibold text-[#171717]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#28483D] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
