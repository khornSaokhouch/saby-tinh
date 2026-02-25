import { create } from "zustand";
import { request } from "@/util/request";

export const useShoppingCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/cart", "GET");
      if (res.success) {
        set({ cart: res.data, loading: false });
      } else {
        set({ error: res.message, loading: false });
      }
    } catch (err) {
      set({ error: err.message || "Failed to fetch cart", loading: false });
    }
  },

  addToCart: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await request("/cart/add", "POST", payload);
      if (res.success) {
        // Refresh cart to get updated state
        await get().fetchCart();
        return res.data;
      } else {
        set({ error: res.message, loading: false });
        return null;
      }
    } catch (err) {
      set({ error: err.message || "Failed to add to cart", loading: false });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity < 1) return;

    const previousCart = get().cart;
    
    // Optimistic Update
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      },
    }));

    try {
      const res = await request(`/cart/items/${itemId}`, "PATCH", { quantity });
      if (!res.success) {
        // Revert on server error
        set({ cart: previousCart, error: res.message });
      }
    } catch (err) {
      // Revert on network error
      set({ 
        cart: previousCart, 
        error: err.message || "Failed to update quantity" 
      });
    }
  },

  removeItem: async (itemId) => {
    const previousCart = get().cart;

    // Optimistic Update
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.filter((item) => item.id !== itemId),
      },
    }));

    try {
      const res = await request(`/cart/items/${itemId}`, "DELETE");
      if (!res.success) {
        set({ cart: previousCart, error: res.message });
      }
    } catch (err) {
      set({ 
        cart: previousCart, 
        error: err.message || "Failed to remove item" 
      });
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/cart", "DELETE");
      if (res.success) {
        set({ cart: { ...get().cart, items: [] }, loading: false });
      } else {
        set({ error: res.message, loading: false });
      }
    } catch (err) {
      set({ error: err.message || "Failed to clear cart", loading: false });
    } finally {
      set({ loading: false });
    }
  },
}));
