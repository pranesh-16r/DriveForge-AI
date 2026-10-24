import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/auth';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoInput } from '../components/ui/NeoInput';
import { NeoSelect } from '../components/ui/NeoSelect';
import { REGIONS } from '../data/locations';
import { EXPERIENCE_LEVELS } from '../data/experiences';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Sliders,
  ArrowRight,
  Cpu
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { navigateTo, setCurrentUser, setRegion, setExperienceLevel } = useApp();

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState(REGIONS[0].id);
  const [selectedExpId, setSelectedExpId] = useState(EXPERIENCE_LEVELS[0].id);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Interaction State
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});

  const passwordEvaluation = authService.evaluatePasswordStrength(password);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name or engineering identifier is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!authService.isValidEmail(email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must contain at least 8 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!termsAccepted) {
      newErrors.terms = 'Please accept the platform terms to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await authService.signup({
        name,
        email,
        password,
        confirmPassword,
        termsAccepted,
        regionId: selectedRegionId,
        experienceLevelId: selectedExpId
      });

      if (result.success && result.user) {
        setSignupSuccess(true);
        setCurrentUser(result.user);

        const reg = REGIONS.find(r => r.id === selectedRegionId);
        const exp = EXPERIENCE_LEVELS.find(e => e.id === selectedExpId);
        if (reg) setRegion(reg);
        if (exp) setExperienceLevel(exp);

        setTimeout(() => {
          navigateTo('/');
        }, 650);
      } else {
        setErrors({ general: result.error || 'Registration failed. Try again.' });
      }
    } catch {
      setErrors({ general: 'Network connection failure during account provisioning.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4 sm:px-6 bg-[#F4F1EA] text-[#171717]">
      
      {/* Background Decor Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#292927_1px,transparent_1px),linear-gradient(to_bottom,#292927_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-5 pointer-events-none" />

      <PageContainer maxWidth="5xl" className="relative z-10 w-full py-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mx-auto space-y-6"
        >

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#28483D] text-[#FAFAF7] text-[10px] font-mono font-bold uppercase tracking-widest shadow-xs mb-1">
              <Cpu className="w-3.5 h-3.5 text-[#D6C09A]" />
              REGISTER ACCOUNT • FIRESTORE CONNECTED
            </div>

            <h1 className="text-3xl font-black text-[#171717] font-sans tracking-tight uppercase">
              CREATE DRIVER ACCOUNT.
            </h1>
            <p className="text-xs sm:text-sm text-[#383835] font-sans max-w-md mx-auto">
              Set up your profile to compose physical vehicle builds, calculate regional labor, and access AI Chief Engineer recommendations.
            </p>
          </div>

          {/* Warm Ivory Form Card */}
          <div className="p-6 sm:p-8 space-y-6 rounded-3xl bg-[#FAFAF7] border border-[#292927]/15 shadow-xl">
            
            <AnimatePresence>
              {signupSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3.5 rounded-2xl bg-[#28483D]/10 border border-[#28483D]/30 text-[#28483D] text-xs font-mono font-bold flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Profile created &amp; stored in Firestore. Initializing DriveForge studio...</span>
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

            <form onSubmit={handleSignup} className="space-y-4" noValidate>
              
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NeoInput
                  label="Engineer Name"
                  type="text"
                  required
                  placeholder="Marcus Vance"
                  value={name}
                  error={errors.name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  icon={<User className="w-4 h-4 text-[#5A5955]" />}
                />

                <NeoInput
                  label="Engineering Email"
                  type="email"
                  required
                  placeholder="marcus@driveforge.ai"
                  value={email}
                  error={errors.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  icon={<Mail className="w-4 h-4 text-[#5A5955]" />}
                />
              </div>

              {/* Region & Experience Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NeoSelect
                  label="Regional Labor Zone"
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  icon={<MapPin className="w-4 h-4 text-[#B47A52]" />}
                  options={REGIONS.map(r => ({
                    value: r.id,
                    label: `${r.name} (${r.currencySymbol})`
                  }))}
                />

                <NeoSelect
                  label="Experience Level"
                  value={selectedExpId}
                  onChange={(e) => setSelectedExpId(e.target.value)}
                  icon={<Sliders className="w-4 h-4 text-[#28483D]" />}
                  options={EXPERIENCE_LEVELS.map(exp => ({
                    value: exp.id,
                    label: exp.title
                  }))}
                />
              </div>

              {/* Password & Confirm Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NeoInput
                  label="Security Password"
                  type={showPassword ? 'text' : 'password'}
                  required
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
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <NeoInput
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  error={errors.confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }}
                  icon={<Lock className="w-4 h-4 text-[#5A5955]" />}
                />
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1.5 p-3 rounded-xl bg-white border border-[#292927]/10">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                    <span className="text-[#5A5955]">SECURITY METRIC:</span>
                    <span
                      className={
                        passwordEvaluation.score >= 3
                          ? 'text-[#28483D]'
                          : passwordEvaluation.score === 2
                          ? 'text-[#B47A52]'
                          : 'text-[#B8644A]'
                      }
                    >
                      {passwordEvaluation.label.toUpperCase()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E8E2D8] rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map(step => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-all ${
                          step <= passwordEvaluation.score
                            ? passwordEvaluation.score >= 3
                              ? 'bg-[#28483D]'
                              : passwordEvaluation.score === 2
                              ? 'bg-[#B47A52]'
                              : 'bg-[#B8644A]'
                            : 'opacity-20 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="space-y-1 pt-1">
                <label className="flex items-start gap-2.5 text-xs text-[#5A5955] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (errors.terms) setErrors(prev => ({ ...prev, terms: undefined }));
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-[#28483D] focus:ring-0 bg-white border border-[#292927]/20 cursor-pointer accent-[#28483D]"
                  />
                  <span className="font-sans leading-tight">
                    I agree to the engineering platform safety guidelines, CAD clearance disclaimers, and data storage terms.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-[11px] font-mono text-[#B8644A] pl-6">{errors.terms}</p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || signupSuccess}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] font-bold font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Registering Account...</span>
                  ) : signupSuccess ? (
                    <span>Account Created // Entering Studio...</span>
                  ) : (
                    <>
                      <span>Create Account &amp; Proceed</span>
                      <ArrowRight className="w-4 h-4 text-[#D6C09A]" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Existing User Login Link */}
            <div className="pt-2 text-center border-t border-[#292927]/10">
              <p className="text-xs text-[#5A5955] font-sans">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => navigateTo('/login')}
                  className="text-[#28483D] font-bold hover:underline cursor-pointer font-mono"
                >
                  Sign In →
                </button>
              </p>
            </div>
          </div>

          {/* Security Guarantee Pill */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#5A5955]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#28483D]" />
            <span>FIRESTORE DB CONNECTED • SECURE ACCOUNT PROVISIONING</span>
          </div>

        </motion.div>
      </PageContainer>
    </div>
  );
};
