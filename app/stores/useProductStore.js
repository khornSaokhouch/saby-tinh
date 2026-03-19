import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { request } from '@/util/request';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      product: null,
      loading: false,
      error: null,

      // Fetch all products
      fetchProducts: async (limit = null) => {
        // SWR pattern
        if (get().products.length === 0) {
          set({ loading: true });
        }
        set({ error: null });
        
        try {
          const url = limit ? `/products?limit=${limit}` : '/products';
          const res = await request(url, 'GET');
          set({ products: res.data || [], loading: false });
        } catch (err) {
          set({ error: err.response?.data?.message || err.message || 'Failed to fetch products', loading: false });
        }
      },

      // Fetch all products (alias)
      fetchAllProducts: async (limit = null) => {
        if (get().products.length === 0) {
          set({ loading: true });
        }
        set({ error: null });
        try {
          const url = limit ? `/products?limit=${limit}` : '/products';
          const res = await request(url, 'GET');
          set({ products: res.data || [], loading: false });
        } catch (err) {
          set({ error: err.response?.data?.message || err.message || 'Failed to fetch products', loading: false });
        }
      },

      // Fetch a single product by ID
      fetchProductById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await request(`/products/${id}`, 'GET');
          set({ product: res.data || null, loading: false });
        } catch (err) {
          set({ error: err.response?.data?.message || err.message || 'Failed to fetch product', loading: false });
        }
      },

      // Fetch a single product by slug
      fetchProductBySlug: async (slug) => {
        if (!slug) return;
        set({ loading: true, error: null });
        
        try {
          const res = await request(`/products/${encodeURIComponent(slug)}`, 'GET');
          const data = res.data || null;
          set({ product: data, loading: false });
          return data;
        } catch (err) {
          console.error("Registry access failed:", err);
          set({ 
            error: err.response?.data?.message || err.message || 'Registry access failed', 
            loading: false 
          });
        }
      },

      // Fetch products by category
      fetchProductsByCategory: async (categoryId) => {
        if (get().products.length === 0) {
          set({ loading: true });
        }
        set({ error: null });
        try {
          const res = await request(`/categories/${categoryId}/products`, 'GET');
          set({ products: res.data || [], loading: false });
        } catch (err) {
          set({ error: err.response?.data?.message || err.message || 'Failed to fetch products', loading: false });
        }
      },

      // Fetch products by store
      fetchProductsByStore: async (storeId) => {
        if (get().products.length === 0) {
          set({ loading: true });
        }
        set({ error: null });
        try {
          const res = await request(`/products?store_id=${storeId}`, 'GET');
          set({ products: res.data || [], loading: false });
        } catch (err) {
          console.error('Failed to fetch products by store:', err);
          set({ error: err.message, loading: false });
        }
      },

      // Fetch products with multi-faceted filtering
      fetchProductsByFilters: async (filters = {}) => {
        const { 
          categoryId = 'all', 
          storeId = 'all', 
          brandId = 'all', 
          search = '', 
          minPrice = '', 
          maxPrice = '', 
          colorId = 'all', 
          sizeId = 'all',
          promotionId = null,
          promotionName = '',
          eventName = '',
          silent = false
        } = filters;

        if (!silent && get().products.length === 0) set({ loading: true });
        set({ error: null });
        
        try {
          let url = (categoryId === 'all') ? '/products' : `/categories/${categoryId}/products`;
          
          const queryParams = new URLSearchParams();
          if (storeId && storeId !== 'all') queryParams.append('store_id', storeId);
          if (brandId && brandId !== 'all') queryParams.append('brand_id', brandId);
          if (colorId && colorId !== 'all') queryParams.append('color_id', colorId);
          if (sizeId && sizeId !== 'all') queryParams.append('size_id', sizeId);
          if (search) queryParams.append('search', search);
          if (minPrice) queryParams.append('min_price', minPrice);
          if (maxPrice) queryParams.append('max_price', maxPrice);
          if (promotionId) queryParams.append('promotion_id', promotionId);
          if (promotionName) queryParams.append('promotion_name', promotionName);
          if (eventName) queryParams.append('event_name', eventName);
          if (filters.hasPromotion) queryParams.append('has_promotion', '1');
          
          const fullUrl = url + (queryParams.toString() ? `?${queryParams.toString()}` : '');

          const res = await request(fullUrl, 'GET');
          const products = res.data || (Array.isArray(res) ? res : []);
          set({ products: Array.isArray(products) ? products : [], loading: false });
        } catch (err) {
          set({ error: err.message || 'Failed to fetch registry results', loading: false });
        }
      },

      // Alias for backward compatibility
      fetchProductsByCategoryAndStore: async (categoryId, storeId = null) => {
        return get().fetchProductsByFilters({ categoryId, storeId });
      },

      // Create a product
      createProduct: async (data) => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          for (const key in data) {
            if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
              if (key === 'images' && Array.isArray(data[key])) {
                data[key].forEach((file) => formData.append('images[]', file));
              } else {
                formData.append(key, data[key]);
              }
            }
          }
          const res = await request('/products', 'POST', formData);
          const newProduct = res.data;
          set((state) => ({ 
            products: [...state.products, newProduct], 
            loading: false 
          }));
          return newProduct;
        } catch (err) {
          const errorData = err.response?.data;
          const errorMessage = errorData?.errors 
            ? Object.values(errorData.errors).flat().join(' ') 
            : (errorData?.message || err.message || 'Failed to create product');
          
          set({ error: errorMessage, loading: false });
          throw err;
        }
      },

      // Update a product
      updateProduct: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          for (const key in data) {
            if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
              if (key === 'images' && Array.isArray(data[key])) {
                data[key].forEach((file) => formData.append('images[]', file));
              } else if (key !== 'images') {
                formData.append(key, data[key]);
              }
            }
          }
          formData.append('_method', 'PUT'); 
          const res = await request(`/products/${id}`, 'POST', formData);
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? res.data : p)),
            loading: false,
          }));
          return res.data;
        } catch (err) {
          const errorData = err.response?.data;
          const errorMessage = errorData?.errors 
            ? Object.values(errorData.errors).flat().join(' ') 
            : (errorData?.message || err.message || 'Failed to update product');
          
          set({ error: errorMessage, loading: false });
          throw err;
        }
      },

      // Delete a product
      deleteProduct: async (id) => {
        set({ loading: true, error: null });
        try {
          await request(`/products/${id}`, 'DELETE');
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            loading: false,
          }));
        } catch (err) {
          set({ error: err.response?.data?.message || err.message || 'Failed to delete product', loading: false });
        }
      },

      // Fetch a category by ID
      fetchCategoryById: async (categoryId) => {
        try {
          const data = await request(`/categories/${categoryId}`, 'GET');
          return data;
        } catch (err) {
          console.error('Failed to fetch category:', err);
          return null;
        }
      },

      // Clear all products from state
      clearProducts: () => set({ products: [] }),
    }),
    {
      name: 'saby-tinh-products',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
