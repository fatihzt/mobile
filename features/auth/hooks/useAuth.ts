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
} from '../store/authAtoms';

export const useAuth = () => {
  const [user] = useAtom(userAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const checkAuth = useSetAtom(checkAuthAtom);
  const login = useSetAtom(loginAtom);
  const signup = useSetAtom(signupAtom);
  const logout = useSetAtom(logoutAtom);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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

  return {
    user,
    isLoading,
    isAuthenticated,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };
};

