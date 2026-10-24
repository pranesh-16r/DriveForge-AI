import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/auth';
import { PageContainer } from '../components/ui/PageContainer';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoInput } from '../components/ui/NeoInput';
import { NeoButton } from '../components/ui/NeoButton';
import {
  Mail,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { navigateTo } = useApp();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your registered engineering email address.');
      return;
    }
    if (!authService.isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.forgotPassword({ email });
      if (response.success && response.resetToken) {
        setResetToken(response.resetToken);
      } else {
        setError(response.error || 'Failed to dispatch reset instructions.');
      }
    } catch {
      setError('Network failure while generating security reset link.');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (!resetToken) return;
    navigator.clipboard.writeText(resetToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6">
      
      {/* Background Decor */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-10 mix-blend-luminosity filter contrast-125"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-[#121417]/90 to-[#121417] pointer-events-none" />

      <PageContainer maxWidth="5xl" className="relative z-10 w-full py-2">
        <div className="max-w-md mx-auto space-y-6">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neo-inset text-[10px] font-mono font-bold text-[#0070F3] uppercase tracking-widest border border-[#0070F3]/30 mb-1">
              <KeyRound className="w-3 h-3" />
              SECURITY DISPATCH
            </div>

            <h1 className="text-3xl font-black text-white font-sans tracking-tight">
              RESET SECURITY PASSKEY
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-sm mx-auto">
              Enter your registered engineering email. We will generate a secure authentication recovery token for your session.
            </p>
          </div>

          <NeoCard variant="panel" radius="28" className="p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl">
            
            <AnimatePresence>
              {resetToken ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 space-y-2 text-[#10B981]">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      RECOVERY TOKEN GENERATED
                    </div>
                    <p className="text-xs text-gray-300 font-sans leading-relaxed">
                      In this preview environment, your passkey reset authorization code has been created for <strong className="text-white">{email}</strong>:
                    </p>
                    <div className="flex items-center justify-between p-2.5 rounded-xl neo-inset bg-[#111316] font-mono text-xs text-white">
                      <span className="text-[#0070F3] font-bold">{resetToken}</span>
                      <button
                        type="button"
                        onClick={copyToken}
                        className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Copy token"
                      >
                        {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <NeoButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => navigateTo('/login')}
                    icon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Return to Login
                  </NeoButton>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {error && (
                    <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-mono font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <NeoInput
                    label="Registered Engineering Email"
                    type="email"
                    required
                    placeholder="engineer@driveforge.ai"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    icon={<Mail className="w-4 h-4" />}
                    helperText="A single-use security token will be routed to this address."
                  />

                  <NeoButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={loading}
                    icon={<KeyRound className="w-4 h-4" />}
                  >
                    {loading ? 'Dispatching Reset Token...' : 'Send Reset Link'}
                  </NeoButton>

                  <div className="pt-2 text-center border-t border-[#2A2F38]/60">
                    <button
                      type="button"
                      onClick={() => navigateTo('/login')}
                      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-mono cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>

          </NeoCard>

          <div className="text-center">
            <p className="text-[11px] font-mono text-gray-500 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />
              DriveForge AI Security Center • Automated Passkey Dispatch
            </p>
          </div>

        </div>
      </PageContainer>
    </div>
  );
};
