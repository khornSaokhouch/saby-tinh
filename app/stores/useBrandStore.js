import { create } from 'zustand';
import { request } from '@/util/request';

export const useBrandStore = create((set, get) => ({
  brands: [],
  loading: false,
  error: null,

  fetchBrands: async () => {
    // SWR pattern: Only show loading if we have no brands cached
    if (get().brands.length === 0) {
      set({ loading: true });
    }
    set({ error: null });
    
    try {
      const res = await request('/brands', 'GET');
      const list = Array.isArray(res) ? res : (res?.data || []);
      set({ brands: list, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  saveBrand: async (brand) => {
    set({ loading: true });
    try {
      // Logic: Update if ID exists, otherwise Create
      const url = brand.id ? `/brands/${brand.id}` : '/brands';
      
      const formData = new FormData();
      formData.append('name', brand.name);
      formData.append('status', brand.status ? 1 : 0); // Map boolean to integer for backend validation

      // Only append image if it's a new file upload
      if (brand.image instanceof File) {
        formData.append('image', brand.image);
      }

      await request(url, 'POST', formData, true); 
      
      // Critical: Refetch to sync UI with DB
      await get().fetchBrands();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  deleteBrand: async (id) => {
    try {
      await request(`/brands/${id}`, 'DELETE');
      set((state) => ({
        brands: state.brands.filter((b) => b.id !== id)
      }));
    } catch (err) {
      throw err;
    }
  }
}));