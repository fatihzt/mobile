/**
 * Notifications Feature - Jotai Atoms
 */

import { atom } from 'jotai';

// Base atoms
export const expoPushTokenAtom = atom<string | null>(null);
export const isRegisteredAtom = atom<boolean>(false);

