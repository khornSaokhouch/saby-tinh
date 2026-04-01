import { create } from 'zustand';
import { request } from '@/util/request';

export const usePayoutStore = create((set) => ({
  payouts: [],
  meta: { current_page: 1, last_page: 1, total: 0, per_page: 15 },
  loading: false,
  submitting: false,
  error: null,

  fetchPayouts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await request('/payouts', 'GET', null, { params });
      if (res.success) {
        const p = res.data;
        set({
          payouts: p.data ?? [],
          meta: {
            current_page: p.current_page,
            last_page: p.last_page,
            total: p.total,
            per_page: p.per_page,
          },
          loading: false,
        });
      }
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  /**
   * Generate Bakong QR Code for a store payout
   */
  generatePayoutQr: async (storeId, amount, currency = 'USD') => {
    try {
      const res = await request('/admin/payouts/generate-qr', 'POST', {
        store_id: Number(storeId),
        amount: parseFloat(amount),
        currency,
      });
      return res;
    } catch (e) {
      if (e.response && e.response.data) {
        throw new Error(e.response.data.message || JSON.stringify(e.response.data.errors) || 'Failed to generate QR');
      }
      throw e;
    }
  },

  /**
   * Bulk-create payouts for multiple invoices via a single DB transaction endpoint.
   * invoices    = array of invoice objects (must have id, total_amount)
   * storeId     = the store's id
   * currency    = 'USD' | 'KHR'
   * paymentStatusId = the "paid" payment_status id (typically 2)
   */
  bulkPayout: async (invoices, storeId, currency = 'USD', paymentStatusId = 2) => {
    set({ submitting: true, error: null });
    try {
      const res = await request('/payouts/bulk', 'POST', {
        store_id: Number(storeId),
        currency,
        payment_status_id: paymentStatusId,
        payouts: invoices.map((inv) => ({
          invoice_id: inv.id,
          amount: parseFloat(inv.total_amount || 0),
        })),
      });
      set({ submitting: false });
      // res = { success, total, created_count, failed_count, failed_ids }
      return {
        success: res.success ?? false,
        total: res.total ?? invoices.length,
        failed: res.failed_count ?? 0,
      };
    } catch (e) {
      set({ error: e.message, submitting: false });
      throw e;
    }
  },

  /**
   * Fetch a single payout by ID
   */
  fetchPayoutDetail: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/payouts/${id}`, 'GET');
      set({ loading: false });
      return res;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },
}));

export default usePayoutStore;
