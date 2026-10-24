import { Vehicle } from '../types';
import { BuildComponent, BuildState } from '../types/build';
import { BuildPerformanceAnalysis } from '../types/analysis';
import { PerformanceService } from './performanceService';
import { RecommendationService } from './recommendationService';
import { ConfidenceService } from './confidenceService';

export class BuildAnalysisService {
  /**
   * Orchestrates the complete build analysis workflow
   */
  public static analyze(
    vehicle: Vehicle,
    components: BuildComponent[],
    buildState: BuildState
  ): BuildPerformanceAnalysis {
    return PerformanceService.calculateBuildPerformance(vehicle, components, buildState);
  }
}

export { PerformanceService, RecommendationService, ConfidenceService };
