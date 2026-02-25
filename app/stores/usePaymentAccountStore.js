import { create } from 'zustand';
import { request } from '@/util/request'; // adjust path if needed

export const usePaymentAccountStore = create((set, get) => ({
  paymentAccounts: [],
  loading: false,
  error: null,
  search: '',

  /* =========================
     Fetch all payment accounts
     ========================= */
  fetchPaymentAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/payment-accounts', 'GET', null, false);
      const list = Array.isArray(res) ? res : res?.data || [];
      set({ paymentAccounts: list, loading: false });
    } catch (e) {
      set({
        error: e.response?.data?.message || e.message || 'Failed to fetch payment accounts',
        loading: false,
      });
    }
  },

  /* =========================
     Search
     ========================= */
  setSearch: (value) => set({ search: value }),

  /* =========================
     Create / Update payment account
     ========================= */
  savePaymentAccount: async (account) => {
    try {
      let url = '/payment-accounts';
      let method = 'POST';

      // Update uses POST /payment-accounts/{id} (per your route)
      if (account.id) {
        url = `/payment-accounts/${account.id}`;
        method = 'POST';
      }

      const payload = {
        account_name: account.account_name,
        account_id: account.account_id,
        type_value: account.type_value,
        account_city: account.account_city,
        currency: account.currency,
        status: account.status ?? true,
      };

      await request(url, method, payload);
      await get().fetchPaymentAccounts();
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || 'Failed to save payment account' });
      throw err;
    }
  },

  /* =========================
     Delete payment account
     ========================= */
  deletePaymentAccount: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/payment-accounts/${id}`, 'DELETE');
      await get().fetchPaymentAccounts();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete payment account',
        loading: false,
      });
      throw err;
    }
  },
}));
