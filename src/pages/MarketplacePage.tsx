import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoButton } from '../components/ui/NeoButton';
import { MarketplaceService, MarketplaceCategory, MarketplaceItem } from '../lib/marketplace/marketplaceService';
import { MarketplaceCard } from '../components/marketplace/MarketplaceCard';
import { MarketplaceDetailModal } from '../components/marketplace/MarketplaceDetailModal';
import { InstallationDifficulty } from '../types/modification';
import {
  Search,
  SlidersHorizontal,
  Car,
  MapPin,
  Sparkles,
  Layers,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Filter,
  Bot
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const {
    activeVehicle,
    selectedCountry,
    selectedRegion,
    experienceMode,
    buildComponents,
    addComponentToBuild,
    removeComponentFromBuild,
    navigateTo,
    askEngineerAboutComponent
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>('ALL');
  const [compatibilityFilter, setCompatibilityFilter] = useState<'ALL' | 'COMPATIBLE' | 'CONDITIONALLY_COMPATIBLE' | 'REVIEW'>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<InstallationDifficulty | 'ALL'>('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Selected item for modal
  const [activeModalItem, setActiveModalItem] = useState<MarketplaceItem | null>(null);

  // Unique brands
  const availableBrands = useMemo(() => {
    return MarketplaceService.getBrands();
  }, []);

  // Filtered Items
  const items: MarketplaceItem[] = useMemo(() => {
    if (!activeVehicle) return [];
    return MarketplaceService.searchMarketplace({
      query: searchQuery,
      category: selectedCategory,
      compatibilityFilter,
      brand: selectedBrand,
      difficulty: selectedDifficulty,
      vehicle: activeVehicle,
      country: selectedCountry,
      region: selectedRegion,
      experienceMode
    });
  }, [
    activeVehicle,
    selectedCountry,
    selectedRegion,
    experienceMode,
    searchQuery,
    selectedCategory,
    compatibilityFilter,
    selectedBrand,
    selectedDifficulty
  ]);

  // Categories list
  const categories: MarketplaceCategory[] = [
    'ALL',
    'EXTERIOR',
    'WHEELS',
    'BRAKES',
    'SUSPENSION',
    'PERFORMANCE',
    'INTERIOR'
  ];

  const handleToggleBuild = (item: MarketplaceItem) => {
    const isAlreadyIn = buildComponents.some(
      c => c.componentId === item.component.id || c.id === item.component.id
    );
    if (isAlreadyIn) {
      removeComponentFromBuild(item.component.id);
    } else {
      addComponentToBuild(item.component);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setCompatibilityFilter('ALL');
    setSelectedBrand('ALL');
    setSelectedDifficulty('ALL');
  };

  // If no vehicle is selected
  if (!activeVehicle) {
    return (
      <PageContainer
        eyebrow="DRIVEFORGE MARKETPLACE"
        title="Component Discovery & Sourcing"
        subtitle="Explore verified components engineered for your build."
      >
        <div className="p-12 sm:p-16 rounded-[28px] neo-panel border border-white/10 bg-[#12141A] text-center space-y-5 max-w-2xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl neo-inset border border-white/10 text-[#0070F3] flex items-center justify-center mx-auto shadow-inner">
            <Car className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black font-sans text-white uppercase tracking-wider">
              SELECT A VEHICLE PLATFORM
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              DriveForge requires an active vehicle platform to calculate kinematic clearance, regional installation labor, and verified fitment rules.
            </p>
          </div>
          <div className="pt-2">
            <NeoButton
              variant="primary"
              size="md"
              onClick={() => navigateTo('/vehicles')}
              icon={<Car className="w-4 h-4" />}
            >
              SELECT VEHICLE PLATFORM
            </NeoButton>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      eyebrow="DRIVEFORGE EDITORIAL MARKETPLACE"
      title="EXPLORE YOUR BUILD"
      subtitle={`Verified aftermarket and motorsport hardware homologated for ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}.`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo('/build')}
            icon={<Layers className="w-4 h-4 text-[#0070F3]" />}
          >
            Active Build ({buildComponents.length})
          </NeoButton>
          <NeoButton
            variant="primary"
            size="sm"
            onClick={() => navigateTo('/garage')}
            icon={<Car className="w-4 h-4" />}
          >
            3D Garage
          </NeoButton>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Top Active Platform Context Bar */}
        <div className="p-4 sm:p-5 rounded-[22px] neo-panel border border-white/10 bg-[#12141A] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0070F3]/15 text-[#0070F3] flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-gray-400 uppercase">ACTIVE TARGET</span>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-[#0070F3]/20 text-[#0070F3] border border-[#0070F3]/40">
                  {experienceMode.toUpperCase()}
                </span>
              </div>
              <h2 className="text-base font-black text-white font-sans">
                {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} ({activeVehicle.chassisCode || 'OEM'})
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D0F13] neo-inset border border-white/5 text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{selectedRegion?.name || 'Global'} ({selectedCountry?.currency || 'USD'})</span>
            </div>

            <button
              onClick={() => navigateTo('/vehicles')}
              className="px-3 py-1.5 rounded-xl neo-button text-xs font-mono text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              Switch Vehicle
            </button>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search components by part number, brand (e.g. Akrapovič, Öhlins, Brembo), or purpose..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#12141A] neo-inset border border-white/10 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#0070F3]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-mono"
                >
                  CLEAR
                </button>
              )}
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-3 rounded-2xl neo-button text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                showAdvancedFilters || compatibilityFilter !== 'ALL' || selectedBrand !== 'ALL' || selectedDifficulty !== 'ALL'
                  ? 'text-[#0070F3] border-[#0070F3]/40 bg-[#0070F3]/10'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>FILTERS</span>
              {(compatibilityFilter !== 'ALL' || selectedBrand !== 'ALL' || selectedDifficulty !== 'ALL') && (
                <span className="w-2 h-2 rounded-full bg-[#0070F3]" />
              )}
            </button>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0070F3] text-white shadow-md shadow-[#0070F3]/30'
                    : 'bg-[#12141A] neo-inset text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Expandable Advanced Filters Drawer */}
          {showAdvancedFilters && (
            <div className="p-4 rounded-2xl neo-panel border border-white/10 bg-[#101217] space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-mono font-bold text-gray-300 uppercase flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#0070F3]" />
                  ADVANCED FITMENT & SPEC FILTERS
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-mono text-gray-400 hover:text-[#0070F3] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                {/* Fitment Compatibility Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Compatibility Status</label>
                  <select
                    value={compatibilityFilter}
                    onChange={e => setCompatibilityFilter(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#0D0F13] neo-inset border border-white/10 text-gray-200 focus:outline-none focus:border-[#0070F3]"
                  >
                    <option value="ALL">All Compatibility Levels</option>
                    <option value="COMPATIBLE">Fully Compatible (Direct Fit)</option>
                    <option value="CONDITIONALLY_COMPATIBLE">Conditionally Compatible</option>
                    <option value="REVIEW">Verification Required</option>
                  </select>
                </div>

                {/* Brand Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Brand / Manufacturer</label>
                  <select
                    value={selectedBrand}
                    onChange={e => setSelectedBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0D0F13] neo-inset border border-white/10 text-gray-200 focus:outline-none focus:border-[#0070F3]"
                  >
                    <option value="ALL">All Brands ({availableBrands.length})</option>
                    {availableBrands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Installation Complexity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Installation Complexity</label>
                  <select
                    value={selectedDifficulty}
                    onChange={e => setSelectedDifficulty(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#0D0F13] neo-inset border border-white/10 text-gray-200 focus:outline-none focus:border-[#0070F3]"
                  >
                    <option value="ALL">All Difficulties</option>
                    <option value="bolt_on">Bolt-On (Direct Fit)</option>
                    <option value="moderate">Moderate</option>
                    <option value="professional_required">Professional Required</option>
                    <option value="specialist">Specialist Required</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count & Quick Status */}
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
          <span>SHOWING {items.length} HOMOLOGATED COMPONENTS</span>
          {buildComponents.length > 0 && (
            <span className="text-[#10B981] font-bold">
              {buildComponents.length} Selected in Physical Build
            </span>
          )}
        </div>

        {/* Grid of Component Cards */}
        {items.length === 0 ? (
          <div className="p-12 rounded-3xl neo-panel border border-white/10 bg-[#12141A] text-center space-y-4 max-w-xl mx-auto my-8">
            <Layers className="w-10 h-10 text-gray-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-mono uppercase">
                NO COMPONENTS MATCH YOUR CRITERIA
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Try clearing your search query or loosening compatibility filters.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl neo-button text-xs font-mono text-[#0070F3] hover:text-white border border-[#0070F3]/30"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => {
              const isInBuild = buildComponents.some(
                c => c.componentId === item.component.id || c.id === item.component.id
              );

              return (
                <MarketplaceCard
                  key={item.component.id}
                  item={item}
                  isInBuild={isInBuild}
                  onViewDetails={it => setActiveModalItem(it)}
                  onCheckFitment={it => setActiveModalItem(it)}
                  onToggleBuild={it => handleToggleBuild(it)}
                  onViewBuild={() => navigateTo('/build')}
                />
              );
            })}
          </div>
        )}

      </div>

      {/* Component Detail Modal */}
      {activeModalItem && (
        <MarketplaceDetailModal
          item={activeModalItem}
          activeVehicle={activeVehicle}
          isInBuild={buildComponents.some(
            c => c.componentId === activeModalItem.component.id || c.id === activeModalItem.component.id
          )}
          onClose={() => setActiveModalItem(null)}
          onToggleBuild={it => handleToggleBuild(it)}
          onPreviewInGarage={() => {
            setActiveModalItem(null);
            navigateTo('/garage');
          }}
          onAskChiefEngineer={compPlanId => {
            setActiveModalItem(null);
            askEngineerAboutComponent(compPlanId);
          }}
        />
      )}
    </PageContainer>
  );
};
