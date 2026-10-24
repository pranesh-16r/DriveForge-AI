import { SavedBuild } from '../../types/vault';
import { Vehicle, Country, Region } from '../../types';
import { BuildComponent } from '../../types/build';
import { VEHICLES } from '../../data/vehicles';

const VAULT_STORAGE_KEY = 'driveforge_build_vault_v1';

export class VaultService {
  /**
   * Retrieves all saved builds from local storage.
   */
  public static getSavedBuilds(): SavedBuild[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(VAULT_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to parse vault builds from localStorage', e);
      return [];
    }
  }

  /**
   * Generates a new unique sequential or timestamped Build ID (e.g., DF-BUILD-001).
   */
  private static generateBuildId(existingBuilds: SavedBuild[]): string {
    const existingNumbers = existingBuilds
      .map(b => {
        const match = b.buildId.match(/DF-BUILD-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));

    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNum = maxNum + 1;
    return `DF-BUILD-${String(nextNum).padStart(3, '0')}`;
  }

  /**
   * Save a new build to the vault.
   */
  public static saveBuild(
    data: Omit<SavedBuild, 'buildId' | 'version' | 'createdAt' | 'updatedAt'>
  ): SavedBuild {
    const existing = this.getSavedBuilds();
    const now = new Date().toISOString();
    const newBuildId = this.generateBuildId(existing);

    const newBuild: SavedBuild = {
      ...data,
      buildId: newBuildId,
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    const updated = [newBuild, ...existing];
    this.persist(updated);
    return newBuild;
  }

  /**
   * Updates an existing build in the vault.
   */
  public static updateBuild(buildId: string, updates: Partial<SavedBuild>): SavedBuild | null {
    const existing = this.getSavedBuilds();
    const index = existing.findIndex(b => b.buildId === buildId);
    if (index === -1) return null;

    const current = existing[index];
    const updatedBuild: SavedBuild = {
      ...current,
      ...updates,
      buildId: current.buildId, // immutable
      updatedAt: new Date().toISOString(),
      version: current.version + 1
    };

    existing[index] = updatedBuild;
    this.persist(existing);
    return updatedBuild;
  }

  /**
   * Duplicate a build (creates a separate copy with a new ID).
   */
  public static duplicateBuild(buildId: string): SavedBuild | null {
    const existing = this.getSavedBuilds();
    const target = existing.find(b => b.buildId === buildId);
    if (!target) return null;

    const now = new Date().toISOString();
    const newBuildId = this.generateBuildId(existing);

    const duplicated: SavedBuild = {
      ...target,
      buildId: newBuildId,
      version: 1,
      buildName: `${target.buildName} (Copy)`,
      createdAt: now,
      updatedAt: now
    };

    const updated = [duplicated, ...existing];
    this.persist(updated);
    return duplicated;
  }

  /**
   * Delete a build from the vault.
   */
  public static deleteBuild(buildId: string): boolean {
    const existing = this.getSavedBuilds();
    const filtered = existing.filter(b => b.buildId !== buildId);
    if (filtered.length === existing.length) return false;

    this.persist(filtered);
    return true;
  }

  /**
   * Rename a build.
   */
  public static renameBuild(buildId: string, newName: string): SavedBuild | null {
    if (!newName.trim()) return null;
    return this.updateBuild(buildId, { buildName: newName.trim() });
  }

  /**
   * Retrieve a single build by ID.
   */
  public static getBuildById(buildId: string): SavedBuild | null {
    const existing = this.getSavedBuilds();
    return existing.find(b => b.buildId === buildId) || null;
  }

  /**
   * Seed initial reference builds/projects if vault is completely empty.
   */
  public static seedIfEmpty(
    vehicle: Vehicle,
    country: Country | null,
    region: Region | null,
    components: BuildComponent[]
  ): SavedBuild[] {
    const existing = this.getSavedBuilds();
    if (existing.length > 0) return existing;

    const now = new Date().toISOString();
    const currency = region?.currency || country?.currency || 'USD';
    const currencySymbol = region?.currencySymbol || country?.currencySymbol || '$';

    const porscheVehicle = vehicle || VEHICLES[0];
    const bmwVehicle = VEHICLES.find(v => v.model.includes('M3')) || VEHICLES[1] || porscheVehicle;
    const supraVehicle = VEHICLES.find(v => v.model.includes('Supra')) || VEHICLES[2] || porscheVehicle;

    const seed1: SavedBuild = {
      buildId: 'DF-BUILD-001',
      version: 1,
      buildName: `${porscheVehicle.make} ${porscheVehicle.model} Track Attack Spec`,
      vehicle: porscheVehicle,
      country,
      region,
      experienceMode: 'enthusiast',
      projectStatus: 'in_progress',
      projectGoal: 'Track Attack',
      targetBudgetUSD: 35000,
      componentIds: components.map(c => c.componentId),
      components,
      notes: [
        {
          id: 'note-seed-1',
          text: 'Corner balance targets 50.0% cross weight with driver in seat and 1/2 tank fuel.',
          createdAt: new Date().toLocaleDateString()
        }
      ],
      costSummary: {
        partsCostUSD: 18450,
        laborCostUSD: 2800,
        totalCostUSD: 21250,
        regionalDisplayParts: `${currencySymbol}18,450`,
        regionalDisplayLabor: `${currencySymbol}2,800`,
        regionalDisplayTotal: `${currencySymbol}21,250`,
        currency,
        currencySymbol
      },
      compatibilitySummary: {
        compatibleCount: Math.max(2, components.length),
        conditionalCount: 0,
        conflictCount: 0,
        verificationRequiredCount: 0,
        hasCriticalConflict: false
      },
      buildHealth: {
        status: 'GOOD',
        label: 'VERIFIED COMPATIBLE'
      },
      performanceSummary: {
        baselinePowerHp: porscheVehicle.baselinePowerHp,
        projectedPowerHp: porscheVehicle.baselinePowerHp + 52,
        powerGainHp: 52,
        baselineWeightKg: porscheVehicle.weightKg,
        projectedWeightKg: porscheVehicle.weightKg - 18,
        weightDeltaKg: -18
      },
      createdAt: now,
      updatedAt: now
    };

    const seed2: SavedBuild = {
      buildId: 'DF-BUILD-002',
      version: 1,
      buildName: `${bmwVehicle.make} ${bmwVehicle.model} Pure800 Stage 2 Clubsport`,
      vehicle: bmwVehicle,
      country,
      region,
      experienceMode: 'enthusiast',
      projectStatus: 'tuning',
      projectGoal: 'Street Performance',
      targetBudgetUSD: 25000,
      componentIds: ['mod-pwr-pure800-turbo', 'mod-pwr-akrapovic-exhaust', 'mod-pwr-eventuri-intake'],
      components: [],
      notes: [
        {
          id: 'note-seed-2',
          text: 'Flash tune scheduled on Mustang dyno with E85 flex-fuel sensor calibration.',
          createdAt: new Date().toLocaleDateString()
        }
      ],
      costSummary: {
        partsCostUSD: 16000,
        laborCostUSD: 2025,
        totalCostUSD: 18025,
        regionalDisplayParts: `${currencySymbol}16,000`,
        regionalDisplayLabor: `${currencySymbol}2,025`,
        regionalDisplayTotal: `${currencySymbol}18,025`,
        currency,
        currencySymbol
      },
      compatibilitySummary: {
        compatibleCount: 3,
        conditionalCount: 1,
        conflictCount: 0,
        verificationRequiredCount: 1,
        hasCriticalConflict: false
      },
      buildHealth: {
        status: 'GOOD',
        label: 'DYNO TUNING REQUIRED'
      },
      performanceSummary: {
        baselinePowerHp: bmwVehicle.baselinePowerHp,
        projectedPowerHp: bmwVehicle.baselinePowerHp + 185,
        powerGainHp: 185,
        baselineWeightKg: bmwVehicle.weightKg,
        projectedWeightKg: bmwVehicle.weightKg - 13,
        weightDeltaKg: -13
      },
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
    };

    const seed3: SavedBuild = {
      buildId: 'DF-BUILD-003',
      version: 1,
      buildName: `${supraVehicle.make} ${supraVehicle.model} B58 700HP Drag Weapon`,
      vehicle: supraVehicle,
      country,
      region,
      experienceMode: 'enthusiast',
      projectStatus: 'completed',
      projectGoal: 'Drag Spec',
      targetBudgetUSD: 28000,
      componentIds: ['mod-pwr-akrapovic-exhaust', 'mod-whl-bbs-fir'],
      components: [],
      notes: [
        {
          id: 'note-seed-3',
          text: 'Verified 1/4 mile ET 10.12s @ 138 mph. Full telemetry logged.',
          createdAt: new Date().toLocaleDateString()
        }
      ],
      costSummary: {
        partsCostUSD: 19850,
        laborCostUSD: 1850,
        totalCostUSD: 21700,
        regionalDisplayParts: `${currencySymbol}19,850`,
        regionalDisplayLabor: `${currencySymbol}1,850`,
        regionalDisplayTotal: `${currencySymbol}21,700`,
        currency,
        currencySymbol
      },
      compatibilitySummary: {
        compatibleCount: 4,
        conditionalCount: 0,
        conflictCount: 0,
        verificationRequiredCount: 0,
        hasCriticalConflict: false
      },
      buildHealth: {
        status: 'GOOD',
        label: 'VERIFIED COMPATIBLE'
      },
      performanceSummary: {
        baselinePowerHp: supraVehicle.baselinePowerHp,
        projectedPowerHp: supraVehicle.baselinePowerHp + 215,
        powerGainHp: 215,
        baselineWeightKg: supraVehicle.weightKg,
        projectedWeightKg: supraVehicle.weightKg - 22,
        weightDeltaKg: -22
      },
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    };

    const seeds = [seed1, seed2, seed3];
    this.persist(seeds);
    return seeds;
  }

  public static seedSampleBuildsIfEmpty(
    vehicle: Vehicle,
    components: BuildComponent[],
    country: Country | null,
    region: Region | null
  ): SavedBuild[] {
    return this.seedIfEmpty(vehicle, country, region, components);
  }

  /**
   * Dedicated entry point for creating new modification projects from the Project Dashboard.
   */
  public static createNewProject(params: {
    projectName: string;
    vehicle: Vehicle;
    projectGoal?: string;
    targetBudgetUSD?: number;
    projectStatus?: 'draft' | 'in_progress' | 'tuning' | 'completed';
    country?: Country | null;
    region?: Region | null;
    experienceMode?: 'beginner' | 'enthusiast';
    initialComponents?: BuildComponent[];
  }): SavedBuild {
    const existing = this.getSavedBuilds();
    const newBuildId = this.generateBuildId(existing);
    const now = new Date().toISOString();

    const currency = params.region?.currency || params.country?.currency || 'USD';
    const currencySymbol = params.region?.currencySymbol || params.country?.currencySymbol || '$';

    const components = params.initialComponents || [];
    const partsTotal = components.reduce((sum, c) => sum + (c.estimatedPartCost?.min || 0), 0);
    const laborTotal = components.reduce((sum, c) => sum + (c.estimatedInstallationCost?.min || 0), 0);
    const totalUSD = partsTotal + laborTotal;

    const newProject: SavedBuild = {
      buildId: newBuildId,
      version: 1,
      buildName: params.projectName.trim() || `${params.vehicle.year} ${params.vehicle.model} Build Project`,
      vehicle: params.vehicle,
      country: params.country || null,
      region: params.region || null,
      experienceMode: params.experienceMode || 'enthusiast',
      projectStatus: params.projectStatus || 'in_progress',
      projectGoal: params.projectGoal || 'Street Performance',
      targetBudgetUSD: params.targetBudgetUSD || 20000,
      componentIds: components.map(c => c.componentId),
      components,
      notes: [
        {
          id: `note-${Date.now()}`,
          text: `Project created on ${new Date().toLocaleDateString()}. Initial goal: ${params.projectGoal || 'Street Performance'}.`,
          createdAt: new Date().toLocaleDateString()
        }
      ],
      costSummary: {
        partsCostUSD: partsTotal,
        laborCostUSD: laborTotal,
        totalCostUSD: totalUSD,
        regionalDisplayParts: `${currencySymbol}${partsTotal.toLocaleString()}`,
        regionalDisplayLabor: `${currencySymbol}${laborTotal.toLocaleString()}`,
        regionalDisplayTotal: `${currencySymbol}${totalUSD.toLocaleString()}`,
        currency,
        currencySymbol
      },
      compatibilitySummary: {
        compatibleCount: components.length,
        conditionalCount: 0,
        conflictCount: 0,
        verificationRequiredCount: 0,
        hasCriticalConflict: false
      },
      buildHealth: {
        status: 'GOOD',
        label: 'ACTIVE PROJECT'
      },
      performanceSummary: {
        baselinePowerHp: params.vehicle.baselinePowerHp,
        projectedPowerHp: params.vehicle.baselinePowerHp + components.reduce((s, c) => s + (c.powerGainHp || 0), 0),
        powerGainHp: components.reduce((s, c) => s + (c.powerGainHp || 0), 0),
        baselineWeightKg: params.vehicle.weightKg,
        projectedWeightKg: params.vehicle.weightKg + components.reduce((s, c) => s + (c.weightDeltaKg || 0), 0),
        weightDeltaKg: components.reduce((s, c) => s + (c.weightDeltaKg || 0), 0)
      },
      createdAt: now,
      updatedAt: now
    };

    const updated = [newProject, ...existing];
    this.persist(updated);
    return newProject;
  }

  public static createFromCurrentSession(params: {
    buildName: string;
    vehicle: Vehicle;
    components: BuildComponent[];
    country: Country | null;
    region: Region | null;
    experienceMode: 'beginner' | 'enthusiast';
    costSummary?: any;
    notes?: any[];
  }): SavedBuild {
    const currency = params.region?.currency || params.country?.currency || 'USD';
    const currencySymbol = params.region?.currencySymbol || params.country?.currencySymbol || '$';

    const partsTotal = params.components.reduce((sum, c) => sum + (c.estimatedPartCost?.min || 0), 0);
    const laborTotal = params.components.reduce((sum, c) => sum + (c.estimatedInstallationCost?.min || 0), 0);
    const totalUSD = partsTotal + laborTotal;

    return this.saveBuild({
      buildName: params.buildName,
      vehicle: params.vehicle,
      country: params.country,
      region: params.region,
      experienceMode: params.experienceMode,
      componentIds: params.components.map(c => c.componentId),
      components: params.components,
      notes: params.notes || [],
      costSummary: {
        partsCostUSD: partsTotal,
        laborCostUSD: laborTotal,
        totalCostUSD: totalUSD,
        regionalDisplayParts: `${currencySymbol}${partsTotal.toLocaleString()}`,
        regionalDisplayLabor: `${currencySymbol}${laborTotal.toLocaleString()}`,
        regionalDisplayTotal: `${currencySymbol}${totalUSD.toLocaleString()}`,
        currency,
        currencySymbol
      },
      compatibilitySummary: {
        compatibleCount: params.components.length,
        conditionalCount: 0,
        conflictCount: 0,
        verificationRequiredCount: 0,
        hasCriticalConflict: false
      },
      buildHealth: {
        status: 'GOOD',
        label: 'HOMOLOGATED'
      },
      performanceSummary: {
        baselinePowerHp: params.vehicle.baselinePowerHp,
        projectedPowerHp: params.vehicle.baselinePowerHp + params.components.reduce((s, c) => s + (c.powerGainHp || 0), 0),
        powerGainHp: params.components.reduce((s, c) => s + (c.powerGainHp || 0), 0),
        baselineWeightKg: params.vehicle.weightKg,
        projectedWeightKg: params.vehicle.weightKg + params.components.reduce((s, c) => s + (c.weightDeltaKg || 0), 0),
        weightDeltaKg: params.components.reduce((s, c) => s + (c.weightDeltaKg || 0), 0)
      }
    });
  }

  public static exportBuildAsJson(buildId: string): string | null {
    const build = this.getBuildById(buildId);
    if (!build) return null;
    return JSON.stringify(build, null, 2);
  }

  public static importBuildFromJson(jsonString: string): SavedBuild | null {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.vehicle || !parsed.buildName) return null;

      const existing = this.getSavedBuilds();
      const newBuildId = this.generateBuildId(existing);
      const now = new Date().toISOString();

      const newBuild: SavedBuild = {
        ...parsed,
        buildId: newBuildId,
        version: (parsed.version || 0) + 1,
        createdAt: now,
        updatedAt: now
      };

      const updated = [newBuild, ...existing];
      this.persist(updated);
      return newBuild;
    } catch (e) {
      console.error('Failed to import build JSON', e);
      return null;
    }
  }

  private static persist(builds: SavedBuild[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(builds));
    } catch (e) {
      console.error('Failed to write vault to localStorage', e);
    }
  }
}
