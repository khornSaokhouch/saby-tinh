import { create } from 'zustand';
import { request } from '@/util/request';

export const useReportByStore = create((set, get) => ({
    stats: null,
    recentOrders: [],
    topProducts: [],
    loading: false,
    error: null,

    fetchReports: async (storeId, dateRange) => {
        if (!storeId) return;

        set({ loading: true, error: null });
        try {
            const [statsRes, ordersRes, productsRes] = await Promise.all([
                request(`/reports/stats?store_id=${storeId}&range=${dateRange}`, 'GET'),
                request(`/reports/recent-orders?store_id=${storeId}&limit=5`, 'GET'),
                request(`/reports/top-products?store_id=${storeId}&limit=5`, 'GET')
            ]);

            set({
                stats: statsRes.data,
                recentOrders: ordersRes.data || [],
                topProducts: productsRes.data || [],
                loading: false
            });
        } catch (e) {
            console.error('Failed to fetch reports:', e);
            set({
                error: e.response?.data?.message || e.message || 'Unable to load reporting data.',
                loading: false
            });
        }
    },
}));
