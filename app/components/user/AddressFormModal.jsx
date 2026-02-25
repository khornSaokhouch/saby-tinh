"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  MapPin, 
  Home, 
  Hash, 
  Globe, 
  Check, 
  Loader2,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { request } from "@/util/request";

export default function AddressFormModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    house_number: "",
    street: "",
    commune: "",
    district: "",
    province: "",
    country_id: 1,
    latitude: null,
    longitude: null,
  });

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCountries, setFetchingCountries] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFetchingCountries(true);
      request("/countries", "GET")
        .then((res) => {
          setCountries(res?.data || res || []);
        })
        .finally(() => setFetchingCountries(false));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        country_id: parseInt(formData.country_id, 10),
      };
      await onSave(payload);
      onClose();
      // Reset form
      setFormData({
        house_number: "",
        street: "",
        commune: "",
        district: "",
        province: "",
        country_id: 1,
        latitude: null,
        longitude: null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[40px] w-full max-w-xl relative z-10 shadow-2xl overflow-hidden border border-white"
          >
            <div className="px-8 pt-8 pb-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                    New Destination
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Register a new logistic endpoint
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Home className="w-3 h-3 text-indigo-500" /> House / Unit
                  </label>
                  <input
                    required
                    name="house_number"
                    value={formData.house_number}
                    onChange={handleChange}
                    placeholder="e.g. 12A"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Hash className="w-3 h-3 text-indigo-500" /> Street
                  </label>
                  <input
                    required
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Street name"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Commune / Sangkat
                  </label>
                  <input
                    required
                    name="commune"
                    value={formData.commune}
                    onChange={handleChange}
                    placeholder="Commune name"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    District / Khan
                  </label>
                  <input
                    required
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="District name"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Province / City
                  </label>
                  <input
                    required
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    placeholder="e.g. Phnom Penh"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Globe className="w-3 h-3 text-indigo-500" /> Country
                  </label>
                  <select
                    required
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all appearance-none"
                  >
                    {fetchingCountries ? (
                      <option>Loading...</option>
                    ) : (
                      countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between gap-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="px-12 py-4 bg-slate-900 text-white rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200 flex items-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Verify & Add
                      <Plus className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
