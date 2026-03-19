import { create } from 'zustand';
import { request } from '@/util/request';

export const usePaywayStore = create((set) => ({
    products: [],
    merchantId: '',
    loading: false,
    error: null,
    qrResponse: null,
    status: 'idle', // idle, loading, success, error

    fetchSettings: async () => {
        set({ loading: true, error: null, status: 'loading' });
        try {
            const res = await request('/payway/products', 'GET');
            if (res.success) {
                set({ merchantId: res.merchantId, status: 'success' });
            }
        } catch (err) {
            set({ error: err.message, status: 'error' });
        } finally {
            set({ loading: false });
        }
    },

    generateQr: async (data) => {
        set({ loading: true, error: null, qrResponse: null, status: 'loading' });
        console.log('PayWay Generate QR Request:', data);
        try {
            const res = await request('/payway/generate-qr', 'POST', data);
            console.log('PayWay Generate QR Success:', res);
            set({ qrResponse: res, status: 'success' });
            return res;
        } catch (err) {
            console.error('PayWay Generate QR Error:', err.response?.data || err.message);
            const msg = err.response?.data?.response?.error || err.response?.data?.message || err.message;
            set({ error: msg, status: 'error' });
            throw new Error(msg);
        } finally {
            set({ loading: false });
        }
    },

    checkTransaction: async (tran_id) => {
        set({ loading: true, error: null, status: 'loading' });
        try {
            const res = await request('/payway/check-transaction', 'POST', { tran_id });
            set({ status: 'success' });
            return res;
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            set({ error: msg, status: 'error' });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    clearError: () => set({ error: null, status: 'idle' }),
    clearQrResponse: () => set({ qrResponse: null, status: 'idle' }),
}));
