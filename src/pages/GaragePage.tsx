import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoButton } from '../components/ui/NeoButton';
import { GarageScene } from '../components/garage/GarageScene';
import { GarageToolbar } from '../components/garage/GarageToolbar';
import { GarageControls } from '../components/garage/GarageControls';
import { GarageNavigation, MODIFICATION_CATEGORIES } from '../components/garage/GarageNavigation';
import { VehicleInteraction } from '../components/garage/VehicleInteraction';
import { HotspotItem } from '../components/garage/ComponentHotspot';
import { ExtendedVehicle } from '../data/vehicles';
import { CameraTargetId, ModificationCategoryNavId, CAMERA_PRESETS } from '../lib/3d/camera';
import { PaintFinish } from '../lib/3d/materials';
import { Slider } from '../components/shadcn/Slider';
import { MODIFICATION_COMPONENTS } from '../data/modificationComponents';
import { ExtendedModificationComponent, ComponentCompatibilityResult } from '../types/modification';
import { evaluateComponentCompatibility } from '../lib/modifications/compatibility';
import { ComponentGrid } from '../components/modifications/ComponentGrid';
import { ComponentDetailPanel } from '../components/modifications/ComponentDetailPanel';
import { ComponentComparisonModal } from '../components/modifications/ComponentComparisonModal';
import { MiniBuildSummary } from '../components/modifications/MiniBuildSummary';
import { VehicleModelViewer } from '../components/garage/VehicleModelViewer';
import { GTACustomisationShop } from '../components/garage/GTACustomisationShop';
import { ChiefEngineerChat } from '../components/ai/ChiefEngineerChat';
import { GarageIntroSequence } from '../components/garage/GarageIntroSequence';
import { GarageTransitionController, TransitionType } from '../components/garage/GarageTransitionController';
import {
  ArrowLeft,
  Wrench,
  Bookmark,
  Sparkles,
  Gauge,
  Sliders,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Palette,
  Eye,
  Layers,
  Bot,
  Zap
} from 'lucide-react';

const OEM_COLORS = [
  { name: 'Liquid Silver', hex: '#C0C0C0' },
  { name: 'Phantom Black', hex: '#181A20' },
  { name: 'Guards Red', hex: '#DC2626' },
  { name: 'Gentian Blue', hex: '#1D4ED8' },
  { name: 'Racing Yellow', hex: '#EAB308' },
  { name: 'Chalk White', hex: '#E2E8F0' }
];

export const GaragePage: React.FC = () => {
  const {
    activeVehicle,
    experienceMode,
    selectedCountry,
    selectedRegion,
    navigateTo,
    selectedComponents,
    toggleComponentInBuild,
    removeComponentFromBuild,
    clearBuild
  } = useApp();

  // Primary 3D State
  const [activePreset, setActivePreset] = useState<CameraTargetId>('hero');
  const [activeCategory, setActiveCategory] = useState<ModificationCategoryNavId>('exterior');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [hoodOpen, setHoodOpen] = useState<boolean>(false);
  const [doorsOpen, setDoorsOpen] = useState<boolean>(false);
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // Stance Geometry State (Enthusiast controls)
  const [rideHeight, setRideHeight] = useState<number>(0.5); // 0 (slammed) to 1 (high)
  const [camberAngle, setCamberAngle] = useState<number>(-2.0); // deg

  // Visual Appearance Architecture
  const [paintColor, setPaintColor] = useState<string>(activeVehicle?.colorHex || '#C0C0C0');
  const [paintFinish, setPaintFinish] = useState<PaintFinish>('metallic');
  const [spoilerType, setSpoilerType] = useState<'stock' | 'ducktail' | 'gt_wing' | 'drag'>('gt_wing');

  // Active 3D Previewed Component State
  const [previewedComponent, setPreviewedComponent] = useState<ExtendedModificationComponent | null>(null);

  // Drawer & Comparison Modal State
  const [selectedDetailComponent, setSelectedDetailComponent] = useState<ExtendedModificationComponent | null>(null);
  const [comparingComponentIds, setComparingComponentIds] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  // UI Drawer / Details Collapsible
  const [showSpecsExpanded, setShowSpecsExpanded] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // 3D Viewer Mode & Chief Engineer Chat Drawer State
  const [viewerMode, setViewerMode] = useState<'customs' | 'inspector' | 'studio'>('studio');
  const [showChiefEngineerDrawer, setShowChiefEngineerDrawer] = useState<boolean>(false);

  // Cinematic Intro Sequence & Route Transition State
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeTransition, setActiveTransition] = useState<TransitionType>('none');
  const [targetRoute, setTargetRoute] = useState<string | null>(null);

  const handleNavigateWithTransition = (route: string, transition: TransitionType) => {
    setActiveTransition(transition);
    setTargetRoute(route);
  };

  const handleTransitionComplete = () => {
    if (targetRoute) {
      navigateTo(targetRoute);
      setTargetRoute(null);
    }
    setActiveTransition('none');
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  };

  // Derive components for active category
  const activeCategoryConfig = useMemo(() => {
    return MODIFICATION_CATEGORIES.find((c) => c.id === activeCategory) || MODIFICATION_CATEGORIES[0];
  }, [activeCategory]);

  const activeCategoryComponents = useMemo(() => {
    return MODIFICATION_COMPONENTS.filter((comp) =>
      activeCategoryConfig.categoryKeys.includes(comp.category)
    );
  }, [activeCategoryConfig]);

  // Set of selected component IDs in the build
  const buildComponentIds = useMemo(() => {
    return selectedComponents.map((c) => c.id);
  }, [selectedComponents]);

  // Components chosen for comparison
  const comparingComponents = useMemo(() => {
    return MODIFICATION_COMPONENTS.filter((comp) => comparingComponentIds.includes(comp.id));
  }, [comparingComponentIds]);

  // Dynamic visual states derived from active preview or selected build parts
  const activeVisuals = useMemo(() => {
    // If user is actively previewing a component, use its visual asset
    if (previewedComponent?.visualAsset?.supported) {
      const v = previewedComponent.visualAsset;
      return {
        spoilerType: v.spoilerType || spoilerType,
        rimColor: v.rimColor,
        caliperColor: v.caliperColor,
        exhaustColor: v.exhaustColor,
        hasRaceSplitter: v.hasRaceSplitter || false,
        hasCarbonHood: v.hasCarbonHood || false,
        rideHeight: v.rideHeightDrop !== undefined ? v.rideHeightDrop : rideHeight,
        camberAngle: v.camberDelta !== undefined ? v.camberDelta : camberAngle
      };
    }

    // Otherwise inspect selected components in active build
    const activeSpoiler = selectedComponents.find(c => (c as ExtendedModificationComponent).visualAsset?.type === 'spoiler') as ExtendedModificationComponent | undefined;
    const activeWheel = selectedComponents.find(c => (c as ExtendedModificationComponent).visualAsset?.type === 'wheel') as ExtendedModificationComponent | undefined;
    const activeBrake = selectedComponents.find(c => (c as ExtendedModificationComponent).visualAsset?.type === 'brake') as ExtendedModificationComponent | undefined;
    const activeExhaust = selectedComponents.find(c => (c as ExtendedModificationComponent).visualAsset?.type === 'exhaust') as ExtendedModificationComponent | undefined;
    const activeSplitter = selectedComponents.find(c => (c as ExtendedModificationComponent).visualAsset?.type === 'splitter') as ExtendedModificationComponent | undefined;
    const activeHood = selectedComponents.find(c => (c as ExtendedModificationComponent).visualAsset?.type === 'hood') as ExtendedModificationComponent | undefined;

    return {
      spoilerType: activeSpoiler?.visualAsset?.spoilerType || spoilerType,
      rimColor: activeWheel?.visualAsset?.rimColor,
      caliperColor: activeBrake?.visualAsset?.caliperColor,
      exhaustColor: activeExhaust?.visualAsset?.exhaustColor,
      hasRaceSplitter: activeSplitter?.visualAsset?.hasRaceSplitter || false,
      hasCarbonHood: activeHood?.visualAsset?.hasCarbonHood || false,
      rideHeight,
      camberAngle
    };
  }, [previewedComponent, selectedComponents, spoilerType, rideHeight, camberAngle]);

  // Category selection handler with synchronized camera motion
  const handleSelectCategory = (cat: ModificationCategoryNavId, targetCamera: CameraTargetId) => {
    setActiveCategory(cat);
    setActivePreset(targetCamera);
    setAutoRotate(false);
  };

  // Hotspot selection handler
  const handleSelectHotspot = (hotspot: HotspotItem) => {
    setActiveCategory(hotspot.category);
    setActivePreset(hotspot.cameraPreset);
    setAutoRotate(false);
    showToast(`Focused on ${hotspot.name} (${hotspot.category.toUpperCase()})`);
  };

  // Camera Reset
  const handleResetCamera = useCallback(() => {
    setActivePreset('hero');
    setAutoRotate(false);
  }, []);

  // 3D Preview Toggle Handler
  const handleTogglePreview = (component: ExtendedModificationComponent) => {
    if (previewedComponent?.id === component.id) {
      setPreviewedComponent(null);
      showToast(`Exited 3D preview of ${component.name}`);
    } else {
      setPreviewedComponent(component);
      setAutoRotate(false);

      // Focus camera on the component target if configured
      if (component.cameraTarget) {
        setActivePreset(component.cameraTarget);
      }

      // Automatically open hood/doors if inspecting engine or interior
      if (component.cameraTarget === 'engine' || component.category === 'powertrain') {
        setHoodOpen(true);
      } else if (component.cameraTarget === 'interior' || component.category === 'interior') {
        setDoorsOpen(true);
      }

      showToast(`3D Preview: ${component.name} activated`);
    }
  };

  // Add / Remove from Build Handler
  const handleToggleBuild = (component: ExtendedModificationComponent) => {
    const isCurrentlyIn = buildComponentIds.includes(component.id);
    toggleComponentInBuild(component);

    if (isCurrentlyIn) {
      showToast(`Removed ${component.name} from build`);
    } else {
      const compat = evaluateComponentCompatibility(component, activeVehicle);
      if (compat.status === 'compatible') {
        showToast(`Added ${component.name} • Fitment Verified`);
      } else if (compat.status === 'conditionally_compatible') {
        showToast(`Added ${component.name} • Check Prerequisites`);
      } else {
        showToast(`Added ${component.name} to build`);
      }
    }
  };

  // Compare Toggle Handler (Up to 3 items)
  const handleToggleCompare = (component: ExtendedModificationComponent) => {
    setComparingComponentIds((prev) => {
      if (prev.includes(component.id)) {
        return prev.filter((id) => id !== component.id);
      } else {
        if (prev.length >= 3) {
          showToast('Maximum 3 components can be compared simultaneously.');
          return prev;
        }
        return [...prev, component.id];
      }
    });
  };

  // Keyboard Shortcuts for Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      switch (e.key) {
        case '1':
          setActivePreset('hero');
          break;
        case '2':
          setActivePreset('front');
          break;
        case '3':
          setActivePreset('rear');
          break;
        case '4':
          setActivePreset('side');
          break;
        case '5':
          setActivePreset('top');
          break;
        case '6':
          setActivePreset('wheel');
          break;
        case 'r':
        case 'R':
          setAutoRotate((prev) => !prev);
          break;
        case 'h':
        case 'H':
          setHoodOpen((prev) => !prev);
          break;
        case 'd':
        case 'D':
          setDoorsOpen((prev) => !prev);
          break;
        case 'l':
        case 'L':
          setHeadlightsOn((prev) => !prev);
          break;
        case 'Escape':
          setSelectedDetailComponent(null);
          setShowComparisonModal(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentPresetConfig = CAMERA_PRESETS[activePreset] || CAMERA_PRESETS.hero;

  return (
    <div className="relative min-h-screen pb-16">
      
      {/* Cinematic Studio Intro Reveal Sequence */}
      {showIntro && (
        <GarageIntroSequence
          vehicleName={activeVehicle.model}
          vehicleBrand={activeVehicle.make}
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* Contextual Cinematic Page Transition Overlay */}
      <GarageTransitionController
        type={activeTransition}
        onComplete={handleTransitionComplete}
      />
      
      {/* Top Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl neo-panel bg-[#111317]/95 border border-[#0070F3]/60 text-xs font-mono font-bold text-white shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#0070F3]" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <PageContainer
        eyebrow="DRIVEFORGE AI • DIGITAL AUTOMOTIVE STUDIO"
        title={`${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`}
        subtitle={`${activeVehicle.trim || (activeVehicle as ExtendedVehicle).variant || 'Spec'} • Real-Time 3D Engineering Planning & Fitment Studio`}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Exit Garage / Back to Vehicle Overview */}
            <NeoButton
              variant="outline"
              size="sm"
              onClick={() => navigateTo(`/vehicles/${activeVehicle.id}`)}
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Exit Garage
            </NeoButton>

            {/* Save Build Profile */}
            <NeoButton
              variant="raised"
              size="sm"
              onClick={() => showToast('Vehicle build state synchronized to local garage cache.')}
              icon={<Bookmark className="w-3.5 h-3.5 text-[#0070F3]" />}
            >
              Save Build
            </NeoButton>

            {/* Part Compatibility Simulator */}
            <NeoButton
              variant="outline"
              size="sm"
              onClick={() => navigateTo('/compatibility')}
              icon={<Zap className="w-3.5 h-3.5 text-amber-400" />}
            >
              Simulate Fitment
            </NeoButton>

            {/* Saved Projects Dashboard */}
            <NeoButton
              variant="outline"
              size="sm"
              onClick={() => navigateTo('/projects')}
              icon={<Layers className="w-3.5 h-3.5 text-[#0070F3]" />}
            >
              Projects
            </NeoButton>

            {/* Ask Chief Engineer */}
            <NeoButton
              variant="outline"
              size="sm"
              onClick={() => setShowChiefEngineerDrawer(true)}
              icon={<Bot className="w-3.5 h-3.5 text-[#0070F3]" />}
            >
              Ask Chief Engineer
            </NeoButton>

            {/* Compose Build Button */}
            <NeoButton
              variant="primary"
              size="sm"
              onClick={() => handleNavigateWithTransition('/build', 'garageToBuild')}
              icon={<Wrench className="w-3.5 h-3.5" />}
            >
              Compose Build ({selectedComponents.length})
            </NeoButton>
          </div>
        }
      >
        {/* ================= VIEW MODE SWITCHER ================= */}
        <div className="flex items-center justify-between p-2 rounded-2xl neo-panel border border-white/10 bg-[#12141A] mb-4">
          <div className="flex items-center gap-1.5 p-1 rounded-xl neo-inset border border-white/10 overflow-x-auto">
            <button
              type="button"
              onClick={() => setViewerMode('customs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer select-none ${
                viewerMode === 'customs'
                  ? 'bg-[#FFB800] text-black shadow-lg shadow-[#FFB800]/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>In-Game Customisation Shop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewerMode('inspector')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer select-none ${
                viewerMode === 'inspector'
                  ? 'bg-[#0070F3] text-white shadow-lg shadow-[#0070F3]/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>3D Studio Inspector</span>
            </button>
            <button
              type="button"
              onClick={() => setViewerMode('studio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer select-none ${
                viewerMode === 'studio'
                  ? 'bg-[#0070F3] text-white shadow-lg shadow-[#0070F3]/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Parts Grid</span>
            </button>
          </div>

          <div className="flex items-center gap-3 pr-2">
            <span className="text-[11px] font-mono text-gray-400 hidden md:inline">
              {viewerMode === 'customs'
                ? 'GTA 5 Customisation Shop layout with in-game vertical HUD & real-time angles'
                : viewerMode === 'inspector'
                ? 'Interactive 360° rotation & inspection active'
                : 'Category fitment & component catalog active'}
            </span>
          </div>
        </div>

        {/* If in Customs Mode: Render the exact GTA 5 Customisation Shop layout */}
        {viewerMode === 'customs' ? (
          <div className="rounded-[28px] overflow-hidden border border-white/10 shadow-2xl">
            <GTACustomisationShop />
          </div>
        ) : (
          /* ================= MAIN GARAGE LAYOUT ================= */
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Modification Category Navigation & Studio Paint (3 cols on XL) */}
          <div className="xl:col-span-3 order-2 xl:order-1 space-y-4">
            <GarageNavigation
              activeCategory={activeCategory}
              activeVehicle={activeVehicle}
              onSelectCategory={handleSelectCategory}
              onQuickPreview={handleTogglePreview}
              onQuickAdd={handleToggleBuild}
              buildComponentIds={buildComponentIds}
              previewedComponentId={previewedComponent?.id || null}
            />

            {/* Color & Paint Finish Architecture */}
            <div className="p-3.5 rounded-[22px] neo-panel border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#0070F3]" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    STUDIO PAINTWORK
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  {paintFinish}
                </span>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-2 flex-wrap">
                {OEM_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setPaintColor(c.hex);
                      showToast(`Respray applied: ${c.name}`);
                    }}
                    title={c.name}
                    aria-label={`Select ${c.name}`}
                    className={`w-7 h-7 rounded-full transition-all cursor-pointer border-2 ${
                      paintColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'scale-110 border-[#0070F3] shadow-[0_0_10px_rgba(0,112,243,0.8)]'
                        : 'border-white/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>

              {/* Finish Selector */}
              <div className="grid grid-cols-3 gap-1 pt-1">
                {(['metallic', 'matte', 'gloss'] as PaintFinish[]).map((fin) => (
                  <button
                    key={fin}
                    onClick={() => setPaintFinish(fin)}
                    className={`py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      paintFinish === fin
                        ? 'neo-inset text-[#0070F3] border border-[#0070F3]/60 bg-[#111317]'
                        : 'neo-button text-gray-400 hover:text-white'
                    }`}
                  >
                    {fin}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER & RIGHT COLUMN: 3D Studio Canvas + Component Catalog (9 cols on XL) */}
          <div className="xl:col-span-9 order-1 xl:order-2 space-y-4">
            
            {/* View Mode Switcher: 3D Vehicle Inspector vs Parts Studio */}
            <div className="flex items-center justify-between p-2 rounded-2xl neo-panel border border-white/10 bg-[#12141A]">
              <div className="flex items-center gap-1.5 p-1 rounded-xl neo-inset border border-white/10">
                <button
                  onClick={() => setViewerMode('inspector')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    viewerMode === 'inspector'
                      ? 'bg-[#0070F3] text-white shadow-lg shadow-[#0070F3]/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>3D Vehicle Inspector</span>
                </button>
                <button
                  onClick={() => setViewerMode('studio')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    viewerMode === 'studio'
                      ? 'bg-[#0070F3] text-white shadow-lg shadow-[#0070F3]/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Parts Studio</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pr-2">
                <span className="text-[11px] font-mono text-gray-400 hidden md:inline">
                  {viewerMode === 'inspector'
                    ? 'Interactive 360° rotation & inspection active'
                    : 'Category fitment & component catalog active'}
                </span>
                <button
                  onClick={() => setShowChiefEngineerDrawer(true)}
                  className="px-2.5 py-1 rounded-lg bg-[#0070F3]/15 hover:bg-[#0070F3]/25 text-[#38BDF8] border border-[#0070F3]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask Chief Engineer</span>
                </button>
              </div>
            </div>

            {/* If in Inspector Mode: Render Dedicated 3D Vehicle Model Viewer */}
            {viewerMode === 'inspector' ? (
              <VehicleModelViewer
                vehicle={activeVehicle}
                paintColor={paintColor}
                paintFinish={paintFinish}
                onAskChiefEngineer={(query) => {
                  setShowChiefEngineerDrawer(true);
                }}
              />
            ) : (
              /* The 3D Canvas Viewport Card */
              <div className="relative w-full rounded-[28px] overflow-hidden neo-panel border border-white/10 shadow-2xl">
              
              {/* Active 3D Preview Floating Notice */}
              {previewedComponent && (
                <div className="absolute top-4 left-4 z-20 pointer-events-auto">
                  <div className="px-3 py-1.5 rounded-xl bg-[#0070F3]/90 backdrop-blur-md text-white text-xs font-mono font-bold shadow-xl flex items-center gap-2 border border-white/20">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Active Preview: {previewedComponent.name}</span>
                    <button
                      onClick={() => setPreviewedComponent(null)}
                      className="ml-1 text-[10px] underline hover:text-gray-200 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Top Floating Viewport Header: Perspective info & Interaction cue */}
              <div className="absolute top-4 right-4 z-20 hidden md:block">
                <VehicleInteraction
                  isInteracting={isInteracting}
                  activePresetLabel={currentPresetConfig.label}
                />
              </div>

              {/* 3D Scene Viewport */}
              <div className="h-[480px] sm:h-[540px] md:h-[600px] lg:h-[640px] w-full">
                <GarageScene
                  vehicle={activeVehicle}
                  activeCategory={activeCategory}
                  activePreset={activePreset}
                  autoRotate={autoRotate}
                  hoodOpen={hoodOpen}
                  doorsOpen={doorsOpen}
                  headlightsOn={headlightsOn}
                  wireframe={wireframe}
                  showHotspots={showHotspots}
                  rideHeight={activeVisuals.rideHeight}
                  camberAngle={activeVisuals.camberAngle}
                  paintColor={paintColor}
                  paintFinish={paintFinish}
                  spoilerType={activeVisuals.spoilerType}
                  rimColor={activeVisuals.rimColor}
                  caliperColor={activeVisuals.caliperColor}
                  exhaustColor={activeVisuals.exhaustColor}
                  hasRaceSplitter={activeVisuals.hasRaceSplitter}
                  hasCarbonHood={activeVisuals.hasCarbonHood}
                  onSelectHotspot={handleSelectHotspot}
                  onInteractionStart={() => setIsInteracting(true)}
                  onInteractionEnd={() => setIsInteracting(false)}
                />
              </div>

              {/* Bottom Floating Tactical Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none">
                {/* Tactical Camera Presets Toolbar */}
                <div className="pointer-events-auto w-full md:w-auto flex justify-center">
                  <GarageToolbar
                    activePreset={activePreset}
                    onSelectPreset={(p) => {
                      setActivePreset(p);
                      setAutoRotate(false);
                    }}
                    onResetCamera={handleResetCamera}
                  />
                </div>

                {/* Viewport Manipulation & Kinematic Toggles */}
                <div className="pointer-events-auto w-full md:w-auto flex justify-center">
                  <GarageControls
                    autoRotate={autoRotate}
                    onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
                    onZoomIn={() => showToast('Use mouse scroll or trackpad pinch for precision zoom')}
                    onZoomOut={() => showToast('Use mouse scroll or trackpad pinch for precision zoom')}
                    onResetView={handleResetCamera}
                    hoodOpen={hoodOpen}
                    onToggleHood={() => {
                      setHoodOpen((prev) => !prev);
                      if (!hoodOpen) setActivePreset('engine');
                    }}
                    doorsOpen={doorsOpen}
                    onToggleDoors={() => {
                      setDoorsOpen((prev) => !prev);
                      if (!doorsOpen) setActivePreset('interior');
                    }}
                    headlightsOn={headlightsOn}
                    onToggleHeadlights={() => setHeadlightsOn((prev) => !prev)}
                    wireframe={wireframe}
                    onToggleWireframe={() => setWireframe((prev) => !prev)}
                    showHotspots={showHotspots}
                    onToggleHotspots={() => setShowHotspots((prev) => !prev)}
                  />
                </div>
              </div>
            </div>
            )}

            {/* Mini Build Spec Tracker Bar */}
            <MiniBuildSummary
              vehicle={activeVehicle}
              components={selectedComponents}
              onRemoveComponent={(id) => removeComponentFromBuild(id)}
              onComposeBuild={() => navigateTo('/build')}
              onClearBuild={() => clearBuild()}
            />

            {/* ================= COMPONENT FITMENT & SPECIFICATIONS CATALOG ================= */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#0070F3]" />
                    <h3 className="text-base sm:text-lg font-bold text-white font-sans">
                      {activeCategoryConfig.label} Catalog
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">
                    Verified fitment and live specs for {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} ({activeVehicle.chassisCode || 'Platform'})
                  </p>
                </div>

                <span className="text-xs font-mono text-gray-400">
                  Showing {activeCategoryComponents.length} {activeCategoryComponents.length === 1 ? 'part' : 'parts'}
                </span>
              </div>

              {/* Responsive Visual Grid of Components */}
              <ComponentGrid
                components={activeCategoryComponents}
                activeVehicle={activeVehicle}
                activeCategory={activeCategory}
                buildComponentIds={buildComponentIds}
                previewedComponentId={previewedComponent?.id || null}
                comparingComponentIds={comparingComponentIds}
                experienceMode={experienceMode}
                onToggleBuild={handleToggleBuild}
                onTogglePreview={handleTogglePreview}
                onOpenDetails={(comp) => setSelectedDetailComponent(comp)}
                onToggleCompare={handleToggleCompare}
                onOpenCompareModal={() => setShowComparisonModal(true)}
                onClearCompare={() => setComparingComponentIds([])}
              />
            </div>

            {/* ================= COMPACT VEHICLE TELEMETRY CARD ================= */}
            <div className="p-4 sm:p-5 rounded-[24px] neo-panel border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl neo-inset flex items-center justify-center text-[#0070F3]">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-sans">
                      {activeVehicle.make} {activeVehicle.model} Factory Architecture
                    </h3>
                    <p className="text-[11px] font-mono text-gray-400">
                      Chassis {activeVehicle.chassisCode || 'OEM'} • {activeVehicle.drivetrain} • {selectedCountry?.name || 'Global'} Homologation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSpecsExpanded(!showSpecsExpanded)}
                    className="px-3 py-1 rounded-xl neo-button text-xs font-mono font-bold text-gray-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{showSpecsExpanded ? 'Compact Specs' : 'Detailed Telemetry'}</span>
                    {showSpecsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <NeoButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigateTo(`/vehicles/${activeVehicle.id}`)}
                    icon={<ExternalLink className="w-3 h-3" />}
                  >
                    Platform Overview
                  </NeoButton>
                </div>
              </div>

              {/* Primary Key Metric Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#111317] neo-inset border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">ENGINE</span>
                  <span className="text-xs font-black font-sans text-white truncate block">
                    {activeVehicle.engine}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#111317] neo-inset border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">BASELINE POWER</span>
                  <span className="text-xs font-black font-mono text-[#0070F3] block">
                    {activeVehicle.baselinePowerHp} HP
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#111317] neo-inset border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">TORQUE</span>
                  <span className="text-xs font-black font-mono text-white block">
                    {activeVehicle.baselineTorqueLbFt} lb-ft
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#111317] neo-inset border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">CURB WEIGHT</span>
                  <span className="text-xs font-black font-mono text-white block">
                    {activeVehicle.weightKg} kg
                  </span>
                </div>
              </div>

              {/* Collapsible Enthusiast Engineering Telemetry & Stance Geometry Sliders */}
              {showSpecsExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2 border-t border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#0070F3]" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        CHASSIS STANCE & GEOMETRY TUNING
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#0070F3] bg-[#0070F3]/10 px-2 py-0.5 rounded-full border border-[#0070F3]/30">
                      LIVE 3D RECALIBRATION
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Slider
                      label="CHASSIS RIDE HEIGHT (SLAMMED / STANCE)"
                      value={Math.round((1 - rideHeight) * 100)}
                      min={0}
                      max={100}
                      unit="%"
                      onChange={(val) => setRideHeight(1 - val / 100)}
                    />

                    <Slider
                      label="WHEEL NEGATIVE CAMBER ANGLE"
                      value={Math.abs(camberAngle)}
                      min={0}
                      max={5}
                      step={0.5}
                      unit="°"
                      onChange={(val) => setCamberAngle(-val)}
                    />
                  </div>

                  {/* Aerodynamic Wing Specification */}
                  <div className="p-3 rounded-xl bg-[#111317] neo-inset border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                      AERODYNAMIC SPOILER CONFIGURATION
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['stock', 'ducktail', 'gt_wing', 'drag'] as const).map((wing) => (
                        <button
                          key={wing}
                          onClick={() => {
                            setSpoilerType(wing);
                            showToast(`Spoiler geometry switched to ${wing.toUpperCase()}`);
                          }}
                          className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                            spoilerType === wing
                              ? 'neo-inset text-[#0070F3] border border-[#0070F3]/60 bg-[#14171E]'
                              : 'neo-button text-gray-400 hover:text-white'
                          }`}
                        >
                          {wing.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

        </div>
        )}

      </PageContainer>

      {/* Slide-In Right Component Detail Panel (Does not obscure 3D vehicle) */}
      {selectedDetailComponent && (
        <ComponentDetailPanel
          component={selectedDetailComponent}
          compatibility={evaluateComponentCompatibility(selectedDetailComponent, activeVehicle)}
          activeVehicle={activeVehicle}
          isInBuild={buildComponentIds.includes(selectedDetailComponent.id)}
          isPreviewing={previewedComponent?.id === selectedDetailComponent.id}
          isComparing={comparingComponentIds.includes(selectedDetailComponent.id)}
          experienceMode={experienceMode}
          onClose={() => setSelectedDetailComponent(null)}
          onToggleBuild={handleToggleBuild}
          onTogglePreview={handleTogglePreview}
          onToggleCompare={handleToggleCompare}
        />
      )}

      {/* Side-by-Side Comparison Modal */}
      {showComparisonModal && (
        <ComponentComparisonModal
          components={comparingComponents}
          activeVehicle={activeVehicle}
          buildComponentIds={buildComponentIds}
          previewedComponentId={previewedComponent?.id || null}
          onClose={() => setShowComparisonModal(false)}
          onRemoveFromCompare={(id) => setComparingComponentIds((prev) => prev.filter((i) => i !== id))}
          onClearCompare={() => {
            setComparingComponentIds([]);
            setShowComparisonModal(false);
          }}
          onToggleBuild={handleToggleBuild}
          onTogglePreview={handleTogglePreview}
        />
      )}

      {/* AI Chief Engineer Chat Modal */}
      <AnimatePresence>
        {showChiefEngineerDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowChiefEngineerDrawer(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 24 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-3xl h-[640px] max-h-[92vh] flex shadow-2xl"
            >
              <ChiefEngineerChat
                isCompact={true}
                onClose={() => setShowChiefEngineerDrawer(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
