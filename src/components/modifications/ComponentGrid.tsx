import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Columns3, 
  X, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { ExtendedModificationComponent } from '../../types/modification';
import { evaluateComponentCompatibility } from '../../lib/modifications/compatibility';
import { ComponentCard } from './ComponentCard';
import { Vehicle, ExperienceMode } from '../../types';
import { ModificationCategoryNavId } from '../../lib/3d/camera';

interface ComponentGridProps {
  components: ExtendedModificationComponent[];
  activeVehicle: Vehicle;
  activeCategory: ModificationCategoryNavId;
  buildComponentIds: string[];
  previewedComponentId: string | null;
  comparingComponentIds: string[];
  experienceMode: ExperienceMode;
  onToggleBuild: (component: ExtendedModificationComponent) => void;
  onTogglePreview: (component: ExtendedModificationComponent) => void;
  onOpenDetails: (component: ExtendedModificationComponent) => void;
  onToggleCompare: (component: ExtendedModificationComponent) => void;
  onOpenCompareModal: () => void;
  onClearCompare: () => void;
}

export const ComponentGrid: React.FC<ComponentGridProps> = ({
  components,
  activeVehicle,
  activeCategory,
  buildComponentIds,
  previewedComponentId,
  comparingComponentIds,
  experienceMode,
  onToggleBuild,
  onTogglePreview,
  onOpenDetails,
  onToggleCompare,
  onOpenCompareModal,
  onClearCompare
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [onlyCompatible, setOnlyCompatible] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'power_gain'>('recommended');

  // Derive unique subcategories for active components
  const availableSubCategories = useMemo(() => {
    const set = new Set<string>();
    components.forEach((c) => {
      if (c.subCategory) set.add(c.subCategory);
    });
    return Array.from(set);
  }, [components]);

  // Filtered & Sorted Components
  const filteredComponents = useMemo(() => {
    return components
      .filter((comp) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = comp.name.toLowerCase().includes(q);
          const matchBrand = comp.brand.toLowerCase().includes(q);
          const matchSub = comp.subCategory.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchSub) return false;
        }

        // Subcategory filter
        if (selectedSubCategory !== 'all' && comp.subCategory !== selectedSubCategory) {
          return false;
        }

        // Compatibility filter
        if (onlyCompatible) {
          const compat = evaluateComponentCompatibility(comp, activeVehicle);
          if (compat.status !== 'compatible') return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') {
          return a.priceUSD - b.priceUSD;
        }
        if (sortBy === 'price_high') {
          return b.priceUSD - a.priceUSD;
        }
        if (sortBy === 'power_gain') {
          return (b.powerGainHp || 0) - (a.powerGainHp || 0);
        }
        // Recommended default: featured first, then compatible first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [components, searchQuery, selectedSubCategory, onlyCompatible, sortBy, activeVehicle]);

  return (
    <div className="space-y-4">
      
      {/* Search, Subcategory Pills, Filter & Sort Controls */}
      <div className="p-3.5 sm:p-4 rounded-[22px] neo-panel border border-white/10 bg-[#12141A] space-y-3">
        
        {/* Top Search & Compatibility Toggle Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by part name, brand, or spec..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#0F1115] neo-inset border border-white/5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#0070F3]/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Compatibility Toggle Pill */}
          <button
            onClick={() => setOnlyCompatible(!onlyCompatible)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              onlyCompatible
                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'neo-button text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Fit Only</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-[#0F1115] neo-inset px-2.5 py-1 rounded-xl border border-white/5">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-mono text-gray-300 focus:outline-none cursor-pointer py-1"
            >
              <option value="recommended" className="bg-[#12141A] text-white">Recommended</option>
              <option value="price_low" className="bg-[#12141A] text-white">Price: Low to High</option>
              <option value="price_high" className="bg-[#12141A] text-white">Price: High to Low</option>
              <option value="power_gain" className="bg-[#12141A] text-white">Max Power Gain</option>
            </select>
          </div>
        </div>

        {/* Subcategory Pills Bar */}
        {availableSubCategories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all shrink-0 cursor-pointer ${
                selectedSubCategory === 'all'
                  ? 'bg-[#0070F3] text-white shadow-md shadow-[#0070F3]/30'
                  : 'neo-button text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              All {activeCategory.toUpperCase()}
            </button>
            {availableSubCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                  selectedSubCategory === sub
                    ? 'bg-[#0070F3] text-white font-bold shadow-md shadow-[#0070F3]/30'
                    : 'neo-button text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Grid of Component Cards */}
      {filteredComponents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {filteredComponents.map((comp) => {
            const compatibility = evaluateComponentCompatibility(comp, activeVehicle);
            const isInBuild = buildComponentIds.includes(comp.id);
            const isPreviewing = previewedComponentId === comp.id;
            const isComparing = comparingComponentIds.includes(comp.id);

            return (
              <ComponentCard
                key={comp.id}
                component={comp}
                compatibility={compatibility}
                isInBuild={isInBuild}
                isPreviewing={isPreviewing}
                isComparing={isComparing}
                experienceMode={experienceMode}
                onToggleBuild={onToggleBuild}
                onTogglePreview={onTogglePreview}
                onOpenDetails={onOpenDetails}
                onToggleCompare={onToggleCompare}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 rounded-[24px] neo-panel border border-white/10 bg-[#12141A] text-center space-y-3">
          <div className="w-10 h-10 rounded-full neo-inset flex items-center justify-center text-gray-400 mx-auto">
            <Filter className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-sans">
            No components matched your filter
          </h4>
          <p className="text-xs font-mono text-gray-400 max-w-sm mx-auto">
            Try clearing the search query or switching from "Verified Fit Only" to browse full specifications.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubCategory('all');
              setOnlyCompatible(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#0070F3] text-white text-xs font-mono font-bold hover:bg-[#0060df] transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Floating Sticky Comparison Bar (When 1-3 items selected) */}
      {comparingComponentIds.length > 0 && (
        <div className="sticky bottom-4 z-40 p-3 rounded-2xl neo-panel border border-[#0070F3]/60 bg-[#111317]/95 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0070F3] text-white flex items-center justify-center font-mono font-bold text-xs">
              {comparingComponentIds.length}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-wider block">
                COMPARE TRAY
              </span>
              <span className="text-xs font-sans font-bold text-white">
                {comparingComponentIds.length} of 3 selected for side-by-side review
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearCompare}
              className="px-2.5 py-1.5 rounded-xl neo-button text-[11px] font-mono text-gray-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={onOpenCompareModal}
              className="px-3.5 py-1.5 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#0070F3]/30"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Compare Now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
