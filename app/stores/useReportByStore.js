import { create } from 'zustand';
import { request } from '@/util/request';

const useReportByStore = create((set) => ({
    recentOrders: [],
    topProducts: [],
    topCustomers: [],
    analytics: null, // New comprehensive analytics state
    dashboardData: null, // New dashboard pulse state
    loading: false,
    error: null,

    fetchDashboardData: async (storeId) => {
        set({ loading: true, error: null });
        try {
            const res = await request(`/reports/dashboard?store_id=${storeId}`, 'GET');
            if (res.success) {
                set({ dashboardData: res.data, loading: false });
            } else {
                set({ error: res.message, loading: false });
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchAnalytics: async (storeId, range = 'thisYear') => {
        set({ loading: true, error: null });
        try {
            const res = await request(`/reports/analytics?store_id=${storeId}&range=${range}`, 'GET');
            if (res.success) {
                set({ analytics: res.data, loading: false });
            } else {
                set({ error: res.message, loading: false });
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchReports: async (storeId, dateRange) => {
        if (!storeId) return;

        set({ loading: true, error: null });
        try {
            const [recentRes, topProductsRes, topCustomersRes] = await Promise.all([
                request(`/reports/recent-orders?store_id=${storeId}`, 'GET'),
                request(`/reports/top-products?store_id=${storeId}`, 'GET'),
                request(`/reports/top-customers?store_id=${storeId}`, 'GET')
            ]);

            set({
                recentOrders: recentRes.data || [],
                topProducts: topProductsRes.data || [],
                topCustomers: topCustomersRes.data || [],
                loading: false
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    }
}));

export { useReportByStore };
