import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/auth';
import { lsAudio } from '../utils/lsAudio';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoInput } from '../components/ui/NeoInput';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Car,
  Wrench,
  Sparkles,
  Cpu
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigateTo, setCurrentUser } = useApp();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Interaction States
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Engineering email address is required.';
    } else if (!authService.isValidEmail(email)) {
      newErrors.email = 'Enter a valid email address (e.g., engineer@driveforge.ai).';
    }

    if (!password) {
      newErrors.password = 'Password or security passkey is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await authService.login({
        email,
        password,
        rememberMe
      });

      if (result.success && result.user) {
        setLoginSuccess(true);
        setCurrentUser(result.user);
        setTimeout(() => {
          navigateTo('/');
        }, 500);
      } else {
        setErrors({ general: result.error || 'Authentication rejected. Verify credentials.' });
      }
    } catch {
      setErrors({ general: 'System network error. Unable to verify credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrors({});
    try {
      const result = await authService.signInWithGoogle();
      if (result.success && result.user) {
        setLoginSuccess(true);
        setCurrentUser(result.user);
        setTimeout(() => {
          navigateTo('/');
        }, 500);
      } else {
        setErrors({ general: result.error || 'Google Authentication failed.' });
      }
    } catch {
      setErrors({ general: 'Google sign in failed.' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
      const result = await authService.continueAsGuest();
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setLoginSuccess(true);
        setTimeout(() => {
          navigateTo('/');
        }, 500);
      }
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4 sm:px-6 bg-[#F4F1EA] text-[#171717]">
      
      {/* Warm Ivory Subtle Grid Pattern Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#292927_1px,transparent_1px),linear-gradient(to_bottom,#292927_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-5 pointer-events-none" />

      <PageContainer maxWidth="5xl" className="relative z-10 w-full py-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md mx-auto space-y-6"
        >

          {/* Identity & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#28483D] text-[#FAFAF7] text-[10px] font-mono font-bold uppercase tracking-widest shadow-xs mb-1">
              <Cpu className="w-3.5 h-3.5 text-[#D6C09A]" />
              AUTHENTICATION GATEWAY • FIREBASE AUTH
            </div>

            <h1 className="text-3xl font-black text-[#171717] font-sans tracking-tight uppercase">
              DRIVEFORGE STUDIO LOG IN.
            </h1>
            <p className="text-xs sm:text-sm text-[#383835] font-sans max-w-sm mx-auto">
              Access your saved vehicle builds, 3D garage specs, and AI renders synced with Firestore DB.
            </p>
          </div>

          {/* Warm Ivory Studio Card Container */}
          <div className="p-6 sm:p-8 space-y-5 rounded-3xl bg-[#FAFAF7] border border-[#292927]/15 shadow-xl">
            
            {/* Google 1-Click Authentication Button */}
            <button
              type="button"
              disabled={googleLoading || loading}
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-[#E8E2D8] text-[#171717] font-bold font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-3 border border-[#292927]/15 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? 'Connecting Google Account...' : 'Continue with Google Account'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-[#292927]/10" />
              <span className="absolute bg-[#FAFAF7] px-3 text-[10px] font-mono text-[#383835] uppercase font-bold">
                OR EMAIL PASSKEY
              </span>
            </div>

            {/* Quick 1-Click Driver Credentials */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#383835] uppercase block tracking-wider">
                Quick 1-Click Credentials (Fill &amp; Test):
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('franklin@ls-customs.sa');
                    setPassword('tunerpass123');
                    lsAudio.playRatchet();
                  }}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#E8E2D8] border border-[#292927]/15 text-left transition-colors cursor-pointer"
                >
                  <p className="font-bold text-[#171717] text-[11px] truncate">Franklin C.</p>
                  <p className="text-[9px] text-[#383835]">Street Tuner</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('hao@ls-customs.sa');
                    setPassword('mastertech77');
                    lsAudio.playRatchet();
                  }}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#E8E2D8] border border-[#292927]/15 text-left transition-colors cursor-pointer"
                >
                  <p className="font-bold text-[#B47A52] text-[11px] truncate">Hao Tech</p>
                  <p className="text-[9px] text-[#383835]">Master Mech</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('guest@driveforge.com');
                    setPassword('driver2026');
                    lsAudio.playRatchet();
                  }}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#E8E2D8] border border-[#292927]/15 text-left transition-colors cursor-pointer"
                >
                  <p className="font-bold text-[#28483D] text-[11px] truncate">Guest Rig</p>
                  <p className="text-[9px] text-[#383835]">Test Driver</p>
                </button>
              </div>
            </div>

            {/* Feedback Alerts */}
            <AnimatePresence>
              {loginSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3.5 rounded-2xl bg-[#28483D]/10 border border-[#28483D]/30 text-[#28483D] text-xs font-mono font-bold flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Authenticated // Restoring saved builds from Firestore...</span>
                </motion.div>
              )}

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3.5 rounded-2xl bg-[#B8644A]/10 border border-[#B8644A]/30 text-[#B8644A] text-xs font-mono font-bold flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.general}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              
              {/* Email Input */}
              <NeoInput
                label="Engineering Email"
                type="email"
                required
                autoComplete="email"
                placeholder="engineer@driveforge.ai"
                value={email}
                error={errors.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                icon={<Mail className="w-4 h-4 text-[#5A5955]" />}
              />

              {/* Password Input */}
              <div className="space-y-1">
                <NeoInput
                  label="Passkey / Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  error={errors.password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  icon={<Lock className="w-4 h-4 text-[#5A5955]" />}
                  rightElement={
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-[#5A5955] hover:text-[#171717] transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-[#5A5955] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#28483D] focus:ring-0 bg-white border border-[#292927]/20 cursor-pointer accent-[#28483D]"
                  />
                  <span className="font-sans">Remember session</span>
                </label>

                <button
                  type="button"
                  onClick={() => navigateTo('/forgot-password')}
                  className="text-xs font-mono text-[#B47A52] hover:text-[#28483D] transition-colors cursor-pointer font-bold"
                >
                  Forgot passkey?
                </button>
              </div>

              {/* Login CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || loginSuccess}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] font-bold font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : loginSuccess ? (
                    <span>Session Verified // Opening Studio...</span>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4 text-[#D6C09A]" />
                      <span>Log In &amp; Enter Landing Page</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Guest Mode Option */}
            <button
              type="button"
              disabled={guestLoading || loading}
              onClick={handleGuestLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#E8E2D8] border border-[#292927]/15 text-[#5A5955] hover:text-[#171717] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Car className="w-3.5 h-3.5 text-[#28483D]" />
              <span>{guestLoading ? 'Provisioning Guest Rig...' : 'Instant Demo Driver Session'}</span>
            </button>

            {/* Footer Registration Link */}
            <div className="pt-2 text-center border-t border-[#292927]/10">
              <p className="text-xs text-[#5A5955] font-sans">
                Don't have an engineer account?{' '}
                <button
                  type="button"
                  onClick={() => navigateTo('/signup')}
                  className="text-[#B47A52] font-bold hover:underline cursor-pointer font-mono"
                >
                  Create Account →
                </button>
              </p>
            </div>
          </div>

          {/* Security Guarantee Pill */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#5A5955]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#28483D]" />
            <span>FIRESTORE DB CONNECTED • ENCRYPTED SESSION</span>
          </div>

        </motion.div>
      </PageContainer>
    </div>
  );
};
