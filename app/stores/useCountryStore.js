import { create } from "zustand";
import { request } from "@/util/request";

const extractError = (err) => err?.response?.data?.message || err?.message || "An error occurred";

export const useCountryStore = create((set) => ({
  countries: [],
  loading: false,
  error: null,

  fetchCountries: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/countries", "GET");
      if (res.success) {
        set({ countries: res.data || [], loading: false });
      } else {
        set({ error: res.message, loading: false });
      }
    } catch (err) {
      set({ error: err.message || "Failed to fetch countries", loading: false });
    }
  },

  createCountry: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await request("/countries", "POST", data);
      if (res.success) {
        set((state) => ({
          countries: [res.data, ...state.countries],
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

  updateCountry: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/countries/${id}`, "POST", data);
      if (res.success) {
        set((state) => ({
          countries: state.countries.map((c) => c.id === id ? res.data : c),
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

  deleteCountry: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/countries/${id}`, "DELETE");
      if (res.success) {
        set((state) => ({
          countries: state.countries.filter((c) => c.id !== id),
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
