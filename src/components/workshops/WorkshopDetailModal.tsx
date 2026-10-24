import React from 'react';
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

interface WorkshopDetailModalProps {
  workshop: Workshop;
  matchResult: WorkshopMatchResult | undefined;
  buildComponents: BuildComponent[];
  vehicle: Vehicle;
  userCoords: Coordinates | null;
  onClose: () => void;
  onAskEngineer: (workshop: Workshop) => void;
}

export const WorkshopDetailModal: React.FC<WorkshopDetailModalProps> = ({
  workshop,
  matchResult,
  buildComponents,
  vehicle,
  userCoords,
  onClose,
  onAskEngineer
}) => {
  const directionsUrl = WorkshopService.getDirectionsUrl(workshop, userCoords);
  const matchLevel = matchResult?.matchLevel || 'UNKNOWN';

  // Match Level Badge styling
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

  const workshopServiceLower = new Set(workshop.services.map(s => s.toLowerCase()));

  buildComponents.forEach(bc => {
    const raw = bc.rawComponent;
    const cat = (raw?.category || bc.category || '').toLowerCase();
    const name = raw?.name || bc.name;

    let isSupported = false;
    if (cat === 'suspension' && (workshopServiceLower.has('suspension installation') || workshopServiceLower.has('coilover installation'))) {
      isSupported = true;
    } else if (cat === 'brakes' && workshopServiceLower.has('brake installation')) {
      isSupported = true;
    } else if (cat === 'wheels_tires' && workshopServiceLower.has('wheel & tyre installation')) {
      isSupported = true;
    } else if (cat === 'exhaust' && workshopServiceLower.has('exhaust installation')) {
      isSupported = true;
    } else if (cat === 'powertrain' && (workshopServiceLower.has('performance tuning') || workshopServiceLower.has('intake installation') || workshopServiceLower.has('intercooler installation'))) {
      isSupported = true;
    } else if (cat === 'electronics' && (workshopServiceLower.has('ecu tuning') || workshopServiceLower.has('performance tuning'))) {
      isSupported = true;
    } else if ((cat === 'aerodynamics' || cat === 'exterior') && (workshopServiceLower.has('body kit installation') || workshopServiceLower.has('spoiler installation'))) {
      isSupported = true;
    }

    if (isSupported) {
      supportedComponentNames.push(name);
    } else {
      unsupportedComponentNames.push(name);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] neo-panel border border-white/15 bg-[#14171E] text-white shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 p-5 border-b border-white/10 bg-[#14171E]/95 backdrop-blur-md flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border flex items-center gap-1.5 ${matchBadgeColor}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${matchDotColor}`}></span>
                <span>{matchLevel}</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono text-[#38BDF8] border border-[#38BDF8]/30 bg-[#38BDF8]/10">
                {workshop.source.toUpperCase()}
              </span>

              {workshop.distance != null && (
                <span className="text-xs font-mono text-gray-300">
                  • {workshop.distance} km away
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight">
              {workshop.name}
            </h2>

            <p className="text-xs text-gray-400 font-sans flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0070F3] shrink-0" />
              <span>{workshop.address}, {workshop.city}, {workshop.region}, {workshop.country}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl neo-button text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
            title="Close Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick Contact & Navigation Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {workshop.phone ? (
              <a
                href={`tel:${workshop.phone}`}
                className="p-3 rounded-xl neo-button text-xs font-mono text-gray-200 hover:text-white border border-white/10 flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#0070F3] shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-gray-400 block">CALL WORKSHOP</span>
                  <span className="font-bold">{workshop.phone}</span>
                </div>
              </a>
            ) : (
              <div className="p-3 rounded-xl neo-inset text-xs font-mono text-gray-400 border border-white/5 flex items-center gap-2">
                <Phone className="w-4 h-4 opacity-40 shrink-0" />
                <div>
                  <span className="text-[10px] block">PHONE</span>
                  <span>Unavailable</span>
                </div>
              </div>
            )}

            {workshop.website ? (
              <a
                href={workshop.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl neo-button text-xs font-mono text-gray-200 hover:text-white border border-white/10 flex items-center gap-2 transition-colors"
              >
                <Globe className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-gray-400 block">OFFICIAL SITE</span>
                  <span className="font-bold flex items-center gap-1">
                    Visit Website <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ) : (
              <div className="p-3 rounded-xl neo-inset text-xs font-mono text-gray-400 border border-white/5 flex items-center gap-2">
                <Globe className="w-4 h-4 opacity-40 shrink-0" />
                <div>
                  <span className="text-[10px] block">WEBSITE</span>
                  <span>None listed</span>
                </div>
              </div>
            )}

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl neo-button text-xs font-mono text-gray-200 hover:text-white border border-[#10B981]/30 bg-[#10B981]/10 hover:bg-[#10B981]/20 flex items-center gap-2 transition-colors"
            >
              <Navigation className="w-4 h-4 text-[#10B981] shrink-0" />
              <div>
                <span className="text-[10px] text-[#10B981] block font-bold">ROUTE GUIDANCE</span>
                <span className="font-bold">Open Directions</span>
              </div>
            </a>
          </div>

          {/* Section: Your Build Installation Request */}
          <div className="p-4 sm:p-5 rounded-2xl neo-panel border border-white/10 space-y-4 bg-[#181C24]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#0070F3]" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  INSTALLATION REQUEST FOR {vehicle.year} {vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 text-gray-300">
                {buildComponents.length} Planned {buildComponents.length === 1 ? 'Part' : 'Parts'}
              </span>
            </div>

            {buildComponents.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-mono text-gray-300">
                  {matchResult?.matchReason || 'Evaluating capability alignment with your build blueprint.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Supported parts */}
                  <div className="p-3 rounded-xl neo-inset bg-[#0E1015] border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      SUPPORTED BY WORKSHOP ({supportedComponentNames.length})
                    </span>
                    {supportedComponentNames.length > 0 ? (
                      <ul className="space-y-1 text-xs font-mono text-gray-300">
                        {supportedComponentNames.map((name, i) => (
                          <li key={i} className="flex items-center gap-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-[#10B981]"></span>
                            <span className="truncate">{name}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] font-mono text-gray-400">
                        No components match listed capabilities directly.
                      </p>
                    )}
                  </div>

                  {/* Components requiring separate specialist */}
                  <div className="p-3 rounded-xl neo-inset bg-[#0E1015] border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-500/80" />
                      MAY REQUIRE SPECIALIST ({unsupportedComponentNames.length})
                    </span>
                    {unsupportedComponentNames.length > 0 ? (
                      <ul className="space-y-1 text-xs font-mono text-gray-400">
                        {unsupportedComponentNames.map((name, i) => (
                          <li key={i} className="flex items-center gap-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-yellow-500/70"></span>
                            <span className="truncate">{name}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] font-mono text-[#10B981]">
                        All build components covered by listed services!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs font-mono text-gray-400">
                Your Physical Build is currently empty. Add components in the Build Plan to see precise workshop matching.
              </p>
            )}
          </div>

          {/* Section: Facility Equipment & Installation Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#38BDF8]" />
              FACILITY EQUIPMENT & CAPABILITIES
            </h4>
            <div className="flex flex-wrap gap-2">
              {workshop.installationCapabilities.map((cap, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl neo-inset bg-[#111317] border border-white/5 text-xs font-mono text-gray-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                  <span>{cap}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Section: All Listed Workshop Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#0070F3]" />
              LISTED WORKSHOP SERVICES
            </h4>
            <div className="flex flex-wrap gap-2">
              {workshop.services.map((service, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg neo-button text-xs font-mono text-gray-300 border border-white/5"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Section: Operating Hours & Ratings Transparency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl neo-inset bg-[#111317] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#38BDF8]" /> OPERATING SCHEDULE
              </span>
              <p className="text-xs font-mono font-bold text-white">
                {workshop.openingHours?.display || 'Hours unavailable from directory data'}
              </p>
              {workshop.openingHours?.statusText && (
                <span className="text-[10px] font-mono text-[#10B981]">
                  Status: {workshop.openingHours.statusText}
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-xl neo-inset bg-[#111317] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#10B981]" /> VERIFICATION & RATINGS
              </span>
              <p className="text-xs font-mono text-gray-300">
                {workshop.rating != null ? `${workshop.rating} / 5` : 'Rating unavailable'}
              </p>
              <p className="text-[10px] font-mono text-gray-400">
                Data source: {workshop.source} (Unbiased directory)
              </p>
            </div>
          </div>

          {/* Safety Notice & Disclaimer */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-gray-400 space-y-1">
            <p className="font-bold text-gray-300">IMPORTANT INSTALLATION NOTICE:</p>
            <p className="leading-relaxed">
              DriveForge is an automotive planning and engineering analysis platform, not an installation provider. Service information is based on available directory listings. For safety-critical modifications (brakes, suspension, fuel systems), always verify mechanical credentials and inspect installation contracts prior to work.
            </p>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 z-10 p-5 border-t border-white/10 bg-[#14171E] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onAskEngineer(workshop)}
            className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(0,112,243,0.3)] cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>ASK CHIEF ENGINEER ABOUT THIS WORKSHOP</span>
          </button>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3 px-5 rounded-xl neo-button text-xs font-mono text-gray-200 hover:text-white border border-white/10 flex items-center justify-center gap-2 transition-colors"
          >
            <Navigation className="w-4 h-4 text-[#10B981]" />
            <span>Get Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
