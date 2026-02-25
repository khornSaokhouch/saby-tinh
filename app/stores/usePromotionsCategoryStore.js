import { create } from 'zustand';
import { request } from '@/util/request';

export const usePromotionsCategoryStore = create((set) => ({
  categoriesByPromotion: [],
  loading: false,
  error: null,

  fetchCategoriesByPromotion: async (promotionId) => {
    if (!promotionId) {
      // Clear previous data and error
      set({ error: null, categoriesByPromotion: [] });
      return;
    }

    set({ loading: true, error: null });

    try {
      const res = await request(`/promotion-category/${promotionId}/categories`, 'GET');
      set({ categoriesByPromotion: res || [], loading: false });
    } catch (err) {
      // Check if error is 404 - treat as empty categories instead of error
      if (err?.response?.status === 404) {
        set({ categoriesByPromotion: [], loading: false, error: null });
      } else {
        set({ error: err.message || 'Failed to fetch categories', loading: false });
      }
    }
  },
  

  attachCategoriesToPromotion: async (promotionId, categoryId) => {
    try {
      await request(`/promotion-category/${promotionId}/categories`, 'POST', {
        category_id: categoryId,
      });
      // Refresh list after attach
      const res = await request(`/promotion-category/${promotionId}/categories`, 'GET');
      set({ categoriesByPromotion: res });
    } catch (err) {
      set({ error: err.message || 'Failed to attach category' });
      throw err;
    }
  },

  detachCategoryFromPromotion: async (promotionId, categoryId) => {
    try {
      await request(`/promotion-category/${promotionId}/categories/${categoryId}`, 'DELETE');
      // Refresh list after detach
      const res = await request(`/promotion-category/${promotionId}/categories`, 'GET');
      set({ categoriesByPromotion: res });
    } catch (err) {
      set({ error: err.message || 'Failed to detach category' });
      throw err;
    }
  },

  // ✅ Clear categories state (useful after deleting a promotion)
  clearCategoriesByPromotion: () => {
    set({ categoriesByPromotion: [], error: null });
  },
}));
