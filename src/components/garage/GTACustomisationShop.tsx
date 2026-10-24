import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { lsAudio } from '../../utils/lsAudio';
import { toast } from 'sonner';
import { GarageScene } from './GarageScene';
import { CameraTargetId, CAMERA_PRESETS } from '../../lib/3d/camera';
import { PaintFinish } from '../../lib/3d/materials';
import { VEHICLES } from '../../data/vehicles';
import {
  Wrench,
  Flame,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  DollarSign,
  Car,
  Layers,
  ArrowRight,
  Shield,
  Disc,
  Palette,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface MenuOption {
  id: string;
  name: string;
  priceUSD: number;
  installed?: boolean;
  cameraPreset: CameraTargetId;
  previewType?: string;
  colorHex?: string;
  statGains?: {
    speed?: number;
    topSpeed?: number;
    accel?: number;
    brake?: number;
    braking?: number;
    traction?: number;
  };
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  cameraPreset: CameraTargetId;
  options: MenuOption[];
}

export const GTACustomisationShop: React.FC = () => {
  const {
    activeVehicle,
    setActiveVehicle,
    selectedRegion,
    totalBuildCostUSD,
    addComponentToBuild,
    removeComponentFromBuild,
    selectedComponents,
    navigateTo
  } = useApp();

  // Active Menu Navigation State
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null);
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(0);

  // 3D Vehicle Interactive Visuals
  const [activeCamera, setActiveCamera] = useState<CameraTargetId>('hero');
  const [paintColor, setPaintColor] = useState<string>(activeVehicle?.colorHex || '#1D4ED8');
  const [paintFinish, setPaintFinish] = useState<PaintFinish>('metallic');
  const [neonColor, setNeonColor] = useState<string>('#00E5FF');
  const [hasNeon, setHasNeon] = useState<boolean>(true);
  const [hasTurbo, setHasTurbo] = useState<boolean>(true);
  const [spoilerType, setSpoilerType] = useState<'stock' | 'ducktail' | 'gt_wing' | 'drag'>('gt_wing');
  const [stanceLevel, setStanceLevel] = useState<'stock' | 'street' | 'slammed'>('street');
  const [rideHeight, setRideHeight] = useState<number>(0.4);
  const [camberAngle, setCamberAngle] = useState<number>(-2.2);
  const [hoodOpen, setHoodOpen] = useState<boolean>(false);
  const [doorsOpen, setDoorsOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(lsAudio.enabled);

  // Installed upgrade IDs map
  const [installedUpgrades, setInstalledUpgrades] = useState<Record<string, string>>({
    engine: 'engine-stage3',
    turbo: 'turbo-stage3',
    exhaust: 'exhaust-titanium',
    suspension: 'suspension-street',
    wheels: 'wheels-tuner',
    brakes: 'brakes-ceramic',
    armor: 'armor-80',
    spoiler: 'spoiler-gt',
    respray: 'respray-blue',
    neon: 'neon-cyan',
    tint: 'tint-dark'
  });

  // Base Stats
  const baseStats = {
    topSpeed: 78,
    acceleration: 74,
    braking: 80,
    traction: 82
  };

  // Categories and Sub-options structured exactly like GTA 5 Los Santos Customs
  const categories: MenuCategory[] = useMemo(() => [
    {
      id: 'armor',
      name: 'ARMOR & REINFORCEMENT',
      description: 'Strengthen chassis rigidity and bulletproof crash protection.',
      cameraPreset: 'side',
      options: [
        { id: 'armor-none', name: 'None (Stock)', priceUSD: 0, cameraPreset: 'side' },
        { id: 'armor-20', name: 'Armor Upgrade 20%', priceUSD: 3500, cameraPreset: 'side', statGains: { traction: 2 } },
        { id: 'armor-40', name: 'Armor Upgrade 40%', priceUSD: 6500, cameraPreset: 'side', statGains: { traction: 4 } },
        { id: 'armor-60', name: 'Armor Upgrade 60%', priceUSD: 11000, cameraPreset: 'side', statGains: { traction: 6 } },
        { id: 'armor-80', name: 'Armor Upgrade 80%', priceUSD: 16500, cameraPreset: 'side', statGains: { traction: 8 } },
        { id: 'armor-100', name: '100% Armor (Bulletproof)', priceUSD: 25000, cameraPreset: 'side', statGains: { traction: 10 } }
      ]
    },
    {
      id: 'brakes',
      name: 'BRAKES',
      description: 'High-performance slotted and carbon ceramic disc systems.',
      cameraPreset: 'brake',
      options: [
        { id: 'brakes-stock', name: 'Stock Brakes', priceUSD: 0, cameraPreset: 'brake' },
        { id: 'brakes-street', name: 'Street Slotted Brakes', priceUSD: 2400, cameraPreset: 'brake', statGains: { braking: 8 } },
        { id: 'brakes-sport', name: 'Sport Drilled Brakes', priceUSD: 4800, cameraPreset: 'brake', statGains: { braking: 14 } },
        { id: 'brakes-ceramic', name: 'Race Carbon Ceramic Kit', priceUSD: 14500, cameraPreset: 'brake', statGains: { braking: 22 } }
      ]
    },
    {
      id: 'engine',
      name: 'ENGINE (EMS UPGRADES)',
      description: 'Engine management, cam profiles, and blueprinted race internals.',
      cameraPreset: 'engine',
      options: [
        { id: 'engine-stock', name: 'Stock Engine Tuning', priceUSD: 0, cameraPreset: 'engine' },
        { id: 'engine-stage1', name: 'EMS Upgrade, Level 1', priceUSD: 9000, cameraPreset: 'engine', statGains: { topSpeed: 4, accel: 6 } },
        { id: 'engine-stage2', name: 'EMS Upgrade, Level 2', priceUSD: 13500, cameraPreset: 'engine', statGains: { topSpeed: 8, accel: 12 } },
        { id: 'engine-stage3', name: 'EMS Upgrade, Level 3', priceUSD: 19000, cameraPreset: 'engine', statGains: { topSpeed: 12, accel: 18 } },
        { id: 'engine-stage4', name: 'EMS Upgrade, Level 4 (Race Tune)', priceUSD: 33500, cameraPreset: 'engine', statGains: { topSpeed: 18, accel: 25 } }
      ]
    },
    {
      id: 'exhaust',
      name: 'EXHAUST',
      description: 'High-flow titanium exhaust pipes and anti-lag flame deceleration.',
      cameraPreset: 'exhaust',
      options: [
        { id: 'exhaust-stock', name: 'Stock Exhaust', priceUSD: 0, cameraPreset: 'exhaust' },
        { id: 'exhaust-chrome', name: 'Dual Chrome Tips', priceUSD: 1200, cameraPreset: 'exhaust', statGains: { accel: 2 } },
        { id: 'exhaust-titanium', name: 'Dual Titanium Burnt Tips', priceUSD: 3800, cameraPreset: 'exhaust', statGains: { topSpeed: 3, accel: 5 } },
        { id: 'exhaust-oval', name: 'Race Oval Track Exhaust', priceUSD: 5200, cameraPreset: 'exhaust', statGains: { topSpeed: 5, accel: 8 } },
        { id: 'exhaust-flame', name: 'Titanium Straight Pipes (Anti-Lag)', priceUSD: 8500, cameraPreset: 'exhaust', statGains: { topSpeed: 7, accel: 11 } }
      ]
    },
    {
      id: 'neon',
      name: 'NEON KITS (UNDERGLOW)',
      description: 'High-intensity 360° underglow ground neon illumination.',
      cameraPreset: 'hero',
      options: [
        { id: 'neon-off', name: 'Neon Off', priceUSD: 0, cameraPreset: 'hero' },
        { id: 'neon-cyan', name: 'Electric Cyan Underglow', priceUSD: 2800, colorHex: '#00E5FF', cameraPreset: 'hero' },
        { id: 'neon-green', name: 'Acid Green Underglow', priceUSD: 2800, colorHex: '#39FF14', cameraPreset: 'hero' },
        { id: 'neon-purple', name: 'Neon Purple Underglow', priceUSD: 2800, colorHex: '#D946EF', cameraPreset: 'hero' },
        { id: 'neon-amber', name: 'Hot Amber Underglow', priceUSD: 2800, colorHex: '#F59E0B', cameraPreset: 'hero' },
        { id: 'neon-crimson', name: 'Pure Crimson Underglow', priceUSD: 2800, colorHex: '#FF0055', cameraPreset: 'hero' }
      ]
    },
    {
      id: 'respray',
      name: 'RESPRAY (PAINT BOOTH)',
      description: 'Chamber spray booth with metallic, matte, and pearlescent finishes.',
      cameraPreset: 'hero',
      options: [
        { id: 'respray-blue', name: 'Ultra Blue Metallic', priceUSD: 1800, colorHex: '#0070F3', cameraPreset: 'hero' },
        { id: 'respray-purple', name: 'Midnight Purple Pearl', priceUSD: 2400, colorHex: '#8B5CF6', cameraPreset: 'hero' },
        { id: 'respray-yellow', name: 'Race Yellow Gloss', priceUSD: 1500, colorHex: '#EAB308', cameraPreset: 'hero' },
        { id: 'respray-red', name: 'Candy Apple Red', priceUSD: 2200, colorHex: '#EF4444', cameraPreset: 'hero' },
        { id: 'respray-black', name: 'Matte Obsidian', priceUSD: 3000, colorHex: '#181A20', cameraPreset: 'hero' },
        { id: 'respray-mint', name: 'Mint Pearl Lime', priceUSD: 2600, colorHex: '#10B981', cameraPreset: 'hero' },
        { id: 'respray-white', name: 'Chalk White Gloss', priceUSD: 1700, colorHex: '#F3F4F6', cameraPreset: 'hero' }
      ]
    },
    {
      id: 'spoiler',
      name: 'SPOILERS & AERO',
      description: 'Rear downforce wings and high-speed stability spoilers.',
      cameraPreset: 'rear',
      options: [
        { id: 'spoiler-stock', name: 'Stock Aero', priceUSD: 0, cameraPreset: 'rear' },
        { id: 'spoiler-ducktail', name: 'Ducktail Lip Spoiler', priceUSD: 2800, cameraPreset: 'rear', statGains: { traction: 4 } },
        { id: 'spoiler-gt', name: 'High Level GT Wing', priceUSD: 6500, cameraPreset: 'rear', statGains: { traction: 9, topSpeed: -1 } },
        { id: 'spoiler-drag', name: 'Competition Carbon Wing', priceUSD: 9800, cameraPreset: 'rear', statGains: { traction: 14, topSpeed: -2 } }
      ]
    },
    {
      id: 'suspension',
      name: 'SUSPENSION',
      description: 'Lower chassis center of gravity and competitive track stance.',
      cameraPreset: 'side',
      options: [
        { id: 'suspension-stock', name: 'Stock Suspension', priceUSD: 0, cameraPreset: 'side' },
        { id: 'suspension-lowered', name: 'Lowered Suspension', priceUSD: 1200, cameraPreset: 'side', statGains: { traction: 3 } },
        { id: 'suspension-street', name: 'Street Suspension', priceUSD: 2400, cameraPreset: 'side', statGains: { traction: 6 } },
        { id: 'suspension-sport', name: 'Sport Suspension', priceUSD: 3800, cameraPreset: 'side', statGains: { traction: 10 } },
        { id: 'suspension-slammed', name: 'Competition Slammed Suspension', priceUSD: 5500, cameraPreset: 'side', statGains: { traction: 15 } }
      ]
    },
    {
      id: 'turbo',
      name: 'TURBO',
      description: 'Forced induction turbocharger kit with blow-off wastegate flutter.',
      cameraPreset: 'engine',
      options: [
        { id: 'turbo-none', name: 'None (Naturally Aspirated)', priceUSD: 0, cameraPreset: 'engine' },
        { id: 'turbo-stage3', name: 'Turbo Tuning (Twin-Scroll)', priceUSD: 12500, cameraPreset: 'engine', statGains: { topSpeed: 14, accel: 22 } }
      ]
    },
    {
      id: 'wheels',
      name: 'WHEELS',
      description: 'Modular forged rims, lightweight alloys, and competition track tires.',
      cameraPreset: 'wheel',
      options: [
        { id: 'wheels-stock', name: 'Stock Factory Rims', priceUSD: 0, cameraPreset: 'wheel' },
        { id: 'wheels-tuner', name: 'Tuner Deep-Dish Mesh', priceUSD: 3800, cameraPreset: 'wheel', statGains: { traction: 4 } },
        { id: 'wheels-forged', name: 'Forged Monoblock Track', priceUSD: 5600, cameraPreset: 'wheel', statGains: { traction: 8, accel: 3 } },
        { id: 'wheels-aero', name: 'Carbon Aero Turbofan', priceUSD: 8200, cameraPreset: 'wheel', statGains: { traction: 11, topSpeed: 2 } }
      ]
    }
  ], []);

  const activeCategory = categories[activeCategoryIndex];
  const activeSubmenu = activeSubmenuId ? categories.find(c => c.id === activeSubmenuId) : null;
  const currentOptions = activeSubmenu ? activeSubmenu.options : [];
  const highlightedOption = activeSubmenu ? currentOptions[activeOptionIndex] : null;

  // Calculate live HUD stats with prospective gains
  const prospectiveGains = highlightedOption?.statGains || {};
  const prospectiveTopSpeed = prospectiveGains.topSpeed || prospectiveGains.speed || 0;
  const prospectiveBraking = prospectiveGains.braking || prospectiveGains.brake || 0;
  const currentStats = {
    topSpeed: Math.min(100, baseStats.topSpeed + (hasTurbo ? 14 : 0) + (installedUpgrades.engine === 'engine-stage4' ? 18 : 6)),
    acceleration: Math.min(100, baseStats.acceleration + (hasTurbo ? 22 : 0) + (installedUpgrades.engine === 'engine-stage4' ? 25 : 8)),
    braking: Math.min(100, baseStats.braking + (installedUpgrades.brakes === 'brakes-ceramic' ? 20 : 6)),
    traction: Math.min(100, baseStats.traction + (stanceLevel === 'slammed' ? 15 : stanceLevel === 'street' ? 8 : 2))
  };

  const previewStats = {
    topSpeed: Math.min(100, currentStats.topSpeed + prospectiveTopSpeed),
    acceleration: Math.min(100, currentStats.acceleration + (prospectiveGains.accel || 0)),
    braking: Math.min(100, currentStats.braking + prospectiveBraking),
    traction: Math.min(100, currentStats.traction + (prospectiveGains.traction || 0))
  };

  // Sound Toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    lsAudio.enabled = next;
    if (next) lsAudio.playRatchet();
    toast.info(next ? 'Sound FX: ON' : 'Sound FX: OFF');
  };

  // Sound on cursor move
  const playCursorClick = () => {
    if (soundEnabled) lsAudio.playRatchet();
  };

  // Handle selecting a category to enter its submenu
  const handleSelectCategory = (cat: MenuCategory, index: number) => {
    setActiveCategoryIndex(index);
    setActiveSubmenuId(cat.id);
    setActiveOptionIndex(0);
    setActiveCamera(cat.cameraPreset);
    setHoodOpen(cat.id === 'engine' || cat.id === 'turbo');
    playCursorClick();
  };

  // Back button (return to categories list)
  const handleBackToCategories = () => {
    setActiveSubmenuId(null);
    setActiveCamera('hero');
    setHoodOpen(false);
    playCursorClick();
  };

  // Apply / Install an option
  const handleInstallOption = (category: MenuCategory, option: MenuOption) => {
    setInstalledUpgrades(prev => ({ ...prev, [category.id]: option.id }));

    // Apply specific visual changes
    if (category.id === 'respray' && option.colorHex) {
      setPaintColor(option.colorHex);
      if (soundEnabled) lsAudio.playSpray();
      toast.success(`Respray Applied: ${option.name}`);
    } else if (category.id === 'neon') {
      if (option.id === 'neon-off') {
        setHasNeon(false);
      } else if (option.colorHex) {
        setHasNeon(true);
        setNeonColor(option.colorHex);
      }
      playCursorClick();
      toast.success(`Neon Kit Installed: ${option.name}`);
    } else if (category.id === 'turbo') {
      const active = option.id !== 'turbo-none';
      setHasTurbo(active);
      if (active && soundEnabled) lsAudio.playTurboWhistle();
      toast.success(active ? 'Stage 3 Turbocharger Installed (+22% Accel)' : 'Turbocharger Removed');
    } else if (category.id === 'suspension') {
      if (soundEnabled) lsAudio.playHydraulics();
      if (option.id === 'suspension-slammed') {
        setStanceLevel('slammed');
        setRideHeight(0.2);
        setCamberAngle(-3.8);
      } else if (option.id === 'suspension-sport') {
        setStanceLevel('street');
        setRideHeight(0.35);
        setCamberAngle(-2.5);
      } else {
        setStanceLevel('stock');
        setRideHeight(0.5);
        setCamberAngle(-1.0);
      }
      toast.success(`Suspension Stance: ${option.name}`);
    } else if (category.id === 'spoiler') {
      if (option.id === 'spoiler-drag') setSpoilerType('drag');
      else if (option.id === 'spoiler-gt') setSpoilerType('gt_wing');
      else if (option.id === 'spoiler-ducktail') setSpoilerType('ducktail');
      else setSpoilerType('stock');
      playCursorClick();
      toast.success(`Aero Wing Mounted: ${option.name}`);
    } else {
      playCursorClick();
      toast.success(`Installed: ${option.name} ($${option.priceUSD.toLocaleString()})`);
    }
  };

  // Keyboard navigation for full in-game console feel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        playCursorClick();
        if (activeSubmenu) {
          setActiveOptionIndex(prev => (prev > 0 ? prev - 1 : currentOptions.length - 1));
        } else {
          setActiveCategoryIndex(prev => (prev > 0 ? prev - 1 : categories.length - 1));
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        playCursorClick();
        if (activeSubmenu) {
          setActiveOptionIndex(prev => (prev < currentOptions.length - 1 ? prev + 1 : 0));
        } else {
          setActiveCategoryIndex(prev => (prev < categories.length - 1 ? prev + 1 : 0));
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeSubmenu && highlightedOption) {
          handleInstallOption(activeSubmenu, highlightedOption);
        } else if (!activeSubmenu) {
          handleSelectCategory(activeCategory, activeCategoryIndex);
        }
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        if (activeSubmenu) {
          handleBackToCategories();
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (soundEnabled) lsAudio.playEngineRev();
        toast.info('Dyno Rev: Engine test active');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSubmenu, activeOptionIndex, activeCategoryIndex, currentOptions, highlightedOption, activeCategory, soundEnabled]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[640px] bg-[#0A0C0E] text-white overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* 1. 3D AUTOMOTIVE WORKSHOP HOIST CANVAS (FULLSCREEN CENTERSTAGE) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <GarageScene
          vehicle={activeVehicle}
          activePreset={activeCamera}
          paintColor={paintColor}
          paintFinish={paintFinish}
          spoilerType={spoilerType}
          rideHeight={rideHeight}
          camberAngle={camberAngle}
          hoodOpen={hoodOpen}
          doorsOpen={doorsOpen}
          headlightsOn={true}
          wireframe={false}
          autoRotate={false}
          showHotspots={false}
        />

        {/* Dynamic Neon Reflection under car */}
        {hasNeon && (
          <div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 h-24 rounded-full blur-3xl opacity-75 pointer-events-none transition-colors duration-500"
            style={{ backgroundColor: neonColor }}
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP RIGHT HUD: DRIVER FUNDS & PLATFORM SPEC */}
      {/* ========================================================================= */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        {/* Audio Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className="p-2 rounded-xl bg-black/75 hover:bg-black border border-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
          title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FFB800]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
        </button>

        {/* Vehicle Platform Pill */}
        <div className="px-3.5 py-1.5 rounded-xl bg-black/80 border border-white/20 backdrop-blur-md text-xs font-mono hidden sm:flex items-center gap-2">
          <Car className="w-3.5 h-3.5 text-[#FFB800]" />
          <span className="text-white font-bold">{activeVehicle.year} {activeVehicle.make} {activeVehicle.model}</span>
        </div>

        {/* GTA V Digital Cash Balance HUD */}
        <div className="px-4 py-2 rounded-xl bg-black/90 border border-[#39FF14]/40 backdrop-blur-md shadow-lg shadow-black/60 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#39FF14]" />
          <span className="font-mono text-base font-black text-[#39FF14] tracking-wider tabular-nums">
            $ 485,250
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ICONIC GTA 5 VERTICAL MENU OVERLAY (LEFT SIDE OF SCREEN) */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 z-20 w-80 sm:w-88 md:w-96 flex flex-col max-h-[calc(100vh-140px)]">
        
        {/* Menu Main Frame */}
        <div className="bg-[#0B0D11]/95 border-2 border-white/20 shadow-2xl backdrop-blur-xl rounded-none flex flex-col overflow-hidden">
          
          {/* Menu Top Banner (The Classic Black & Gold Header) */}
          <div className="bg-gradient-to-r from-black via-[#14161B] to-black px-4 py-3 border-b-2 border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#FFB800] text-black font-black font-mono text-xs flex items-center justify-center">
                DF
              </div>
              <div>
                <h2 className="text-sm font-black font-sans uppercase tracking-widest text-white leading-none">
                  DRIVEFORGE CUSTOMS
                </h2>
                <span className="text-[9px] font-mono text-[#FFB800] uppercase tracking-wider block mt-0.5">
                  BAY 04 • SAN ANDREAS
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#FFB800] text-black px-2 py-0.5 rounded">
              HOIST #01
            </span>
          </div>

          {/* Subheader: Category Title & Item Index */}
          <div className="bg-[#1C1F26] px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs font-mono text-gray-300">
            {activeSubmenu ? (
              <button
                type="button"
                onClick={handleBackToCategories}
                className="flex items-center gap-1 text-[#FFB800] font-bold hover:underline cursor-pointer uppercase"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{activeSubmenu.name}</span>
              </button>
            ) : (
              <span className="font-bold text-white uppercase tracking-wider">
                CATEGORIES
              </span>
            )}

            <span className="text-[10px] text-gray-400 font-bold">
              {activeSubmenu
                ? `${activeOptionIndex + 1} / ${currentOptions.length}`
                : `${activeCategoryIndex + 1} / ${categories.length}`}
            </span>
          </div>

          {/* Scrollable Option Items (The Classic GTA V Cursor List) */}
          <div className="overflow-y-auto max-h-[380px] divide-y divide-white/5 scrollbar-thin">
            
            {/* LEVEL 1: SUBMENU OPTIONS LIST */}
            {activeSubmenu ? (
              currentOptions.map((option, idx) => {
                const isHighlighted = idx === activeOptionIndex;
                const isInstalled = installedUpgrades[activeSubmenu.id] === option.id;

                return (
                  <div
                    key={option.id}
                    onMouseEnter={() => {
                      setActiveOptionIndex(idx);
                      playCursorClick();
                      if (option.cameraPreset) setActiveCamera(option.cameraPreset);
                    }}
                    onClick={() => handleInstallOption(activeSubmenu, option)}
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                      isHighlighted
                        ? 'bg-white text-black font-black'
                        : 'bg-black/60 text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {isInstalled ? (
                        <Check className={`w-4 h-4 shrink-0 ${isHighlighted ? 'text-black' : 'text-emerald-400'}`} />
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isHighlighted ? 'bg-black' : 'bg-gray-500'}`} />
                      )}
                      <span className="text-xs uppercase truncate font-mono">
                        {option.name}
                      </span>
                    </div>

                    <div className="shrink-0 ml-2 font-mono text-xs">
                      {isInstalled ? (
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isHighlighted ? 'bg-black text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          INSTALLED
                        </span>
                      ) : option.priceUSD === 0 ? (
                        <span className={isHighlighted ? 'text-black' : 'text-gray-400'}>FREE</span>
                      ) : (
                        <span className={`font-bold ${isHighlighted ? 'text-black' : 'text-[#FFB800]'}`}>
                          ${option.priceUSD.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              /* LEVEL 0: MAIN CATEGORIES LIST */
              categories.map((cat, idx) => {
                const isHighlighted = idx === activeCategoryIndex;
                const installedId = installedUpgrades[cat.id];
                const installedOption = cat.options.find(o => o.id === installedId);

                return (
                  <div
                    key={cat.id}
                    onMouseEnter={() => {
                      setActiveCategoryIndex(idx);
                      playCursorClick();
                      if (cat.cameraPreset) setActiveCamera(cat.cameraPreset);
                    }}
                    onClick={() => handleSelectCategory(cat, idx)}
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                      isHighlighted
                        ? 'bg-white text-black font-black'
                        : 'bg-black/60 text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isHighlighted ? 'bg-black' : 'bg-[#FFB800]'}`} />
                      <span className="text-xs uppercase truncate font-mono">
                        {cat.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2 font-mono text-xs">
                      {installedOption && installedOption.priceUSD > 0 && (
                        <span className={`text-[10px] truncate max-w-[90px] ${isHighlighted ? 'text-black/80 font-bold' : 'text-gray-400'}`}>
                          {installedOption.name.split(' ')[0]}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isHighlighted ? 'text-black' : 'text-gray-400'}`} />
                    </div>
                  </div>
                );
              })
            )}

          </div>

          {/* Menu Bottom Action Drawer */}
          <div className="p-3 bg-black/95 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            {activeSubmenu ? (
              <button
                type="button"
                onClick={handleBackToCategories}
                className="text-[#FFB800] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Return to Categories</span>
              </button>
            ) : (
              <span className="text-gray-400 text-[11px]">
                {activeCategory.description}
              </span>
            )}
            
            <button
              type="button"
              onClick={() => navigateTo('/build')}
              className="px-3 py-1.5 rounded bg-[#FFB800] hover:bg-[#FFA000] text-black font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>Build Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM RIGHT: ICONIC GTA V 4 HORIZONTAL PERFORMANCE STAT BARS */}
      {/* ========================================================================= */}
      <div className="absolute bottom-14 right-4 z-20 w-80 sm:w-96 bg-black/90 border-2 border-white/20 p-4 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-3">
          <span className="text-xs font-mono font-black uppercase text-white tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Vehicle Telemetry Spec</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            STAGE 3 DYNO
          </span>
        </div>

        {/* 4 Performance Bars with Prospective Gains Indicator */}
        <div className="space-y-2.5 text-xs font-mono">
          
          {/* 1. Top Speed */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-gray-400 uppercase font-bold">Top Speed</span>
              <span className="text-white font-bold tabular-nums">
                {previewStats.topSpeed} / 100
                {prospectiveTopSpeed > 0 ? (
                  <span className="text-[#38BDF8] ml-1">+{prospectiveTopSpeed}</span>
                ) : null}
              </span>
            </div>
            <div className="w-full bg-white/15 h-2.5 rounded-none overflow-hidden flex">
              <div className="bg-[#0070F3] h-full" style={{ width: `${currentStats.topSpeed}%` }} />
              {previewStats.topSpeed > currentStats.topSpeed && (
                <div
                  className="bg-[#38BDF8] h-full animate-pulse"
                  style={{ width: `${previewStats.topSpeed - currentStats.topSpeed}%` }}
                />
              )}
            </div>
          </div>

          {/* 2. Acceleration */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-gray-400 uppercase font-bold">Acceleration</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {previewStats.acceleration} / 100
                {prospectiveGains.accel ? (
                  <span className="text-emerald-300 ml-1">+{prospectiveGains.accel}%</span>
                ) : null}
              </span>
            </div>
            <div className="w-full bg-white/15 h-2.5 rounded-none overflow-hidden flex">
              <div className="bg-emerald-500 h-full" style={{ width: `${currentStats.acceleration}%` }} />
              {previewStats.acceleration > currentStats.acceleration && (
                <div
                  className="bg-emerald-300 h-full animate-pulse"
                  style={{ width: `${previewStats.acceleration - currentStats.acceleration}%` }}
                />
              )}
            </div>
          </div>

          {/* 3. Braking */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-gray-400 uppercase font-bold">Braking</span>
              <span className="text-[#FFB800] font-bold tabular-nums">
                {previewStats.braking} / 100
                {prospectiveGains.brake ? (
                  <span className="text-yellow-200 ml-1">+{prospectiveGains.brake}</span>
                ) : null}
              </span>
            </div>
            <div className="w-full bg-white/15 h-2.5 rounded-none overflow-hidden flex">
              <div className="bg-[#FFB800] h-full" style={{ width: `${currentStats.braking}%` }} />
              {previewStats.braking > currentStats.braking && (
                <div
                  className="bg-yellow-200 h-full animate-pulse"
                  style={{ width: `${previewStats.braking - currentStats.braking}%` }}
                />
              )}
            </div>
          </div>

          {/* 4. Traction */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-gray-400 uppercase font-bold">Traction</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {previewStats.traction} / 100
                {prospectiveGains.traction ? (
                  <span className="text-cyan-200 ml-1">+{prospectiveGains.traction}</span>
                ) : null}
              </span>
            </div>
            <div className="w-full bg-white/15 h-2.5 rounded-none overflow-hidden flex">
              <div className="bg-cyan-400 h-full" style={{ width: `${currentStats.traction}%` }} />
              {previewStats.traction > currentStats.traction && (
                <div
                  className="bg-cyan-200 h-full animate-pulse"
                  style={{ width: `${previewStats.traction - currentStats.traction}%` }}
                />
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM COMMANDS & KEYBOARD PROMPT STRIP (GTA 5 HUD HELPER) */}
      {/* ========================================================================= */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-black/95 border-t border-white/20 px-4 py-2.5 flex items-center justify-between text-[11px] font-mono text-gray-300">
        
        {/* Left: Keyboard & Controller Action Prompts */}
        <div className="flex items-center gap-4 overflow-x-auto">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-white font-bold text-[10px]">ENTER</kbd>
            <span>Select Upgrade</span>
          </span>

          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-white font-bold text-[10px]">ESC</kbd>
            <span>Back</span>
          </span>

          <span className="flex items-center gap-1.5 hidden sm:flex">
            <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-white font-bold text-[10px]">↑ / ↓</kbd>
            <span>Navigate</span>
          </span>

          <span className="flex items-center gap-1.5 hidden md:flex">
            <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-white font-bold text-[10px]">DRAG</kbd>
            <span>Orbit Car 360°</span>
          </span>

          <span className="flex items-center gap-1.5 hidden md:flex">
            <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-white font-bold text-[10px]">SPACE</kbd>
            <span>Dyno Rev</span>
          </span>
        </div>

        {/* Right: Quick Camera Angle Presets */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {(['hero', 'front', 'rear', 'wheel', 'exhaust'] as CameraTargetId[]).map(cam => (
            <button
              key={cam}
              type="button"
              onClick={() => {
                setActiveCamera(cam);
                playCursorClick();
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold transition-colors cursor-pointer ${
                activeCamera === cam ? 'bg-[#FFB800] text-black' : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              {cam}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};
