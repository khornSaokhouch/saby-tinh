import { create } from 'zustand';
import { request } from '@/util/request';

export const useAnalyticsStore = create((set) => ({
    analyticsData: null,
    loading: false,
    error: null,

    fetchAnalytics: async () => {
        set({ loading: true, error: null });
        try {
            const res = await request('/admin/dashboard', 'GET');
            if (res.success) {
                set({ analyticsData: res.data, loading: false });
            } else {
                set({ error: res.message || 'Failed to fetch analytics', loading: false });
            }
        } catch (e) {
            set({ error: e.message, loading: false });
        }
    }
}));

export default useAnalyticsStore;
