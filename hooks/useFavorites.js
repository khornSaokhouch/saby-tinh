import { useState, useEffect } from 'react';
import { useFavoriteStore } from '@/stores/useFavoriteStore';

export function useFavorites() {
  const store = useFavoriteStore();
  const [mounted, setMounted] = useState(false);

  // This prevents hydration mismatch errors in Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    favorites: mounted ? store.favorites : [],
    toggleFavorite: store.toggleFavorite,
    isFavorite: store.isFavorite,
    clearFavorites: store.clearFavorites,
    count: mounted ? store.favorites.length : 0
  };
}