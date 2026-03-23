import { create } from 'zustand';
import { request } from '@/util/request';

export const usePromoCodeStore = create((set, get) => ({
  promoCodes: [],
  loading: false,
  error: null,
  search: '',

  fetchPromoCodes: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/promo-codes', 'GET', null, false);
      const list = Array.isArray(res) ? res : res?.data || [];
      set({ promoCodes: list, loading: false });
    } catch (e) {
      set({
        error: e.response?.data?.message || e.message || 'Failed to fetch promo codes',
        loading: false,
      });
    }
  },

  setSearch: (value) => set({ search: value }),

  savePromoCode: async (promoCode) => {
    set({ loading: true, error: null });
    try {
      let url = '/promo-codes';
      let method = 'POST';

      if (promoCode.id) {
        url = `/promo-codes/${promoCode.id}`;
        method = 'POST'; // Backend defines update as POST (or match PUT if needed, but POST is used in others)
      }

      const payload = {
        code: promoCode.code,
        description: promoCode.description,
        discount_type: promoCode.discount_type,
        discount_value: promoCode.discount_value,
        min_order_amount: promoCode.min_order_amount,
        max_discount_amount: promoCode.max_discount_amount,
        usage_limit: promoCode.usage_limit,
        per_user_limit: promoCode.per_user_limit,
        start_date: promoCode.start_date,
        end_date: promoCode.end_date,
        status: promoCode.status,
      };

      await request(url, method, payload);
      await get().fetchPromoCodes();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to save promo code',
        loading: false,
      });
      throw err;
    }
  },

  deletePromoCode: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/promo-codes/${id}`, 'DELETE');
      await get().fetchPromoCodes();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete promo code',
        loading: false,
      });
      throw err;
    }
  },

  deleteMultiplePromoCodes: async (ids) => {
    set({ loading: true, error: null });
    try {
      await Promise.all(ids.map(id => request(`/promo-codes/${id}`, 'DELETE')));
      await get().fetchPromoCodes();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete promo codes',
        loading: false,
      });
      return { success: false, message: err.message };
    }
  },

  validatePromoCode: async (code, order_total) => {
    set({ loading: true, error: null });
    try {
      const res = await request('/promo-codes/validate', 'POST', { code, order_total });
      set({ loading: false });
      return res; // { status: 'success', data: { promo_code: {...}, discount_amount: 10 } }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid promo code';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },
}));
