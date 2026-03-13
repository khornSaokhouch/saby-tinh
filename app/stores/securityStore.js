import { create } from 'zustand';
import { request } from '@/util/request';

export const useSecurityStore = create((set) => ({
  loginHistory: [],
  loadingHistory: false,
  error: null,

  fetchLoginHistory: async () => {
    set({ loadingHistory: true, error: null });
    try {
      // The request util signature is request(url, method, data, config)
      const response = await request('/user/login-history', 'GET');
      if (response.status === 'success') {
        set({ loginHistory: response.data, loadingHistory: false });
      } else {
        set({ error: 'Failed to load login history', loadingHistory: false });
      }
    } catch (error) {
      console.error('Failed to load login history:', error);
      set({ error: error.message || 'Error occurred', loadingHistory: false });
    }
  },

  logoutAllDevices: async () => {
    set({ loadingHistory: true, error: null });
    try {
      const response = await request('/logout-all', 'POST');
      if (response.success) {
        // Refresh history after logout all
        const historyResponse = await request('/user/login-history', 'GET');
        set({ loginHistory: historyResponse.data, loadingHistory: false });
        return true;
      }
      set({ loadingHistory: false });
      return false;
    } catch (error) {
      console.error('Failed to logout all devices:', error);
      set({ error: error.message || 'Error occurred', loadingHistory: false });
      return false;
    }
  },

  terminateSession: async (sessionId) => {
    try {
      const response = await request(`/sessions/${sessionId}`, 'DELETE');
      if (response.success) {
        // Remove the session from local state to avoid full reload
        set((state) => ({
          loginHistory: state.loginHistory.filter((s) => s.id !== sessionId)
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to terminate session:', error);
      set({ error: error.message || 'Error occurred' });
      return false;
    }
  },

  terminateMultipleSessions: async (sessionIds) => {
    set({ loadingHistory: true, error: null });
    try {
      const response = await request('/sessions/terminate-multiple', 'POST', { session_ids: sessionIds });
      if (response.success) {
        set((state) => ({
          loginHistory: state.loginHistory.filter((s) => !sessionIds.includes(s.id)),
          loadingHistory: false
        }));
        return true;
      }
      set({ loadingHistory: false });
      return false;
    } catch (error) {
      console.error('Failed to terminate multiple sessions:', error);
      set({ error: error.message || 'Error occurred', loadingHistory: false });
      return false;
    }
  }
}));
