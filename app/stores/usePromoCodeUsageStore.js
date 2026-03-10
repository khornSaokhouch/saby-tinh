import { create } from 'zustand';
import { request } from '@/util/request';

export const usePromoCodeUsageStore = create((set, get) => ({
  usages: [],
  meta: {},
  stats: null,
  loading: false,
  error: null,

  fetchUsages: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams(params).toString();
      const res = await request(`/admin/promo-code-usages?${queryParams}`, 'GET');
      if (res.success) {
        set({ 
          usages: res.data.data, 
          meta: {
            current_page: res.data.current_page,
            last_page: res.data.last_page,
            total: res.data.total
          },
          loading: false 
        });
      }
    } catch (e) {
      set({
        error: e.response?.data?.message || e.message || 'Failed to fetch usages',
        loading: false,
      });
    }
  },

  fetchStats: async () => {
    try {
      const res = await request('/admin/promo-code-usages/stats', 'GET');
      if (res.success) {
        set({ stats: res.data });
      }
    } catch (e) {
      console.error('Failed to fetch usage stats:', e);
    }
  },
}));
