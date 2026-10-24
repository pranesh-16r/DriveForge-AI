import React from 'react';
import { useApp } from '../../context/AppContext';
import { NeoCard } from '../ui/NeoCard';
import { NeoButton } from '../ui/NeoButton';
import { PageContainer } from '../ui/PageContainer';
import { AlertCircle, Home, Car } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <PageContainer maxWidth="5xl" className="py-20">
      <NeoCard variant="panel" radius="28" className="p-12 text-center max-w-xl mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl neo-inset flex items-center justify-center text-[#0070F3] mx-auto border border-white/5 shadow-inner">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-[#0070F3] uppercase tracking-widest">
            ERROR 404 — ROUTE NOT FOUND
          </span>
          <h1 className="text-3xl font-black text-white font-sans tracking-tight">
            Off-Track Trajectory
          </h1>
          <p className="text-sm text-gray-400 font-sans leading-relaxed max-w-md mx-auto">
            The requested route or engineering asset does not exist in the current DriveForge AI telemetry map.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <NeoButton
            variant="outline"
            onClick={() => navigateTo('/')}
            icon={<Home className="w-4 h-4" />}
          >
            Return to Overview
          </NeoButton>

          <NeoButton
            variant="primary"
            onClick={() => navigateTo('/vehicles')}
            icon={<Car className="w-4 h-4" />}
          >
            Explore Vehicles
          </NeoButton>
        </div>
      </NeoCard>
    </PageContainer>
  );
};
