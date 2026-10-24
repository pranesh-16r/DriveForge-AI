import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoButton } from '../components/ui/NeoButton';
import { VaultService } from '../lib/vault/vaultService';
import { SavedBuild } from '../types/vault';
import {
  Sparkles,
  Car,
  Layers,
  Wrench,
  Download,
  Upload,
  Copy,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Plus,
  FileText,
  AlertTriangle,
  Search,
  Check,
  Edit2
} from 'lucide-react';

export const VaultPage: React.FC = () => {
  const {
    activeVehicle,
    selectedCountry,
    selectedRegion,
    experienceMode,
    buildState,
    buildComponents,
    loadSavedBuild,
    navigateTo
  } = useApp();

  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [newBuildTitle, setNewBuildTitle] = useState('');
  const [newBuildNote, setNewBuildNote] = useState('');
  const [activeLoadedId, setActiveLoadedId] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load builds on mount & seed if empty
  useEffect(() => {
    let builds = VaultService.getSavedBuilds();
    if (builds.length === 0 && activeVehicle) {
      builds = VaultService.seedSampleBuildsIfEmpty(activeVehicle, buildComponents, selectedCountry, selectedRegion);
    }
    setSavedBuilds(builds);
  }, []);

  const refreshBuilds = () => {
    setSavedBuilds(VaultService.getSavedBuilds());
  };

  const handleSaveActiveBuild = () => {
    if (!activeVehicle) return;

    const title = newBuildTitle.trim() || `${activeVehicle.year} ${activeVehicle.model} Spec`;
    const initialNotes = newBuildNote.trim()
      ? [{ id: `note-${Date.now()}`, text: newBuildNote.trim(), createdAt: new Date().toLocaleDateString() }]
      : [];

    VaultService.createFromCurrentSession({
      buildName: title,
      vehicle: activeVehicle,
      components: buildComponents,
      country: selectedCountry,
      region: selectedRegion,
      experienceMode,
      costSummary: buildState.costSummary,
      notes: initialNotes
    });

    setSaveModalOpen(false);
    setNewBuildTitle('');
    setNewBuildNote('');
    refreshBuilds();
  };

  const handleLoadBuild = (build: SavedBuild) => {
    loadSavedBuild(build);
    setActiveLoadedId(build.buildId);
    setTimeout(() => {
      setActiveLoadedId(null);
    }, 2500);
  };

  const handleDuplicate = (buildId: string) => {
    VaultService.duplicateBuild(buildId);
    refreshBuilds();
  };

  const handleDelete = (buildId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this saved build from your vault?')) {
      VaultService.deleteBuild(buildId);
      refreshBuilds();
    }
  };

  const handleExport = (build: SavedBuild) => {
    const jsonStr = VaultService.exportBuildAsJson(build.buildId);
    if (!jsonStr) return;

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${build.buildId.toLowerCase()}-${build.vehicle.model.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = VaultService.importBuildFromJson(text);
        if (imported) {
          refreshBuilds();
          setImportNotice({ type: 'success', text: `Successfully imported ${imported.buildName} (${imported.buildId}) into your Vault.` });
        } else {
          setImportNotice({ type: 'error', text: 'Invalid build JSON schema format.' });
        }
      } catch (err) {
        setImportNotice({ type: 'error', text: 'Error reading JSON file.' });
      }
      setTimeout(() => setImportNotice(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredBuilds = savedBuilds.filter(b => {
    const q = searchQuery.toLowerCase();
    return (
      b.buildName.toLowerCase().includes(q) ||
      b.buildId.toLowerCase().includes(q) ||
      b.vehicle.model.toLowerCase().includes(q) ||
      b.vehicle.make.toLowerCase().includes(q)
    );
  });

  return (
    <PageContainer
      eyebrow="DIGITAL GARAGE ARCHIVE"
      title="YOUR BUILDS"
      subtitle="Digital garage archive: saved vehicle builds, component stacks, and engineering schematics stored for trackside and workshop handoff."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <NeoButton
            variant="outline"
            size="sm"
            onClick={() => navigateTo('/projects')}
            icon={<Layers className="w-3.5 h-3.5 text-[#0070F3]" />}
          >
            Project Dashboard
          </NeoButton>
          <label className="py-2 px-3.5 rounded-xl neo-button text-xs font-mono text-gray-300 hover:text-white border border-white/10 flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-[#0070F3]" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportFile}
            />
          </label>
          <NeoButton
            variant="primary"
            size="sm"
            onClick={() => setSaveModalOpen(true)}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Save Active Build
          </NeoButton>
        </div>
      }
    >
      <div className="space-y-8">
        
        {importNotice && (
          <div className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in ${
            importNotice.type === 'success'
              ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
              : 'bg-red-500/15 border-red-500/30 text-red-400'
          }`}>
            <span>{importNotice.text}</span>
            <button onClick={() => setImportNotice(null)} className="underline cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Active Session Snapshot Strip */}
        <div className="p-5 sm:p-6 rounded-[24px] neo-panel border border-[#0070F3]/30 bg-[#12151D] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#0070F3] uppercase tracking-wider">
                ACTIVE PHYSICAL SESSION STATE
              </span>
            </div>
            <h3 className="text-xl font-black text-white font-sans">
              {buildState.buildName || 'Untitled Physical Blueprint'}
            </h3>
            <p className="text-xs font-mono text-gray-400">
              {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} • {buildComponents.length} Hardware Components Selected • Region: {selectedRegion?.name || 'Selected'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo('/build')}
              className="py-2.5 px-4 rounded-xl neo-button text-xs font-mono font-bold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-[#0070F3]" />
              <span>EDIT BUILD</span>
            </button>

            <button
              onClick={() => navigateTo('/reports')}
              className="py-2.5 px-4 rounded-xl neo-button text-xs font-mono font-bold text-[#38BDF8] hover:text-white border border-[#38BDF8]/30 bg-[#38BDF8]/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>CERTIFICATION REPORT</span>
            </button>

            <button
              onClick={() => setSaveModalOpen(true)}
              className="py-2.5 px-5 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs font-mono font-black flex items-center gap-1.5 shadow-lg shadow-[#0070F3]/25 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>SAVE SNAPSHOT</span>
            </button>
          </div>
        </div>

        {/* Search & Vault Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search saved blueprints by build ID, title, or vehicle..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#12141A] neo-inset border border-white/10 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#0070F3]"
            />
          </div>

          <div className="text-xs font-mono text-gray-400">
            {filteredBuilds.length} ARCHIVED BLUEPRINTS IN VAULT
          </div>
        </div>

        {/* Saved Builds Grid */}
        {filteredBuilds.length === 0 ? (
          <div className="p-12 sm:p-16 rounded-3xl neo-panel border border-white/10 bg-[#12141A] text-center space-y-4 max-w-xl mx-auto my-8">
            <Layers className="w-12 h-12 text-gray-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-mono uppercase">
                NO BLUEPRINTS MATCH YOUR SEARCH
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Save your active configuration or import a previously exported JSON build file.
              </p>
            </div>
            <NeoButton
              variant="primary"
              size="sm"
              onClick={() => setSaveModalOpen(true)}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Save Current Build Now
            </NeoButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBuilds.map(build => {
              const isLoaded = activeLoadedId === build.buildId;

              return (
                <div
                  key={build.buildId}
                  className="p-6 rounded-[28px] neo-panel border border-white/10 bg-[#14161C] flex flex-col justify-between space-y-5 hover:border-[#0070F3]/40 transition-all"
                >
                  {/* Card Header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wider bg-[#0070F3]/20 text-[#0070F3] border border-[#0070F3]/30">
                        {build.buildId}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span>Updated {new Date(build.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white font-sans tracking-tight">
                        {build.buildName}
                      </h3>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">
                        {build.vehicle.year} {build.vehicle.make} {build.vehicle.model} ({build.vehicle.chassisCode || 'OEM'})
                      </p>
                    </div>

                    {/* Regional Price and Performance Metrics */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#0D0F14] neo-inset border border-white/5 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Components</span>
                        <span className="font-bold text-white text-sm">
                          {build.components.length} parts
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Power Output</span>
                        <span className="font-bold text-[#10B981] text-sm">
                          +{build.performanceSummary?.powerGainHp || 0} HP
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Estimated Total</span>
                        <span className="font-bold text-white text-sm">
                          {build.costSummary?.regionalDisplayTotal || `$${build.costSummary?.totalCostUSD.toLocaleString()}`}
                        </span>
                      </div>
                    </div>

                    {/* Parts List Preview */}
                    {build.components.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
                          BOM PREVIEW
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {build.components.slice(0, 4).map(c => (
                            <span
                              key={c.id}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-gray-300"
                            >
                              {c.name}
                            </span>
                          ))}
                          {build.components.length > 4 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0070F3]/10 text-[#0070F3] border border-[#0070F3]/30">
                              +{build.components.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes Snippet */}
                    {build.notes && build.notes.length > 0 && (
                      <p className="text-xs text-gray-400 font-sans italic line-clamp-1">
                        Note: "{build.notes[0].text}"
                      </p>
                    )}
                  </div>

                  {/* Card Action Controls */}
                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleExport(build)}
                        className="p-2 rounded-xl neo-button text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title="Download JSON schematic"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(build.buildId)}
                        className="p-2 rounded-xl neo-button text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title="Duplicate blueprint"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(build.buildId)}
                        className="p-2 rounded-xl neo-button text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete blueprint"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateTo(`/reports?buildId=${build.buildId}`)}
                        className="py-2 px-3 rounded-xl neo-button text-xs font-mono font-bold text-[#38BDF8] hover:text-white border border-[#38BDF8]/30 transition-colors cursor-pointer"
                      >
                        REPORT
                      </button>

                      <button
                        onClick={() => handleLoadBuild(build)}
                        className={`py-2 px-4 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isLoaded
                            ? 'bg-[#10B981] text-black shadow-lg shadow-[#10B981]/30 font-black'
                            : 'bg-[#0070F3] hover:bg-[#0060df] text-white shadow-md shadow-[#0070F3]/20'
                        }`}
                      >
                        {isLoaded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>LOADED TO ACTIVE</span>
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4" />
                            <span>LOAD BLUEPRINT</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Save Active Build Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="fixed inset-0" onClick={() => setSaveModalOpen(false)} aria-hidden="true" />

          <div className="relative w-full max-w-lg bg-[#14171E] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-2xl z-10 animate-in fade-in zoom-in-95">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-wider block">
                LOCAL ENCRYPTED STORAGE
              </span>
              <h3 className="text-xl font-black text-white font-sans">
                Save Blueprint to Vault
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Store the active CAD configuration for {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} ({buildComponents.length} parts).
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold uppercase block">
                  Blueprint Title
                </label>
                <input
                  type="text"
                  value={newBuildTitle}
                  onChange={e => setNewBuildTitle(e.target.value)}
                  placeholder={`${activeVehicle.year} ${activeVehicle.model} Spec Alpha`}
                  className="w-full p-3 rounded-xl bg-[#0D0F13] neo-inset border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#0070F3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold uppercase block">
                  Engineering Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={newBuildNote}
                  onChange={e => setNewBuildNote(e.target.value)}
                  placeholder="Target alignment: -2.5 deg front camber, 50% cross weight, 98 RON fuel map..."
                  className="w-full p-3 rounded-xl bg-[#0D0F13] neo-inset border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#0070F3]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="py-2.5 px-4 rounded-xl neo-button text-xs font-mono text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveActiveBuild}
                className="py-2.5 px-6 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs font-mono font-black shadow-lg shadow-[#0070F3]/30 cursor-pointer"
              >
                Confirm & Save Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
