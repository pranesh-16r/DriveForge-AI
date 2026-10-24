import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoPanel } from '../components/ui/NeoPanel';
import { NeoButton } from '../components/ui/NeoButton';
import { ComponentDetailPanel } from '../components/modifications/ComponentDetailPanel';
import { ExtendedModificationComponent } from '../types/modification';
import { BuildComponent } from '../types/build';
import {
  Wrench,
  Trash2,
  Zap,
  ArrowRight,
  Sparkles,
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
  Plus,
  Edit2,
  Check,
  X,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  Bot
} from 'lucide-react';

export const BuildPage: React.FC = () => {
  const {
    activeVehicle,
    selectedCountry,
    selectedRegion,
    experienceMode,
    setExperienceMode,
    buildState,
    buildComponents,
    removeComponentFromBuild,
    clearBuild,
    updateBuildName,
    addBuildNote,
    editBuildNote,
    deleteBuildNote,
    dismissRevalidationNotice,
    navigateTo
  } = useApp();

  // State for component detail drawer
  const [selectedDetailComponent, setSelectedDetailComponent] = useState<ExtendedModificationComponent | null>(null);

  // State for editing build name
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(buildState.buildName);

  // State for new note input
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  // Location display
  const regionName = selectedRegion ? selectedRegion.name : 'Selected Region';
  const currencyCode = buildState.currency;
  const currencySymbol = buildState.currencySymbol;
  const cost = buildState.costSummary;
  const compat = buildState.compatibilitySummary;
  const health = buildState.buildHealth;

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateBuildName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      addBuildNote(newNoteText.trim());
      setNewNoteText('');
    }
  };

  const handleSaveEditNote = (id: string) => {
    if (editingNoteText.trim()) {
      editBuildNote(id, editingNoteText.trim());
    }
    setEditingNoteId(null);
  };

  return (
    <PageContainer
      eyebrow="PHYSICAL MODIFICATION BLUEPRINT"
      title="Physical Build Plan & Fitment Matrix"
      subtitle={`Engineering plan for ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}. Calculates regional part costs, workshop labor hours, and mechanical prerequisites.`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo('/garage')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Return to Garage
          </NeoButton>
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo('/workshops')}
            icon={<MapPin className="w-4 h-4 text-[#10B981]" />}
          >
            Find Installation Support
          </NeoButton>
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo('/compatibility')}
            icon={<Zap className="w-4 h-4 text-amber-400" />}
          >
            Check Compatibility
          </NeoButton>
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo('/projects')}
            icon={<Layers className="w-4 h-4 text-[#0070F3]" />}
          >
            Projects
          </NeoButton>
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo('/ai-engineer')}
            icon={<Bot className="w-4 h-4 text-[#0070F3]" />}
          >
            Ask AI Chief Engineer
          </NeoButton>
          {buildComponents.length > 0 && (
            <NeoButton
              variant="primary"
              size="sm"
              onClick={() => navigateTo('/build/analysis')}
              icon={<Sparkles className="w-4 h-4" />}
            >
              ANALYZE BUILD
            </NeoButton>
          )}
        </div>
      }
    >
      {/* VEHICLE REVALIDATION NOTICE (If vehicle platform was changed) */}
      {buildState.revalidationNotice?.requiresReview && (
        <div className="p-4 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-[#F59E0B] uppercase tracking-wider">
                  BUILD REQUIRES REVIEW
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-[#F59E0B]/20 text-[#F59E0B]">
                  Platform Changed
                </span>
              </div>
              <p className="text-xs text-[#171717] font-sans font-medium mt-0.5">
                {buildState.revalidationNotice.message}
              </p>
            </div>
          </div>

          <button
            onClick={dismissRevalidationNotice}
            className="px-3 py-1.5 rounded-xl bg-[#FAFAF7] text-xs font-mono font-bold text-[#171717] hover:bg-[#E8E2D8] border border-[#292927]/20 shrink-0 cursor-pointer shadow-xs"
          >
            Acknowledge & Keep
          </button>
        </div>
      )}

      {/* TOP BUILD HEADER CARD */}
      <div className="p-5 sm:p-6 rounded-[24px] bg-[#FAFAF7] border border-[#292927]/15 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Build Name & Vehicle Meta */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-md bg-[#E8E2D8] text-[#28483D] border border-[#292927]/12 font-bold">
                {buildState.buildId}
              </span>
              <span className="text-[#292927]/30">•</span>
              <span className="text-[#4A4843] font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#28483D]" />
                {regionName} • {currencyCode}
              </span>
              <span className="text-[#292927]/30">•</span>
              <span className="text-[#4A4843] font-semibold">
                {buildComponents.length} {buildComponents.length === 1 ? 'Modification' : 'Modifications'}
              </span>
            </div>

            {/* Editable Build Name */}
            <div className="flex items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#E8E2D8] border-2 border-[#171717] text-[#171717] font-mono text-lg font-black outline-none focus:ring-1 focus:ring-[#171717]"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="w-8 h-8 rounded-lg bg-[#28483D] text-[#FAFAF7] flex items-center justify-center cursor-pointer font-bold"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="w-8 h-8 rounded-lg bg-[#E8E2D8] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/15 flex items-center justify-center cursor-pointer font-bold"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h2 className="text-2xl sm:text-3xl font-black font-sans text-[#171717] tracking-tight">
                    {buildState.buildName}
                  </h2>
                  <button
                    onClick={() => {
                      setNameInput(buildState.buildName);
                      setIsEditingName(true);
                    }}
                    className="w-7 h-7 rounded-lg bg-[#E8E2D8] opacity-0 group-hover:opacity-100 transition-opacity text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/12 flex items-center justify-center cursor-pointer"
                    title="Rename build"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Base Vehicle specs */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#4A4843]">
              <span className="text-[#171717] font-black">
                {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} {activeVehicle.trim}
              </span>
              <span>•</span>
              <span>Chassis: {activeVehicle.chassisCode || 'OEM'}</span>
              <span>•</span>
              <span>Engine: {activeVehicle.engine}</span>
              <span>•</span>
              <span>Drivetrain: {activeVehicle.drivetrain}</span>
            </div>
          </div>

          {/* Right: Experience Mode Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#E8E2D8] border border-[#292927]/12">
              <button
                onClick={() => setExperienceMode('beginner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  experienceMode === 'beginner'
                    ? 'bg-[#171717] text-[#FAFAF7] shadow-sm'
                    : 'text-[#4A4843] hover:text-[#171717]'
                }`}
              >
                Beginner View
              </button>
              <button
                onClick={() => setExperienceMode('enthusiast')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  experienceMode === 'enthusiast'
                    ? 'bg-[#171717] text-[#FAFAF7] shadow-sm'
                    : 'text-[#4A4843] hover:text-[#171717]'
                }`}
              >
                Enthusiast Spec
              </button>
            </div>

            {buildComponents.length > 0 && (
              <button
                onClick={clearBuild}
                className="px-3 py-1.5 rounded-xl bg-[#FAFAF7] text-xs font-mono font-bold text-[#4A4843] hover:text-red-700 hover:border-red-300 border border-[#292927]/15 transition-colors cursor-pointer"
              >
                Clear Build
              </button>
            )}
          </div>

        </div>
      </div>

      {/* EMPTY STATE */}
      {buildComponents.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-[28px] bg-[#FAFAF7] border border-[#292927]/15 text-center space-y-5 max-w-2xl mx-auto my-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#E8E2D8] border border-[#292927]/12 text-[#28483D] flex items-center justify-center mx-auto shadow-inner">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black font-sans text-[#171717] uppercase tracking-wider">
              YOUR PHYSICAL BUILD IS EMPTY
            </h3>
            <p className="text-sm text-[#4A4843] max-w-md mx-auto leading-relaxed font-medium">
              Start with a modification in the 3D Garage. Explore verified exhausts, coilovers, big brake kits, and aero components matched to your {activeVehicle.model}.
            </p>
          </div>
          <div className="pt-2">
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
      ) : (
        /* MAIN BUILD LAYOUT: 2 COLUMNS ON DESKTOP */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: COMPONENT CARDS & TECHNICAL SECTIONS (8 COLUMNS) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Component List Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#292927]/12">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#28483D]" />
                <span className="text-xs font-mono font-black text-[#171717] uppercase tracking-wider">
                  SELECTED PHYSICAL COMPONENTS ({buildComponents.length})
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#4A4843] font-medium">
                Sorted by Engineering Sequence
              </span>
            </div>

            {/* Component Cards List */}
            <div className="space-y-4">
              <AnimatePresence>
                {buildComponents.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-5 rounded-[22px] bg-[#FAFAF7] border border-[#292927]/15 hover:border-[#171717]/40 transition-all space-y-4 shadow-sm group"
                  >
                    {/* Top Row: Image, Name, Category, Compatibility Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#E8E2D8] border border-[#292927]/12 shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover filter brightness-95"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-extrabold text-[#28483D] uppercase tracking-wider">
                              {item.category.toUpperCase()}
                            </span>
                            <span className="text-[#292927]/30">•</span>
                            <span className="text-[10px] font-mono text-[#4A4843] font-medium">
                              Part #{item.partNumber}
                            </span>
                          </div>
                          <h4 className="text-base font-black font-sans text-[#171717] leading-snug">
                            {item.name}
                          </h4>
                          <span className="text-xs font-mono text-[#4A4843] font-medium block">
                            {item.brand} • {item.subCategory}
                          </span>
                        </div>
                      </div>

                      {/* Compatibility Badge */}
                      <div className="shrink-0">
                        {item.compatibilityStatus === 'compatible' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            COMPATIBLE
                          </span>
                        )}
                        {item.compatibilityStatus === 'conditionally_compatible' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F59E0B]/15 text-[#B47A52] border border-[#F59E0B]/30">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            CONDITIONAL
                          </span>
                        )}
                        {item.compatibilityStatus === 'not_compatible' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-100 text-red-700 border border-red-300">
                            <XCircle className="w-3.5 h-3.5" />
                            NOT COMPATIBLE
                          </span>
                        )}
                        {item.compatibilityStatus === 'verification_required' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#28483D]/10 text-[#28483D] border border-[#28483D]/30">
                            <Info className="w-3.5 h-3.5" />
                            VERIFICATION REQUIRED
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Middle Row: Regional Cost Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/12 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-[#4A4843] font-bold block uppercase">Est. Part Hardware</span>
                        <span className="font-black text-[#171717] text-sm">
                          {item.estimatedPartCost.display}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#4A4843] font-bold block uppercase">
                          Workshop Labor (~{item.estimatedInstallationCost.hours}h)
                        </span>
                        <span className="font-black text-[#28483D] text-sm">
                          {item.estimatedInstallationCost.display}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#4A4843] font-bold block uppercase">Est. Item Total</span>
                        <span className="font-black text-[#171717] text-sm">
                          {item.estimatedTotalCost.display}
                        </span>
                      </div>
                    </div>

                    {/* Explanatory notes based on Experience Mode */}
                    <div className="p-3.5 rounded-xl bg-[#E8E2D8]/60 border border-[#292927]/10 text-xs">
                      {experienceMode === 'beginner' ? (
                        <p className="text-[#292927] font-sans font-medium leading-relaxed">
                          <strong className="text-[#171717] font-mono text-[11px] mr-1.5 font-bold">Fitment Summary:</strong>
                          {item.beginnerExplanation}
                        </p>
                      ) : (
                        <div className="space-y-1 font-mono">
                          <div className="flex items-center justify-between text-[11px] text-[#4A4843]">
                            <span>Mounting Anchorage: <strong className="text-[#171717] font-bold">{item.fitmentDetails.mountingPointType}</strong></span>
                            <span>Difficulty: <strong className="text-[#171717] font-bold">{item.installationDifficultyLabel}</strong></span>
                          </div>
                          <p className="text-[#292927] font-sans font-medium text-xs pt-1">
                            {item.expertExplanation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Warning conditions if any */}
                    {item.warningConditions && item.warningConditions.length > 0 && (
                      <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 font-medium flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#B47A52] shrink-0 mt-0.5" />
                        <span className="font-sans">
                          {item.warningConditions.join(' • ')}
                        </span>
                      </div>
                    )}

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#292927]/10 text-xs font-mono">
                      <div className="text-[#4A4843] text-[11px] font-medium">
                        Install Phase: <span className="text-[#171717] font-black">Step {item.recommendedOrder}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDetailComponent(item.rawComponent)}
                          className="px-3 py-1.5 rounded-lg bg-[#E8E2D8] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] font-bold border border-[#292927]/15 transition-colors cursor-pointer"
                        >
                          View Specifications
                        </button>
                        <button
                          onClick={() => removeComponentFromBuild(item.componentId)}
                          className="p-1.5 rounded-lg text-[#4A4843] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove from build"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* SECTION: VERIFICATION REQUIREMENTS CHECKLIST */}
            {buildState.verificationRequirements.length > 0 && (
              <div className="p-5 sm:p-6 rounded-[24px] bg-[#FAFAF7] border-2 border-amber-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-[#B47A52]">
                    <ShieldAlert className="w-5 h-5 text-[#B47A52]" />
                    <div>
                      <h3 className="text-sm font-black font-mono text-[#171717] uppercase tracking-wider">
                        PRE-PURCHASE & INSTALLATION VERIFICATION REQUIREMENTS
                      </h3>
                      <p className="text-xs text-[#4A4843] font-sans font-medium">
                        Critical checks required before acquiring parts or performing physical installation.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                    {buildState.verificationRequirements.length} Checklist Items
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {buildState.verificationRequirements.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/10 text-xs font-mono space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[#171717] text-sm">
                          {req.title}
                        </span>
                        {req.isSafetyCritical && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                            Safety Critical
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#292927] font-sans font-medium">
                        {req.description}
                      </p>
                      <div className="text-[#28483D] font-bold text-[11px] pt-1">
                        → Required Action: {req.actionRequired}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: RECOMMENDED INSTALLATION SEQUENCE */}
            {buildState.recommendedOrder.length > 0 && (
              <div className="p-5 sm:p-6 rounded-[24px] bg-[#FAFAF7] border border-[#292927]/15 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <ListOrdered className="w-5 h-5 text-[#28483D]" />
                  <div>
                    <h3 className="text-sm font-black font-mono text-[#171717] uppercase tracking-wider">
                      RECOMMENDED PHYSICAL INSTALLATION SEQUENCE
                    </h3>
                    <p className="text-xs text-[#4A4843] font-sans font-medium">
                      Automotive engineering order to avoid conflicting assembly steps and optimize workshop alignment.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {buildState.recommendedOrder.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/10 flex items-start gap-3.5 text-xs font-mono"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#28483D] text-[#FAFAF7] flex items-center justify-center font-black shrink-0 shadow-xs">
                        {step.stepNumber}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#171717]">{step.categoryLabel}</span>
                          <span className="text-[#292927]/30">•</span>
                          <span className="text-[#28483D] font-bold">{step.componentNames.join(', ')}</span>
                        </div>
                        <p className="text-xs text-[#4A4843] font-sans font-medium">
                          {step.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: BUILD NOTES */}
            <div className="p-5 sm:p-6 rounded-[24px] bg-[#FAFAF7] border border-[#292927]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-[#28483D]" />
                  <h3 className="text-sm font-black font-mono text-[#171717] uppercase tracking-wider">
                    PHYSICAL BUILD NOTES & WORKSHOP DIRECTIVES
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#4A4843]">
                  {buildState.notes.length} Notes Saved
                </span>
              </div>

              {/* Add Note Input */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Ask workshop to verify front rotor bolt torque spec..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/15 text-[#171717] placeholder-[#55534E] text-xs font-mono outline-none focus:border-[#28483D] font-medium"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#28483D] hover:bg-[#1E362E] text-[#FAFAF7] text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-2 pt-2">
                {buildState.notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-[#E8E2D8] border border-[#292927]/10 flex items-start justify-between gap-3 text-xs font-mono"
                  >
                    {editingNoteId === n.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingNoteText}
                          onChange={(e) => setEditingNoteText(e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded bg-[#FAFAF7] text-[#171717] border border-[#28483D] font-bold outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEditNote(n.id)}
                          className="w-6 h-6 rounded bg-[#28483D] text-[#FAFAF7] flex items-center justify-center cursor-pointer font-bold"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="w-6 h-6 rounded bg-[#FAFAF7] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/15 flex items-center justify-center cursor-pointer font-bold"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <p className="text-[#171717] font-sans font-medium leading-relaxed">{n.text}</p>
                          <span className="text-[10px] text-[#4A4843] font-mono block">Added on {n.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingNoteId(n.id);
                              setEditingNoteText(n.text);
                            }}
                            className="p-1 rounded text-[#4A4843] hover:text-[#171717] transition-colors cursor-pointer"
                            title="Edit note"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteBuildNote(n.id)}
                            className="p-1 rounded text-[#4A4843] hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: PERSISTENT SUMMARY & HEALTH PANEL (4 COLUMNS) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* BUILD SUMMARY CARD */}
            <div className="p-6 rounded-[26px] bg-[#FAFAF7] border border-[#292927]/15 shadow-xl space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#292927]/12">
                <span className="text-xs font-mono font-extrabold text-[#28483D] uppercase tracking-wider">
                  PHYSICAL BUILD SUMMARY
                </span>
                <span className="text-xs font-mono font-bold text-[#171717] bg-[#E8E2D8] px-2 py-0.5 rounded-md border border-[#292927]/12">
                  {buildComponents.length} Parts
                </span>
              </div>

              {/* Animated Cost Totals */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/12 space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-[#4A4843]">
                    <span>Hardware Parts:</span>
                    <motion.span
                      key={cost.partsDisplay}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      className="font-bold text-[#171717]"
                    >
                      {cost.partsDisplay}
                    </motion.span>
                  </div>
                  <div className="flex items-center justify-between text-[#4A4843]">
                    <span>Workshop Labor ({cost.totalInstallHours}h):</span>
                    <motion.span
                      key={cost.laborDisplay}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      className="font-bold text-[#28483D]"
                    >
                      {cost.laborDisplay}
                    </motion.span>
                  </div>
                </div>

                {/* Total Investment Highlight */}
                <div className="p-4 rounded-2xl bg-[#E8E2D8] border-2 border-[#28483D]/40 space-y-1">
                  <span className="text-[10px] font-mono font-extrabold text-[#28483D] uppercase tracking-wider block">
                    ESTIMATED BUILD TOTAL ({currencyCode})
                  </span>
                  <motion.div
                    key={cost.totalDisplay}
                    initial={{ scale: 0.98, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-3xl font-black font-mono text-[#171717] tracking-tight"
                  >
                    {cost.totalDisplay}
                  </motion.div>
                  <span className="text-[10px] font-mono font-medium text-[#4A4843] block pt-1">
                    {regionName} ({selectedCountry?.name || 'Selected'})
                  </span>
                </div>
              </div>

              {/* Data Confidence & Disclaimer */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#4A4843]">Estimate Confidence</span>
                  <span className="text-[#10B981] font-bold">{cost.confidence}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#4A4843]">Data Source</span>
                  <span className="text-[#171717] font-semibold">{cost.sourceType}</span>
                </div>
                <p className="text-[10px] font-sans text-[#4A4843] italic pt-1 leading-relaxed">
                  * {cost.disclaimer}
                </p>
              </div>

              {/* Compatibility Breakdown Chips */}
              <div className="pt-2 border-t border-[#292927]/12 space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#4A4843] uppercase block">
                  COMPATIBILITY PROFILE
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-[#28483D]/10 border border-[#28483D]/30 text-[#28483D] text-center font-bold">
                    {compat.compatibleCount} Compatible
                  </div>
                  <div className="p-2 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-center font-bold">
                    {compat.conditionalCount + compat.verificationRequiredCount} Verification
                  </div>
                </div>
              </div>

              {/* Build Health Card */}
              <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2 ${
                health.status === 'GOOD'
                  ? 'bg-[#28483D]/10 border-2 border-[#28483D]/30 text-[#171717]'
                  : health.status === 'REVIEW'
                  ? 'bg-amber-100 border-2 border-amber-300 text-amber-900'
                  : 'bg-red-100 border-2 border-red-300 text-red-900'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#171717] uppercase text-[11px]">
                    BUILD HEALTH STATUS
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    health.status === 'GOOD'
                      ? 'bg-[#28483D] text-[#FAFAF7]'
                      : health.status === 'REVIEW'
                      ? 'bg-[#B47A52] text-[#FAFAF7]'
                      : 'bg-red-700 text-white'
                  }`}>
                    {health.status}
                  </span>
                </div>
                <strong className="text-[#171717] block font-sans text-xs font-bold">
                  {health.headline}
                </strong>
                <p className="text-[11px] font-sans text-[#292927] leading-relaxed font-medium">
                  {health.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => navigateTo('/build/analysis')}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#28483D] hover:bg-[#1E362E] text-[#FAFAF7] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ANALYZE PHYSICAL BUILD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigateTo('/ai-engineer')}
                  className="w-full py-3 px-4 rounded-xl bg-[#E8E2D8] hover:bg-[#171717] hover:text-[#FAFAF7] text-xs font-mono font-bold text-[#171717] border border-[#292927]/15 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Bot className="w-4 h-4 text-[#28483D]" />
                  <span>ASK AI CHIEF ENGINEER</span>
                </button>

                <button
                  onClick={() => navigateTo('/workshops')}
                  className="w-full py-3 px-4 rounded-xl bg-[#E8E2D8] hover:bg-[#28483D] hover:text-[#FAFAF7] text-xs font-mono text-[#28483D] border border-[#28483D]/30 transition-colors flex items-center justify-center gap-2 cursor-pointer font-bold shadow-xs"
                >
                  <MapPin className="w-4 h-4 text-[#28483D]" />
                  <span>FIND INSTALLATION SUPPORT</span>
                </button>

                <button
                  onClick={() => navigateTo('/garage')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FAFAF7] text-xs font-mono font-bold text-[#171717] hover:bg-[#E8E2D8] border border-[#292927]/15 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>Return to 3D Garage</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Component Detail Modal / Drawer */}
      {selectedDetailComponent && (
        <ComponentDetailPanel
          component={selectedDetailComponent}
          compatibility={null}
          activeVehicle={activeVehicle}
          isInBuild={buildComponents.some(c => c.componentId === selectedDetailComponent.id)}
          isPreviewing={false}
          isComparing={false}
          experienceMode={experienceMode}
          onClose={() => setSelectedDetailComponent(null)}
          onToggleBuild={() => {
            removeComponentFromBuild(selectedDetailComponent.id);
            setSelectedDetailComponent(null);
          }}
          onTogglePreview={() => {}}
          onToggleCompare={() => {}}
        />
      )}
    </PageContainer>
  );
};
