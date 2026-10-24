import React, { useState, useMemo } from 'react';
import { 
  X, 
  Check, 
  Plus, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Wrench, 
  Zap, 
  Scale, 
  ShieldCheck, 
  DollarSign, 
  Layers, 
  Compass, 
  SlidersHorizontal,
  Columns3,
  MapPin,
  Clock,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { ExtendedModificationComponent, ComponentCompatibilityResult } from '../../types/modification';
import { ExperienceMode, Vehicle } from '../../types';
import { useApp } from '../../context/AppContext';
import { PricingService } from '../../services/pricingService';
import { InstallationService } from '../../services/installationService';
import { CompatibilityService } from '../../services/compatibilityService';

interface ComponentDetailPanelProps {
  component: ExtendedModificationComponent | null;
  compatibility: ComponentCompatibilityResult | null;
  activeVehicle: Vehicle;
  isInBuild: boolean;
  isPreviewing: boolean;
  isComparing: boolean;
  experienceMode: ExperienceMode;
  onClose: () => void;
  onToggleBuild: (component: ExtendedModificationComponent) => void;
  onTogglePreview: (component: ExtendedModificationComponent) => void;
  onToggleCompare: (component: ExtendedModificationComponent) => void;
}

export const ComponentDetailPanel: React.FC<ComponentDetailPanelProps> = ({
  component,
  compatibility: initialCompatibility,
  activeVehicle,
  isInBuild,
  isPreviewing,
  isComparing,
  experienceMode: initialMode,
  onClose,
  onToggleBuild,
  onTogglePreview,
  onToggleCompare
}) => {
  const { selectedCountry, selectedRegion, experienceMode, navigateTo, askEngineerAboutComponent } = useApp();

  const [panelSection, setPanelSection] = useState<'overview' | 'fitment' | 'cost'>('overview');
  const [insightMode, setInsightMode] = useState<'beginner' | 'expert'>(
    experienceMode === 'beginner' ? 'beginner' : 'expert'
  );

  // Compute live regional price and installation for this component
  const regionalPartCost = useMemo(() => {
    if (!component) return null;
    return PricingService.calculateRegionalPartCost(component, selectedCountry, selectedRegion);
  }, [component, selectedCountry, selectedRegion]);

  const regionalInstallCost = useMemo(() => {
    if (!component) return null;
    return InstallationService.calculateRegionalInstallationCost(component, activeVehicle, selectedCountry, selectedRegion);
  }, [component, activeVehicle, selectedCountry, selectedRegion]);

  const totalMinCost = (regionalPartCost?.min || 0) + (regionalInstallCost?.min || 0);
  const totalMaxCost = (regionalPartCost?.max || 0) + (regionalInstallCost?.max || 0);
  const totalCostDisplay = regionalPartCost
    ? `${PricingService.formatCurrency(totalMinCost, regionalPartCost.currency, regionalPartCost.currencySymbol)} – ${PricingService.formatCurrency(totalMaxCost, regionalPartCost.currency, regionalPartCost.currencySymbol)}`
    : '';

  // Live evaluated compatibility
  const liveEval = useMemo(() => {
    if (!component) return null;
    return CompatibilityService.evaluate(component, activeVehicle, experienceMode);
  }, [component, activeVehicle, experienceMode]);

  if (!component) return null;

  const currentCurrency = regionalPartCost?.currency || 'USD';
  const currentSymbol = regionalPartCost?.currencySymbol || '$';
  const regionLabel = selectedRegion ? `${selectedRegion.name} (${selectedRegion.code})` : 'Global Baseline';

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] md:w-[560px] bg-[#111317]/98 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#14171E]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl neo-inset flex items-center justify-center text-[#0070F3]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
              COMPONENT SPECIFICATION
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {component.brand} • {component.subCategory}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleCompare(component)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
              isComparing 
                ? 'bg-[#0070F3] text-white' 
                : 'neo-button text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>{isComparing ? 'Comparing' : 'Compare'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl neo-button flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs: Overview, Check Fitment, View Cost */}
      <div className="grid grid-cols-3 p-1.5 bg-[#0D0F13] border-b border-white/10 text-xs font-mono">
        <button
          onClick={() => setPanelSection('overview')}
          className={`py-2 text-center rounded-lg transition-all font-bold cursor-pointer ${
            panelSection === 'overview'
              ? 'bg-[#181B22] text-white shadow-sm border border-white/10'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          OVERVIEW
        </button>
        <button
          onClick={() => setPanelSection('fitment')}
          className={`py-2 text-center rounded-lg transition-all font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
            panelSection === 'fitment'
              ? 'bg-[#181B22] text-[#0070F3] shadow-sm border border-[#0070F3]/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          CHECK FITMENT
        </button>
        <button
          onClick={() => setPanelSection('cost')}
          className={`py-2 text-center rounded-lg transition-all font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
            panelSection === 'cost'
              ? 'bg-[#181B22] text-[#10B981] shadow-sm border border-[#10B981]/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          VIEW COST
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="p-5 overflow-y-auto space-y-6 flex-1 text-gray-200">
        
        {/* SECTION 1: OVERVIEW */}
        {panelSection === 'overview' && (
          <>
            {/* Product Image */}
            <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-[#181B20] border border-white/10">
              <img 
                src={component.image} 
                alt={component.name}
                className="w-full h-full object-cover filter brightness-95 contrast-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-black/20" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-white">
                  {component.brand}
                </span>
                {component.visualAsset?.supported && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#0070F3]/30 backdrop-blur-md border border-[#0070F3]/60 text-[10px] font-mono text-[#38BDF8] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0070F3] animate-pulse" />
                    3D Interactive Asset
                  </span>
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-sans text-white leading-tight">
                {component.name}
              </h2>
              <p className="text-xs font-mono text-gray-400">
                Part No. {component.partNumber} • Category: {component.category.toUpperCase()}
              </p>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                {component.description}
              </p>
            </div>

            {/* Quick Regional Price Preview */}
            <div className="p-4 rounded-2xl neo-panel border border-white/10 bg-[#13161C] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase block">INDICATIVE TOTAL (PARTS + LABOR)</span>
                <span className="text-base font-black font-mono text-white">
                  {totalCostDisplay}
                </span>
                <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                  {regionLabel} • {currentCurrency}
                </span>
              </div>
              <button
                onClick={() => setPanelSection('cost')}
                className="px-3 py-1.5 rounded-xl neo-button text-xs font-mono text-[#0070F3] hover:text-white border border-[#0070F3]/40 cursor-pointer"
              >
                Cost Breakdown →
              </button>
            </div>

            {/* Engineering Insights Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#0070F3]" />
                  ENGINEERING PERSPECTIVE
                </span>
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0F1115] neo-inset border border-white/5">
                  <button
                    onClick={() => setInsightMode('beginner')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      insightMode === 'beginner' 
                        ? 'bg-[#0070F3] text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Beginner
                  </button>
                  <button
                    onClick={() => setInsightMode('expert')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      insightMode === 'expert' 
                        ? 'bg-[#0070F3] text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Enthusiast
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl neo-panel border border-white/5 bg-[#13161C] text-xs font-sans leading-relaxed text-gray-300">
                {insightMode === 'beginner' ? (
                  <div className="space-y-2">
                    <p>{component.beginnerExplanation}</p>
                    {component.whyUsersInstall && (
                      <div className="pt-2 border-t border-white/5">
                        <strong className="text-white block font-mono text-[11px] mb-0.5">Why Users Install:</strong>
                        <p className="text-gray-400">{component.whyUsersInstall}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>{component.expertExplanation}</p>
                    {component.tradeoffs && (
                      <div className="pt-2 border-t border-white/5">
                        <strong className="text-[#F59E0B] block font-mono text-[11px] mb-0.5">Potential Tradeoffs:</strong>
                        <p className="text-gray-400">{component.tradeoffs}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* SECTION 2: CHECK FITMENT */}
        {panelSection === 'fitment' && liveEval && (
          <div className="space-y-5">
            {/* Target Vehicle Header */}
            <div className="p-4 rounded-2xl neo-panel border border-white/10 bg-[#13161C] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">TARGET VEHICLE PLATFORM</span>
                  <h3 className="text-sm font-black font-mono text-white">
                    {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                  </h3>
                  <span className="text-[11px] font-mono text-gray-400">
                    Engine: {activeVehicle.engine} • Chassis: {activeVehicle.chassisCode || 'OEM'}
                  </span>
                </div>

                {liveEval.status === 'compatible' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    <CheckCircle2 className="w-4 h-4" />
                    COMPATIBLE
                  </span>
                )}
                {liveEval.status === 'conditionally_compatible' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                    <AlertTriangle className="w-4 h-4" />
                    CONDITIONALLY COMPATIBLE
                  </span>
                )}
                {liveEval.status === 'not_compatible' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                    <XCircle className="w-4 h-4" />
                    NOT COMPATIBLE
                  </span>
                )}
                {liveEval.status === 'verification_required' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                    <Info className="w-4 h-4" />
                    VERIFICATION REQUIRED
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F1115] neo-inset border border-white/5 space-y-1">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block">WHY IT FITS:</span>
                <p className="text-xs text-gray-200 font-sans leading-relaxed">
                  {experienceMode === 'beginner' ? liveEval.beginnerExplanation : liveEval.expertExplanation}
                </p>
              </div>
            </div>

            {/* Fitment Specifications */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0070F3]" />
                PHYSICAL FITMENT PARAMETERS
              </span>

              <div className="rounded-xl neo-inset bg-[#0F1115] border border-white/5 overflow-hidden text-xs font-mono divide-y divide-white/5">
                {liveEval.fitmentDetails.boltPattern && (
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-gray-400">Bolt Pattern (PCD)</span>
                    <span className="font-bold text-white">{liveEval.fitmentDetails.boltPattern}</span>
                  </div>
                )}
                {liveEval.fitmentDetails.wheelDiameterInches && (
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-gray-400">Wheel Diameter Fitment</span>
                    <span className="font-bold text-white">{liveEval.fitmentDetails.wheelDiameterInches} inches</span>
                  </div>
                )}
                {liveEval.fitmentDetails.brakeClearanceMm && (
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-gray-400">Rotor / Caliper Clearance</span>
                    <span className="font-bold text-white">&gt;= {liveEval.fitmentDetails.brakeClearanceMm} mm</span>
                  </div>
                )}
                <div className="p-3 flex items-center justify-between">
                  <span className="text-gray-400">Mounting Anchorage</span>
                  <span className="font-bold text-white">{liveEval.fitmentDetails.mountingPointType}</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-gray-400">Chassis Code Matched</span>
                  <span className="font-bold text-white">{liveEval.fitmentDetails.bodyGeneration}</span>
                </div>
              </div>
            </div>

            {/* Verification Requirements Checklist */}
            {liveEval.verificationRequirements && liveEval.verificationRequirements.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#F59E0B]">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">
                    VERIFICATION REQUIRED BEFORE PURCHASE
                  </span>
                </div>
                <div className="space-y-2">
                  {liveEval.verificationRequirements.map(req => (
                    <div key={req.id} className="p-3 rounded-xl bg-[#0D0F13]/90 border border-white/5 text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{req.title}</span>
                        {req.isSafetyCritical && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-400 border border-red-500/30">
                            Safety Critical
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-[11px] font-sans">{req.description}</p>
                      <div className="text-[#0070F3] text-[10px] font-mono pt-1">
                        → Action: {req.actionRequired}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: VIEW REGIONAL COST */}
        {panelSection === 'cost' && regionalPartCost && regionalInstallCost && (
          <div className="space-y-5">
            {/* Region Banner */}
            <div className="p-4 rounded-2xl neo-panel border border-white/10 bg-[#13161C] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl neo-inset flex items-center justify-center text-[#10B981]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">SELECTED REGIONAL PRICING</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {regionLabel} • {currentCurrency}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-gray-300 border border-white/10">
                {regionalPartCost.confidence}
              </span>
            </div>

            {/* Cost Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Hardware Cost Card */}
              <div className="p-4 rounded-2xl neo-inset bg-[#0F1115] border border-white/5 space-y-1.5">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">ESTIMATED PART HARDWARE</span>
                <span className="text-base font-black font-mono text-white block">
                  {regionalPartCost.display}
                </span>
                <p className="text-[10px] font-mono text-gray-500">
                  Includes regional logistics & duties
                </p>
              </div>

              {/* Installation Cost Card */}
              <div className="p-4 rounded-2xl neo-inset bg-[#0F1115] border border-white/5 space-y-1.5">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">INSTALLATION LABOR</span>
                <span className="text-base font-black font-mono text-[#0070F3] block">
                  {regionalInstallCost.display}
                </span>
                <p className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  ~{regionalInstallCost.hours} hours estimated
                </p>
              </div>
            </div>

            {/* Total Range Banner */}
            <div className="p-4 rounded-2xl neo-panel border border-[#10B981]/30 bg-[#10B981]/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase block">ESTIMATED TOTAL INVESTMENT</span>
                <span className="text-lg font-black font-mono text-white">
                  {totalCostDisplay}
                </span>
              </div>
              <span className="px-2 py-1 rounded-lg text-[10px] font-mono bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                Part + Labor
              </span>
            </div>

            {/* Installation Details */}
            <div className="p-3.5 rounded-xl neo-panel border border-white/5 bg-[#13161C] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Workshop Difficulty Tier</span>
                <span className="font-bold text-white">{regionalInstallCost.difficultyLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Hourly Labor Benchmark</span>
                <span className="font-bold text-white">
                  {PricingService.formatCurrency(regionalInstallCost.laborRateHourly, currentCurrency, currentSymbol)} / hr
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] font-sans text-gray-400 italic">
              * Prices are indicative estimates and may vary by supplier, shipping transit, and workshop specialization.
            </p>
          </div>
        )}

      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 sm:p-5 border-t border-white/10 bg-[#14171E] space-y-2.5">
        <button
          onClick={() => {
            if (component) {
              askEngineerAboutComponent(component.id);
            }
          }}
          className="w-full py-2.5 px-3 rounded-xl neo-button text-xs font-mono text-gray-200 hover:text-white border border-[#0070F3]/40 bg-[#0070F3]/10 hover:bg-[#0070F3]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Bot className="w-4 h-4 text-[#0070F3]" />
          <span>Ask Chief Engineer About This Part</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Preview in 3D Button */}
          <button
            onClick={() => onTogglePreview(component)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isPreviewing
                ? 'bg-[#38BDF8]/25 text-[#38BDF8] border border-[#38BDF8]/60 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                : 'neo-button text-gray-200 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            {isPreviewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#38BDF8]" />}
            <span>{isPreviewing ? 'Dismiss 3D' : 'Preview in 3D'}</span>
          </button>

          {/* Add to Physical Build Button */}
          <button
            onClick={() => onToggleBuild(component)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isInBuild
                ? 'bg-[#10B981] text-black font-black border border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-[#0070F3] hover:bg-[#0060df] text-white border border-[#0070F3]/80'
            }`}
          >
            {isInBuild ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>In Build (Remove)</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Physical Build</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
