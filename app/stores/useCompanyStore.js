import { create } from "zustand";
import { request } from "@/util/request";

export const useCompanyStore = create((set) => ({
  companies: [],
  loading: false,
  error: null,

  fetchCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/companies", "GET");
      set({
        companies: Array.isArray(res) ? res : (res?.data || []),
        loading: false,
        error: null,
      });
    } catch (err) {
      set({ error: err.message || "Failed to fetch company info", loading: false });
    }
  },

  /**
   * Create new company info.
   * Logic handles FormData for image uploads.
   */
  createCompany: async (data) => {
    const formData = data instanceof FormData ? data : new FormData();
    if (!(data instanceof FormData)) {
      Object.keys(data).forEach(key => formData.append(key, data[key]));
    }
    set({ loading: true, error: null });
    try {
      const res = await request("/companies", "POST", formData, {
        "Content-Type": "multipart/form-data",
      });
      set((state) => ({ 
        companies: [...state.companies, res.data],
        loading: false 
      }));
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  /**
   * Update existing company info.
   * Logic handles FormData for image uploads.
   */
  updateCompany: async (id, data) => {
    const formData = data instanceof FormData ? data : new FormData();
    if (!(data instanceof FormData)) {
      Object.keys(data).forEach(key => formData.append(key, data[key]));
    }
    set({ loading: true, error: null });
    try {
      const res = await request(`/companies/${id}`, "POST", formData, {
        "Content-Type": "multipart/form-data",
      });
      set((state) => ({
        companies: state.companies.map((c) => (c.id === id ? res.data : c)),
        loading: false
      }));
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteCompany: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/companies/${id}`, "DELETE");
      set((state) => ({
        companies: state.companies.filter((c) => c.id !== id),
        loading: false
      }));
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));
