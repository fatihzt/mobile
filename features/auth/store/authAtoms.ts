/**
 * Auth Feature - Jotai Atoms
 */

import { atom } from 'jotai';
import { User } from '../../../shared/types';
import authService from '../services/authService';

// Base atoms
export const userAtom = atom<User | null>(null);
export const isLoadingAtom = atom<boolean>(true);

// Derived atoms
export const isAuthenticatedAtom = atom((get) => !!get(userAtom));

// Async atoms
export const checkAuthAtom = atom(null, async (_get, set) => {
  set(isLoadingAtom, true);
  try {
    const token = await authService.getToken();
    if (token) {
      const user = await authService.getUser();
      if (user) {
        set(userAtom, user);
      }
    }
  } catch (error) {
    if (__DEV__) console.error('Auth check failed:', error);
  } finally {
    set(isLoadingAtom, false);
  }
});

export const loginAtom = atom(null, async (_get, set, credentials: { email: string; password: string }) => {
  set(isLoadingAtom, true);
  try {
    const { user } = await authService.login(credentials);
    set(userAtom, user);
    set(isLoadingAtom, false);
  } catch (error) {
    set(isLoadingAtom, false);
    throw error;
  }
});

export const signupAtom = atom(null, async (_get, set, data: { email: string; password: string; fullName?: string }) => {
  set(isLoadingAtom, true);
  try {
    const { user } = await authService.signup({
      email: data.email,
      password: data.password,
      full_name: data.fullName,
    });
    set(userAtom, user);
    set(isLoadingAtom, false);
  } catch (error) {
    set(isLoadingAtom, false);
    throw error;
  }
});

export const logoutAtom = atom(null, async (_get, set) => {
  try {
    await authService.logout();
    set(userAtom, null);
  } catch (error) {
    if (__DEV__) console.error('Logout failed:', error);
  }
});

export const updateProfileAtom = atom(null, async (_get, set, data: { full_name: string }) => {
  try {
    const user = await authService.updateProfile(data);
    set(userAtom, user);
    return user;
  } catch (error) {
    throw error;
  }
});
