import React from 'react';
import { WorkshopMatchResult, Workshop } from '../../lib/workshops/workshopTypes';
import { Coordinates } from '../../lib/maps/mapService';
import { WorkshopService } from '../../lib/workshops/workshopService';
import {
  MapPin,
  Phone,
  Globe,
  Navigation,
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  ExternalLink,
  Wrench,
  AlertCircle,
  Bot
} from 'lucide-react';

interface WorkshopCardProps {
  matchResult: WorkshopMatchResult;
  isSelected: boolean;
  onSelect: (workshop: Workshop) => void;
  userCoords: Coordinates | null;
  onAskEngineer?: (workshop: Workshop) => void;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({
  matchResult,
  isSelected,
  onSelect,
  userCoords,
  onAskEngineer
}) => {
  const { workshop, matchLevel, matchReason, matchedServices } = matchResult;

  const directionsUrl = WorkshopService.getDirectionsUrl(workshop, userCoords);

  // Match Level Badge styling
  let matchBadgeColor = 'text-[#4A4843] border-[#292927]/20 bg-[#E8E2D8]';
  let matchDotColor = 'bg-[#4A4843]';
  if (matchLevel === 'GOOD MATCH') {
    matchBadgeColor = 'text-[#1B5E20] border-[#1B5E20]/40 bg-[#1B5E20]/10 font-bold';
    matchDotColor = 'bg-[#10B981]';
  } else if (matchLevel === 'PARTIAL MATCH') {
    matchBadgeColor = 'text-[#28483D] border-[#28483D]/40 bg-[#28483D]/10 font-bold';
    matchDotColor = 'bg-[#28483D]';
  }

  // Verification status styling
  const isVerified = workshop.verificationStatus === 'VERIFIED';

  return (
    <div
      onClick={() => onSelect(workshop)}
      className={`p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between gap-4 border ${
        isSelected
          ? 'bg-[#FAFAF7] border-2 border-[#171717] shadow-md ring-1 ring-[#171717]/10'
          : 'bg-[#FAFAF7] border-[#292927]/15 hover:border-[#171717]/40 shadow-sm'
      }`}
    >
      {/* Card Header: Title, Distance, Match Level */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border flex items-center gap-1.5 ${matchBadgeColor}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${matchDotColor}`}></span>
                <span>{matchLevel}</span>
              </span>

              {/* Verified or Demo Label */}
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono text-[#4A4843] border border-[#292927]/15 bg-[#E8E2D8] font-bold">
                {workshop.source.toUpperCase()}
              </span>
            </div>

            <h3 className="text-base font-black text-[#171717] font-sans tracking-tight group-hover:text-[#28483D] transition-colors">
              {workshop.name}
            </h3>

            <p className="text-xs text-[#4A4843] font-sans font-medium flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#28483D] shrink-0" />
              <span className="truncate">{workshop.address}, {workshop.city}</span>
            </p>
          </div>

          {/* Distance Indicator */}
          <div className="text-right shrink-0">
            {workshop.distance != null ? (
              <div className="bg-[#E8E2D8] px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-[#171717] border border-[#292927]/12">
                {workshop.distance} km
              </div>
            ) : (
              <div className="text-[10px] font-mono text-[#4A4843] font-bold">
                {workshop.city}
              </div>
            )}
            
            {/* Opening status */}
            {workshop.openingHours && (
              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-mono">
                {workshop.openingHours.statusText === 'OPEN NOW' ? (
                  <span className="text-[#10B981] flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                    OPEN
                  </span>
                ) : workshop.openingHours.statusText === 'CLOSED' ? (
                  <span className="text-[#4A4843] font-medium">CLOSED</span>
                ) : (
                  <span className="text-[#4A4843] font-medium">HOURS N/A</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Why it matches */}
        {matchReason && (
          <div className="p-2.5 rounded-xl bg-[#E8E2D8]/70 border border-[#292927]/12 text-[11px] font-mono text-[#171717] flex items-start gap-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#28483D] shrink-0 mt-0.5" />
            <span className="leading-snug">{matchReason}</span>
          </div>
        )}

        {/* Services Badges */}
        <div className="space-y-1">
          <p className="text-[9px] font-mono uppercase tracking-wider text-[#4A4843] font-bold">
            AVAILABLE SERVICES:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {workshop.services.slice(0, 5).map(service => {
              const isMatchedToBuild = matchedServices.some(
                ms => ms.toLowerCase() === service.toLowerCase()
              );
              return (
                <span
                  key={service}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                    isMatchedToBuild
                      ? 'bg-[#28483D]/12 text-[#28483D] border border-[#28483D]/30 font-bold'
                      : 'bg-[#E8E2D8] text-[#171717] border border-[#292927]/12 font-medium'
                  }`}
                >
                  {service}
                </span>
              );
            })}
            {workshop.services.length > 5 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-[#4A4843] bg-[#E8E2D8] border border-[#292927]/10 font-bold">
                +{workshop.services.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-[#292927]/12 flex flex-wrap items-center justify-between gap-2" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          {workshop.phone && (
            <a
              href={`tel:${workshop.phone}`}
              className="p-2 rounded-xl bg-[#E8E2D8] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/12 transition-colors flex items-center justify-center cursor-pointer"
              title={`Call ${workshop.phone}`}
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}

          {workshop.website && (
            <a
              href={workshop.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#E8E2D8] text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/12 transition-colors flex items-center justify-center cursor-pointer"
              title="Visit Website"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#E8E2D8] text-xs font-mono font-bold text-[#171717] hover:bg-[#171717] hover:text-[#FAFAF7] border border-[#292927]/12 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-[#28483D]" />
            <span>Directions</span>
          </a>

          {onAskEngineer && (
            <button
              onClick={() => onAskEngineer(workshop)}
              className="px-3 py-1.5 rounded-xl bg-[#E8E2D8] text-xs font-mono font-bold text-[#28483D] hover:bg-[#28483D] hover:text-[#FAFAF7] border border-[#28483D]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Consult AI Chief Engineer about this workshop"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          )}
        </div>

        <button
          onClick={() => onSelect(workshop)}
          className="px-3 py-1.5 rounded-xl bg-[#28483D] hover:bg-[#1E362E] text-[#FAFAF7] border border-[#28483D] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
