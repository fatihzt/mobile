import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { favoriteIdsAtom, loadFavoritesAtom, toggleFavoriteAtom } from '../store/favoritesAtoms';

export const useFavorites = () => {
  const favoriteIds = useAtomValue(favoriteIdsAtom);
  const loadFavorites = useSetAtom(loadFavoritesAtom);
  const toggleFavorite = useSetAtom(toggleFavoriteAtom);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorite = useCallback(
    (eventId: string) => favoriteIds.includes(eventId),
    [favoriteIds]
  );

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
  };
};
