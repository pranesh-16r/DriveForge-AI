import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CompatibilitySimulatorService,
  ENGINE_PLATFORMS,
  TESTABLE_PARTS,
  PRESET_SIMULATION_SCENARIOS
} from '../../services/compatibilitySimulatorService';
import {
  SimulationConfig,
  CompatibilitySimulationResult,
  FuelBlend,
  SimulationPreset
} from '../../types/compatibilitySimulator';
import { useApp } from '../../context/AppContext';
import { NeoButton } from '../ui/NeoButton';
import { Badge } from '../../../components/ui/badge';
import { Switch } from '../../../components/ui/switch';
import { Slider } from '../../../components/ui/slider';
import { Progress } from '../../../components/ui/progress';
import { Separator } from '../../../components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../../components/ui/tooltip';
import { toast } from 'sonner';
import {
  Cpu,
  Flame,
  Gauge,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wrench,
  Zap,
  Activity,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Layers,
  Thermometer,
  Fuel,
  Sliders,
  ChevronRight,
  Info,
  Car
} from 'lucide-react';

interface PartCompatibilitySimulatorProps {
  initialEngineId?: string;
  initialPartId?: string;
  onAddedToBuild?: () => void;
}

export const PartCompatibilitySimulator: React.FC<PartCompatibilitySimulatorProps> = ({
  initialEngineId,
  initialPartId,
  onAddedToBuild
}) => {
  const { activeVehicle, addComponentToBuild, navigateTo } = useApp();

  // Try to find matching engine for active vehicle if available
  const defaultEngineId = useMemo(() => {
    if (initialEngineId) return initialEngineId;
    if (activeVehicle) {
      const match = ENGINE_PLATFORMS.find(e => e.compatibleVehicleIds.includes(activeVehicle.id));
      if (match) return match.id;
    }
    return ENGINE_PLATFORMS[0].id;
  }, [initialEngineId, activeVehicle]);

  const [config, setConfig] = useState<SimulationConfig>({
    engineId: defaultEngineId,
    partId: initialPartId || TESTABLE_PARTS[0].id,
    targetBoostPsi: 26,
    fuelBlend: 'pump_93',
    hasUpgradedDownpipe: true,
    hasUpgradedHpfp: false,
    hasUpgradedIntercooler: true,
    hasEcuTune: true,
    hasForgedInternals: false,
    hasClutchUpgrade: false
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationPhase, setSimulationPhase] = useState<string>('');
  const [simulationResult, setSimulationResult] = useState<CompatibilitySimulationResult>(() =>
    CompatibilitySimulatorService.simulate(config)
  );
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const selectedEngine = useMemo(() => {
    return CompatibilitySimulatorService.getEngineById(config.engineId) || ENGINE_PLATFORMS[0];
  }, [config.engineId]);

  const selectedPart = useMemo(() => {
    return CompatibilitySimulatorService.getPartById(config.partId) || TESTABLE_PARTS[0];
  }, [config.partId]);

  // Adjust target boost when part changes
  useEffect(() => {
    if (selectedPart.category === 'turbocharger') {
      const defaultBoost = Math.max(selectedEngine.maxStockBoostPsi + 6, selectedPart.ratedBoostRangePsi[0] + 4);
      setConfig(prev => ({
        ...prev,
        targetBoostPsi: Math.min(selectedPart.ratedBoostRangePsi[1], defaultBoost)
      }));
    }
  }, [selectedPart.id, selectedEngine.id]);

  // Run simulation calculation
  const runSimulation = (newConfig?: SimulationConfig) => {
    const targetConfig = newConfig || config;
    setIsSimulating(true);

    const phases = [
      'Scanning physical flange bolt patterns & clearance...',
      'Solving thermodynamic enthalpy & compression ratio...',
      'Modeling fuel rail pressure & injector duty cycle...',
      'Analyzing connecting rod tensile stress & thermal index...'
    ];

    let phaseIdx = 0;
    setSimulationPhase(phases[0]);

    const interval = setInterval(() => {
      phaseIdx += 1;
      if (phaseIdx < phases.length) {
        setSimulationPhase(phases[phaseIdx]);
      } else {
        clearInterval(interval);
        const result = CompatibilitySimulatorService.simulate(targetConfig);
        setSimulationResult(result);
        setIsSimulating(false);
      }
    }, 120);
  };

  // Immediate recalculation when toggles change without lengthy delay
  const handleConfigChange = (updates: Partial<SimulationConfig>) => {
    const updated = { ...config, ...updates };
    setConfig(updated);
    setActivePresetId(null);
    const result = CompatibilitySimulatorService.simulate(updated);
    setSimulationResult(result);
  };

  const handleApplyPreset = (preset: SimulationPreset) => {
    setActivePresetId(preset.id);
    const newConfig: SimulationConfig = {
      engineId: preset.engineId,
      partId: preset.partId,
      targetBoostPsi: preset.targetBoostPsi,
      fuelBlend: preset.fuelBlend,
      hasUpgradedDownpipe: preset.hasUpgradedDownpipe,
      hasUpgradedHpfp: preset.hasUpgradedHpfp,
      hasUpgradedIntercooler: preset.hasUpgradedIntercooler,
      hasEcuTune: preset.hasEcuTune,
      hasForgedInternals: preset.hasForgedInternals,
      hasClutchUpgrade: preset.hasClutchUpgrade
    };
    setConfig(newConfig);
    runSimulation(newConfig);
    toast.info(`Loaded Preset: ${preset.title}`, {
      description: `${preset.targetBoostPsi} PSI • ${preset.fuelBlend.replace('_', ' ').toUpperCase()}`
    });
  };

  const handleTransferToActiveBuild = () => {
    // Attempt to match with MODIFICATION_COMPONENTS
    const fakeComp: any = {
      id: selectedPart.id,
      name: selectedPart.name,
      category: selectedPart.category === 'turbocharger' ? 'powertrain' : selectedPart.category,
      brand: selectedPart.brand,
      partNumber: selectedPart.partNumber,
      priceUSD: selectedPart.priceUSD,
      installHours: 6.5,
      powerGainHp: simulationResult.telemetry.deltaHp,
      weightDeltaKg: 1.5,
      compatibilityRating: simulationResult.status === 'fully_compatible' ? 'compatible' : 'verificationRequired',
      compatibilityNotes: simulationResult.summary,
      description: selectedPart.description,
      specifications: {
        'Max Power Support': `${selectedPart.maxHpSupport} HP`,
        'Boost Pressure Tested': `${config.targetBoostPsi} PSI`,
        'Fuel Tested': config.fuelBlend.replace('_', ' ').toUpperCase(),
        'Engine Fitment': selectedEngine.name
      },
      imageUrl: selectedPart.imageUrl
    };

    addComponentToBuild(fakeComp);
    setAddedNotice(true);
    toast.success(`Transferred ${selectedPart.name} to active build!`, {
      description: `Engine: ${selectedEngine.name} • Projected Power: ${simulationResult.telemetry.projectedHp} HP (+${simulationResult.telemetry.deltaHp} HP)`
    });
    if (onAddedToBuild) onAddedToBuild();
    setTimeout(() => setAddedNotice(false), 3500);
  };

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 1. PRESET SCENARIOS QUICK STRIP (e.g., Turbo on Engine Simulation) */}
      {/* ========================================================================= */}
      <div className="neo-panel rounded-3xl p-5 border border-white/5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0070F3]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
              Simulation Test Scenarios (Quick Presets)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            Click any scenario to simulate compatibility & failure modes instantly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_SIMULATION_SCENARIOS.map(preset => {
            const isSelected = activePresetId === preset.id;
            let badgeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            if (preset.badgeColor === 'red') badgeBg = 'bg-red-500/10 text-red-400 border-red-500/20';
            if (preset.badgeColor === 'green') badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            if (preset.badgeColor === 'amber') badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            if (preset.badgeColor === 'crimson') badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`
                  p-3 rounded-2xl text-left transition-all border flex flex-col justify-between cursor-pointer group
                  ${isSelected
                    ? 'bg-[#0070F3]/10 border-[#0070F3] shadow-[0_0_15px_rgba(0,112,243,0.25)]'
                    : 'bg-[#181B20]/60 border-white/5 hover:border-white/20 hover:bg-[#1E2229]'
                  }
                `}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-gray-400 uppercase">
                    {preset.badge}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#0070F3] transition-colors leading-snug">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{preset.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE COMPATIBILITY COCKPIT (Engine + Part Selection & Parameters) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Platform & Hardware Selectors */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Engine Platform Selector */}
          <div className="neo-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#0070F3]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Engine Architecture & Geometry
                </h3>
              </div>
              <span className="text-xs font-mono text-gray-400">
                {selectedEngine.code}
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-gray-400">Select Engine Platform</label>
              <select
                value={config.engineId}
                onChange={e => handleConfigChange({ engineId: e.target.value })}
                className="w-full bg-[#121417] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0070F3] font-medium"
              >
                {ENGINE_PLATFORMS.map(eng => (
                  <option key={eng.id} value={eng.id} className="bg-[#181B20] text-white">
                    {eng.name} ({eng.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Engine Quick Specs Card */}
            <div className="p-3.5 rounded-2xl bg-[#121417]/80 border border-white/5 space-y-2.5">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Aspiration</span>
                  <span className="font-bold text-white uppercase text-[11px]">
                    {selectedEngine.aspiration.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Displacement</span>
                  <span className="font-bold text-white text-[11px]">
                    {selectedEngine.displacementL > 0 ? `${selectedEngine.displacementL} Liters` : 'Dual Electric Stator'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Static Compression</span>
                  <span className={`font-bold font-mono text-[11px] ${selectedEngine.compressionRatio >= 12.0 ? 'text-amber-400' : 'text-white'}`}>
                    {selectedEngine.compressionRatio > 0 ? `${selectedEngine.compressionRatio}:1` : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Factory Power</span>
                  <span className="font-bold text-white text-[11px]">
                    {selectedEngine.factoryHp} HP / {selectedEngine.factoryTorqueLbFt} lb-ft
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 border-t border-white/5 pt-2 leading-relaxed">
                {selectedEngine.description}
              </p>
            </div>
          </div>

          {/* Component / Turbocharger Selector */}
          <div className="neo-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Component Under Test
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                ${selectedPart.priceUSD.toLocaleString()} USD
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-gray-400">Select Part / Turbocharger</label>
              <select
                value={config.partId}
                onChange={e => handleConfigChange({ partId: e.target.value })}
                className="w-full bg-[#121417] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#10B981] font-medium"
              >
                {TESTABLE_PARTS.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#181B20] text-white">
                    {p.name} (${p.priceUSD.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Part Quick Specs Card */}
            <div className="p-3.5 rounded-2xl bg-[#121417]/80 border border-white/5 space-y-2.5">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Manufacturer</span>
                  <span className="font-bold text-white text-[11px]">{selectedPart.brand}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Part Number</span>
                  <span className="font-mono text-gray-300 text-[11px]">{selectedPart.partNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Flow Ceiling</span>
                  <span className="font-bold text-[#10B981] text-[11px]">Up to {selectedPart.maxHpSupport} HP</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">Flange Interface</span>
                  <span className="font-mono text-gray-300 text-[11px] truncate block" title={selectedPart.flangeType}>
                    {selectedPart.flangeType}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 border-t border-white/5 pt-2 leading-relaxed">
                {selectedPart.description}
              </p>
            </div>
          </div>

          {/* Simulation Operating Parameters */}
          <div className="neo-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Simulation Parameters
                </h3>
              </div>
              <span className="text-[11px] font-mono text-gray-400">Dynamic Telemetry</span>
            </div>

            {/* Boost Pressure Slider (Only visible if forced induction) */}
            {['turbocharger', 'supercharger'].includes(selectedPart.category) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase text-gray-300 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-[#38BDF8]" />
                    Target Boost Pressure:
                  </label>
                  <span className="text-sm font-mono font-bold text-[#38BDF8]">
                    {config.targetBoostPsi} PSI / {(config.targetBoostPsi * 0.0689476).toFixed(2)} Bar
                  </span>
                </div>
                <Slider
                  value={[config.targetBoostPsi]}
                  min={Math.max(6, selectedPart.ratedBoostRangePsi[0] - 4)}
                  max={Math.min(42, selectedPart.ratedBoostRangePsi[1] + 6)}
                  step={1}
                  onValueChange={(val: any) => {
                    const nextVal = Array.isArray(val) ? val[0] : val;
                    handleConfigChange({ targetBoostPsi: Number(nextVal) });
                  }}
                  className="w-full py-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>Factory: {selectedEngine.maxStockBoostPsi} PSI</span>
                  <span className={config.targetBoostPsi > selectedEngine.maxSafeStockBoostPsi ? 'text-amber-400 font-bold' : ''}>
                    Safe Stock Ceiling: {selectedEngine.maxSafeStockBoostPsi} PSI
                  </span>
                  <span>Max Rated: {selectedPart.ratedBoostRangePsi[1]} PSI</span>
                </div>
              </div>
            )}

            {/* Fuel Blend Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-gray-300 flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-amber-400" />
                Combustion Fuel Calibration:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'pump_91', label: '91 ACN', desc: 'Standard' },
                  { id: 'pump_93', label: '93 Octane', desc: 'Premium' },
                  { id: 'e85_flex', label: 'E85 Flex', desc: 'Ethanol' },
                  { id: 'race_100', label: '100+ Race', desc: 'Unleaded' },
                ].map(fuel => (
                  <button
                    key={fuel.id}
                    type="button"
                    onClick={() => handleConfigChange({ fuelBlend: fuel.id as FuelBlend })}
                    className={`
                      p-2 rounded-xl text-center border font-mono transition-all cursor-pointer
                      ${config.fuelBlend === fuel.id
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                        : 'bg-[#121417] border-white/5 text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-xs block">{fuel.label}</span>
                    <span className="text-[9px] text-gray-400 block">{fuel.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Supporting Hardware Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase text-gray-300 block">
                  Supporting Hardware Installed:
                </label>
                <Badge variant="outline" className="text-[10px] font-mono text-gray-400">
                  Adaptive Logic
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121417] border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-xs text-gray-300 font-sans">ECU Stage 2 Remap</span>
                  <Switch
                    checked={config.hasEcuTune}
                    onCheckedChange={(checked) => handleConfigChange({ hasEcuTune: Boolean(checked) })}
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121417] border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-xs text-gray-300 font-sans">High-Flow Downpipe</span>
                  <Switch
                    checked={config.hasUpgradedDownpipe}
                    onCheckedChange={(checked) => handleConfigChange({ hasUpgradedDownpipe: Boolean(checked) })}
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121417] border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-xs text-gray-300 font-sans">Upgraded HPFP (Fuel)</span>
                  <Switch
                    checked={config.hasUpgradedHpfp}
                    onCheckedChange={(checked) => handleConfigChange({ hasUpgradedHpfp: Boolean(checked) })}
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121417] border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-xs text-gray-300 font-sans">Upgraded Intercooler</span>
                  <Switch
                    checked={config.hasUpgradedIntercooler}
                    onCheckedChange={(checked) => handleConfigChange({ hasUpgradedIntercooler: Boolean(checked) })}
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121417] border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-xs text-gray-300 font-sans">Forged Rods & Pistons</span>
                  <Switch
                    checked={config.hasForgedInternals}
                    onCheckedChange={(checked) => handleConfigChange({ hasForgedInternals: Boolean(checked) })}
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121417] border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-xs text-gray-300 font-sans">Upgraded Clutch Pack</span>
                  <Switch
                    checked={config.hasClutchUpgrade}
                    onCheckedChange={(checked) => handleConfigChange({ hasClutchUpgrade: Boolean(checked) })}
                  />
                </div>
              </div>
            </div>

            {/* Run Full Scan Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => runSimulation()}
                disabled={isSimulating}
                className="w-full py-3.5 px-4 rounded-2xl neo-button-primary text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,112,243,0.4)] transition-all disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin text-white" />
                    <span>{simulationPhase}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Simulate Diagnostic Compatibility Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Telemetry & Results Display */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Status Header Card */}
          <div
            className={`
              neo-panel rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden
              ${simulationResult.statusColor === 'green'
                ? 'border-emerald-500/40 bg-gradient-to-br from-[#121417] via-[#121417] to-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                : simulationResult.statusColor === 'amber'
                ? 'border-amber-500/40 bg-gradient-to-br from-[#121417] via-[#121417] to-amber-950/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]'
                : simulationResult.statusColor === 'crimson'
                ? 'border-rose-500/50 bg-gradient-to-br from-[#121417] via-[#121417] to-rose-950/30 shadow-[0_0_35px_rgba(244,63,94,0.2)]'
                : 'border-red-500/40 bg-gradient-to-br from-[#121417] via-[#121417] to-red-950/25 shadow-[0_0_30px_rgba(239,68,68,0.15)]'
              }
            `}
          >
            {/* Top Badge Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                {simulationResult.statusColor === 'green' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : simulationResult.statusColor === 'amber' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                )}
                <span
                  className={`
                    text-xs font-mono font-black tracking-wider px-3 py-1 rounded-full border uppercase
                    ${simulationResult.statusColor === 'green'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : simulationResult.statusColor === 'amber'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : simulationResult.statusColor === 'crimson'
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }
                  `}
                >
                  {simulationResult.statusBadge}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                <span>Confidence:</span>
                <span className="font-bold text-white">{simulationResult.confidenceScore}%</span>
              </div>
            </div>

            {/* Title & Summary */}
            <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight mb-2">
              {simulationResult.title}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-sans mb-6">
              {simulationResult.summary}
            </p>

            {/* Telemetry Metric KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
              
              {/* Projected Power */}
              <div className="p-3 rounded-2xl bg-[#121417]/80 border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Projected Power</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-black text-white font-mono">
                    {simulationResult.telemetry.projectedHp}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">HP</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold block mt-0.5">
                  +{simulationResult.telemetry.deltaHp} HP Gain
                </span>
              </div>

              {/* Fuel Duty Cycle */}
              <div className="p-3 rounded-2xl bg-[#121417]/80 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Fuel Duty Cycle</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="cursor-help"><Info className="w-3 h-3 text-gray-400 hover:text-white" /></span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#181B20] text-gray-200 border border-white/10 font-mono text-[11px] p-2 max-w-xs">
                      Injector duty cycle &gt;85% risks fuel starvation and detonation without high-pressure fuel pump (HPFP) upgrade.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-lg font-black font-mono ${simulationResult.telemetry.fuelDutyCyclePct > 100 ? 'text-rose-400' : simulationResult.telemetry.fuelDutyCyclePct > 85 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {simulationResult.telemetry.fuelDutyCyclePct}%
                  </span>
                </div>
                <div className="pt-1">
                  <Progress
                    value={Math.min(100, simulationResult.telemetry.fuelDutyCyclePct)}
                    className="h-1.5 w-full bg-white/10"
                  />
                </div>
              </div>

              {/* Exhaust Heat / EGT */}
              <div className="p-3 rounded-2xl bg-[#121417]/80 border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Exhaust EGT</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-lg font-black font-mono ${simulationResult.telemetry.exhaustGasTempC > 950 ? 'text-rose-400' : simulationResult.telemetry.exhaustGasTempC > 880 ? 'text-amber-400' : 'text-white'}`}>
                    {simulationResult.telemetry.exhaustGasTempC}°C
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                  Limit: &lt;920°C
                </span>
              </div>

              {/* Rod Safety Factor */}
              <div className="p-3 rounded-2xl bg-[#121417]/80 border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Safety Margin</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-lg font-black font-mono ${simulationResult.telemetry.safetyFactor < 1.0 ? 'text-rose-400' : simulationResult.telemetry.safetyFactor < 1.15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {simulationResult.telemetry.safetyFactor}x
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 block mt-0.5 truncate">
                  {simulationResult.telemetry.safetyFactor >= 1.15 ? 'Safe Tensile' : 'Yield Warning'}
                </span>
              </div>
            </div>

            {/* Quick Action Button Strip */}
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-white/10">
              {simulationResult.isTransferableToBuild && (
                <button
                  type="button"
                  onClick={handleTransferToActiveBuild}
                  className="px-4 py-2.5 rounded-xl neo-button-primary text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Transfer Component to Active Build</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => navigateTo('/projects')}
                className="px-4 py-2.5 rounded-xl neo-raised hover:neo-raised-active text-gray-300 hover:text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-[#0070F3]" />
                <span>View Saved Projects</span>
              </button>

              {addedNotice && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Added {selectedPart.name} to active build!
                </span>
              )}
            </div>
          </div>

          {/* Diagnostic Check Subsystems (6 Systems) */}
          <div className="neo-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0070F3]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Engineering Telemetry & System Diagnostics
                </h3>
              </div>
              <span className="text-[11px] font-mono text-gray-400">6 Subsystem Passes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(simulationResult.checks).map(check => {
                let badgeClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                let icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;

                if (check.status === 'warning') {
                  badgeClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                  icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
                } else if (check.status === 'failed') {
                  badgeClass = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                  icon = <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
                }

                return (
                  <div
                    key={check.id}
                    className="p-3.5 rounded-2xl bg-[#121417]/80 border border-white/5 space-y-1.5 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {icon}
                        <h4 className="text-xs font-bold text-white truncate font-sans">{check.title}</h4>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeClass}`}>
                        {check.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-gray-300 font-semibold">
                      {check.metric}
                    </div>

                    <p className="text-[11px] text-gray-400 leading-normal font-sans">
                      {check.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Supporting Upgrades & Warnings */}
          {(simulationResult.requiredMods.length > 0 || simulationResult.warnings.length > 0 || simulationResult.recommendations.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Required Supporting Upgrades */}
              {simulationResult.requiredMods.length > 0 && (
                <div className="neo-panel rounded-3xl p-5 border border-amber-500/20 space-y-3 bg-[#181B20]/40">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Wrench className="w-4 h-4" />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                      Required Supporting Upgrades
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {simulationResult.requiredMods.map((mod, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-300 leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Engineering Recommendations & Best Practices */}
              {simulationResult.recommendations.length > 0 && (
                <div className="neo-panel rounded-3xl p-5 border border-white/5 space-y-3 bg-[#181B20]/40">
                  <div className="flex items-center gap-2 text-[#38BDF8]">
                    <Info className="w-4 h-4" />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                      Technical Recommendations
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {simulationResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-300 leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
