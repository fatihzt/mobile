import { atom } from 'jotai';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'favorites';

// Base atom: array of event IDs
export const favoriteIdsAtom = atom<string[]>([]);

// Load favorites from SecureStore
export const loadFavoritesAtom = atom(null, async (_get, set) => {
  try {
    const stored = await SecureStore.getItemAsync(STORAGE_KEY);
    if (stored) {
      set(favoriteIdsAtom, JSON.parse(stored));
    }
  } catch (error) {
    if (__DEV__) console.error('Load favorites failed:', error);
  }
});

// Toggle favorite
export const toggleFavoriteAtom = atom(null, async (get, set, eventId: string) => {
  const current = get(favoriteIdsAtom);
  const updated = current.includes(eventId)
    ? current.filter(id => id !== eventId)
    : [...current, eventId];

  set(favoriteIdsAtom, updated);

  try {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (__DEV__) console.error('Save favorites failed:', error);
  }
});
