import { create } from 'zustand';
import { request } from '@/util/request'; // adjust path

export const useSizeStore = create((set, get) => ({
  sizes: [],
  loading: false,
  error: null,
  search: '',

  /* =========================
     Fetch all sizes
     ========================= */
  fetchSizes: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/sizes', 'GET', null, false);
      const list = Array.isArray(res) ? res : res?.data || [];
      set({ sizes: list, loading: false });
    } catch (e) {
      set({
        error: e.response?.data?.message || e.message || 'Failed to fetch sizes',
        loading: false,
      });
    }
  },

  /* =========================
     Search
     ========================= */
  setSearch: (value) => set({ search: value }),

  /* =========================
     Create / Update size
     ========================= */
  saveSize: async (size) => {
    try {
      let url = '/sizes';
      let method = 'POST';
      if (size.id) {
        url = `/sizes/${size.id}`;
        method = 'POST';
      }

      await request(url, method, { name: size.name });
      await get().fetchSizes();
    } catch (err) {
      throw err;
    }
  },

  /* =========================
     Delete size
     ========================= */
  deleteSize: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/sizes/${id}`, 'DELETE');
      await get().fetchSizes();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete size',
        loading: false,
      });
      throw err;
    }
  },
}));
