/**
 * DriveForge AI - Authentication Types
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'engineer' | 'guest' | 'admin';
  createdAt: string;
  avatarUrl?: string;
  savedBuildsCount: number;
  selectedVehicleId?: string;
  regionCode?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  regionId?: string;
  experienceLevelId?: string;
}

export interface PasswordResetPayload {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
  message?: string;
  resetToken?: string;
}
