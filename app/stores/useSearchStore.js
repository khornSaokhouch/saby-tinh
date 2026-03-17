import { create } from 'zustand';
import { request } from '@/util/request';

export const useSearchStore = create((set, get) => ({
  query: '',
  results: {
    products: [],
    stores: [],
    categories: []
  },
  loading: false,
  error: null,

  setQuery: (query) => set({ query }),

  performSearch: async (query) => {
    if (!query || query.trim() === '') {
      set({ 
        results: { products: [], stores: [], categories: [] },
        loading: false,
        error: null 
      });
      return;
    }

    set({ loading: true, error: null, query });

    try {
      const res = await request(`/search?q=${encodeURIComponent(query)}`, 'GET');
      
      // The backend returns { success: true, data: { products: [...], stores: [...], categories: [...] } }
      if (res?.success) {
        set({ 
          results: res.data, 
          loading: false 
        });
      } else {
        set({ 
          error: 'Failed to fetch search results', 
          loading: false 
        });
      }
    } catch (err) {
      set({ 
        error: err.message || 'An error occurred during search', 
        loading: false 
      });
    }
  },

  clearSearch: () => {
    set({
      query: '',
      results: { products: [], stores: [], categories: [] },
      loading: false,
      error: null
    });
  }
}));
