import React, { useEffect } from 'react';
import { Workshop, WorkshopMatchResult } from '../../lib/workshops/workshopTypes';
import { Coordinates } from '../../lib/maps/mapService';
import { WorkshopService } from '../../lib/workshops/workshopService';
import { BuildComponent } from '../../types/build';
import { Vehicle } from '../../types';
import {
  X,
  MapPin,
  Phone,
  Globe,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Wrench,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export interface WorkshopDetailDrawerProps {
  workshop: Workshop;
  matchResult?: WorkshopMatchResult;
  buildComponents?: BuildComponent[];
  vehicle?: Vehicle;
  userCoords?: Coordinates | null;
  isOpen: boolean;
  onClose: () => void;
  onAskEngineer?: (workshop: Workshop) => void;
}

export const WorkshopDetailDrawer: React.FC<WorkshopDetailDrawerProps> = ({
  workshop,
  matchResult,
  buildComponents = [],
  vehicle,
  userCoords = null,
  isOpen,
  onClose,
  onAskEngineer
}) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !workshop) return null;

  const directionsUrl = WorkshopService.getDirectionsUrl(workshop, userCoords);
  const matchLevel = matchResult?.matchLevel || 'GOOD MATCH';

  let matchBadgeColor = 'text-gray-400 border-gray-700 bg-gray-900/60';
  let matchDotColor = 'bg-gray-400';
  if (matchLevel === 'GOOD MATCH') {
    matchBadgeColor = 'text-[#10B981] border-[#10B981]/40 bg-[#10B981]/15';
    matchDotColor = 'bg-[#10B981]';
  } else if (matchLevel === 'PARTIAL MATCH') {
    matchBadgeColor = 'text-[#0070F3] border-[#0070F3]/40 bg-[#0070F3]/15';
    matchDotColor = 'bg-[#0070F3]';
  }

  // Determine which components this workshop can install
  const supportedComponentNames: string[] = [];
  const unsupportedComponentNames: string[] = [];

  buildComponents.forEach(comp => {
    const compName = comp.name;
    const isSupported = (workshop.installationCapabilities || workshop.services || []).some(
      cap => cap.toLowerCase().includes(comp.category.toLowerCase()) || comp.category.toLowerCase().includes(cap.toLowerCase())
    );
    if (isSupported) {
      supportedComponentNames.push(compName);
    } else {
      unsupportedComponentNames.push(compName);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl h-full bg-[#181B20] border-l border-[#2A2F38] shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header Banner */}
        <div className="relative p-6 border-b border-[#2A2F38] bg-[#141619] flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wide uppercase border ${matchBadgeColor}`}>
                  <span className={`w-2 h-2 rounded-full ${matchDotColor} animate-pulse`} />
                  {matchLevel}
                </span>
                {workshop.verificationStatus && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#0070F3]/20 text-[#0070F3] border border-[#0070F3]/40">
                    <ShieldCheck className="w-3 h-3" />
                    {workshop.verificationStatus}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-white font-sans tracking-tight mt-1">
                {workshop.name}
              </h2>
              <p className="text-xs text-gray-400 font-mono flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                {workshop.address}, {workshop.city}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl neo-button text-gray-400 hover:text-white transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-xl neo-button text-xs font-mono font-bold text-white hover:text-[#0070F3] transition-colors"
            >
              <Navigation className="w-4 h-4 text-[#0070F3]" />
              GET DIRECTIONS
            </a>

            {workshop.website ? (
              <a
                href={workshop.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-xl neo-button text-xs font-mono font-bold text-white hover:text-[#10B981] transition-colors"
              >
                <Globe className="w-4 h-4 text-[#10B981]" />
                VISIT WEBSITE
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-2 p-3 rounded-xl neo-inset opacity-50 text-xs font-mono text-gray-500 cursor-not-allowed"
              >
                <Globe className="w-4 h-4" />
                NO WEBSITE
              </button>
            )}
          </div>

          {/* Contact & Hours Section */}
          <div className="p-4 rounded-2xl neo-panel border border-[#2A2F38] space-y-3">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
              OPERATIONAL DETAILS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                <a href={`tel:${workshop.phone}`} className="hover:text-[#0070F3] underline">
                  {workshop.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span>Mon-Sat: 09:00 - 19:00</span>
              </div>
            </div>
          </div>

          {/* Build Match Analysis */}
          {buildComponents.length > 0 && (
            <div className="p-5 rounded-2xl neo-inset border border-[#2A2F38] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0070F3]" />
                  ACTIVE BUILD FITMENT ({buildComponents.length} COMPONENTS)
                </h3>
              </div>

              {/* Supported Components */}
              {supportedComponentNames.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-mono text-[#10B981] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SUPPORTED FOR IN-HOUSE INSTALLATION ({supportedComponentNames.length})
                  </p>
                  <ul className="space-y-1.5 pl-5">
                    {supportedComponentNames.map((name, i) => (
                      <li key={i} className="text-xs font-mono text-gray-300 list-disc">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Unsupported Components Notice */}
              {unsupportedComponentNames.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#2A2F38]">
                  <p className="text-[11px] font-mono text-[#F5A623] font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    REQUIRES EXTERNAL SPECIALIST ({unsupportedComponentNames.length})
                  </p>
                  <ul className="space-y-1.5 pl-5">
                    {unsupportedComponentNames.map((name, i) => (
                      <li key={i} className="text-xs font-mono text-gray-400 list-disc">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Core Services */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
              INSTALLATION CAPABILITIES & SERVICES
            </h3>
            <div className="flex flex-wrap gap-2">
              {workshop.services.map((service, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl neo-inset text-xs font-mono text-gray-300 border border-[#2A2F38]"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Facility Hardware & Tooling */}
          {workshop.specialties && workshop.specialties.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                SPECIALTIES & RIG CAPABILITIES
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-300">
                {workshop.specialties.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#141619] border border-[#2A2F38]">
                    <Wrench className="w-3.5 h-3.5 text-[#0070F3]" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Consultation Card */}
          {onAskEngineer && (
            <div className="p-4 rounded-2xl neo-panel border border-[#0070F3]/30 bg-[#0070F3]/5 space-y-3">
              <div className="flex items-center gap-2 text-[#0070F3]">
                <Bot className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  AI CHIEF ENGINEER OPINION
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Have DriveForge Chief Engineer evaluate {workshop.name}&apos;s equipment against your specific build requirements.
              </p>
              <button
                onClick={() => onAskEngineer(workshop)}
                className="w-full py-2.5 rounded-xl neo-button text-xs font-mono font-bold text-[#0070F3] hover:text-white flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                ASK ENGINEER ABOUT THIS WORKSHOP
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2A2F38] bg-[#141619] flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-500">
            DRIVEFORGE CERTIFIED DIRECTORY
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl neo-button text-xs font-mono font-bold text-gray-300 hover:text-white"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
