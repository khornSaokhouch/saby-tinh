import { create } from 'zustand';
import { request } from '@/util/request';

const useDashboardStore = create((set) => ({
    dashboardData: {
        totals: {
            revenue: { value: "$0.00", trend: "0%", isPositive: true },
            orders: { value: "0", trend: "0%", isPositive: true },
            customers: { value: "0", trend: "0%", isPositive: true },
            products_sold: { value: "0", trend: "0%", isPositive: true }
        },
        revenue_chart: [],
        recent_orders: [],
        alerts: []
    },
    loading: false,
    error: null,

    fetchDashboardData: async () => {
        set({ loading: true, error: null });
        try {
            const res = await request('/admin/dashboard', 'GET');
            if (res.success) {
                set({ dashboardData: res.data, loading: false });
            } else {
                set({ error: 'Failed to fetch dashboard data', loading: false });
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    }
}));

export default useDashboardStore;
