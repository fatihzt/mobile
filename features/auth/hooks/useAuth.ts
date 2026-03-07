/**
 * Auth Hook - Jotai atoms kullanarak auth state yönetimi
 */

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import {
  userAtom,
  isLoadingAtom,
  isAuthenticatedAtom,
  checkAuthAtom,
  loginAtom,
  signupAtom,
  logoutAtom,
  updateProfileAtom,
} from '../store/authAtoms';
import { setOnUnauthorizedCallback } from '@/shared/services/api';

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const checkAuth = useSetAtom(checkAuthAtom);
  const login = useSetAtom(loginAtom);
  const signup = useSetAtom(signupAtom);
  const logout = useSetAtom(logoutAtom);
  const updateProfile = useSetAtom(updateProfileAtom);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Register 401 callback to clear auth state
  useEffect(() => {
    setOnUnauthorizedCallback(() => {
      setUser(null);
    });
  }, [setUser]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      await login({ email, password });
    },
    [login]
  );

  const handleSignup = useCallback(
    async (email: string, password: string, fullName?: string) => {
      await signup({ email, password, fullName });
    },
    [signup]
  );

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const handleUpdateProfile = useCallback(
    async (data: { full_name: string }) => {
      await updateProfile(data);
    },
    [updateProfile]
  );

  return {
    user,
    isLoading,
    isAuthenticated,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
  };
};

