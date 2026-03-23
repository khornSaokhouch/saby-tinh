import { create } from 'zustand';
import { request } from '@/util/request'; // adjust path if needed

export const usePromotionStore = create((set, get) => ({
  promotions: [],
  loading: false,
  error: null,
  search: '',

  /* =========================
     Fetch all promotions
     ========================= */
  fetchPromotions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/promotions', 'GET', null, false);
      const list = Array.isArray(res) ? res : res?.data || [];
      set({ promotions: list, loading: false });
    } catch (e) {
      set({
        error: e.response?.data?.message || e.message || 'Failed to fetch promotions',
        loading: false,
      });
    }
  },

  /* =========================
     Search
     ========================= */
  setSearch: (value) => set({ search: value }),

  /* =========================
     Create / Update promotion
     ========================= */
  savePromotion: async (promotion) => {
    set({ loading: true, error: null });
    try {
      let url = '/promotions';
      let method = 'POST';

       if (promotion.id) {
        url = `/promotions/${promotion.id}`;
        method = 'POST'; // Backend defines update as POST
      }
      
      const payload = {
        name: promotion.name,
        description: promotion.description,
        discount_percentage: promotion.discount_percentage,
        priority: promotion.priority || 0,
        event_type: promotion.event_type || 'promotion',
        discount_type: promotion.discount_type || 'none',
        discount_value: promotion.discount_value || 0,
        products: promotion.products || [],
        start_date: promotion.start_date,
        end_date: promotion.end_date,
        status: promotion.status ?? 1,
        category_ids: promotion.category_ids || [],
      };

      await request(url, method, payload);
      await get().fetchPromotions();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to save promotion',
        loading: false,
      });
      throw err;
    }
  },

  /* =========================
     Delete promotion
     ========================= */
  deletePromotion: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/promotions/${id}`, 'DELETE');
      await get().fetchPromotions();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete promotion',
        loading: false,
      });
      throw err;
    }
  },

  /* =========================
     Delete multiple promotions
     ========================= */
  deleteMultiplePromotions: async (ids) => {
    set({ loading: true, error: null });
    try {
      await Promise.all(ids.map(id => request(`/promotions/${id}`, 'DELETE')));
      await get().fetchPromotions();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete promotions',
        loading: false,
      });
      return { success: false, message: err.message };
    }
  },
}));
