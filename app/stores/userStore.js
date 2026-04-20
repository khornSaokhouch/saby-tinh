import { create } from 'zustand';
import { request } from '@/util/request';
import { useAuthStore } from './authStore';

export const useUserStore = create((set, get) => ({
  user: null, // current logged-in user
  users: [],
  loading: false,
  error: null,

  // -------------------------------
  // Fetch logged-in user's profile
  // -------------------------------
  fetchUser: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ error: 'No token found. Please log in.' });
      return null;
    }
  
    set({ loading: true, error: null });
    try {
      const res = await request('/profile', 'GET'); // interceptor adds token
      set({ user: res.data, loading: false });
      return res.data;
    } catch (err) {
      // console.error("[userStore] fetchUser failed:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        useAuthStore.setState({ token: null, user: null });
      }
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch user',
        loading: false,
      });
      return null;
    }
  },

  // Alias for clarity
  fetchProfile: async () => {
    return await get().fetchUser();
  },

  // -------------------------------
  // Admin: Update user role
  // -------------------------------
  updateUserRole: async (id, role) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("No token found. Please log in.");

    set({ loading: true, error: null });
    try {
      const res = await request(`/users/${id}/role`, "PATCH", { role });
      
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, role } : u)),
        loading: false,
      }));
      
      return res;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw new Error(err.response?.data?.message || err.message || "Role update failed");
    }
  },


  

  // -------------------------------
  // Fetch a user by ID
  // -------------------------------
  fetchUserById: async (id) => {
    const token = useAuthStore.getState().token;
    const currentUser = useAuthStore.getState().user;
    
    if (!token) return null; // cannot fetch without token
  
    // If fetching self, use the profile endpoint to avoid 403
    if (currentUser && String(currentUser.id) === String(id)) {
      return await get().fetchUser();
    }

    try {
      const res = await request(`/users/${id}`, 'GET'); // token automatically added by interceptor
      return res;
    } catch (err) {
      console.error('Error fetching user:', err);
      return null;
    }
  },

  // -------------------------------
  // Fetch all users
  // -------------------------------
  fetchAllUsers: async () => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('No token found. Please log in.');

    set({ loading: true, error: null });
    try {
      const res = await request('/users', 'GET');
      // res is { status: 'success', data: [...], message: ... }
      set({ users: res.data || [], loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch users',
        loading: false,
      });
      return [];
    }
  },

  // -------------------------------
  // Update logged-in user profile
  // -------------------------------
  updateProfile: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      // Laravel usually requires POST for FormData with images even if it's an "update"
      const res = await request(`/users/${id}`, 'POST', formData);
      
      // Update state
      set({ 
        user: res.data, // res.data is the updated user from controller successResponse
        loading: false 
      });
      
      // Also update in users list if it exists
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? res.data : u)),
      }));

      return res;
    } catch (err) {
      console.error("[userStore] updateProfile failed:", err.response?.data || err.message);
      set({ loading: false, error: err.response?.data?.message || err.message });
      throw err;
    }
  },

  // -------------------------------
  // Update user (Legacy/Alias)
  // -------------------------------
  updateUser: async (updatedData) => {
    const currentUser = get().user;
    if (!currentUser) throw new Error('No logged-in user');
    return await get().updateProfile(currentUser.id, updatedData);
  },

  // -------------------------------
  // Create a user
  // -------------------------------
  createUser: async (userData) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('No token found. Please log in.');

    set({ loading: true, error: null });
    try {
      const res = await request('/users', 'POST', userData);
      set((state) => ({
        users: [...state.users, res.data], // res.data contains the new user
        loading: false,
      }));
      return res;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // -------------------------------
  // Update user by ID (Admin)
  // -------------------------------
  updateUserById: async (id, updatedData) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('No token found. Please log in.');

    set({ loading: true, error: null });
    try {
      // POST request to update user (using POST for FormData/Image handling in Laravel)
      const res = await request(`/users/${id}`, 'POST', updatedData); 
      
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? res.data : u)),
        loading: false,
      }));
      return res;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // -------------------------------
  // Delete a user
  // -------------------------------
  deleteUser: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('No token found. Please log in.');

    set({ loading: true, error: null });
    try {
      await request(`/users/${id}`, 'DELETE');
      set((state) => ({
        users: state.users.filter((user) => (user.user_id ?? user.id) !== id),
        loading: false,
      }));
    } catch (err) {
      console.error('Error deleting user:', err);
      set({ error: err.message || 'Failed to delete user', loading: false });
      throw err;
    }
  },

  // -------------------------------
  // Owner: Team Management
  // -------------------------------
  fetchTeamMembers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/owner/team', 'GET');
      // res is { success: true, data: [...], ... }
      set({ users: res.data || [], loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false, error: err.message });
      return [];
    }
  },

  fetchStoreMembers: async (storeId) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/admin/stores/${storeId}/members`, 'GET');
      // We return this specifically so the caller can manage local state if needed
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false, error: err.message });
      return { success: false, message: err.message };
    }
  },

  addTeamMember: async (memberData) => {
    set({ loading: true, error: null });
    try {
      const res = await request('/owner/team/add', 'POST', memberData);
      set((state) => ({
        users: [...state.users, res.data],
        loading: false
      }));
      return res;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  updateTeamMember: async (id, memberData) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/owner/team/update/${id}`, 'POST', memberData);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? res.data : u)),
        loading: false
      }));
      return res;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  batchDeleteTeamMembers: async (ids) => {
    set({ loading: true, error: null });
    try {
      const res = await request('/owner/team/batch-delete', 'POST', { ids });
      set((state) => ({
        users: state.users.filter((u) => !ids.includes(u.id)),
        loading: false
      }));
      return res;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // -------------------------------
  // Clear state
  // -------------------------------
  clearUser: () => set({ user: null, loading: false, error: null }),
  clearUsers: () => set({ users: [], loading: false, error: null }),
}));
