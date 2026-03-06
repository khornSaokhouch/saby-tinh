import { create } from "zustand";
import { request } from "@/util/request";

export const usePaymentStore = create((set) => ({
  loading: false,
  error: null,
  qrData: null,
  paymentStatus: null,

  generateBakongQr: async (orderId, paymentAccountId, currency = "USD") => {
    set({ loading: true, error: null, qrData: null });
    try {
      const res = await request("/bakong/generate-qr", "POST", {
        order_id: orderId,
        payment_account_id: paymentAccountId,
        currency: currency,
      });

      if (res.success) {
        set({ qrData: res.data, loading: false });
        return { success: true, data: res.data };
      } else {
        set({ error: res.message, loading: false });
        return { success: false, message: res.message };
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to generate QR";
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  checkBakongStatus: async (md5) => {
    try {
      const res = await request("/bakong/check-status", "POST", { md5 });
      if (res.success) {
        set({ paymentStatus: res.status });
        return { success: true, status: res.status };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  resetPayment: () => set({ qrData: null, paymentStatus: null, error: null }),
}));
