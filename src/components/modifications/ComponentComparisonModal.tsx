import React from 'react';
import { 
  X, 
  Check, 
  Plus, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Trash2, 
  Columns3
} from 'lucide-react';
import { ExtendedModificationComponent, ComponentCompatibilityResult } from '../../types/modification';
import { evaluateComponentCompatibility } from '../../lib/modifications/compatibility';
import { Vehicle } from '../../types';

interface ComponentComparisonModalProps {
  components: ExtendedModificationComponent[];
  activeVehicle: Vehicle;
  buildComponentIds: string[];
  previewedComponentId: string | null;
  onClose: () => void;
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onToggleBuild: (component: ExtendedModificationComponent) => void;
  onTogglePreview: (component: ExtendedModificationComponent) => void;
}

export const ComponentComparisonModal: React.FC<ComponentComparisonModalProps> = ({
  components,
  activeVehicle,
  buildComponentIds,
  previewedComponentId,
  onClose,
  onRemoveFromCompare,
  onClearCompare,
  onToggleBuild,
  onTogglePreview
}) => {
  if (components.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] rounded-[28px] neo-panel border border-white/10 bg-[#12141A] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#151820]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl neo-inset flex items-center justify-center text-[#0070F3]">
              <Columns3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-sans">
                Side-by-Side Component Comparison
              </h3>
              <p className="text-xs font-mono text-gray-400">
                Evaluating fitment & specs against {activeVehicle.make} {activeVehicle.model}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearCompare}
              className="px-3 py-1.5 rounded-xl neo-button text-xs font-mono text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl neo-button flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              aria-label="Close comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comparison Table Grid */}
        <div className="overflow-x-auto overflow-y-auto p-4 sm:p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 w-40 text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Component
                </th>
                {components.map((comp) => {
                  const isInBuild = buildComponentIds.includes(comp.id);
                  const isPreviewing = previewedComponentId === comp.id;

                  return (
                    <th key={comp.id} className="p-3 min-w-[240px] max-w-[280px] align-top">
                      <div className="p-3 rounded-2xl neo-panel border border-white/10 bg-[#151820] space-y-3 relative group">
                        <button
                          onClick={() => onRemoveFromCompare(comp.id)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-gray-400 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                        <div className="w-full h-28 rounded-xl overflow-hidden bg-[#181B20]">
                          <img 
                            src={comp.image} 
                            alt={comp.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-gray-400 block uppercase">
                            {comp.brand} • {comp.subCategory}
                          </span>
                          <h4 className="text-xs font-bold text-white font-sans line-clamp-1">
                            {comp.name}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <button
                            onClick={() => onTogglePreview(comp)}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer ${
                              isPreviewing
                                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/50'
                                : 'neo-button text-gray-300 hover:text-white border border-white/10'
                            }`}
                          >
                            <Eye className="w-3 h-3" />
                            <span>{isPreviewing ? 'Previewing' : '3D Preview'}</span>
                          </button>

                          <button
                            onClick={() => onToggleBuild(comp)}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer ${
                              isInBuild
                                ? 'bg-[#10B981] text-black font-black'
                                : 'bg-[#0070F3] text-white hover:bg-[#0060df]'
                            }`}
                          >
                            {isInBuild ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            <span>{isInBuild ? 'In Build' : 'Add'}</span>
                          </button>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="text-xs divide-y divide-white/5 font-mono">
              {/* Fitment Compatibility Row */}
              <tr>
                <td className="p-3 text-gray-400 font-bold uppercase">Compatibility</td>
                {components.map((comp) => {
                  const compat = evaluateComponentCompatibility(comp, activeVehicle);
                  return (
                    <td key={comp.id} className="p-3">
                      {compat.status === 'compatible' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                          <CheckCircle2 className="w-3 h-3" />
                          VERIFIED
                        </span>
                      )}
                      {compat.status === 'conditionally_compatible' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                          <AlertTriangle className="w-3 h-3" />
                          CONDITIONAL
                        </span>
                      )}
                      {compat.status === 'not_compatible' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                          <XCircle className="w-3 h-3" />
                          INCOMPATIBLE
                        </span>
                      )}
                      {compat.status === 'verification_required' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                          <Info className="w-3 h-3" />
                          VERIFY
                        </span>
                      )}
                      <p className="text-[11px] text-gray-400 font-sans mt-1 line-clamp-2">
                        {compat.explanation}
                      </p>
                    </td>
                  );
                })}
              </tr>

              {/* Hardware Price */}
              <tr>
                <td className="p-3 text-gray-400 font-bold uppercase">Price Estimate</td>
                {components.map((comp) => (
                  <td key={comp.id} className="p-3 font-bold text-white text-sm">
                    {comp.estimatedPrice.displayUSD}
                  </td>
                ))}
              </tr>

              {/* Installation Hours & Labor */}
              <tr>
                <td className="p-3 text-gray-400 font-bold uppercase">Installation</td>
                {components.map((comp) => (
                  <td key={comp.id} className="p-3 text-gray-300">
                    <span className="font-bold text-white block">
                      {comp.installationEstimate.hours} hours (~${comp.installationEstimate.estimatedLaborUSD})
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {comp.installationEstimate.difficultyLabel}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Power Gain */}
              <tr>
                <td className="p-3 text-gray-400 font-bold uppercase">Power Gain</td>
                {components.map((comp) => (
                  <td key={comp.id} className="p-3">
                    {comp.powerGainHp > 0 ? (
                      <span className="text-[#10B981] font-black">+{comp.powerGainHp} HP</span>
                    ) : (
                      <span className="text-gray-500">0 HP (Handling/Aero)</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Weight Delta */}
              <tr>
                <td className="p-3 text-gray-400 font-bold uppercase">Weight Delta</td>
                {components.map((comp) => (
                  <td key={comp.id} className="p-3">
                    {comp.weightDeltaKg < 0 ? (
                      <span className="text-[#38BDF8] font-black">{comp.weightDeltaKg} kg (Lighter)</span>
                    ) : comp.weightDeltaKg > 0 ? (
                      <span className="text-gray-400">+{comp.weightDeltaKg} kg</span>
                    ) : (
                      <span className="text-gray-500">Neutral (0 kg)</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Primary Material */}
              <tr>
                <td className="p-3 text-gray-400 font-bold uppercase">Material</td>
                {components.map((comp) => (
                  <td key={comp.id} className="p-3 text-gray-300">
                    {comp.material || 'OEM Spec Composite'}
                  </td>
                ))}
              </tr>

              {/* Performance Impact */}
              <tr>
                <td className="p-3 text-gray-400 font-bold uppercase">Expected Impact</td>
                {components.map((comp) => (
                  <td key={comp.id} className="p-3 text-gray-300 font-sans leading-relaxed">
                    {comp.performanceImpact || comp.handlingImpact || 'Visual styling upgrade'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
