import { create } from 'zustand';
import { request } from '@/util/request';

export const useStockStore = create((set) => ({
  stocks: [],
  loading: false,
  error: null,

  // Fetch all stocks for the owner
  fetchStocks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/stocks', 'GET');
      set({ stocks: res.data || [], loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || err.message || 'Failed to fetch stocks', 
        loading: false 
      });
    }
  },
}));
