import { create } from 'zustand';
import { request } from '@/util/request';

export const usePaymentStatusStore = create((set, get) => ({
  paymentStatuses: [],
  loading: false,
  error: null,
  search: '',

  /* =========================
     Fetch all
     ========================= */
  fetchPaymentStatuses: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/payment-statuses', 'GET', null, false);

      const raw = Array.isArray(res) ? res : (res?.data || []);
      const list = Array.isArray(raw) ? raw : [];

      set({ paymentStatuses: list, loading: false });
    } catch (e) {
      set({
        error:
          e.response?.data?.message ||
          e.message ||
          'Failed to fetch payment statuses',
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
  savePaymentStatus: async (item) => {
    try {
      let url = '/payment-statuses';
      let method = 'POST';

      if (item.id) {
        url = `/payment-statuses/${item.id}`;
        method = 'POST';
      }

      const payload = {
        status: item.status,
      };

      await request(url, method, payload);

      await get().fetchPaymentStatuses();
    } catch (err) {
      throw err;
    }
  },

  /* =========================
     Delete
     ========================= */
  deletePaymentStatus: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/payment-statuses/${id}`, 'DELETE');
      await get().fetchPaymentStatuses();
      set({ loading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          'Failed to delete payment status',
        loading: false,
      });
      throw err;
    }
  },
}));
