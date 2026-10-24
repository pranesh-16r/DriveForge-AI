import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WorkshopMatchResult, Workshop } from '../../lib/workshops/workshopTypes';
import { Coordinates } from '../../lib/maps/mapService';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';

interface WorkshopMapProps {
  results: WorkshopMatchResult[];
  selectedWorkshopId: string | null;
  onSelectWorkshop: (workshop: Workshop) => void;
  userCoords: Coordinates | null;
  className?: string;
}

export const WorkshopMap: React.FC<WorkshopMapProps> = ({
  results,
  selectedWorkshopId,
  onSelectWorkshop,
  userCoords,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center (Irvine, CA or center of first result)
    const initialLat = results[0]?.workshop.latitude || 33.6846;
    const initialLng = results[0]?.workshop.longitude || -117.8265;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 11,
      zoomControl: false,
      attributionControl: false
    });

    // Dark-themed tiles from CartoDB Dark Matter (clean tactical automotive aesthetic)
    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }
    );

    tileLayer.addTo(map);

    // Custom tactical zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Resize observer to ensure tiles render when container layout shifts
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userCoords) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userCoords.latitude, userCoords.longitude]);
      } else {
        const userIcon = L.divIcon({
          className: 'user-location-marker-icon',
          html: `
            <div class="relative flex items-center justify-center w-8 h-8">
              <span class="absolute w-8 h-8 rounded-full bg-[#0070F3]/30 animate-ping"></span>
              <span class="relative w-4 h-4 rounded-full bg-[#0070F3] border-2 border-white shadow-[0_0_12px_#0070F3]"></span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([userCoords.latitude, userCoords.longitude], {
          icon: userIcon,
          zIndexOffset: 1000
        }).addTo(map);

        marker.bindTooltip(
          `<div class="text-[11px] font-mono font-bold text-white bg-[#14171E] border border-[#0070F3] px-2 py-1 rounded-md shadow-lg">YOUR LOCATION</div>`,
          { direction: 'top', offset: [0, -12], opacity: 1 }
        );

        userMarkerRef.current = marker;
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userCoords]);

  // 3. Render Workshop Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (results.length === 0) return;

    const bounds: [number, number][] = [];

    if (userCoords) {
      bounds.push([userCoords.latitude, userCoords.longitude]);
    }

    results.forEach(({ workshop, matchLevel }) => {
      const isSelected = workshop.id === selectedWorkshopId;
      bounds.push([workshop.latitude, workshop.longitude]);

      // Color coding: Good Match = Emerald (#10B981), Partial = Blue (#0070F3), Unknown = Slate (#94A3B8)
      let markerColor = '#94A3B8';
      let badgeLabel = 'SERVICE';
      if (matchLevel === 'GOOD MATCH') {
        markerColor = '#10B981';
        badgeLabel = 'MATCH';
      } else if (matchLevel === 'PARTIAL MATCH') {
        markerColor = '#0070F3';
        badgeLabel = 'PARTIAL';
      }

      const activeBorder = isSelected
        ? 'ring-4 ring-[#38BDF8] ring-offset-2 ring-offset-[#121417] scale-110 shadow-[0_0_20px_rgba(56,189,248,0.7)]'
        : 'hover:scale-105 shadow-lg border border-white/20';

      const customIcon = L.divIcon({
        className: 'custom-workshop-marker',
        html: `
          <div style="cursor: pointer;" class="transition-transform duration-200 flex flex-col items-center">
            <div class="px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-white flex items-center gap-1 ${activeBorder}" style="background-color: ${isSelected ? '#38BDF8' : '#181B22'}; border-color: ${markerColor};">
              <span class="w-2 h-2 rounded-full" style="background-color: ${markerColor};"></span>
              <span class="truncate max-w-[120px]">${workshop.name}</span>
            </div>
            <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px]" style="border-t-color: ${isSelected ? '#38BDF8' : '#181B22'};"></div>
          </div>
        `,
        iconSize: [140, 40],
        iconAnchor: [70, 36]
      });

      const marker = L.marker([workshop.latitude, workshop.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 800 : 100
      });

      marker.on('click', () => {
        onSelectWorkshop(workshop);
      });

      // Bind popup with quick details
      const distanceText = workshop.distance != null ? `${workshop.distance} km away` : 'Distance unavailable';
      const popupContent = `
        <div style="font-family: inherit; min-width: 200px; color: #fff; background: #14171E; padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 9px; font-family: monospace; font-weight: bold; color: ${markerColor}; text-transform: uppercase;">
              ${matchLevel}
            </span>
            <span style="font-size: 10px; color: #94A3B8; font-family: monospace;">${distanceText}</span>
          </div>
          <h4 style="font-size: 13px; font-weight: bold; margin: 0 0 4px 0; color: #FFFFFF;">${workshop.name}</h4>
          <p style="font-size: 11px; color: #94A3B8; margin: 0 0 8px 0;">${workshop.address}, ${workshop.city}</p>
          <div style="font-size: 10px; color: #CBD5E1; background: #0E1015; padding: 6px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 8px;">
            <strong>Services:</strong> ${workshop.services.slice(0, 3).join(', ')}
          </div>
          <button id="view-ws-${workshop.id}" style="width: 100%; background: #0070F3; color: white; border: none; padding: 6px; border-radius: 6px; font-size: 11px; font-family: monospace; font-weight: bold; cursor: pointer;">
            VIEW WORKSHOP DETAILS
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-leaflet-popup',
        offset: [0, -32]
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-ws-${workshop.id}`);
        if (btn) {
          btn.onclick = () => onSelectWorkshop(workshop);
        }
      });

      markersGroup.addLayer(marker);
    });

    // Auto-fit bounds if we have points and not specifically focused
    if (bounds.length > 0 && !selectedWorkshopId) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 13,
        animate: true
      });
    }
  }, [results, selectedWorkshopId, userCoords, onSelectWorkshop]);

  // 4. Center map smoothly on selected workshop
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedWorkshopId) return;

    const matched = results.find(r => r.workshop.id === selectedWorkshopId);
    if (matched) {
      map.flyTo([matched.workshop.latitude, matched.workshop.longitude], 14, {
        duration: 0.8
      });
    }
  }, [selectedWorkshopId, results]);

  return (
    <div className={`relative w-full h-full min-h-[360px] rounded-2xl overflow-hidden border border-white/10 bg-[#0E1015] shadow-inner ${className}`}>
      {/* Real Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Tactical Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 pointer-events-none">
        <div className="neo-panel px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 text-[11px] font-mono text-gray-200 pointer-events-auto backdrop-blur-md bg-[#14171E]/90 shadow-md">
          <Layers className="w-3.5 h-3.5 text-[#0070F3]" />
          <span>Interactive Installation Network</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
        </div>
      </div>

      {/* Tactical Map Footer / Attribution & Demo Mode Notice */}
      <div className="absolute bottom-2 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none text-[10px] font-mono text-gray-400">
        <div className="px-2 py-1 rounded-lg bg-[#0E1015]/90 border border-white/10 backdrop-blur-sm pointer-events-auto flex items-center gap-2">
          <span className="text-[#38BDF8]">DEMO WORKSHOP DIRECTORY</span>
          <span>•</span>
          <span>OpenStreetMap &copy; CARTO</span>
        </div>

        <div className="flex items-center gap-3 px-2 py-1 rounded-lg bg-[#0E1015]/90 border border-white/10 backdrop-blur-sm pointer-events-auto">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span>Good Match</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#0070F3]"></span>
            <span>Partial Match</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#94A3B8]"></span>
            <span>Other Specialist</span>
          </span>
        </div>
      </div>
    </div>
  );
};
