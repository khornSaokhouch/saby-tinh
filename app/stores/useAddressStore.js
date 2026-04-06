import { create } from "zustand";
import { request } from "@/util/request";

const extractError = (err) => err?.response?.data?.message || err?.message || "An error occurred";

export const useAddressStore = create((set, get) => ({
  userAddresses: [],
  allAddresses: [],
  loading: false,
  error: null,

  fetchUserAddresses: async (context = '') => {
    set({ loading: true, error: null });
    try {
      const url = context ? `/user-addresses?context=${context}` : "/user-addresses";
      const res = await request(url, "GET");
      if (res.success) {
        set({
          userAddresses: res.data || [],
          loading: false,
        });
      } else {
        set({ error: res.message, loading: false });
      }
    } catch (err) {
      set({ 
        error: err.message || "Failed to fetch user addresses", 
        loading: false 
      });
    }
  },

  fetchAllAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/user-addresses/all", "GET");
      if (res.success) {
        set({
          allAddresses: res.data || [],
          loading: false,
        });
      } else {
        set({ error: res.message, loading: false });
      }
    } catch (err) {
      set({
        error: err.message || "Failed to fetch all addresses",
        loading: false,
      });
    }
  },

  addAddress: async (addressData) => {
    set({ loading: true, error: null });
    try {
      const res = await request("/user-addresses", "POST", addressData);
      if (res.success) {
        set((state) => ({
          userAddresses: [res.data, ...state.userAddresses],
          loading: false,
        }));
        return { success: true, data: res.data };
      }
      set({ error: res.message, loading: false });
      return { success: false, message: res.message };
    } catch (err) {
      const msg = extractError(err);
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  updateAddress: async (id, addressData) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/user-addresses/${id}`, "PATCH", addressData);
      if (res.success) {
        set((state) => ({
          userAddresses: state.userAddresses.map((addr) => addr.id === id ? res.data : addr),
          loading: false,
        }));
        return { success: true };
      }
      set({ error: res.message, loading: false });
      return { success: false, message: res.message };
    } catch (err) {
      const msg = extractError(err);
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  deleteAddress: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/user-addresses/${id}`, "DELETE");
      if (res.success) {
        set((state) => ({
          userAddresses: state.userAddresses.filter((addr) => addr.id !== id),
          loading: false,
        }));
        return { success: true };
      }
      set({ error: res.message, loading: false });
      return { success: false, message: res.message };
    } catch (err) {
      const msg = extractError(err);
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },
}));
