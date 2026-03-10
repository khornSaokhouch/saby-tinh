import { create } from 'zustand';
import { request } from '@/util/request';

export const useInvoiceStore = create((set, get) => ({
  invoices: [],
  meta: {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15
  },
  stats: null,
  storeStats: [],
  loading: false,
  error: null,

  fetchStoreStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/admin/invoices/store-stats', 'GET');
      if (res.success) {
        set({ storeStats: res.data, loading: false });
      }
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  fetchInvoices: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await request('/admin/invoices', 'GET', null, { params });
      if (res.success) {
        set({ 
          invoices: res.data.data,
          meta: {
            current_page: res.data.current_page,
            last_page: res.data.last_page,
            total: res.data.total,
            per_page: res.data.per_page,
          },
          loading: false
        });
      }
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  fetchInvoiceById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/admin/invoices/${id}`, 'GET');
      set({ loading: false });
      return res.success ? res.data : null;
    } catch (e) {
      set({ error: e.message, loading: false });
      return null;
    }
  },

  updateInvoiceStatus: async (id, status_id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/admin/invoices/${id}/status`, 'POST', { status_id });
      if (res.success) {
        await get().fetchInvoices();
        await get().fetchStats();
      }
      set({ loading: false });
      return res;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  fetchStats: async () => {
    try {
      const res = await request('/admin/invoices/stats', 'GET');
      if (res.success) {
        set({ stats: res.data });
      }
    } catch (e) {
      console.error('Failed to fetch invoice stats:', e);
    }
  },
}));

export default useInvoiceStore;
