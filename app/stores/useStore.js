import { create } from "zustand";
import { request } from "@/util/request";

export const useStore = create((set) => ({
  stores: [],
  loading: false,
  error: null,

  fetchStores: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/stores", "GET");
      set({
        stores: Array.isArray(res) ? res : (res?.data || []),
        loading: false,
        error: null,
      });
    } catch (err) {
      set({ error: err.message || "Failed to fetch stores", loading: false });
    }
  },
  
  fetchStoreById: async (idOrName) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/stores/${encodeURIComponent(idOrName)}`, "GET");
      const storeData = res?.data || res;
      
      if (storeData) {
        set((state) => {
          const exists = state.stores.find(s => s.id === storeData.id);
          return {
            stores: exists ? state.stores.map(s => s.id === storeData.id ? storeData : s) : [...state.stores, storeData],
            loading: false
          };
        });
      } else {
        set({ loading: false });
      }
      
      return res;
    } catch (err) {
      set({ error: err.message || "Failed to fetch store details", loading: false });
      return null;
    }
  },

  createStore: async (data) => {
    const formData = data instanceof FormData ? data : new FormData();
    if (!(data instanceof FormData)) {
      Object.keys(data).forEach(key => formData.append(key, data[key]));
    }
    const newStore = await request("/stores", "POST", formData, {
      "Content-Type": "multipart/form-data",
    });
    set((state) => ({ stores: [...state.stores, newStore] }));
    return newStore;
  },

  updateStore: async (id, data) => {
    const formData = data instanceof FormData ? data : new FormData();
    if (!(data instanceof FormData)) {
      Object.keys(data).forEach(key => formData.append(key, data[key]));
    }
    const updated = await request(`/stores/${id}`, "POST", formData, {
      "Content-Type": "multipart/form-data",
    });
    set((state) => ({
      stores: state.stores.map((s) => (s.id === id ? updated : s)),
    }));
    return updated;
  },

  deleteStore: async (id) => {
    await request(`/stores/${id}`, "DELETE");
    set((state) => ({
      stores: state.stores.filter((s) => s.id !== id),
    }));
    return true;
  },
}));
