"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useAddressStore } from "@/app/stores/useAddressStore";
import { request } from "@/util/request";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Globe, Map as MapIcon, Plus, Pencil, Trash2, Search, ArrowLeft, Navigation, Loader2, Check
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const DynamicMapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100">
      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Initialising Terminal...</p>
    </div>
  ),
});

export default function AddressesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-indigo-600 w-6 h-6" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Logistics...</p>
      </div>
    }>
      <AddressesContent />
    </Suspense>
  );
}

function AddressesContent() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const editId = searchParams.get("editId");
  const showForm = action === "new" || action === "edit";

  return (
    <div className="min-h-[500px] font-sans text-slate-900 pb-8">
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

function AddressList() {
  const { userAddresses, fetchUserAddresses, deleteAddress, loading } = useAddressStore();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchUserAddresses(); }, [fetchUserAddresses]);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this endpoint?")) return;
    setDeletingId(id);
    const res = await deleteAddress(id);
    if (res?.success) toast.success("Removed");
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Shipping Addresses</h1>
            <p className="text-xs text-slate-500 font-medium">Manage your delivery locations and preferences</p>
          </div>
        </div>
        <Link href="/addresses?action=new" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100 flex items-center gap-2">
          <Plus size={16} /> New Address
        </Link>
      </div>

      {loading ? (
        <div className="py-20 bg-white rounded-xl border border-slate-50 flex justify-center"><Loader2 className="animate-spin text-indigo-600 w-6 h-6" /></div>
      ) : userAddresses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {userAddresses.map((addr, i) => (
            <motion.div key={addr.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group bg-white border border-slate-100 rounded-xl p-4 hover:border-indigo-500 transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <MapPin size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate">
                      {[addr.house_number, addr.street].filter(Boolean).join(", ") || "Pinned Location"}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {[addr.commune, addr.district, addr.province].filter(Boolean).join(", ")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {addr.country?.name || "Cambodia"}
                        </span>
                        {addr.latitude && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50">
                            <Navigation size={10} className="fill-indigo-500" /> Map Pin
                          </span>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <Link href={`/addresses?action=edit&editId=${addr.id}`} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                    <Pencil size={14} />
                  </Link>
                  <button onClick={() => handleDelete(addr.id)} disabled={deletingId === addr.id} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                    {deletingId === addr.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
    <div className="bg-slate-50/50 rounded-[24px] border border-slate-100 p-12 flex flex-col items-center text-center">
      <Search size={24} className="text-slate-200 mb-4" />
      <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Archive Empty</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 mb-6">No delivery addresses found.</p>
      <Link href="/addresses?action=new" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md shadow-indigo-100">
        New Endpoint
      </Link>
    </div>
  );
}

function AddressForm({ editId }) {
  const { addAddress, updateAddress, fetchUserAddresses, loading } = useAddressStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");

  const [formData, setFormData] = useState({ house_number: "", street: "", commune: "", district: "", province: "", country_id: "", latitude: "", longitude: "" });
  const [countries, setCountries] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [mapPosition, setMapPosition] = useState([11.5564, 104.9282]);

  useEffect(() => {
    request("/countries", "GET").then((res) => {
      const list = res?.data || res || [];
      setCountries(list);
      if (list.length > 0) setFormData(prev => ({ ...prev, country_id: prev.country_id || list[0].id }));
    });
  }, []);

  useEffect(() => {
    if (editId) {
      fetchUserAddresses().then(() => {
        const addr = useAddressStore.getState().userAddresses.find(a => String(a.id) === String(editId));
        if (addr) {
          const lat = parseFloat(mapLat || addr.latitude || "11.5564");
          const lng = parseFloat(mapLng || addr.longitude || "104.9282");
          setFormData({ house_number: addr.house_number || "", street: addr.street || "", commune: addr.commune || "", district: addr.district || "", province: addr.province || "", country_id: addr.country_id || 1, latitude: lat, longitude: lng });
          setMapPosition([lat, lng]);
        }
      });
    } else if (mapLat && mapLng) {
      const lat = parseFloat(mapLat);
      const lng = parseFloat(mapLng);
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
      setMapPosition([lat, lng]);
    }
  }, [editId, fetchUserAddresses, mapLat, mapLng]);

  const handleLocationSelect = (pos) => {
    setMapPosition(pos);
    setFormData(prev => ({ ...prev, latitude: pos[0], longitude: pos[1] }));
  };

  const handleField = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, country_id: parseInt(formData.country_id, 10) || 1, latitude: formData.latitude !== "" ? parseFloat(formData.latitude) : null, longitude: formData.longitude !== "" ? parseFloat(formData.longitude) : null };
    const res = editId ? await updateAddress(editId, payload) : await addAddress(payload);
    if (res?.success) { toast.success("Saved"); router.push("/addresses"); }
  };

  return (
    <div className="space-y-4">
      <header className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/addresses")} className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors shrink-0">
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">{editId ? "Update" : "New"} Destination</h1>
            <p className="text-xs text-slate-500 font-medium">Configure your shipping coordinates for delivery</p>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="House / Unit" value={formData.house_number} onChange={handleField("house_number")} placeholder="#12A" />
            <InputGroup label="Street" value={formData.street} onChange={handleField("street")} placeholder="Street 271" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Commune" value={formData.commune} onChange={handleField("commune")} placeholder="Sangkat..." />
            <InputGroup label="District" value={formData.district} onChange={handleField("district")} placeholder="Khan..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Province / City" value={formData.province} onChange={handleField("province")} placeholder="e.g. Phnom Penh" required />
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-500 appearance-none" value={formData.country_id} onChange={handleField("country_id")}>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${formData.latitude ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white text-slate-300 border border-slate-100'}`}>
                  <MapIcon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-900 uppercase">Map Pinning</p>
                  <p className="text-[9px] font-bold text-slate-400 truncate">{formData.latitude ? `${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}` : "Visual placement for logistics"}</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowMap(!showMap)}
                className={`px-4 py-2 border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm whitespace-nowrap ${showMap ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'}`}
              >
                {showMap ? "Close Map" : "Open Map"}
              </button>
            </div>

            <AnimatePresence>
              {showMap && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 320, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-50 rounded-2xl border border-slate-100 relative group"
                >
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                    <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-sm shadow-xl">
                      <Navigation size={10} className="text-indigo-400 fill-indigo-400" />
                      Adjust Pin Pointer
                    </div>
                  </div>
                  <DynamicMapPicker position={mapPosition} onLocationSelect={handleLocationSelect} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-50">
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-indigo-600 shadow-lg shadow-slate-100 flex items-center justify-center gap-2 transition-all active:scale-95">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> {editId ? "Confirm Changes" : "Register Location"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, placeholder, required = false }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-200"
      />
    </div>
  );
}