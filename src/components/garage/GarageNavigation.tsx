import React from 'react';
import {
  Layers,
  Disc,
  ShieldAlert,
  Sliders,
  Cpu,
  DoorClosed,
  ChevronRight,
  Sparkles,
  Camera,
  CheckCircle2,
  Eye,
  Plus,
  Check
} from 'lucide-react';
import {
  ModificationCategoryNavId,
  CameraTargetId
} from '../../lib/3d/camera';
import { MODIFICATION_COMPONENTS } from '../../data/modificationComponents';
import { ExtendedModificationComponent } from '../../types/modification';
import { Vehicle } from '../../types';

export interface CategoryNavConfig {
  id: ModificationCategoryNavId;
  label: string;
  tagline: string;
  cameraTarget: CameraTargetId;
  icon: React.ReactNode;
  categoryKeys: string[];
}

export const MODIFICATION_CATEGORIES: CategoryNavConfig[] = [
  {
    id: 'exterior',
    label: 'Exterior & Aero',
    tagline: 'High-downforce splitters, ducktails, GT wings & diffusers',
    cameraTarget: 'hero',
    icon: <Layers className="w-4 h-4" />,
    categoryKeys: ['aerodynamics', 'exterior']
  },
  {
    id: 'wheels',
    label: 'Wheels & Fitment',
    tagline: 'Forged monoblocks, custom offsets, track widths & rim finishes',
    cameraTarget: 'wheel',
    icon: <Disc className="w-4 h-4" />,
    categoryKeys: ['wheels']
  },
  {
    id: 'brakes',
    label: 'Brakes & Rotors',
    tagline: 'Carbon ceramic discs, multi-piston calipers & braided lines',
    cameraTarget: 'brake',
    icon: <ShieldAlert className="w-4 h-4" />,
    categoryKeys: ['brakes']
  },
  {
    id: 'suspension',
    label: 'Suspension & Stance',
    tagline: 'Inverted track coilovers, ride height drop & camber geometry',
    cameraTarget: 'suspension',
    icon: <Sliders className="w-4 h-4" />,
    categoryKeys: ['suspension']
  },
  {
    id: 'performance',
    label: 'Powertrain & Exhaust',
    tagline: 'Twin-turbo upgrades, titanium exhaust & cold-air induction',
    cameraTarget: 'engine',
    icon: <Cpu className="w-4 h-4" />,
    categoryKeys: ['engine', 'exhaust', 'performance', 'cooling']
  },
  {
    id: 'interior',
    label: 'Cockpit & Cabin',
    tagline: 'Carbon bucket seats, Alcantara wheel & telemetry clusters',
    cameraTarget: 'interior',
    icon: <DoorClosed className="w-4 h-4" />,
    categoryKeys: ['interior']
  }
];

interface GarageNavigationProps {
  activeCategory: ModificationCategoryNavId;
  activeVehicle?: Vehicle;
  onSelectCategory: (category: ModificationCategoryNavId, targetCamera: CameraTargetId) => void;
  onQuickPreview?: (comp: ExtendedModificationComponent) => void;
  onQuickAdd?: (comp: ExtendedModificationComponent) => void;
  buildComponentIds?: string[];
  previewedComponentId?: string | null;
  className?: string;
}

/**
 * Modification Category Navigation Component
 * Provides responsive category switching and live component counts for Phase 5.
 */
export const GarageNavigation: React.FC<GarageNavigationProps> = ({
  activeCategory,
  activeVehicle,
  onSelectCategory,
  onQuickPreview,
  onQuickAdd,
  buildComponentIds = [],
  previewedComponentId = null,
  className = ''
}) => {
  const currentCategoryConfig = MODIFICATION_CATEGORIES.find((c) => c.id === activeCategory) || MODIFICATION_CATEGORIES[0];

  const handleCategoryClick = (cat: CategoryNavConfig) => {
    onSelectCategory(cat.id, cat.cameraTarget);
  };

  // Get components for current category
  const categoryComponents = MODIFICATION_COMPONENTS.filter((c) =>
    currentCategoryConfig.categoryKeys.includes(c.category)
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category Selection Tabs Card */}
      <div className="p-3.5 rounded-[22px] neo-panel border border-white/10 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between px-1.5 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0070F3]" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              PARTS CATALOG
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            LIVE FITMENT
          </span>
        </div>

        {/* Category List */}
        <div className="space-y-1.5">
          {MODIFICATION_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = MODIFICATION_COMPONENTS.filter((c) =>
              cat.categoryKeys.includes(c.category)
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`
                  w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer select-none group
                  ${
                    isActive
                      ? 'neo-inset bg-[#111317] border border-[#0070F3]/60 shadow-[inset_0_0_12px_rgba(0,112,243,0.25)]'
                      : 'neo-button text-gray-400 hover:text-white hover:border-white/15'
                  }
                `}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#0070F3] text-white shadow-[0_0_8px_rgba(0,112,243,0.8)]'
                        : 'bg-[#181B20] text-gray-400 group-hover:text-white'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <div className="truncate">
                    <span
                      className={`text-xs font-bold block leading-tight ${
                        isActive ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {cat.label}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 block leading-tight">
                      {count} Parts • {cat.cameraTarget.toUpperCase()} View
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#0070F3]/20 text-[#38BDF8]' : 'bg-white/5 text-gray-500'
                  }`}>
                    {count}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-[#0070F3] translate-x-0.5' : 'text-gray-600 group-hover:text-gray-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Category Featured Highlights */}
      <div className="p-4 rounded-[22px] neo-panel border border-white/10 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/10">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#0070F3] font-bold">
              <Camera className="w-3 h-3" />
              <span className="uppercase">{currentCategoryConfig.label}</span>
            </div>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              {currentCategoryConfig.tagline}
            </p>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20 shrink-0">
            {categoryComponents.length} AVAILABLE
          </span>
        </div>

        {/* Quick Highlights List */}
        <div className="space-y-2">
          {categoryComponents.slice(0, 3).map((comp) => {
            const isInBuild = buildComponentIds.includes(comp.id);
            const isPreviewing = previewedComponentId === comp.id;

            return (
              <div
                key={comp.id}
                className={`p-2 rounded-xl border text-xs font-mono transition-all ${
                  isInBuild 
                    ? 'border-[#0070F3]/50 bg-[#131720]' 
                    : isPreviewing
                      ? 'border-[#38BDF8]/50 bg-[#111622]'
                      : 'border-white/5 bg-[#121418] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <img 
                      src={comp.image} 
                      alt={comp.name} 
                      className="w-8 h-8 rounded-lg object-cover bg-black/40 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <span className="text-[11px] font-sans font-bold text-white block truncate">
                        {comp.name}
                      </span>
                      <span className="text-[10px] text-gray-400 block font-mono">
                        {comp.estimatedPrice.displayUSD}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {onQuickPreview && (
                      <button
                        onClick={() => onQuickPreview(comp)}
                        title="Quick 3D Preview"
                        className={`p-1.5 rounded-lg text-[10px] transition-colors cursor-pointer ${
                          isPreviewing 
                            ? 'bg-[#38BDF8] text-black font-bold' 
                            : 'neo-button text-gray-400 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    )}
                    {onQuickAdd && (
                      <button
                        onClick={() => onQuickAdd(comp)}
                        title="Add to build"
                        className={`p-1.5 rounded-lg text-[10px] transition-colors cursor-pointer ${
                          isInBuild 
                            ? 'bg-[#10B981] text-black font-bold' 
                            : 'bg-[#0070F3] text-white hover:bg-[#0060df]'
                        }`}
                      >
                        {isInBuild ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
