import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExtendedVehicle } from '../../data/vehicles';
import { ExtendedModificationComponent } from '../../types/modification';
import { CameraTargetId, CAMERA_PRESETS, ModificationCategoryNavId } from '../../lib/3d/camera';
import {
  Wrench,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  Check,
  X,
  Zap,
  Info,
  ChevronRight,
  Car
} from 'lucide-react';

export interface GarageHUDProps {
  vehicle: ExtendedVehicle;
  activeCategory: ModificationCategoryNavId;
  onSelectCategory: (category: ModificationCategoryNavId) => void;
  activePreset: CameraTargetId;
  onSelectPreset: (preset: CameraTargetId) => void;
  previewComponent: ExtendedModificationComponent | null;
  selectedBuildComponents: ExtendedModificationComponent[];
  onAddBuildComponent: (component: ExtendedModificationComponent) => void;
  onRemoveBuildComponent: (componentId: string) => void;
  onClearPreview: () => void;
  regionName: string;
  currencySymbol: string;
  totalBuildCostRange: string;
  buildHealthStatus: string;
  onNavigateToBuild: () => void;
  onNavigateBack: () => void;
}

export const GarageHUD: React.FC<GarageHUDProps> = ({
  vehicle,
  activeCategory,
  onSelectCategory,
  activePreset,
  onSelectPreset,
  previewComponent,
  selectedBuildComponents,
  onAddBuildComponent,
  onRemoveBuildComponent,
  onClearPreview,
  regionName,
  currencySymbol,
  totalBuildCostRange,
  buildHealthStatus,
  onNavigateToBuild,
  onNavigateBack
}) => {
  const isAlreadyInBuild = previewComponent
    ? selectedBuildComponents.some(c => c.id === previewComponent.id)
    : false;

  // Derive Visualization Level for component
  const getVisualizationLevelInfo = (comp: ExtendedModificationComponent) => {
    if (['wheels', 'spoilers', 'brakes', 'exhaust', 'bodykits'].includes(comp.category)) {
      return { level: 'LEVEL 1', label: 'FULL 3D ATTACHMENT', color: '#28483D' };
    }
    if (['paint', 'wraps', 'tint', 'interior_trim'].includes(comp.category)) {
      return { level: 'LEVEL 2', label: 'SURFACE & MATERIAL', color: '#B47A52' };
    }
    return { level: 'LEVEL 3', label: 'DATA-DRIVEN TUNING', color: '#121212' };
  };

  const categories: { id: ModificationCategoryNavId; label: string; icon: React.ReactNode }[] = [
    { id: 'exterior', label: 'EXTERIOR', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'wheels', label: 'WHEELS', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'brakes', label: 'BRAKES', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'suspension', label: 'SUSPENSION', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'performance', label: 'PERFORMANCE', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'interior', label: 'INTERIOR', icon: <Eye className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      
      {/* ================= TOP HUD STRIP ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-auto">
        
        {/* Left: Vehicle Info Badge & Back */}
        <div className="flex items-center gap-3 bg-[#FAFAF7]/95 backdrop-blur-md p-2.5 px-4 rounded-2xl border border-[#292927]/12 shadow-md">
          <button
            onClick={onNavigateBack}
            className="p-1.5 rounded-xl hover:bg-[#E8E2D8] text-[#171717] transition-colors cursor-pointer"
            title="Return to vehicle selection"
          >
            <Car className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-[#292927]/15" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black font-sans text-[#171717] uppercase tracking-tight">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </span>
              <span className="px-2 py-0.2 rounded-md bg-[#28483D]/10 text-[#28483D] text-[10px] font-mono font-bold">
                {vehicle.chassisCode || 'OEM'}
              </span>
            </div>
            <p className="text-[10px] font-mono font-semibold text-[#383835]">
              {vehicle.engine} • {vehicle.drivetrain} • {regionName}
            </p>
          </div>
        </div>

        {/* Center: Camera Target Presets Bar */}
        <div className="hidden lg:flex items-center gap-1.5 p-1.5 bg-[#FAFAF7]/95 backdrop-blur-md rounded-2xl border border-[#292927]/12 shadow-md overflow-x-auto scrollbar-none">
          {(Object.keys(CAMERA_PRESETS) as CameraTargetId[]).map((pId) => {
            const preset = CAMERA_PRESETS[pId];
            const isSel = activePreset === pId;

            return (
              <button
                key={pId}
                onClick={() => onSelectPreset(pId)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer shrink-0 ${
                  isSel
                    ? 'bg-[#171717] text-[#FAFAF7] shadow-sm'
                    : 'text-[#383835] hover:bg-[#E8E2D8] hover:text-[#171717]'
                }`}
              >
                {preset.label.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Right: Quick Physical Build Status */}
        <div className="hidden sm:flex items-center gap-3 bg-[#FAFAF7]/95 backdrop-blur-md p-2.5 px-4 rounded-2xl border border-[#292927]/12 shadow-md">
          <div className="text-right">
            <span className="text-[10px] font-mono font-bold text-[#383835] uppercase block">
              PHYSICAL BUILD
            </span>
            <span className="text-xs font-extrabold text-[#171717]">
              {selectedBuildComponents.length} {selectedBuildComponents.length === 1 ? 'Component' : 'Components'}
            </span>
          </div>
          <button
            onClick={onNavigateToBuild}
            className="px-3 py-2 rounded-xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] text-xs font-bold font-sans tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>VIEW</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ================= MIDDLE SECTION: LEFT CATEGORIES ================= */}
      <div className="my-auto py-4 flex items-center justify-between pointer-events-none">
        
        {/* Left Side Category Navigation */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {categories.map((cat) => {
            const isSel = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-3 sm:px-4 rounded-2xl border font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 shadow-md ${
                  isSel
                    ? 'bg-[#171717] text-[#FAFAF7] border-[#171717] scale-105'
                    : 'bg-[#FAFAF7]/90 text-[#383835] border-[#292927]/12 hover:bg-[#FAFAF7] hover:text-[#171717]'
                }`}
              >
                {cat.icon}
                <span className="hidden sm:inline-block">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Persistent Physical Build Card (Desktop Right Side) */}
        <div className="hidden xl:block w-72 bg-[#FAFAF7]/95 backdrop-blur-md p-5 rounded-3xl border border-[#292927]/15 shadow-xl space-y-4 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-[#292927]/10 pb-3">
            <span className="text-xs font-mono font-bold text-[#171717] uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#28483D]" />
              PHYSICAL BUILD
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#28483D] text-[#FAFAF7]">
              {selectedBuildComponents.length} MODS
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-mono font-bold text-[#383835] uppercase">ESTIMATED TOTAL INVESTMENT</p>
            <p className="text-base font-mono font-black text-[#171717]">
              {totalBuildCostRange}
            </p>
            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <span className="text-[#383835]">BUILD HEALTH:</span>
              <span className="font-bold text-[#28483D]">{buildHealthStatus}</span>
            </div>
          </div>

          <button
            onClick={onNavigateToBuild}
            className="w-full py-3 rounded-2xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] font-bold text-xs font-sans tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>REVIEW BUILD PLAN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ================= BOTTOM INSPECTION DRAWER ================= */}
      <AnimatePresence>
        {previewComponent && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto bg-[#FAFAF7] text-[#171717] p-5 sm:p-6 rounded-3xl border border-[#292927]/18 shadow-2xl space-y-4 pointer-events-auto"
          >
            {/* Header: Component Title + Visualization Level */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#292927]/10 pb-3">
              <div className="flex items-center gap-3">
                {/* Visualization Level Tag */}
                {(() => {
                  const info = getVisualizationLevelInfo(previewComponent);
                  return (
                    <span
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-[#FAFAF7] uppercase tracking-wider"
                      style={{ backgroundColor: info.color }}
                    >
                      {info.level} • {info.label}
                    </span>
                  );
                })()}

                <h3 className="text-xl sm:text-2xl font-black font-sans text-[#171717] tracking-tight uppercase">
                  {previewComponent.brand} {previewComponent.name}
                </h3>
              </div>

              <button
                onClick={onClearPreview}
                className="self-end sm:self-auto p-1.5 rounded-xl hover:bg-[#E8E2D8] text-[#383835] transition-colors cursor-pointer"
                title="Dismiss preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Middle Grid: Fitment, Costs & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Left Details */}
              <div className="md:col-span-7 space-y-2">
                <p className="text-xs text-[#292927] font-sans leading-relaxed line-clamp-2">
                  {previewComponent.description}
                </p>

                {/* Compatibility & Specs */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-1">
                  <div className="flex items-center gap-1.5 text-[#28483D] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>FITMENT VERIFIED</span>
                  </div>
                  <span className="text-[#292927]">•</span>
                  <span className="text-[#383835]">
                    Est. Labor: {previewComponent.installationEstimate?.hours || 2.5} Pro Hours
                  </span>
                </div>
              </div>

              {/* Right Action & Cost */}
              <div className="md:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#292927]/10">
                
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] font-mono font-bold text-[#383835] uppercase block">
                    EST. PART COST
                  </span>
                  <span className="text-base font-mono font-extrabold text-[#171717]">
                    {previewComponent.estimatedPrice?.displayUSD || `${currencySymbol}${previewComponent.priceUSD?.toLocaleString() || '450'}`}
                  </span>
                </div>

                {/* Add to Physical Build Button */}
                {isAlreadyInBuild ? (
                  <button
                    onClick={() => onRemoveBuildComponent(previewComponent.id)}
                    className="px-5 py-3 rounded-2xl bg-[#B8644A] hover:bg-red-700 text-[#FAFAF7] font-bold text-xs font-sans tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
                  >
                    <X className="w-4 h-4" />
                    <span>REMOVE FROM BUILD</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onAddBuildComponent(previewComponent)}
                    className="px-5 py-3 rounded-2xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] font-bold text-xs font-sans tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-[#B47A52]" />
                    <span>ADD TO PHYSICAL BUILD</span>
                  </button>
                )}

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
