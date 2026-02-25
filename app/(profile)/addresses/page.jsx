"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useAddressStore } from "@/app/stores/useAddressStore";
import { request } from "@/util/request";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Home, Hash, Check, Loader2,
  Globe, Map as MapIcon, Plus, Pencil, Trash2, Search, ArrowLeft, Navigation
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// ──────────────────────────────────────────────
// Root page — wraps everything in Suspense
// ──────────────────────────────────────────────
export default function AddressesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 w-8 h-8 mb-4" />
        <p className="text-sm font-medium text-slate-500">Loading your addresses...</p>
      </div>
    }>
      <AddressesContent />
    </Suspense>
  );
}

// ──────────────────────────────────────────────
// Main content
// ──────────────────────────────────────────────
function AddressesContent() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const editId = searchParams.get("editId");

  const showForm = action === "new" || action === "edit";

  return (
    <div className="min-h-[600px] p-4 md:p-10 max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <AddressForm editId={editId} />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <AddressList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────
// Address LIST view
// ──────────────────────────────────────────────
function AddressList() {
  const { userAddresses, fetchUserAddresses, deleteAddress, loading } = useAddressStore();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUserAddresses();
  }, [fetchUserAddresses]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this address?")) return;
    setDeletingId(id);
    const res = await deleteAddress(id);
    if (res?.success) toast.success("Address removed successfully");
    else toast.error(res?.message || "Could not remove address");
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shipping Addresses
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your delivery locations for a faster checkout.
          </p>
        </div>

        <Link
          href="/addresses?action=new"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} />
          Add New Address
        </Link>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="animate-spin text-indigo-600 w-8 h-8 mb-4" />
        </div>
      ) : userAddresses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {userAddresses.map((addr, i) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white border border-slate-200 rounded-[24px] p-6 hover:border-indigo-600 transition-all hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {[addr.house_number, addr.street].filter(Boolean).join(", ") || "Untitled Location"}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {[addr.commune, addr.district, addr.province].filter(Boolean).join(", ")}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                        {addr.country?.name || "Cambodia"}
                        </span>
                        {addr.latitude && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                <Navigation size={10} /> Pinned on Map
                            </span>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/addresses?action=edit&editId=${addr.id}`}
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    disabled={deletingId === addr.id}
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all disabled:opacity-50"
                  >
                    {deletingId === addr.id
                      ? <Loader2 size={18} className="animate-spin" />
                      : <Trash2 size={18} />
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-[40px] border border-slate-200 p-16 flex flex-col items-center justify-center text-center shadow-sm">
      <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
        <Search size={32} className="text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">No addresses found</h3>
      <p className="text-slate-500 font-medium mt-2 mb-8 max-w-xs">
        Add a delivery address so we know where to send your items.
      </p>
      <Link
        href="/addresses?action=new"
        className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
      >
        <Plus size={20} />
        Add your first address
      </Link>
    </div>
  );
}

// ──────────────────────────────────────────────
// Address FORM
// ──────────────────────────────────────────────
function AddressForm({ editId }) {
  const { addAddress, updateAddress, fetchUserAddresses, loading } = useAddressStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");

  const [formData, setFormData] = useState({
    house_number: "",
    street: "",
    commune: "",
    district: "",
    province: "",
    country_id: "",
    latitude: "",
    longitude: "",
  });
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    request("/countries", "GET").then((res) => {
      const list = res?.data || res || [];
      setCountries(list);
      if (list.length > 0) {
        setFormData(prev => ({ ...prev, country_id: prev.country_id || list[0].id }));
      }
    });
  }, []);

  useEffect(() => {
    if (editId) {
      fetchUserAddresses().then(() => {
        const addr = useAddressStore.getState().userAddresses.find(a => String(a.id) === String(editId));
        if (addr) {
          setFormData({
            house_number: addr.house_number || "",
            street: addr.street || "",
            commune: addr.commune || "",
            district: addr.district || "",
            province: addr.province || "",
            country_id: addr.country_id || 1,
            latitude: mapLat || addr.latitude || "",
            longitude: mapLng || addr.longitude || "",
          });
        }
      });
    } else if (mapLat && mapLng) {
      setFormData(prev => ({ ...prev, latitude: mapLat, longitude: mapLng }));
    }
  }, [editId, fetchUserAddresses, mapLat, mapLng]);

  const handleField = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      country_id: parseInt(formData.country_id, 10) || 1,
      latitude: formData.latitude !== "" ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude !== "" ? parseFloat(formData.longitude) : null,
    };

    const res = editId ? await updateAddress(editId, payload) : await addAddress(payload);

    if (res?.success) {
      toast.success(editId ? "Address updated!" : "New address saved!");
      router.push("/addresses");
    } else {
      toast.error(res?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center gap-4">
        <button onClick={() => router.push("/addresses")} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {editId ? "Edit Address" : "Add New Address"}
          </h1>
          <p className="text-slate-500 font-medium">Please enter your delivery details below.</p>
        </div>
      </header>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="House / Unit Number" value={formData.house_number} onChange={handleField("house_number")} placeholder="e.g. #34A" />
            <InputGroup label="Street Name" value={formData.street} onChange={handleField("street")} placeholder="e.g. Street 123" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Commune (Sangkat)" value={formData.commune} onChange={handleField("commune")} placeholder="Enter commune" />
            <InputGroup label="District (Khan)" value={formData.district} onChange={handleField("district")} placeholder="Enter district" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Province / City" value={formData.province} onChange={handleField("province")} placeholder="e.g. Phnom Penh" required />
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Country</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all appearance-none"
                  value={formData.country_id}
                  onChange={handleField("country_id")}
                >
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData.latitude ? 'bg-indigo-600 text-white' : 'bg-white text-slate-300 border border-slate-200'}`}>
                <MapIcon size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Map Location</p>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {formData.latitude ? "Location pinned successfully" : "Pin your exact location for easier delivery"}
                </p>
              </div>
            </div>
            <Link
              href={`/google-map?lat=${formData.latitude || 11.5564}&lng=${formData.longitude || 104.9282}&from=add${editId ? `&editId=${editId}` : ""}`}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all text-center shadow-sm"
            >
              Open Map
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/addresses")}
              className="px-8 py-4 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> {editId ? "Update Address" : "Save Address"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, placeholder, required = false }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
      />
    </div>
  );
}