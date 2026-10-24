import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { VaultService } from '../lib/vault/vaultService';
import { SavedBuild } from '../types/vault';
import { VEHICLES } from '../data/vehicles';
import { Vehicle } from '../types';
import { MODIFICATION_COMPONENTS } from '../data/modificationComponents';
import { BuildService } from '../services/buildService';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Slider } from '../../components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../components/ui/tooltip';
import { toast } from 'sonner';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Car,
  Wrench,
  Gauge,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Trash2,
  Copy,
  Download,
  ShieldCheck,
  LayoutList,
  LayoutGrid,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Flame,
  X,
  Bot
} from 'lucide-react';

export const ProjectDashboardPage: React.FC = () => {
  const {
    activeVehicle,
    selectedCountry,
    selectedRegion,
    experienceMode,
    buildComponents,
    loadSavedBuild,
    setActiveVehicle,
    navigateTo
  } = useApp();

  const [projects, setProjects] = useState<SavedBuild[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'updated' | 'power' | 'cost' | 'name'>('updated');
  
  // New Project Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectGoal, setNewProjectGoal] = useState<string>('Street Performance');
  const [newProjectVehicleId, setNewProjectVehicleId] = useState<string>(activeVehicle?.id || VEHICLES[0].id);
  const [newProjectBudget, setNewProjectBudget] = useState<number>(25000);
  const [newProjectTemplate, setNewProjectTemplate] = useState<'blank' | 'street' | 'track' | 'power'>('street');
  const [vehicleSearch, setVehicleSearch] = useState('');

  // Active loaded toast / visual indicator
  const [activeLoadedId, setActiveLoadedId] = useState<string | null>(null);

  // Load projects on mount & seed if empty
  useEffect(() => {
    let loaded = VaultService.getSavedBuilds();
    if (loaded.length === 0 && activeVehicle) {
      loaded = VaultService.seedSampleBuildsIfEmpty(activeVehicle, buildComponents, selectedCountry, selectedRegion);
    }
    setProjects(loaded);
  }, [activeVehicle]);

  const refreshProjects = () => {
    setProjects(VaultService.getSavedBuilds());
  };

  // Fleet Summary KPIs
  const fleetKPIs = useMemo(() => {
    const totalProjects = projects.length;
    const totalHp = projects.reduce((sum, p) => sum + (p.performanceSummary?.projectedPowerHp || p.vehicle.baselinePowerHp), 0);
    const totalCost = projects.reduce((sum, p) => sum + (p.costSummary?.totalCostUSD || 0), 0);
    const fullyCompatibleCount = projects.filter(p => !p.compatibilitySummary?.hasCriticalConflict).length;
    const compatibilityRatio = totalProjects > 0 ? Math.round((fullyCompatibleCount / totalProjects) * 100) : 100;

    return {
      totalProjects,
      totalHp,
      totalCost,
      compatibilityRatio
    };
  }, [projects]);

  // Filtering & Sorting
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          p.buildName.toLowerCase().includes(q) ||
          p.buildId.toLowerCase().includes(q) ||
          p.vehicle.make.toLowerCase().includes(q) ||
          p.vehicle.model.toLowerCase().includes(q) ||
          (p.vehicle.engine && p.vehicle.engine.toLowerCase().includes(q)) ||
          (p.projectGoal && p.projectGoal.toLowerCase().includes(q));

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'in_progress' && (p.projectStatus === 'in_progress' || !p.projectStatus)) ||
          p.projectStatus === statusFilter;

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'updated') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (sortBy === 'power') {
          const powerA = a.performanceSummary?.projectedPowerHp || a.vehicle.baselinePowerHp;
          const powerB = b.performanceSummary?.projectedPowerHp || b.vehicle.baselinePowerHp;
          return powerB - powerA;
        }
        if (sortBy === 'cost') {
          return (b.costSummary?.totalCostUSD || 0) - (a.costSummary?.totalCostUSD || 0);
        }
        if (sortBy === 'name') {
          return a.buildName.localeCompare(b.buildName);
        }
        return 0;
      });
  }, [projects, searchQuery, statusFilter, sortBy]);

  // Handle Load Project into Workspace
  const handleLoadProject = (project: SavedBuild) => {
    loadSavedBuild(project);
    setActiveLoadedId(project.buildId);
    toast.success(`Loaded "${project.buildName}" into workspace!`, {
      description: `${project.vehicle.year} ${project.vehicle.make} ${project.vehicle.model}`
    });
    setTimeout(() => {
      setActiveLoadedId(null);
      navigateTo('/build');
    }, 600);
  };

  // Handle Duplicate Project
  const handleDuplicateProject = (buildId: string) => {
    VaultService.duplicateBuild(buildId);
    refreshProjects();
    toast.success("Project duplicated successfully!", {
      description: "Created an editable copy in your fleet"
    });
  };

  // Handle Delete Project
  const handleDeleteProject = (buildId: string, buildName: string) => {
    VaultService.deleteBuild(buildId);
    refreshProjects();
    toast.error(`Deleted "${buildName}"`, {
      description: "Removed from your saved projects list"
    });
  };

  // Handle Export JSON
  const handleExportProject = (project: SavedBuild) => {
    const jsonStr = VaultService.exportBuildAsJson(project.buildId);
    if (!jsonStr) return;

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `project-${project.buildId.toLowerCase()}-${project.vehicle.model.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported project blueprint as JSON", {
      description: `${project.buildName}.json downloaded`
    });
  };

  // Handle Create New Project
  const handleCreateNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVehicle = VEHICLES.find(v => v.id === newProjectVehicleId) || activeVehicle || VEHICLES[0];
    const projectName = newProjectName.trim() || `${targetVehicle.year} ${targetVehicle.model} ${newProjectGoal}`;

    // Select initial components based on chosen template
    let initialComps = [];
    if (newProjectTemplate === 'street') {
      const exhaust = MODIFICATION_COMPONENTS.find(c => c.category === 'exhaust');
      const intake = MODIFICATION_COMPONENTS.find(c => c.category === 'powertrain');
      const wheels = MODIFICATION_COMPONENTS.find(c => c.category === 'wheels_tires');
      initialComps = [exhaust, intake, wheels].filter(Boolean).map(c =>
        BuildService.createBuildComponent(c!, targetVehicle, selectedCountry, selectedRegion, experienceMode)
      );
    } else if (newProjectTemplate === 'track') {
      const aero = MODIFICATION_COMPONENTS.find(c => c.category === 'aerodynamics');
      const suspension = MODIFICATION_COMPONENTS.find(c => c.category === 'suspension');
      const brakes = MODIFICATION_COMPONENTS.find(c => c.category === 'brakes');
      initialComps = [aero, suspension, brakes].filter(Boolean).map(c =>
        BuildService.createBuildComponent(c!, targetVehicle, selectedCountry, selectedRegion, experienceMode)
      );
    } else if (newProjectTemplate === 'power') {
      const turbo = MODIFICATION_COMPONENTS.find(c => c.id.includes('turbo') || c.category === 'powertrain');
      const exhaust = MODIFICATION_COMPONENTS.find(c => c.category === 'exhaust');
      initialComps = [turbo, exhaust].filter(Boolean).map(c =>
        BuildService.createBuildComponent(c!, targetVehicle, selectedCountry, selectedRegion, experienceMode)
      );
    }

    const created = VaultService.createNewProject({
      projectName,
      vehicle: targetVehicle,
      projectGoal: newProjectGoal,
      targetBudgetUSD: newProjectBudget,
      projectStatus: 'in_progress',
      country: selectedCountry,
      region: selectedRegion,
      experienceMode,
      initialComponents: initialComps
    });

    // Close modal, reset fields, refresh and load into workspace
    setIsNewProjectModalOpen(false);
    setNewProjectName('');
    refreshProjects();
    loadSavedBuild(created);
    toast.success(`Created project "${projectName}"!`, {
      description: `Target Budget: $${newProjectBudget.toLocaleString()} • Opening Workspace...`
    });
    setActiveVehicle(targetVehicle);
    navigateTo('/build');
  };

  const filteredModalVehicles = useMemo(() => {
    const q = vehicleSearch.toLowerCase();
    if (!q) return VEHICLES;
    return VEHICLES.filter(
      v =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.trim.toLowerCase().includes(q)
    );
  }, [vehicleSearch]);

  return (
    <PageContainer
      eyebrow="VEHICLE MODIFICATION PROJECTS"
      title="Saved Projects Dashboard"
      subtitle="Track, engineer, and manage your vehicle modification projects. Review real-time performance telemetry, budget commitments, and component compatibility across your fleet."
      action={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo('/compatibility')}
            className="px-4 py-2.5 rounded-2xl neo-raised hover:neo-raised-active text-xs font-mono font-bold text-gray-300 hover:text-white uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#0070F3]" />
            <span>Part Compatibility Simulator</span>
          </button>

          {/* Primary 'New Project' entry button as requested */}
          <button
            type="button"
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl neo-button-primary text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,112,243,0.4)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      }
    >
      {/* ========================================================================= */}
      {/* 1. FLEET SUMMARY METRIC BANNER */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="neo-panel rounded-3xl p-5 border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">Total Saved Projects</span>
            <Layers className="w-4 h-4 text-[#0070F3]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white">
              {fleetKPIs.totalProjects}
            </span>
            <span className="text-xs font-mono text-gray-400">Active Builds</span>
          </div>
          <span className="text-[11px] font-mono text-gray-500 block mt-1">
            Persisted in Build Vault
          </span>
        </div>

        <div className="neo-panel rounded-3xl p-5 border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">Combined Fleet Power</span>
            <Gauge className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white">
              {fleetKPIs.totalHp.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">HP Total</span>
          </div>
          <span className="text-[11px] font-mono text-gray-500 block mt-1">
            Sum of projected fleet output
          </span>
        </div>

        <div className="neo-panel rounded-3xl p-5 border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">Total Investment Tracked</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white">
              ${fleetKPIs.totalCost.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-gray-400">USD</span>
          </div>
          <span className="text-[11px] font-mono text-gray-500 block mt-1">
            Parts + Certified Labor
          </span>
        </div>

        <div className="neo-panel rounded-3xl p-5 border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">Compatibility Safety</span>
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#38BDF8]">
              {fleetKPIs.compatibilityRatio}%
            </span>
            <span className="text-xs font-mono text-gray-400">Verified</span>
          </div>
          <span className="text-[11px] font-mono text-gray-500 block mt-1">
            Zero fatal engineering conflicts
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. TOOLBAR: SEARCH, STATUS FILTERS, AND VIEW MODE TOGGLE */}
      {/* ========================================================================= */}
      <div className="neo-panel rounded-3xl p-4 sm:p-5 border border-white/5 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input using shadcn Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
            <Input
              type="text"
              placeholder="Search projects by title, vehicle model, engine, or goal..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#121417] border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-gray-500 font-medium h-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white z-10 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filters & View Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Status Filter Badges */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#121417] border border-white/10">
              {[
                { id: 'all', label: 'All' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'tuning', label: 'Tuning' },
                { id: 'completed', label: 'Completed' },
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`
                    px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer
                    ${statusFilter === st.id
                      ? 'bg-[#0070F3] text-white font-bold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#121417] border border-white/10 rounded-2xl px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-[#0070F3] cursor-pointer h-10"
            >
              <option value="updated">Sort: Last Updated</option>
              <option value="power">Sort: Highest Power</option>
              <option value="cost">Sort: Total Budget</option>
              <option value="name">Sort: Project Name</option>
            </select>

            {/* List / Grid Toggle using shadcn Tabs */}
            <Tabs value={viewMode} onValueChange={(val: any) => setViewMode(val as 'list' | 'grid')}>
              <TabsList className="bg-[#121417] border border-white/10 p-0.5 rounded-2xl h-10">
                <TabsTrigger value="list" className="rounded-xl px-2.5 py-1.5 data-active:bg-[#0070F3] data-active:text-white text-xs cursor-pointer">
                  <LayoutList className="w-4 h-4 mr-1.5" />
                  <span>List</span>
                </TabsTrigger>
                <TabsTrigger value="grid" className="rounded-xl px-2.5 py-1.5 data-active:bg-[#0070F3] data-active:text-white text-xs cursor-pointer">
                  <LayoutGrid className="w-4 h-4 mr-1.5" />
                  <span>Grid</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LIST VIEW OF SAVED PROJECTS (Primary Requirement) */}
      {/* ========================================================================= */}
      {filteredProjects.length === 0 ? (
        <div className="neo-panel rounded-3xl p-12 text-center border border-white/5 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#0070F3]/10 border border-[#0070F3]/30 flex items-center justify-center text-[#0070F3] mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white font-sans">No vehicle modification projects found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            {searchQuery
              ? `No projects matched "${searchQuery}". Try clearing your search filter.`
              : 'You haven’t saved any vehicle modification projects yet. Start a new project now to configure parts and test compatibility.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl neo-button-primary text-xs font-mono font-bold text-white uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="space-y-3">
          {filteredProjects.map(project => {
            const isLoaded = activeLoadedId === project.buildId;
            const power = project.performanceSummary?.projectedPowerHp || project.vehicle.baselinePowerHp;
            const deltaHp = project.performanceSummary?.powerGainHp || 0;
            const status = project.projectStatus || 'in_progress';

            let statusBadge = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            let statusLabel = 'IN PROGRESS';
            if (status === 'tuning') {
              statusBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
              statusLabel = 'DYNO TUNING';
            } else if (status === 'completed') {
              statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
              statusLabel = 'COMPLETED';
            } else if (status === 'draft') {
              statusBadge = 'bg-gray-500/10 text-gray-400 border-gray-500/20';
              statusLabel = 'DRAFT';
            }

            return (
              <div
                key={project.buildId}
                className={`
                  neo-panel rounded-3xl p-4 sm:p-5 border transition-all duration-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 group
                  ${isLoaded ? 'border-[#0070F3] bg-[#0070F3]/10' : 'border-white/5 hover:border-white/20 bg-[#181B20]/60'}
                `}
              >
                {/* Vehicle Thumbnail & Title Info */}
                <div className="flex items-center gap-4 min-w-[280px]">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-black/50 border border-white/10 shrink-0 relative">
                    <img
                      src={project.vehicle.imageUrl}
                      alt={project.vehicle.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-black shadow"
                      style={{ backgroundColor: project.vehicle.colorHex || '#0070F3' }}
                      title="Chassis Color"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">
                        {project.buildId}
                      </span>
                      <Badge variant={status === 'completed' ? 'default' : status === 'tuning' ? 'secondary' : 'outline'} className="text-[9px] font-mono font-bold">
                        {statusLabel}
                      </Badge>
                      {project.projectGoal && (
                        <Badge variant="secondary" className="text-[10px] font-mono text-gray-300">
                          {project.projectGoal}
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white font-sans truncate group-hover:text-[#0070F3] transition-colors">
                      {project.buildName}
                    </h3>

                    <p className="text-xs text-gray-400 font-sans truncate">
                      {project.vehicle.year} {project.vehicle.make} {project.vehicle.model} •{' '}
                      <span className="font-mono text-gray-300">{project.vehicle.engine || project.vehicle.trim}</span>
                    </p>
                  </div>
                </div>

                {/* Telemetry & Metrics Badges */}
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 lg:gap-8 px-2 sm:px-4 py-2 lg:py-0 border-y lg:border-y-0 lg:border-x border-white/5 shrink-0">
                  
                  {/* Projected Power */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block">Projected Power</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base font-bold font-mono text-white">{power}</span>
                      <span className="text-[10px] font-mono text-gray-400">HP</span>
                    </div>
                    {deltaHp > 0 && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                        +{deltaHp} HP
                      </span>
                    )}
                  </div>

                  {/* Estimated Cost */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block">Estimated Cost</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base font-bold font-mono text-white">
                        {project.costSummary?.regionalDisplayTotal || `$${project.costSummary?.totalCostUSD.toLocaleString()}`}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 block">
                      {project.components.length} Components
                    </span>
                  </div>

                  {/* Compatibility Status */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block">Compatibility</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      {project.compatibilitySummary?.hasCriticalConflict ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span className="text-xs font-mono font-bold text-rose-400">Conflict</span>
                        </>
                      ) : project.compatibilitySummary?.verificationRequiredCount > 0 ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-mono font-bold text-amber-400">Review</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-mono font-bold text-emerald-400">100% Verified</span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 block truncate">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleLoadProject(project)}
                    className="px-3.5 py-2 rounded-xl neo-button-primary text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                    title="Load into active workspace & garage"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Open in Build</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      loadSavedBuild(project);
                      navigateTo('/compatibility');
                    }}
                    className="px-3 py-2 rounded-xl neo-raised hover:neo-raised-active text-gray-300 hover:text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
                    title="Simulate part compatibility for this project"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#0070F3]" />
                    <span className="hidden sm:inline">Simulate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicateProject(project.buildId)}
                    className="p-2 rounded-xl neo-raised hover:neo-raised-active text-gray-400 hover:text-white transition-all cursor-pointer"
                    title="Duplicate project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportProject(project)}
                    className="p-2 rounded-xl neo-raised hover:neo-raised-active text-gray-400 hover:text-white transition-all cursor-pointer"
                    title="Export JSON spec"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project.buildId, project.buildName)}
                    className="p-2 rounded-xl hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 transition-all cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid View Alternative */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => {
            const power = project.performanceSummary?.projectedPowerHp || project.vehicle.baselinePowerHp;
            const deltaHp = project.performanceSummary?.powerGainHp || 0;

            return (
              <div
                key={project.buildId}
                className="neo-panel rounded-3xl p-5 border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-4 group bg-[#181B20]/60"
              >
                <div>
                  <div className="w-full h-44 rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative mb-4">
                    <img
                      src={project.vehicle.imageUrl}
                      alt={project.vehicle.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {project.buildId}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0070F3]/80 backdrop-blur-md text-white font-bold">
                        {project.projectGoal || 'Street'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white font-sans group-hover:text-[#0070F3] transition-colors leading-snug">
                    {project.buildName}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {project.vehicle.year} {project.vehicle.make} {project.vehicle.model}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#121417] border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">Projected Output</span>
                    <span className="font-bold text-white font-mono">{power} HP</span>
                    {deltaHp > 0 && <span className="text-[10px] font-mono text-emerald-400 block">+{deltaHp} HP</span>}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">Estimated Cost</span>
                    <span className="font-bold text-white font-mono">
                      {project.costSummary?.regionalDisplayTotal || `$${project.costSummary?.totalCostUSD.toLocaleString()}`}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 block">{project.components.length} parts</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleLoadProject(project)}
                    className="flex-1 py-2 px-3 rounded-xl neo-button-primary text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Open Project</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      loadSavedBuild(project);
                      navigateTo('/compatibility');
                    }}
                    className="p-2 rounded-xl neo-raised hover:neo-raised-active text-gray-300 hover:text-white transition-all cursor-pointer"
                    title="Simulate Compatibility"
                  >
                    <Zap className="w-4 h-4 text-[#0070F3]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project.buildId, project.buildName)}
                    className="p-2 rounded-xl hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. 'NEW PROJECT' CREATION MODAL WIZARD */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isNewProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="neo-panel rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 space-y-6 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Title */}
              <div>
                <div className="flex items-center gap-2 text-[#0070F3] mb-1">
                  <Plus className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Create New Project</span>
                </div>
                <h2 className="text-2xl font-black text-white font-sans tracking-tight">
                  Start a Vehicle Modification Project
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-sans">
                  Choose a base platform, set your modification goal, and start configuring compatible components.
                </p>
              </div>

              <form onSubmit={handleCreateNewProject} className="space-y-6">
                
                {/* Project Name */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-300 block">
                    Project Title:
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Apex Hunter GT3 RS Track Spec, B58 700HP Drag Weapon"
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    className="w-full bg-[#121417] border-white/10 rounded-2xl px-4 py-2 text-xs text-white placeholder:text-gray-500 font-medium h-11"
                  />
                </div>

                {/* Base Vehicle Selector */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-gray-300 block">
                      Select Base Vehicle:
                    </label>
                    <input
                      type="text"
                      placeholder="Filter vehicles..."
                      value={vehicleSearch}
                      onChange={e => setVehicleSearch(e.target.value)}
                      className="bg-[#121417] border border-white/10 rounded-xl px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-[#0070F3]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {filteredModalVehicles.slice(0, 12).map(v => {
                      const isSelected = newProjectVehicleId === v.id;
                      return (
                        <div
                          key={v.id}
                          onClick={() => setNewProjectVehicleId(v.id)}
                          className={`
                            p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5
                            ${isSelected
                              ? 'bg-[#0070F3]/20 border-[#0070F3] text-white'
                              : 'bg-[#121417] border-white/5 hover:border-white/20 text-gray-400 hover:text-white'
                            }
                          `}
                        >
                          <img
                            src={v.imageUrl}
                            alt={v.model}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-[11px] font-bold truncate leading-tight">{v.model}</h4>
                            <p className="text-[10px] font-mono text-gray-400 truncate">{v.baselinePowerHp} HP</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Modification Goal */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-300 block">
                    Primary Modification Goal:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'Street Performance', label: 'Street Performance' },
                      { id: 'Track Attack', label: 'Track Attack' },
                      { id: 'Drag Spec', label: 'Drag Spec' },
                      { id: 'Daily Clubsport', label: 'Daily Clubsport' },
                    ].map(goal => (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => setNewProjectGoal(goal.id)}
                        className={`
                          p-2.5 rounded-xl border text-center text-xs font-mono transition-all cursor-pointer
                          ${newProjectGoal === goal.id
                            ? 'bg-[#0070F3] border-[#0070F3] text-white font-bold'
                            : 'bg-[#121417] border-white/5 text-gray-400 hover:text-white'
                          }
                        `}
                      >
                        {goal.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Starter Template */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-300 block">
                    Starter Component Template:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'blank', title: 'Clean Slate', desc: 'No parts' },
                      { id: 'street', title: 'Street Pack', desc: 'Exhaust + Intake' },
                      { id: 'track', title: 'Track Spec', desc: 'Aero + Suspension' },
                      { id: 'power', title: 'Power Pack', desc: 'Turbo + Exhaust' },
                    ].map(tmpl => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setNewProjectTemplate(tmpl.id as any)}
                        className={`
                          p-2.5 rounded-xl border text-left transition-all cursor-pointer
                          ${newProjectTemplate === tmpl.id
                            ? 'bg-emerald-500/20 border-emerald-500 text-white'
                            : 'bg-[#121417] border-white/5 text-gray-400 hover:text-white'
                          }
                        `}
                      >
                        <span className="text-xs font-bold font-sans block">{tmpl.title}</span>
                        <span className="text-[10px] font-mono text-gray-400 block mt-0.5">{tmpl.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Budget Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-gray-300">Target Budget Allocation:</label>
                    <span className="text-sm font-mono font-bold text-white">
                      ${newProjectBudget.toLocaleString()} USD
                    </span>
                  </div>
                  <Slider
                    value={[newProjectBudget]}
                    min={5000}
                    max={100000}
                    step={2500}
                    onValueChange={(val: any) => {
                      const b = Array.isArray(val) ? val[0] : val;
                      setNewProjectBudget(Number(b));
                    }}
                    className="w-full py-2 cursor-pointer"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsNewProjectModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl neo-button-primary text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create & Open Project</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PageContainer>
  );
};
