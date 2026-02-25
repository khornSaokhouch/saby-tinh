import { create } from 'zustand';
import { request } from '@/util/request'; // adjust path if needed

export const useShippingMethodStore = create((set, get) => ({
  shippingMethods: [],
  loading: false,
  error: null,
  search: '',

  /* =========================
     Fetch all shipping methods
     ========================= */
  fetchShippingMethods: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/shipping-methods', 'GET', null, false);

      const raw = Array.isArray(res) ? res : (res?.data || []);
      const list = Array.isArray(raw) ? raw : [];

      set({ shippingMethods: list, loading: false });
    } catch (e) {
      set({
        error:
          e.response?.data?.message ||
          e.message ||
          'Failed to fetch shipping methods',
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
  saveShippingMethod: async (method) => {
    try {
      let url = '/shipping-methods';
      let httpMethod = 'POST';

      // Update uses POST /shipping-methods/{id}
      if (method.id) {
        url = `/shipping-methods/${method.id}`;
        httpMethod = 'POST';
      }

      const payload = {
        name: method.name,
        price: method.price,
      };

      await request(url, httpMethod, payload);

      // refresh list after save
      await get().fetchShippingMethods();

    } catch (err) {
      throw err;
    }
  },

  /* =========================
     Delete
     ========================= */
  deleteShippingMethod: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/shipping-methods/${id}`, 'DELETE');
      await get().fetchShippingMethods();
      set({ loading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          'Failed to delete shipping method',
        loading: false,
      });
      throw err;
    }
  },
}));
