import React from 'react';
import { AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

// Import Pages
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LocationPage } from '../pages/LocationPage';
import { RegionSelectionPage } from '../pages/RegionSelectionPage';
import { ExperiencePage } from '../pages/ExperiencePage';
import { BrandsPage } from '../pages/BrandsPage';
import { VehicleTypePage } from '../pages/VehicleTypePage';
import { VehiclesPage } from '../pages/VehiclesPage';
import { VehicleDetailPage } from '../pages/VehicleDetailPage';
import { GaragePage } from '../pages/GaragePage';
import { BuildPage } from '../pages/BuildPage';
import { BuildAnalysisPage } from '../pages/BuildAnalysisPage';
import { BuildPerformancePage } from '../pages/BuildPerformancePage';
import { AIEngineerPage } from '../pages/AIEngineerPage';
import { WorkshopsPage } from '../pages/WorkshopsPage';
import { MarketplacePage } from '../pages/MarketplacePage';
import { LearningPage } from '../pages/LearningPage';
import { VaultPage } from '../pages/VaultPage';
import { ReportsPage } from '../pages/ReportsPage';
import { ProjectDashboardPage } from '../pages/ProjectDashboardPage';
import { CompatibilitySimulatorPage } from '../pages/CompatibilitySimulatorPage';
import { AccountPage } from '../pages/AccountPage';
import { NotFound } from '../components/layout/NotFound';

export const AppRouter: React.FC = () => {
  const {
    currentPath,
    currentUser,
    isRouteLoading,
    closeRoutePreloader,
    activeVehicle,
    buildComponents
  } = useApp();
  const path = currentPath || '/';

  // COMPULSORY GATEWAY: Require Login / Signup before entering Homepage or Platform
  if (!currentUser) {
    let unauthPage = <LoginPage />;
    if (path === '/signup') unauthPage = <SignupPage />;
    if (path === '/forgot-password') unauthPage = <ForgotPasswordPage />;

    return (
      <AnimatePresence mode="wait">
        <PageWrapper key={path}>{unauthPage}</PageWrapper>
      </AnimatePresence>
    );
  }

  const renderRoute = () => {
    if (path === '/' || path === '/landing') return <HomePage />;
    if (path === '/login') return <LoginPage />;
    if (path === '/signup') return <SignupPage />;
    if (path === '/forgot-password') return <ForgotPasswordPage />;
    
    // Phase 3 Discovery Flow Routes
    if (path === '/location') return <LocationPage />;
    if (path === '/location/region') return <RegionSelectionPage />;
    if (path === '/experience') return <ExperiencePage />;
    if (path === '/brands') return <BrandsPage />;
    if (path === '/vehicles/type') return <VehicleTypePage />;
    if (path === '/vehicles' || path === '/vehicles/models') return <VehiclesPage />;
    if (path.startsWith('/vehicles/')) return <VehicleDetailPage />;
    
    // Core Platform Routes
    if (path === '/garage') return <GaragePage />;
    if (path === '/build') return <BuildPage />;
    if (path === '/build/analysis') return <BuildAnalysisPage />;
    if (path === '/build/performance') return <BuildPerformancePage />;
    if (path === '/ai-engineer') return <AIEngineerPage />;
    if (path === '/workshops') return <WorkshopsPage />;
    if (path.startsWith('/marketplace')) return <MarketplacePage />;
    if (path.startsWith('/learning')) return <LearningPage />;
    if (path === '/vault') return <VaultPage />;
    if (path === '/reports') return <ReportsPage />;
    if (path === '/account' || path === '/profile') return <AccountPage />;

    // Project Dashboard & Part Compatibility Routes
    if (path === '/projects' || path === '/dashboard') return <ProjectDashboardPage />;
    if (path === '/compatibility' || path === '/simulate-compatibility') return <CompatibilitySimulatorPage />;

    return <NotFound />;
  };

  const vehicleTitle = `${activeVehicle?.year || 2022} ${activeVehicle?.make || 'Honda'} ${activeVehicle?.model || 'Civic'}`;

  return (
    <>
      <LoadingOverlay
        isOpen={isRouteLoading}
        onClose={closeRoutePreloader}
        onComplete={closeRoutePreloader}
        vehicleName={vehicleTitle}
        componentCount={buildComponents.length}
      />
      <AnimatePresence mode="wait">
        <PageWrapper key={currentPath}>{renderRoute()}</PageWrapper>
      </AnimatePresence>
    </>
  );
};
