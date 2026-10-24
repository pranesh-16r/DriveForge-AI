import { useState, useEffect, useCallback } from 'react';
import { UserProfile, LoginPayload, SignupPayload, PasswordResetPayload } from '../types/auth';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(payload);
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        setError(response.error || 'Authentication failed');
        return { success: false, error: response.error };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'System authentication error';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signup(payload);
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        setError(response.error || 'Account provisioning failed');
        return { success: false, error: response.error };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration error';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const continueAsGuest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.continueAsGuest();
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      }
      return { success: false, error: 'Guest session unavailable' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (payload: PasswordResetPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.forgotPassword(payload);
      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Password reset failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isGuest: user?.role === 'guest',
    isLoading,
    error,
    login,
    signup,
    continueAsGuest,
    forgotPassword,
    logout,
    clearError: () => setError(null)
  };
};
