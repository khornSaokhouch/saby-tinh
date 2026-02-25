import { create } from "zustand";
import { request } from "@/util/request";

export const useSellerStore = create((set, get) => ({
  form: {
    fullName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    streetAddress: "",
    countryRegion: "",
    document: null,
  },
  loading: false,
  error: null,
  success: null,
  pendingCount: 0,
  sellers: [],

  // 🔹 Fetch all sellers (for admin)
  fetchSellers: async () => {
    set({ loading: true });
    try {
      const res = await request("/sellers", "GET");
      set({ sellers: Array.isArray(res) ? res : [], loading: false });
    } catch (error) {
      set({ error: "Failed to fetch sellers list", loading: false });
    }
  },

  // 🔹 Fetch pending count for admin
  fetchPendingCount: async () => {
    try {
      const res = await request("/sellers/pending-count", "GET");
      if (res && res.count !== undefined) {
        set({ pendingCount: res.count });
      }
    } catch (error) {
      console.error("Failed to fetch pending count:", error);
    }
  },

  // 🔹 Handle text input changes
  handleChange: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      form: { ...state.form, [name]: value },
      error: null,
      success: null,
    }));
  },

  // 🔹 Handle file input (PDF/Word)
  handleFileChange: (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Only allow PDF or Word
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      set({ error: "Invalid file type. Only PDF or Word allowed." });
      return;
    }

    set((state) => ({
      form: { ...state.form, document: file },
      error: null,
      success: null,
    }));
  },

  // 🔹 Submit form with file to Laravel backend
  submitForm: async () => {
    set({ loading: true, error: null, success: null });

    try {
      const { form } = get();
      
      if (!form.document) {
        set({ error: "Please upload your business license document.", loading: false });
        return;
      }

      const formData = new FormData();
      formData.append("name", form.fullName);
      formData.append("company_name", form.companyName);
      formData.append("email", form.email);
      formData.append("phone_number", form.phoneNumber || "");
      formData.append("street_address", form.streetAddress || "");
      formData.append("country_region", form.countryRegion || "");
      formData.append("document", form.document);

      // The request util will handle multipart/form-data via axios automatic detection
      const res = await request("/sellers", "POST", formData);

      set({
        success: res.message || "Your seller request has been submitted successfully!",
        loading: false,
        error: null,
        form: {
          fullName: "",
          companyName: "",
          email: "",
          phoneNumber: "",
          streetAddress: "",
          countryRegion: "",
          document: null,
        },
      });
    } catch (error) {
      console.error("Seller request error:", error);
      let message = "Something went wrong. Please try again.";
      if (error.response?.data?.message) message = error.response.data.message;
      if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          message = Object.values(errors).flat().join(", ");
      }

      set({ error: message, loading: false });
    }
  },

  // 🔹 Approve a seller
  approveSeller: async (id) => {
    set({ loading: true, error: null, success: null });
    try {
      await request(`/sellers/${id}/approve`, "POST");
      set((state) => ({
        sellers: state.sellers.map((s) => 
          s.id === id ? { ...s, status: "approved" } : s
        ),
        loading: false,
        success: "Seller approved successfully!",
        pendingCount: Math.max(0, state.pendingCount - 1)
      }));
    } catch (error) {
      set({ error: "Failed to approve seller", loading: false });
    }
  },

  // 🔹 Reject a seller
  rejectSeller: async (id) => {
    set({ loading: true, error: null, success: null });
    try {
      await request(`/sellers/${id}/reject`, "POST");
      set((state) => ({
        sellers: state.sellers.filter((s) => s.id !== id),
        loading: false,
        success: "Seller rejected and deleted successfully!",
        pendingCount: Math.max(0, state.pendingCount - 1)
      }));
    } catch (error) {
      set({ error: "Failed to reject seller", loading: false });
    }
  },

  // 🔹 Delete a seller
  deleteSeller: async (id) => {
    set({ loading: true, error: null, success: null });
    try {
      await request(`/sellers/${id}`, "DELETE");
      set((state) => ({
        sellers: state.sellers.filter((s) => s.id !== id),
        loading: false,
        success: "Seller record deleted successfully!"
      }));
    } catch (error) {
      set({ error: "Failed to delete seller record", loading: false });
    }
  },
}));
