import { create } from "zustand";
import { request } from "@/util/request";

export const useShopOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/orders", "GET");
      if (res.success) {
        set({ orders: res.data, loading: false });
      } else {
        set({ error: res.message, loading: false });
      }
    } catch (err) {
      set({ error: err.message || "Failed to fetch orders", loading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/orders/${id}`, "GET");
      if (res.success) {
        set({ loading: false });
        return res.data;
      } else {
        set({ error: res.message, loading: false });
        return null;
      }
    } catch (err) {
      set({ error: err.message || "Failed to fetch order", loading: false });
      return null;
    }
  },

  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const res = await request("/orders", "POST", orderData);
      if (res.success) {
        set((state) => ({
          orders: [res.data, ...state.orders],
          loading: false,
        }));
        return { success: true, data: res.data };
      } else {
        set({ error: res.message, loading: false });
        return { success: false, message: res.message };
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to place order";
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  confirmOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/orders/${id}/confirm`, "POST");
      if (res.success) {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, ...res.data } : o)),
          loading: false,
        }));
        return { success: true, message: res.message };
      } else {
        set({ error: res.message, loading: false });
        return { success: false, message: res.message };
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to confirm order";
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },
}));
