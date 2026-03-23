import { create } from 'zustand';
import { request } from '@/util/request';

export const useOrderStatusStore = create((set, get) => ({
  orderStatuses: [],
  loading: false,
  error: null,
  search: '',

  /* =========================
     Fetch all
     ========================= */
  fetchOrderStatuses: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/order-statuses', 'GET', null, false);

      const raw = Array.isArray(res) ? res : (res?.data || []);
      const list = Array.isArray(raw) ? raw : [];

      set({ orderStatuses: list, loading: false });
    } catch (e) {
      set({
        error:
          e.response?.data?.message ||
          e.message ||
          'Failed to fetch order statuses',
        loading: false,
      });
    }
  },

  /* =========================
     Search
     ========================= */
  setSearch: (value) => set({ search: value }),

  /* =========================
     Create / Update
     ========================= */
  saveOrderStatus: async (item) => {
    try {
      let url = '/order-statuses';
      let method = 'POST';

      if (item.id) {
        url = `/order-statuses/${item.id}`;
        method = 'POST';
      }

      const payload = {
        status: item.status,
      };

      await request(url, method, payload);

      await get().fetchOrderStatuses();
    } catch (err) {
      throw err;
    }
  },

  /* =========================
     Delete
     ========================= */
  deleteOrderStatus: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/order-statuses/${id}`, 'DELETE');
      await get().fetchOrderStatuses();
      set({ loading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          'Failed to delete order status',
        loading: false,
      });
      throw err;
    }
  },

  /* =========================
     Batch Delete
     ========================= */
  deleteMultipleOrderStatus: async (ids) => {
    set({ loading: true, error: null });
    try {
      await Promise.all(ids.map(id => request(`/order-statuses/${id}`, 'DELETE')));
      await get().fetchOrderStatuses();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Batch delete failed',
        loading: false,
      });
      throw err;
    }
  },
}));
