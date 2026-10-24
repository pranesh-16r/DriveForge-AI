import React, { useState } from 'react';
import { Coordinates } from '../../lib/maps/mapService';
import { Country, Region } from '../../types';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  Globe,
  Check,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

interface UserLocationPromptProps {
  userCoords: Coordinates | null;
  onLocationAcquired: (coords: Coordinates) => void;
  selectedCountry: Country | null;
  selectedRegion: Region | null;
  onChangeRegionClick: () => void;
}

export const UserLocationPrompt: React.FC<UserLocationPromptProps> = ({
  userCoords,
  onLocationAcquired,
  selectedCountry,
  selectedRegion,
  onChangeRegionClick
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [deniedNotice, setDeniedNotice] = useState(false);

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setDeniedNotice(true);
      return;
    }

    setIsRequesting(true);
    setDeniedNotice(false);

    navigator.geolocation.getCurrentPosition(
      position => {
        setIsRequesting(false);
        onLocationAcquired({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => {
        setIsRequesting(false);
        // Do not show a red catastrophic error, gracefully inform user that region fallback is active
        setDeniedNotice(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  };

  const regionDisplayName = selectedRegion
    ? `${selectedRegion.name}, ${selectedCountry?.name || ''}`
    : selectedCountry?.name || 'Selected Region';

  return (
    <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#292927]/15 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Current Regional Scope and Geolocation status */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#E8E2D8] border border-[#292927]/10 text-[#28483D] shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-black text-[#171717]">
              CURRENT DIRECTORY: {regionDisplayName.toUpperCase()}
            </span>
            {userCoords ? (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold text-[#10B981] border border-[#10B981]/30 bg-[#10B981]/10 flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> GPS ACTIVE
              </span>
            ) : deniedNotice ? (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold text-[#4A4843] border border-[#292927]/15 bg-[#E8E2D8]">
                SHOWING REGIONAL DIRECTORY
              </span>
            ) : null}
          </div>

          <p className="text-[11px] font-mono text-[#4A4843] font-medium mt-0.5">
            {userCoords
              ? 'Distances calculated using browser location coordinates.'
              : deniedNotice
              ? 'GPS permission not granted — showing workshops in selected regional directory.'
              : 'Workshops filtered by your active automotive region.'}
          </p>
        </div>
      </div>

      {/* Buttons: Use Location & Change Region */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {!userCoords && (
          <button
            onClick={handleRequestLocation}
            disabled={isRequesting}
            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-[#28483D] hover:bg-[#1E362E] text-xs font-mono font-bold text-[#FAFAF7] border border-[#28483D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            title="Use precise GPS coordinates for distance calculations"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{isRequesting ? 'Locating...' : 'USE MY LOCATION'}</span>
          </button>
        )}

        <button
          onClick={onChangeRegionClick}
          className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-[#E8E2D8] hover:bg-[#171717] hover:text-[#FAFAF7] text-xs font-mono font-bold text-[#171717] border border-[#292927]/15 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-[#28483D]" />
          <span>CHANGE REGION</span>
          <ChevronDown className="w-3 h-3 text-[#4A4843]" />
        </button>
      </div>
    </div>
  );
};
