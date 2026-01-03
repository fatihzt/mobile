/**
 * Auth Feature - Barrel Export
 */

export { useAuth } from './hooks/useAuth';
export type { LoginCredentials, SignupData, AuthState } from './types';
export { default as authService } from './services/authService';

