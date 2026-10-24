import React from 'react';
import { FeatureSection } from './FeatureSection';
import { NeoCard } from '../ui/NeoCard';
import { NeoButton } from '../ui/NeoButton';
import { WORKSHOPS } from '../../data/workshops';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Star,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Phone,
  ArrowRight
} from 'lucide-react';

export const WorkshopStory: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <FeatureSection
      id="workshops"
      stepNumber="08"
      category="VERIFIED INSTALLATION NETWORK"
      title="FIND A WORKSHOP"
      subtitle="Find modification workshops that can help execute the physical build."
      description="Connect your digital blueprint with certified automotive master technicians who understand high-performance vehicle modifications and honor DriveForge installation plans."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {WORKSHOPS.slice(0, 3).map((shop) => (
          <NeoCard
            key={shop.id}
            variant="raised"
            radius="24"
            className="p-6 flex flex-col justify-between space-y-5 bg-[#FAFAF7] border border-[#292927]/15 hover:border-[#171717]/30 transition-all shadow-sm"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-[#28483D] font-extrabold uppercase tracking-wider block">
                    {shop.city} • {shop.region}
                  </span>
                  <h3 className="text-base font-black text-[#171717] font-sans mt-0.5">
                    {shop.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1 bg-[#E8E2D8] px-2 py-1 rounded-xl text-xs font-mono font-bold text-[#171717] border border-[#292927]/15 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[#B47A52] text-[#B47A52]" />
                  <span>{shop.rating}</span>
                </div>
              </div>

              {/* Address */}
              <p className="text-xs text-[#4A4843] font-medium font-sans flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#28483D] shrink-0" />
                {shop.address}
              </p>

              {/* Certifications */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono font-bold text-[#4A4843] uppercase block">Certifications</span>
                <div className="flex flex-wrap gap-1.5">
                  {shop.masterCertifications.map((cert) => (
                    <span
                      key={cert}
                      className="px-2 py-0.5 rounded bg-[#E8E2D8] text-[10px] font-mono text-[#171717] font-semibold border border-[#292927]/12 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#28483D]" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono font-bold text-[#4A4843] uppercase block">Specialties</span>
                <p className="text-xs text-[#171717] font-medium font-sans">
                  {shop.specialties.join(', ')}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#292927]/12 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono font-bold text-[#4A4843] uppercase block">Bench Labor</span>
                <span className="text-sm font-mono font-black text-[#171717]">${shop.hourlyLaborRateUSD}/hr</span>
              </div>

              <span className="text-xs font-mono font-bold text-[#28483D] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Partner
              </span>
            </div>

          </NeoCard>
        ))}
      </div>

      <div className="mt-8 text-center">
        <NeoButton
          variant="outline"
          size="md"
          onClick={() => navigateTo('/workshops')}
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
        >
          Explore All Certified Workshops
        </NeoButton>
      </div>
    </FeatureSection>
  );
};
