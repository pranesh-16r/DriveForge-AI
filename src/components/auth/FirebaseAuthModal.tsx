import React, { useState } from 'react';
import { signInWithGoogle, logOutFirebase } from '../../lib/firebase';
import { useApp } from '../../context/AppContext';
import { LogOut, ShieldCheck, X } from 'lucide-react';

interface FirebaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseAuthModal: React.FC<FirebaseAuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || 'DriveForge User',
          email: user.email || '',
          role: 'engineer',
          createdAt: new Date().toISOString(),
          avatarUrl: user.photoURL || undefined,
          savedBuildsCount: 1,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logOutFirebase();
      setCurrentUser(null);
      onClose();
    } catch (err: any) {
      setError('Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FAFAF7] text-[#171717] border border-[#292927]/15 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#5A5955] hover:text-[#171717] hover:bg-[#E8E2D8] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#28483D] text-[#FAFAF7] uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            FIREBASE AUTHENTICATION
          </div>
          <h3 className="text-2xl font-black text-[#171717] uppercase tracking-tight font-sans">
            {currentUser ? 'MY DRIVEFORGE VAULT' : 'SIGN IN TO DRIVEFORGE'}
          </h3>
          <p className="text-xs text-[#5A5955] font-sans">
            {currentUser
              ? 'Your vehicle builds and custom specs are synchronized across devices with Firestore.'
              : 'Sign in with your Google account to save vehicle builds, customize specs, and sync to Firestore.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#B8644A]/10 border border-[#B8644A]/20 text-[#B8644A] text-xs font-mono font-bold">
            {error}
          </div>
        )}

        {/* User Profile Info or Sign In Action */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#E8E2D8]/50 border border-[#292927]/10 flex items-center gap-3">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full border border-[#292927]/20" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#171717] text-[#FAFAF7] flex items-center justify-center font-bold text-lg">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-[#171717]">{currentUser.name}</p>
                <p className="text-xs font-mono text-[#5A5955]">{currentUser.email}</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#28483D]/10 text-[#28483D] uppercase">
                  FIRESTORE SYNCED ✓
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#B8644A] hover:bg-[#292927] text-[#FAFAF7] text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>SIGN OUT OF VAULT</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#171717] hover:bg-[#28483D] text-[#FAFAF7] text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3 cursor-pointer shadow-md border border-white/10"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{loading ? 'SIGNING IN...' : 'CONTINUE WITH GOOGLE'}</span>
            </button>

            <p className="text-[11px] text-center text-[#5A5955] font-sans">
              Secured by Google Identity Services &amp; Firebase Authentication.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
