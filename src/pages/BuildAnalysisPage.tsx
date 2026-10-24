import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoButton } from '../components/ui/NeoButton';
import { DataConfidenceBadge } from '../components/analysis/DataConfidenceBadge';
import { DataSourceLabel } from '../components/analysis/DataSourceLabel';
import { VerificationNotice } from '../components/analysis/VerificationNotice';
import { ComparisonMetricCard } from '../components/analysis/ComparisonChart';
import { PerformanceService } from '../services/performanceService';
import { BuildPerformanceAnalysis } from '../types/analysis';
import {
  Wrench,
  Zap,
  Gauge,
  Scale,
  Car,
  Compass,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Layers,
  MapPin,
  ListOrdered,
  FileText,
  ArrowLeft,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Activity,
  Printer,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  Bot
} from 'lucide-react';

export const BuildAnalysisPage: React.FC = () => {
  const {
    activeVehicle,
    selectedCountry,
    selectedRegion,
    experienceMode,
    setExperienceMode,
    buildState,
    buildComponents,
    navigateTo
  } = useApp();

  const [isCalculating, setIsCalculating] = useState<boolean>(true);

  // Simulate short deterministic calculation pass on mount for tactile engineering experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCalculating(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeVehicle.id, buildComponents.length]);

  // Compute performance analysis deterministically
  const analysis: BuildPerformanceAnalysis = useMemo(() => {
    return PerformanceService.calculateBuildPerformance(activeVehicle, buildComponents, buildState);
  }, [activeVehicle, buildComponents, buildState]);

  const regionName = selectedRegion ? selectedRegion.name : 'Selected Region';
  const currencyCode = buildState.currency;
  const cost = buildState.costSummary;

  // Handle Empty Build State
  if (buildComponents.length === 0) {
    return (
      <PageContainer
        eyebrow="ENGINEERING PERFORMANCE INTELLIGENCE"
        title="Automotive Build Analysis & Telemetry"
        subtitle="Full deterministic powertrain, chassis kinematic, and thermal stress analysis based on physical component selections."
      >
        <div className="p-12 sm:p-16 rounded-[28px] neo-panel border border-white/10 bg-[#12141A] text-center space-y-5 max-w-2xl mx-auto my-10">
          <div className="w-16 h-16 rounded-2xl neo-inset border border-white/10 text-[#0070F3] flex items-center justify-center mx-auto shadow-inner">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black font-sans text-white uppercase tracking-wider">
              NO PHYSICAL MODIFICATIONS DETECTED
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              Build Analysis requires at least one physical component in your build to calculate powertrain delta, chassis kinematics, and thermal stress.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <NeoButton
              variant="outline"
              size="md"
              onClick={() => navigateTo('/build')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Build
            </NeoButton>
            <NeoButton
              variant="primary"
              size="md"
              onClick={() => navigateTo('/garage')}
              icon={<Car className="w-4 h-4" />}
            >
              Explore 3D Garage
            </NeoButton>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Calculating state
  if (isCalculating) {
    return (
      <PageContainer
        eyebrow="CALCULATING KINEMATICS & FLOW"
        title="Analyzing Build Telemetry..."
        subtitle="Computing cylinder brake mean effective pressure, damper curves, and unsprung rotational mass."
      >
        <div className="p-16 rounded-[28px] neo-panel border border-white/10 bg-[#12141A] text-center space-y-6 max-w-xl mx-auto my-12">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-2 border-[#0070F3]/20 border-t-[#0070F3] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-[#0070F3]">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
              ANALYZING BUILD...
            </h3>
            <p className="text-xs font-mono text-gray-400">
              Evaluating {buildComponents.length} components for {activeVehicle.year} {activeVehicle.model}
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      eyebrow="ENGINEERING PERFORMANCE INTELLIGENCE"
      title="WHAT WILL YOUR BUILD CHANGE?"
      subtitle={`Comprehensive mechanical engineering evaluation for ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.chassisCode || 'OEM'}).`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo('/build')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Build
          </NeoButton>
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo('/garage')}
            icon={<Car className="w-4 h-4" />}
          >
            View Garage
          </NeoButton>
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo('/workshops')}
            icon={<MapPin className="w-4 h-4 text-[#10B981]" />}
          >
            Find a Workshop
          </NeoButton>
          <NeoButton
            variant="primary"
            size="sm"
            onClick={() => navigateTo('/ai-engineer')}
            icon={<Bot className="w-4 h-4" />}
          >
            Consult Chief Engineer
          </NeoButton>
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl neo-button text-xs font-mono text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Print or Export Engineering Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      }
    >
      {/* 1. TOP HEADER & BUILD IDENTITY */}
      <div className="p-5 sm:p-6 rounded-[24px] neo-panel border border-white/10 bg-[#12141A] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-gray-400 uppercase font-bold tracking-wider">DRIVEFORGE AI</span>
              <span className="text-gray-600">•</span>
              <span className="text-[#0070F3] font-bold uppercase tracking-wider">BUILD ANALYSIS</span>
              <span className="text-gray-600">•</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold">
                {analysis.buildId}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
              {analysis.buildName}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
              <span className="text-white font-bold">
                {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} {activeVehicle.trim}
              </span>
              <span>•</span>
              <span className="text-gray-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#10B981]" />
                {selectedCountry?.name} • {regionName} ({currencyCode})
              </span>
              <span>•</span>
              <span className="text-[#38BDF8]">
                {buildComponents.length} Physical Modifications
              </span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0D0F13] neo-inset border border-white/5">
              <button
                onClick={() => setExperienceMode('beginner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  experienceMode === 'beginner'
                    ? 'bg-[#0070F3] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Beginner Mode
              </button>
              <button
                onClick={() => setExperienceMode('enthusiast')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  experienceMode === 'enthusiast'
                    ? 'bg-[#0070F3] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Enthusiast Spec
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. BUILD HEALTH BANNER */}
      <div
        className={`p-5 sm:p-6 rounded-[24px] neo-panel border transition-all ${
          analysis.health.status === 'GOOD'
            ? 'bg-[#10B981]/10 border-[#10B981]/30'
            : analysis.health.status === 'REVIEW'
            ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                analysis.health.status === 'GOOD'
                  ? 'bg-[#10B981]/20 text-[#10B981]'
                  : analysis.health.status === 'REVIEW'
                  ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {analysis.health.status === 'GOOD' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : analysis.health.status === 'REVIEW' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  BUILD HEALTH STATUS
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                    analysis.health.status === 'GOOD'
                      ? 'bg-[#10B981]/20 text-[#10B981]'
                      : analysis.health.status === 'REVIEW'
                      ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {analysis.health.status}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-sans text-white">
                {analysis.health.headline}
              </h3>
              <p className="text-xs text-gray-300 font-sans leading-relaxed max-w-2xl">
                {analysis.health.description}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-gray-400 block uppercase">
              Installation Complexity
            </span>
            <span className="text-sm font-black font-mono text-white">
              {analysis.installation.highestComplexity}
            </span>
            <span className="text-[10px] font-mono text-gray-400 block">
              ~{analysis.installation.totalInstallHours} Workshop Hours
            </span>
          </div>
        </div>

        {/* Health Reasons List */}
        {analysis.health.reasons.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-gray-300">
            {analysis.health.reasons.map((r, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0070F3] shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. STOCK VS MODIFIED COMPARISON OVERVIEW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#0070F3]" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              STOCK VS BUILD BENCHMARK COMPARISON
            </h3>
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            Deterministic Powertrain & Weight Deltas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Power Metric */}
          <ComparisonMetricCard
            title="Engine Power"
            unit="hp"
            stockValue={analysis.power.stockHp}
            projectedMin={analysis.power.projectedMinHp}
            projectedMax={analysis.power.projectedMaxHp}
            icon={<Zap className="w-4 h-4" />}
            confidence={analysis.power.confidence}
            type="increase_good"
          />

          {/* Torque Metric */}
          <ComparisonMetricCard
            title="Peak Torque"
            unit="Nm"
            stockValue={analysis.torque.stockNm}
            projectedMin={analysis.torque.projectedMinNm}
            projectedMax={analysis.torque.projectedMaxNm}
            icon={<Activity className="w-4 h-4" />}
            confidence={analysis.torque.confidence}
            type="increase_good"
          />

          {/* Weight Metric */}
          <ComparisonMetricCard
            title="Vehicle Weight"
            unit="kg"
            stockValue={analysis.weight.stockKg}
            projectedMin={analysis.weight.projectedKg}
            projectedMax={analysis.weight.projectedKg}
            icon={<Scale className="w-4 h-4" />}
            confidence={analysis.weight.confidence}
            type="decrease_good"
          />

          {/* 0–100 km/h Metric */}
          <div className="p-5 rounded-2xl neo-panel border border-white/10 bg-[#12141A] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl neo-inset flex items-center justify-center text-[#0070F3]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                    0–100 km/h
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    Seconds (s)
                  </span>
                </div>
              </div>

              <DataConfidenceBadge level={analysis.acceleration.confidence} size="sm" />
            </div>

            {analysis.acceleration.available ? (
              <>
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#0E1014] neo-inset border border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Stock Time</span>
                    <span className="text-base font-black text-white">
                      {analysis.acceleration.stockZeroTo100Seconds}s
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Estimated</span>
                    <span className="text-base font-black text-[#10B981]">
                      {analysis.acceleration.projectedZeroTo100MinSeconds}–{analysis.acceleration.projectedZeroTo100MaxSeconds}s
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">Delta:</span>
                  <span className="font-black text-[#10B981]">
                    -{analysis.acceleration.deltaSecondsMin}s to -{analysis.acceleration.deltaSecondsMax}s
                  </span>
                </div>
              </>
            ) : (
              <div className="p-3 rounded-xl bg-[#0E1014] neo-inset border border-white/5 text-xs font-mono text-gray-400">
                0–100 km/h baseline unavailable for this specific chassis configuration.
              </div>
            )}
          </div>
        </div>

        {/* Acceleration Disclaimer Banner */}
        <p className="text-[11px] font-sans text-gray-400 italic px-1">
          * {analysis.acceleration.disclaimer}
        </p>
      </div>

      {/* 4. DETAILED POWER & TORQUE CONTRIBUTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Power Breakdown */}
        <div className="p-5 sm:p-6 rounded-[24px] neo-panel border border-white/10 bg-[#12141A] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#0070F3]" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                POWER IMPACT BREAKDOWN
              </h3>
            </div>
            <DataConfidenceBadge level={analysis.power.confidence} size="sm" />
          </div>

          <div className="p-4 rounded-xl bg-[#0E1014] neo-inset border border-white/5 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Calculated Gain</span>
              <span className="text-xl font-black text-[#10B981]">
                +{analysis.power.estimatedGainMinHp} to +{analysis.power.estimatedGainMaxHp} hp
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block text-[10px] uppercase">Relative Increase</span>
              <span className="text-base font-black text-white">
                +{analysis.power.percentageGainMin}% to +{analysis.power.percentageGainMax}%
              </span>
            </div>
          </div>

          {/* Component Contributors */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block">
              POWER CONTRIBUTORS
            </span>

            {analysis.power.contributors.length > 0 ? (
              <div className="space-y-2">
                {analysis.power.contributors.map((c) => (
                  <div
                    key={c.componentId}
                    className="p-3 rounded-xl bg-[#0D0F14] neo-inset border border-white/5 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-white block">{c.name}</span>
                      <span className="text-[10px] text-gray-400">{c.brand} • {c.note}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-[#10B981] block">
                        +{c.minHp}–{c.maxHp} hp
                      </span>
                      <DataConfidenceBadge level={c.confidence} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#0D0F14] neo-inset border border-white/5 text-xs font-mono text-gray-400">
                No engine or exhaust power modifications currently selected.
              </div>
            )}
          </div>

          {analysis.power.overlapNotice && (
            <div className="p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[11px] font-sans text-gray-300">
              <strong className="text-[#F59E0B] font-mono block mb-0.5">Airflow Bottleneck Note:</strong>
              {analysis.power.overlapNotice}
            </div>
          )}
        </div>

        {/* Torque Breakdown */}
        <div className="p-5 sm:p-6 rounded-[24px] neo-panel border border-white/10 bg-[#12141A] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0070F3]" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                TORQUE IMPACT & CURVE DYNAMICS
              </h3>
            </div>
            <DataConfidenceBadge level={analysis.torque.confidence} size="sm" />
          </div>

          <div className="p-4 rounded-xl bg-[#0E1014] neo-inset border border-white/5 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Calculated Gain</span>
              <span className="text-xl font-black text-[#10B981]">
                +{analysis.torque.estimatedGainMinNm} to +{analysis.torque.estimatedGainMaxNm} Nm
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block text-[10px] uppercase">Peak Baseline</span>
              <span className="text-base font-black text-white">
                {analysis.torque.stockNm} Nm ({analysis.torque.stockLbFt} lb-ft)
              </span>
            </div>
          </div>

          {/* Explanation based on mode */}
          <div className="p-3.5 rounded-xl bg-[#0D0F14] neo-inset border border-white/5 text-xs font-sans text-gray-300 leading-relaxed">
            <strong className="text-white font-mono text-[11px] block mb-1">
              {experienceMode === 'beginner' ? 'What This Means for Daily Driving:' : 'Volumetric Torque Dynamics:'}
            </strong>
            {experienceMode === 'beginner'
              ? analysis.torque.beginnerExplanation
              : analysis.torque.enthusiastExplanation}
          </div>

          {/* Torque contributors */}
          {analysis.torque.contributors.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block">
                TORQUE CONTRIBUTORS
              </span>
              <div className="space-y-2">
                {analysis.torque.contributors.map((c) => (
                  <div
                    key={c.componentId}
                    className="p-3 rounded-xl bg-[#0D0F14] neo-inset border border-white/5 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-white block">{c.name}</span>
                      <span className="text-[10px] text-gray-400">{c.brand}</span>
                    </div>
                    <span className="font-black text-[#10B981]">
                      +{c.minNm}–{c.maxNm} Nm
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 5. HANDLING, DYNAMICS & WEIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Handling & Dynamics */}
        <div className="p-5 sm:p-6 rounded-[24px] neo-panel border border-white/10 bg-[#12141A] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#0070F3]" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                HANDLING & CHASSIS DYNAMICS
              </h3>
            </div>
            <DataConfidenceBadge level="ESTIMATED" size="sm" />
          </div>

          {/* Dynamics Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#0E1014] neo-inset border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 block uppercase">Cornering Stability</span>
              <span className={`font-black uppercase text-sm ${
                analysis.handling.corneringStability === 'improved' ? 'text-[#10B981]' : 'text-gray-300'
              }`}>
                {analysis.handling.corneringStability}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0E1014] neo-inset border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 block uppercase">Steering Response</span>
              <span className={`font-black uppercase text-sm ${
                analysis.handling.steeringResponse === 'improved' ? 'text-[#10B981]' : 'text-gray-300'
              }`}>
                {analysis.handling.steeringResponse}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0E1014] neo-inset border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 block uppercase">Ride Comfort</span>
              <span className={`font-black uppercase text-sm ${
                analysis.handling.rideComfort === 'reduced' ? 'text-[#F59E0B]' : 'text-gray-300'
              }`}>
                {analysis.handling.rideComfort}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0E1014] neo-inset border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 block uppercase">Overall Dynamics</span>
              <span className={`font-black uppercase text-sm ${
                analysis.handling.overallRating === 'improved' ? 'text-[#10B981]' : 'text-gray-300'
              }`}>
                {analysis.handling.overallRating}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D0F14] neo-inset border border-white/5 text-xs font-sans text-gray-300 leading-relaxed">
            <strong className="text-white font-mono text-[11px] block mb-1">
              {experienceMode === 'beginner' ? 'Handling Takeaway:' : 'Kinematic Evaluation:'}
            </strong>
            {experienceMode === 'beginner'
              ? analysis.handling.beginnerExplanation
              : analysis.handling.enthusiastExplanation}
          </div>

          {analysis.handling.factors.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block">
                PHYSICAL CHASSIS FACTORS
              </span>
              <div className="space-y-1.5">
                {analysis.handling.factors.map((f, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#0D0F14] neo-inset border border-white/5 text-xs font-mono">
                    <div className="flex items-center justify-between text-white font-bold">
                      <span>{f.component}</span>
                      <span className="text-[#0070F3] text-[11px]">{f.factor}</span>
                    </div>
                    <p className="text-gray-400 text-[11px] font-sans mt-0.5">{f.effect}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Weight & Mass Distribution */}
        <div className="p-5 sm:p-6 rounded-[24px] neo-panel border border-white/10 bg-[#12141A] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#0070F3]" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                MASS & WEIGHT DISTRIBUTION
              </h3>
            </div>
            <DataConfidenceBadge level={analysis.weight.confidence} size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#0E1014] neo-inset border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 block uppercase">Sprung Mass Delta</span>
              <span className={`font-black text-sm ${analysis.weight.sprungDeltaKg < 0 ? 'text-[#10B981]' : 'text-white'}`}>
                {analysis.weight.sprungDeltaKg > 0 ? `+${analysis.weight.sprungDeltaKg}` : analysis.weight.sprungDeltaKg} kg
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0E1014] neo-inset border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 block uppercase">Unsprung Mass Delta</span>
              <span className={`font-black text-sm ${analysis.weight.unsprungDeltaKg < 0 ? 'text-[#10B981]' : 'text-white'}`}>
                {analysis.weight.unsprungDeltaKg > 0 ? `+${analysis.weight.unsprungDeltaKg}` : analysis.weight.unsprungDeltaKg} kg
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D0F14] neo-inset border border-white/5 text-xs font-sans text-gray-300 leading-relaxed">
            {analysis.weight.explanation}
          </div>

          {/* Weight contributors */}
          {analysis.weight.contributors.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block">
                MASS DELTA BY COMPONENT
              </span>
              <div className="space-y-1.5">
                {analysis.weight.contributors.map((c) => (
                  <div
                    key={c.componentId}
                    className="p-2.5 rounded-lg bg-[#0D0F14] neo-inset border border-white/5 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${c.type === 'unsprung' ? 'bg-[#38BDF8]' : 'bg-[#0070F3]'}`} />
                      <span className="text-white font-medium">{c.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase">({c.type})</span>
                    </div>
                    <span className={`font-bold ${c.deltaKg < 0 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                      {c.deltaKg > 0 ? `+${c.deltaKg}` : c.deltaKg} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 6. BRAKING, THERMAL & RELIABILITY MATRICES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Braking System Impact */}
        <div className="p-5 rounded-[22px] neo-panel border border-white/10 bg-[#12141A] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              BRAKING PERFORMANCE
            </span>
            <DataConfidenceBadge level={analysis.braking.confidence} size="sm" />
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Fade Resistance:</span>
              <span className="font-bold text-white uppercase">{analysis.braking.thermalEndurance}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Pedal Modulation:</span>
              <span className="font-bold text-white uppercase">{analysis.braking.pedalFirmness}</span>
            </div>
          </div>

          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            {analysis.braking.stoppingPerformanceImpact}
          </p>

          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] font-sans text-red-300">
            * {analysis.braking.safetyNotice}
          </div>
        </div>

        {/* Thermal Load Analysis */}
        <div className="p-5 rounded-[22px] neo-panel border border-white/10 bg-[#12141A] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              THERMAL STRESS INDEX
            </span>
            <DataConfidenceBadge level={analysis.thermal.confidence} size="sm" />
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Thermal Load Index:</span>
              <span className={`font-black uppercase ${
                analysis.thermal.thermalLoadIndex === 'low' ? 'text-[#10B981]' : 'text-[#F59E0B]'
              }`}>
                {analysis.thermal.thermalLoadIndex}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Cooling Requirement:</span>
              <span className="font-bold text-white uppercase">
                {analysis.thermal.coolingRequirement.replace('_', ' ')}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            {analysis.thermal.explanation}
          </p>

          {analysis.thermal.recommendations.length > 0 && (
            <div className="pt-2 border-t border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Recommended Cooling:</span>
              <ul className="text-[11px] font-sans text-gray-300 space-y-1 list-disc pl-4">
                {analysis.thermal.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Reliability Considerations */}
        <div className="p-5 rounded-[22px] neo-panel border border-white/10 bg-[#12141A] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              RELIABILITY EVALUATION
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              analysis.reliability.concernLevel === 'LOW CONCERN'
                ? 'bg-[#10B981]/20 text-[#10B981]'
                : analysis.reliability.concernLevel === 'MODERATE CONCERN'
                ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {analysis.reliability.concernLevel}
            </span>
          </div>

          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            {analysis.reliability.summary}
          </p>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block">Stress Factors</span>
            {analysis.reliability.stressFactors.map((s, idx) => (
              <div key={idx} className="p-2 rounded bg-[#0D0F14] neo-inset border border-white/5 text-[11px] font-mono">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>{s.area}</span>
                  <span className={`text-[10px] ${s.level === 'Low' ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                    {s.level}
                  </span>
                </div>
                <p className="text-gray-400 text-[10px] font-sans mt-0.5">{s.details}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 7. COMPONENT IMPACT MATRIX TABLE */}
      <div className="p-5 sm:p-6 rounded-[24px] neo-panel border border-white/10 bg-[#12141A] space-y-4 overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#0070F3]" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              COMPONENT IMPACT MATRIX
            </h3>
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            Multi-Attribute Influence Table
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-gray-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Component</th>
                <th className="py-2.5 px-2 text-center">Power</th>
                <th className="py-2.5 px-2 text-center">Torque</th>
                <th className="py-2.5 px-2 text-center">Weight</th>
                <th className="py-2.5 px-2 text-center">Handling</th>
                <th className="py-2.5 px-2 text-center">Braking</th>
                <th className="py-2.5 px-2 text-center">Comfort</th>
                <th className="py-2.5 px-2 text-center">Thermal</th>
                <th className="py-2.5 px-3 text-right">Install</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {analysis.matrix.map((row) => (
                <tr key={row.componentId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-white block">{row.name}</span>
                    <span className="text-[10px] text-gray-400">{row.brand} • {row.category}</span>
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-[#10B981]" title={row.powerLabel}>
                    {row.powerSymbol}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-[#10B981]" title={row.torqueLabel}>
                    {row.torqueSymbol}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-white" title={row.weightLabel}>
                    {row.weightSymbol}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-[#38BDF8]" title={row.handlingLabel}>
                    {row.handlingSymbol}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-white" title={row.brakingLabel}>
                    {row.brakingSymbol}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-gray-300" title={row.comfortLabel}>
                    {row.comfortSymbol}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-[#F59E0B]" title={row.thermalLabel}>
                    {row.thermalSymbol}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-gray-300">
                      {row.installDifficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. REGIONAL INVESTMENT & INSTALLATION SUMMARY */}
      <div className="p-5 sm:p-6 rounded-[24px] neo-panel border border-[#0070F3]/30 bg-[#12141A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-wider block">
              REGIONAL COST & INSTALLATION PROFILE
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {regionName} ({selectedCountry?.name || 'Selected'}) • {currencyCode}
            </span>
          </div>

          <DataConfidenceBadge level="ESTIMATED" size="sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#0E1014] neo-inset border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-400 block uppercase">Estimated Hardware</span>
            <span className="text-base font-black text-white block">
              {cost.partsDisplay}
            </span>
            <span className="text-[10px] text-gray-500">Includes freight & local tariffs</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1014] neo-inset border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-400 block uppercase">
              Workshop Labor (~{cost.totalInstallHours}h)
            </span>
            <span className="text-base font-black text-[#0070F3] block">
              {cost.laborDisplay}
            </span>
            <span className="text-[10px] text-gray-500">{analysis.installation.highestComplexity} Complexity</span>
          </div>

          <div className="p-4 rounded-xl neo-panel border border-[#10B981]/30 bg-[#10B981]/10 space-y-1">
            <span className="text-[10px] text-[#10B981] font-bold block uppercase">
              Estimated Total Investment
            </span>
            <span className="text-lg font-black text-white block">
              {cost.totalDisplay}
            </span>
            <span className="text-[10px] text-gray-400">Indicative estimate</span>
          </div>
        </div>

        <p className="text-[11px] font-sans text-gray-500 italic">
          * {cost.disclaimer}
        </p>
      </div>

      {/* 9. PHYSICAL VERIFICATION REQUIREMENTS */}
      {analysis.verificationRequirements.length > 0 && (
        <div className="p-5 sm:p-6 rounded-[24px] neo-panel border border-[#F59E0B]/30 bg-[#13151D] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2.5 text-[#F59E0B]">
              <ShieldAlert className="w-5 h-5" />
              <div>
                <h3 className="text-sm font-black font-mono uppercase tracking-wider">
                  VERIFICATION REQUIRED BEFORE PURCHASE & INSTALLATION
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  Mandatory mechanical safety and fitment clearances for this specific build configuration.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 shrink-0">
              {analysis.verificationRequirements.length} Checklist Items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {analysis.verificationRequirements.map((req) => (
              <VerificationNotice
                key={req.id}
                title={req.title}
                description={req.description}
                whyItMatters={req.whyItMatters}
                actionRequired={req.actionRequired}
                isSafetyCritical={req.isSafetyCritical}
              />
            ))}
          </div>
        </div>
      )}

      {/* 10. ENGINEERING RECOMMENDATIONS */}
      <div className="p-5 sm:p-6 rounded-[24px] neo-panel border border-white/10 bg-[#12141A] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0070F3]" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              AUTOMOTIVE ENGINEERING RECOMMENDATIONS
            </h3>
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            Deterministic Best Practices
          </span>
        </div>

        <div className="space-y-3">
          {analysis.recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-[#0D0F14] neo-inset border border-white/5 flex items-start justify-between gap-3 text-xs font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-[#0070F3]/20 text-[#0070F3] border border-[#0070F3]/30 uppercase">
                    {rec.category}
                  </span>
                  <span className="text-white font-bold text-sm font-sans">{rec.title}</span>
                </div>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  {rec.recommendation}
                </p>
                <span className="text-[11px] text-gray-500 font-mono block pt-1">
                  Reasoning: {rec.reasoning}
                </span>
              </div>

              <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                rec.priority === 'HIGH' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-white/10 text-gray-400'
              }`}>
                {rec.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 11. BOTTOM CALL TO ACTION BAR */}
      <div className="p-5 sm:p-6 rounded-[24px] neo-panel border border-white/10 bg-[#14171E] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-black font-mono text-white uppercase tracking-wider">
            Ready to Proceed with this Modification Blueprint?
          </h4>
          <p className="text-xs text-gray-400 font-sans">
            Export the certification report, return to your Physical Build, or test visual stance adjustments in the 3D Garage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <NeoButton
            variant="outline"
            size="md"
            onClick={() => navigateTo('/build')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Edit Build
          </NeoButton>
          <NeoButton
            variant="outline"
            size="md"
            onClick={() => navigateTo('/workshops')}
            icon={<MapPin className="w-4 h-4 text-[#10B981]" />}
          >
            Find a Workshop
          </NeoButton>
          <NeoButton
            variant="outline"
            size="md"
            onClick={() => navigateTo('/ai-engineer')}
            icon={<Bot className="w-4 h-4 text-[#0070F3]" />}
          >
            Ask Chief Engineer
          </NeoButton>
          <NeoButton
            variant="primary"
            size="md"
            onClick={() => navigateTo('/garage')}
            icon={<Car className="w-4 h-4" />}
          >
            Return to 3D Garage
          </NeoButton>
        </div>
      </div>

    </PageContainer>
  );
};
