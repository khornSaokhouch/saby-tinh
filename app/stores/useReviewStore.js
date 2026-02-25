import { create } from "zustand";
import { request } from "@/util/request";

export const useReviewStore = create((set, get) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchReviews: async (productId = null) => {
    set({ loading: true, error: null });
    try {
      const url = productId ? `/reviews?product_id=${productId}` : "/reviews";
      const res = await request(url, "GET");
      if (res.success) {
        set({ reviews: res.data, loading: false });
        return res.data;
      } else {
        set({ error: res.message, loading: false });
        return null;
      }
    } catch (err) {
      set({ error: err.message || "Failed to fetch reviews", loading: false });
      return null;
    }
  },

  createReview: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await request("/reviews", "POST", payload);
      if (res.success) {
        const { reviews } = get();
        set({ reviews: [res.data, ...reviews], loading: false });
        return { success: true, data: res.data };
      } else {
        set({ error: res.message, loading: false });
        return { success: false, message: res.message };
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to submit review";
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  updateReview: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/reviews/${id}`, "PUT", payload);
      if (res.success) {
        const { reviews } = get();
        set({
          reviews: reviews.map((r) => (r.id === id ? { ...r, ...res.data } : r)),
          loading: false,
        });
        return { success: true, data: res.data };
      } else {
        set({ error: res.message, loading: false });
        return { success: false, message: res.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  deleteReview: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/reviews/${id}`, "DELETE");
      if (res.success) {
        const { reviews } = get();
        set({
          reviews: reviews.filter((r) => r.id !== id),
          loading: false,
        });
        return { success: true };
      } else {
        set({ error: res.message, loading: false });
        return { success: false, message: res.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },
}));