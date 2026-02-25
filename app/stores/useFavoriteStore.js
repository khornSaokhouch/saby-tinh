import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useFavoriteStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      // Add items
      addFavorite: (product) => {
        const { favorites } = get();
        if (!favorites.some((item) => item.id === product.id)) {
          set({ favorites: [...favorites, product] });
        }
      },

      // Remove items
      removeFavorite: (productId) => {
        const { favorites } = get();
        set({
          favorites: favorites.filter(
            (item) => item.id !== productId && item.product_id !== productId
          ),
        });
      },

      // Toggle item (legacy support and convenience)
      toggleFavorite: (product) => {
        const { favorites } = get();
        const isExist = favorites.find((item) => item.id === product.id || item.product_id === product.id);

        if (isExist) {
          get().removeFavorite(product.id);
        } else {
          get().addFavorite(product);
        }
      },

      // Check if item is favorited
      isFavorite: (id) => {
        return get().favorites.some((item) => item.id === id || item.product_id === id);
      },

      // Clear everything
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'saby-tinh-favorites', // Unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // Store in localStorage
    }
  )
);