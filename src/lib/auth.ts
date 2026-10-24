import { UserProfile, LoginPayload, SignupPayload, PasswordResetPayload, AuthResponse } from '../types/auth';
import { authService } from '../services/auth';

/**
 * DriveForge AI - Authentication Service Interface & Abstraction Layer
 * 
 * Provides a decoupled contract for future backend authentication providers
 * (e.g. Supabase, Firebase, OAuth2 OIDC, or custom JWT microservices).
 * Ensures no client-side secret exposure and uniform state dispatching.
 */
export interface IAuthService {
  getCurrentUser(): UserProfile | null;
  isValidEmail(email: string): boolean;
  evaluatePasswordStrength(password: string): {
    score: number;
    label: 'Weak' | 'Fair' | 'Good' | 'Engineering-Grade';
    feedback: string;
  };
  login(payload: LoginPayload): Promise<AuthResponse>;
  signup(payload: SignupPayload): Promise<AuthResponse>;
  continueAsGuest(): Promise<AuthResponse>;
  forgotPassword(payload: PasswordResetPayload): Promise<AuthResponse>;
  logout(): void;
}

/**
 * Default active authentication provider implementation.
 * Wraps local storage / simulated latency service with provider-swapping capabilities.
 */
export const auth: IAuthService = authService;

export default auth;
