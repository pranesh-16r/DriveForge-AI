import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { WorkshopMap } from '../components/workshops/WorkshopMap';
import { WorkshopCard } from '../components/workshops/WorkshopCard';
import { WorkshopDetailModal } from '../components/workshops/WorkshopDetailModal';
import { InstallationRequestSummary } from '../components/workshops/InstallationRequestSummary';
import { UserLocationPrompt } from '../components/workshops/UserLocationPrompt';
import { RegionSwitcherModal } from '../components/workshops/RegionSwitcherModal';
import { WorkshopService } from '../lib/workshops/workshopService';
import { Workshop, WorkshopMatchResult, WorkshopMatchLevel } from '../lib/workshops/workshopTypes';
import { Coordinates } from '../lib/maps/mapService';
import {
  MapPin,
  Search,
  Filter,
  SlidersHorizontal,
  Bot,
  Globe,
  Compass,
  Layers,
  Map as MapIcon,
  List,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const WorkshopsPage: React.FC = () => {
  const {
    activeVehicle,
    buildState,
    buildComponents,
    selectedCountry,
    selectedRegion,
    setSelectedRegion,
    setSelectedCountry,
    navigateTo,
    askEngineerAboutWorkshop
  } = useApp();

  // User location state
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [matchLevelFilter, setMatchLevelFilter] = useState<WorkshopMatchLevel | 'ALL'>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [isBuildFilterActive, setIsBuildFilterActive] = useState(false);

  // Active selections
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [modalWorkshop, setModalWorkshop] = useState<Workshop | null>(null);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  // Mobile layout switch (Map vs List)
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  // Search & match workshops against current build and region
  const searchOutput = useMemo(() => {
    return WorkshopService.searchWorkshops({
      query: searchQuery,
      regionId: selectedRegion?.id,
      countryId: selectedCountry?.id,
      buildComponents,
      vehicle: activeVehicle,
      userCoords,
      buildMatchFilter: isBuildFilterActive ? 'GOOD MATCH' : matchLevelFilter,
      serviceFilter: selectedService
    });
  }, [
    searchQuery,
    selectedRegion?.id,
    selectedCountry?.id,
    buildComponents,
    activeVehicle,
    userCoords,
    matchLevelFilter,
    selectedService,
    isBuildFilterActive
  ]);

  const matchResults: WorkshopMatchResult[] = searchOutput.results;

  // Auto-select first workshop if none selected or if current selection is no longer in list
  useEffect(() => {
    if (matchResults.length > 0) {
      if (!selectedWorkshop || !matchResults.some(r => r.workshop.id === selectedWorkshop.id)) {
        setSelectedWorkshop(matchResults[0].workshop);
      }
    } else {
      setSelectedWorkshop(null);
    }
  }, [matchResults, selectedWorkshop]);

  // Handle location acquired
  const handleLocationAcquired = useCallback((coords: Coordinates) => {
    setUserCoords(coords);
  }, []);

  // Handle workshop select
  const handleSelectWorkshop = useCallback((workshop: Workshop) => {
    setSelectedWorkshop(workshop);
  }, []);

  // Handle view details modal
  const handleOpenDetails = useCallback((workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setModalWorkshop(workshop);
  }, []);

  // Handle Ask AI Engineer
  const handleAskAI = useCallback((workshop: Workshop) => {
    askEngineerAboutWorkshop(workshop.id);
  }, [askEngineerAboutWorkshop]);

  // Find match result for the currently opened modal workshop
  const activeModalMatch = useMemo(() => {
    if (!modalWorkshop) return undefined;
    return matchResults.find(m => m.workshop.id === modalWorkshop.id);
  }, [modalWorkshop, matchResults]);

  // Pre-aggregated count of good matches
  const goodMatchCount = useMemo(() => {
    return matchResults.filter(m => m.matchLevel === 'GOOD MATCH').length;
  }, [matchResults]);

  return (
    <PageContainer
      eyebrow="HOMOLOGATED INSTALLATION NETWORK"
      title="TAKE YOUR BUILD INTO THE REAL WORLD."
      subtitle="Find independent workshops with specialized facilities, equipment, and dyno cells matching your active build specifications."
    >
      <div className="space-y-6">
        
        {/* ================= TOP CONTROLS & CONTEXT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Location Permission & Geo Status (5 cols) */}
          <div className="lg:col-span-5">
            <UserLocationPrompt
              userCoords={userCoords}
              onLocationAcquired={handleLocationAcquired}
              selectedCountry={selectedCountry}
              selectedRegion={selectedRegion}
              onChangeRegionClick={() => setIsRegionModalOpen(true)}
            />
          </div>

          {/* Installation Request Summary (7 cols) */}
          <div className="lg:col-span-7">
            <InstallationRequestSummary
              vehicle={activeVehicle}
              buildComponents={buildComponents}
              onFilterByBuild={() => setIsBuildFilterActive(prev => !prev)}
              onNavigateToBuild={() => navigateTo('/build')}
              isBuildFiltered={isBuildFilterActive}
            />
          </div>
        </div>

        {/* ================= SEARCH & FILTER TOOLBAR ================= */}
        <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#292927]/15 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#4A4843] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search workshop name, city, dyno, suspension, ECU..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/15 text-xs font-mono text-[#171717] placeholder-[#55534E] focus:outline-none focus:border-[#28483D] transition-colors font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4843] hover:text-[#171717] text-xs cursor-pointer font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Match Level Filter */}
              <div className="flex items-center rounded-xl bg-[#E8E2D8] p-1 border border-[#292927]/12 text-xs font-mono">
                <button
                  onClick={() => {
                    setIsBuildFilterActive(false);
                    setMatchLevelFilter('ALL');
                  }}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    !isBuildFilterActive && matchLevelFilter === 'ALL'
                      ? 'bg-[#171717] text-[#FAFAF7] font-bold shadow-sm'
                      : 'text-[#4A4843] hover:text-[#171717] font-medium'
                  }`}
                >
                  All ({searchOutput.totalCount})
                </button>
                <button
                  onClick={() => {
                    setIsBuildFilterActive(false);
                    setMatchLevelFilter('GOOD MATCH');
                  }}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    matchLevelFilter === 'GOOD MATCH' || isBuildFilterActive
                      ? 'bg-[#28483D] text-[#FAFAF7] font-bold shadow-sm'
                      : 'text-[#4A4843] hover:text-[#28483D] font-medium'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>Good Match ({goodMatchCount})</span>
                </button>
              </div>

              {/* Mobile View Toggle */}
              <div className="flex lg:hidden items-center rounded-xl bg-[#E8E2D8] p-1 border border-[#292927]/12 text-xs font-mono ml-auto">
                <button
                  onClick={() => setMobileTab('list')}
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                    mobileTab === 'list'
                      ? 'bg-[#171717] text-[#FAFAF7]'
                      : 'text-[#4A4843] hover:text-[#171717]'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMobileTab('map')}
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                    mobileTab === 'map'
                      ? 'bg-[#171717] text-[#FAFAF7]'
                      : 'text-[#4A4843] hover:text-[#171717]'
                  }`}
                  title="Map View"
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Specialty Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono text-[#4A4843]">
            <span className="text-[10px] uppercase font-bold text-[#171717] tracking-wider shrink-0 mr-1">
              SERVICE FILTER:
            </span>
            {[
              { id: 'ALL', label: 'All Services' },
              { id: 'Dyno Tuning', label: 'Chassis Dyno' },
              { id: 'Corner Balancing', label: 'Corner Balancing' },
              { id: 'Suspension Installation', label: 'Suspension & Coilovers' },
              { id: 'ECU Remapping', label: 'ECU / Tuning' },
              { id: 'Brake Installation', label: 'Big Brake Kits' },
              { id: 'Wheel Alignment', label: 'Laser Alignment' },
              { id: 'Exhaust Fabrication', label: 'Exhaust' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedService(f.id)}
                className={`px-2.5 py-1 rounded-lg border shrink-0 transition-colors cursor-pointer ${
                  selectedService === f.id
                    ? 'bg-[#28483D] text-[#FAFAF7] border-[#28483D] font-bold shadow-sm'
                    : 'bg-[#E8E2D8] text-[#171717] border-[#292927]/12 hover:border-[#171717]/40 font-medium'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= MAIN SPLIT: MAP + LIST ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= LEFT: INTERACTIVE MAP (7 cols on lg) ================= */}
          <div className={`lg:col-span-7 space-y-3 ${mobileTab === 'list' ? 'hidden lg:block' : 'block'}`}>
            <div className="flex items-center justify-between text-xs font-mono text-[#4A4843] px-1 font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[#171717] font-black uppercase">TACTICAL RADAR</span>
                <span className="text-[#292927]/30">|</span>
                <span>{selectedRegion?.name || 'Tamil Nadu'}, {selectedCountry?.name || 'India'}</span>
              </div>
              <button
                onClick={() => setIsRegionModalOpen(true)}
                className="text-[#28483D] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>Switch Region</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Leaflet Dark Matter Map */}
            <div className="rounded-2xl overflow-hidden border border-[#292927]/15 shadow-xl h-[620px]">
              <WorkshopMap
                results={matchResults}
                selectedWorkshopId={selectedWorkshop?.id || null}
                onSelectWorkshop={handleSelectWorkshop}
                userCoords={userCoords}
                className="h-full w-full"
              />
            </div>

            {/* Disclaimer footer */}
            <div className="p-3.5 rounded-xl bg-[#E8E2D8]/60 border border-[#292927]/12 flex items-start gap-2.5 text-[11px] font-sans text-[#4A4843]">
              <AlertTriangle className="w-4 h-4 text-[#B47A52] shrink-0 mt-0.5" />
              <p>
                <strong className="text-[#171717] font-mono">Independent Workshop Disclaimer:</strong> DriveForge is a vehicle modification planning platform and does not physically install parts or warrant third-party labor. Workshop data is aggregated for engineering discovery. Always verify technician credentials and safety equipment prior to booking.
              </p>
            </div>
          </div>

          {/* ================= RIGHT: WORKSHOP LIST (5 cols on lg) ================= */}
          <div className={`lg:col-span-5 space-y-4 ${mobileTab === 'map' ? 'hidden lg:block' : 'block'}`}>
            
            <div className="flex items-center justify-between text-xs font-mono text-[#4A4843] px-1 font-bold">
              <span>SHOWING <strong className="text-[#171717] font-black">{matchResults.length}</strong> WORKSHOPS</span>
              {selectedWorkshop && (
                <span className="text-[#4A4843] text-[11px] truncate max-w-[180px]">
                  FOCUSED: <strong className="text-[#28483D]">{selectedWorkshop.name}</strong>
                </span>
              )}
            </div>

            {/* Workshops Card Feed */}
            {matchResults.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#FAFAF7] border border-[#292927]/15 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[#E8E2D8] mx-auto flex items-center justify-center text-[#4A4843]">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#171717] font-mono">No Workshops Found</h4>
                  <p className="text-xs text-[#4A4843] mt-1 font-medium">
                    No workshops in {selectedRegion?.name || 'this region'} matched your search or filters.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setMatchLevelFilter('ALL');
                      setSelectedService('ALL');
                      setIsBuildFilterActive(false);
                    }}
                    className="px-4 py-2 rounded-xl neo-button text-xs font-mono text-white border border-white/10 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setIsRegionModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#0070F3] hover:bg-[#0070F3]/80 text-xs font-mono font-bold text-white cursor-pointer"
                  >
                    Browse Other Regions
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
                {matchResults.map(result => (
                  <WorkshopCard
                    key={result.workshop.id}
                    matchResult={result}
                    isSelected={selectedWorkshop?.id === result.workshop.id}
                    onSelect={handleOpenDetails}
                    userCoords={userCoords}
                    onAskEngineer={handleAskAI}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ================= MODALS ================= */}

      {/* Workshop Deep-Dive Details Modal */}
      {modalWorkshop && (
        <WorkshopDetailModal
          workshop={modalWorkshop}
          matchResult={activeModalMatch}
          buildComponents={buildComponents}
          vehicle={activeVehicle}
          userCoords={userCoords}
          onClose={() => setModalWorkshop(null)}
          onAskEngineer={handleAskAI}
        />
      )}

      {/* Region Switcher Modal */}
      {isRegionModalOpen && (
        <RegionSwitcherModal
          currentCountry={selectedCountry}
          currentRegion={selectedRegion}
          onSelect={(country, region) => {
            setSelectedCountry(country);
            setSelectedRegion(region);
            setIsRegionModalOpen(false);
          }}
          onClose={() => setIsRegionModalOpen(false)}
        />
      )}
    </PageContainer>
  );
};

export const WorkshopDiscoveryPage = WorkshopsPage;
