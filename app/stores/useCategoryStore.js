import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { request } from '@/util/request'; // adjust path as needed

export const useCategoryStore = create(
  persist(
    (set, get) => ({
      categories: [],
      loading: false,
      error: null,
      search: '',

      fetchCategories: async () => {
        // Stale-While-Revalidate: Only show loading if we have no categories
        if (get().categories.length === 0) {
          set({ loading: true });
        }
        set({ error: null });
        
        try {
          const res = await request('/categories', 'GET', null, false); 
          const raw = Array.isArray(res) ? res : (res?.data || []);
          const list = Array.isArray(raw) ? raw : [];
          set({ categories: list, loading: false });
        } catch (e) {
          set({ error: e.response?.data?.message || e.message || 'Failed to fetch categories', loading: false });
        }
      },

      setSearch: (value) => set({ search: value }),

      saveCategory: async (category) => {
        try {
          let url = '/categories';
          let method = 'POST';
      
          if (category.id) {
            url = `/categories/${category.id}`;
            method = 'POST';
          }
      
          const formData = new FormData();
          formData.append('name', category.name);
          formData.append('status', category.status ? 1 : 2);
      
          if (category.category_image) {
            formData.append('category_image', category.category_image);
          }
      
          await request(url, method, formData);
          await get().fetchCategories();
        } catch (err) {
          throw err;
        }
      },

      deleteCategory: async (id) => {
        set({ loading: true, error: null });
        try {
          await request(`/categories/${id}`, 'DELETE');
          await get().fetchCategories();
          set({ loading: false });
        } catch (err) {
          set({ error: err.response?.data?.message || err.message || 'Failed to delete category', loading: false });
          throw err;
        }
      },

      toggleCategoryStatus: async (id) => {
        try {
          await request(`/categories/${id}/toggle-status`, 'PATCH');
          await get().fetchCategories();
        } catch (err) {
          console.error('Failed to toggle category status:', err);
          throw err;
        }
      },
    }),
    {
      name: 'saby-tinh-categories',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
