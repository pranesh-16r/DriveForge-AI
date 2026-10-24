import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MobileNav } from './MobileNav';
import { FirebaseAuthModal } from '../auth/FirebaseAuthModal';
import {
  Menu,
  User,
  LogOut,
  ChevronDown,
  MapPin,
  Sparkles,
  Layers,
  Wrench,
  BookOpen,
  LogIn
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, navigateTo, selectedComponents, currentUser, isAuthenticated, logoutUser, currentRegion } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for visibility effect on homepage
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 02 — NAVIGATION SPECIFICATION:
  // Center: BUILD | GARAGE | MARKETPLACE | LEARNING | WORKSHOPS
  const centerNavItems = [
    { label: 'BUILD', path: '/build', badge: selectedComponents.length ? `${selectedComponents.length}` : undefined },
    { label: 'GARAGE', path: '/garage' },
    { label: 'MARKETPLACE', path: '/marketplace' },
    { label: 'LEARNING', path: '/learning' },
    { label: 'WORKSHOPS', path: '/workshops' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  // If on homepage and not scrolled, keep header subtly integrated
  const isHome = currentPath === '/' || currentPath === '/landing';

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isHome && !scrolled
            ? 'bg-transparent border-b border-transparent py-3'
            : 'bg-[#F4F1EA]/90 backdrop-blur-xl border-b border-[#292927]/8 py-2.5 shadow-[0_2px_12px_rgba(23,23,23,0.03)]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Left: DRIVEFORGE Wordmark */}
          <div
            onClick={() => navigateTo('/')}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
          >
            <div className="w-7 h-7 rounded-md bg-[#171717] text-[#FAFAF7] flex items-center justify-center font-bold text-xs tracking-wider">
              DF
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-extrabold tracking-[-0.03em] font-sans uppercase text-[#171717]">
                DRIVEFORGE
              </span>
              <span className="text-[10px] font-mono font-semibold text-[#28483D]">
                AI
              </span>
            </div>
          </div>

          {/* Center: Minimal Text Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {centerNavItems.map(item => {
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  className={`
                    relative text-[11px] lg:text-xs font-semibold tracking-wider font-sans transition-colors cursor-pointer py-1
                    ${active 
                      ? 'text-[#171717] border-b-2 border-[#171717]' 
                      : 'text-[#5A5955] hover:text-[#171717]'
                    }
                  `}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-[#28483D] text-[#FAFAF7] text-[9px] font-mono rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: VAULT | AI | ACCOUNT */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            <button
              onClick={() => navigateTo('/vault')}
              className={`hidden sm:inline-block text-[11px] lg:text-xs font-semibold tracking-wider font-sans transition-colors cursor-pointer ${
                isActive('/vault') ? 'text-[#171717] font-bold' : 'text-[#5A5955] hover:text-[#171717]'
              }`}
            >
              VAULT
            </button>

            <button
              onClick={() => navigateTo('/ai-engineer')}
              className={`hidden sm:flex items-center gap-1 text-[11px] lg:text-xs font-semibold tracking-wider font-sans transition-colors cursor-pointer ${
                isActive('/ai-engineer') ? 'text-[#28483D] font-bold' : 'text-[#5A5955] hover:text-[#28483D]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#28483D]" />
              <span>AI</span>
            </button>

            {/* Region Chip */}
            <button
              onClick={() => navigateTo('/location')}
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md bg-[#E8E2D8]/60 hover:bg-[#E8E2D8] text-[10px] font-mono text-[#4A4843] transition-colors"
              title={`Region: ${currentRegion.name}`}
            >
              <MapPin className="w-3 h-3 text-[#B47A52]" />
              <span>{currentRegion.code}</span>
            </button>

            {/* Account / Login */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#FAFAF7] border border-[#292927]/10 hover:border-[#292927]/25 transition-all cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-[#28483D] text-[#FAFAF7] flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-[#171717] hidden sm:block">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#5A5955]" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-[#FAFAF7] rounded-xl p-1.5 shadow-xl border border-[#292927]/10 space-y-0.5 z-50 animate-in fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#292927]/8">
                      <p className="text-xs font-bold text-[#171717]">{currentUser.name}</p>
                      <p className="text-[11px] text-[#5A5955] font-mono truncate">{currentUser.email}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => { navigateTo('/account'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[#292927] hover:bg-[#E8E2D8]/60 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#28483D]" />
                      <span>Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { navigateTo('/build'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[#292927] hover:bg-[#E8E2D8]/60 transition-colors"
                    >
                      <Wrench className="w-3.5 h-3.5 text-[#B47A52]" />
                      <span>Active Build</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { navigateTo('/reports'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[#292927] hover:bg-[#E8E2D8]/60 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#557B76]" />
                      <span>Build Reports</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { logoutUser(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-[11px] lg:text-xs font-semibold tracking-wider text-[#171717] hover:text-[#28483D] transition-colors cursor-pointer py-1 flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-[#28483D]" />
                <span>ACCOUNT</span>
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#171717] hover:bg-[#E8E2D8]/60 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        mainNavItems={[
          { label: 'BUILD', path: '/build', icon: <Wrench className="w-4 h-4 text-[#B47A52]" /> },
          { label: 'GARAGE', path: '/garage', icon: <Layers className="w-4 h-4" /> },
          { label: 'MARKETPLACE', path: '/marketplace', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'LEARNING', path: '/learning', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'WORKSHOPS', path: '/workshops', icon: <MapPin className="w-4 h-4" /> },
          { label: 'VAULT', path: '/vault', icon: <Sparkles className="w-4 h-4" /> },
          { label: 'AI CHIEF ENGINEER', path: '/ai-engineer', icon: <Sparkles className="w-4 h-4 text-[#28483D]" /> },
          { label: 'ACCOUNT', path: isAuthenticated ? '/account' : '/login', icon: <User className="w-4 h-4" /> }
        ]}
        secondaryNavItems={[
          { label: 'Choose Vehicle', path: '/brands', icon: <Layers className="w-4 h-4" /> },
          { label: 'Regional Settings', path: '/location', icon: <MapPin className="w-4 h-4 text-[#B47A52]" /> },
          { label: 'Build Reports', path: '/reports', icon: <BookOpen className="w-4 h-4" /> }
        ]}
      />

      {/* Firebase Auth Modal */}
      <FirebaseAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

