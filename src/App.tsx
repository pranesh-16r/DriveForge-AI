import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { AppRouter } from './router/AppRouter';
import { AuthGuard } from './components/auth/AuthGuard';
import { Footer } from './components/layout/Footer';
import { TooltipProvider } from '../components/ui/tooltip';
import { Toaster } from '../components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';

// Initialize GSAP and ScrollTrigger globally for cinematic transitions
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({
    autoSleep: 60,
    force3D: true,
  });
}

export default function App() {
  useEffect(() => {
    // Refresh ScrollTrigger instances on app mount
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <TooltipProvider delay={200}>
          <div className="min-h-screen bg-[#F4F1EA] text-[#171717] flex flex-col font-sans selection:bg-[#28483D] selection:text-[#FAFAF7]">
            <Navbar />
            <div className="flex-1">
              <AuthGuard>
                <AppRouter />
              </AuthGuard>
            </div>
            <Footer />
            <Toaster richColors position="bottom-right" />
          </div>
          <Analytics />
        </TooltipProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
