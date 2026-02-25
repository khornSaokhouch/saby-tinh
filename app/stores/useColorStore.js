import { create } from 'zustand';
import { request } from '@/util/request'; // adjust path

export const useColorStore = create((set, get) => ({
  colors: [],
  loading: false,
  error: null,
  search: '',

  /* =========================
     Fetch all colors
     ========================= */
  fetchColors: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/colors', 'GET', null, false);
      const list = Array.isArray(res) ? res : res?.data || [];
      set({ colors: list, loading: false });
    } catch (e) {
      set({
        error: e.response?.data?.message || e.message || 'Failed to fetch colors',
        loading: false,
      });
    }
  },

  /* =========================
     Search
     ========================= */
  setSearch: (value) => set({ search: value }),

  /* =========================
     Create / Update color
     ========================= */
  saveColor: async (color) => {
    try {
      let url = '/colors';
      let method = 'POST';
      if (color.id) {
        url = `/colors/${color.id}`;
        method = 'POST';
      }

      await request(url, method, { name: color.name });
      await get().fetchColors();
    } catch (err) {
      throw err;
    }
  },

  /* =========================
     Delete color
     ========================= */
  deleteColor: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/colors/${id}`, 'DELETE');
      await get().fetchColors();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete color',
        loading: false,
      });
      throw err;
    }
  },
}));
