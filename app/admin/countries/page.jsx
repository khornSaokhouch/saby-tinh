'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Globe, Plus, Pencil, Trash2, Search, Loader2,
  ShieldAlert, CheckCircle2 , X, Check, RefreshCw
} from 'lucide-react';
import { useCountryStore } from '@/stores/useCountryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function AdminCountriesPage() {
  const { countries, fetchCountries, createCountry, updateCountry, deleteCountry, loading, error } = useCountryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchCountries();

    const interval = setInterval(() => {
      fetchCountries();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchCountries]);

  const filteredCountries = useMemo(() => {
    return countries.filter(c =>
      String(c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  const handleOpenCreate = () => {
    setEditingCountry(null);
    setShowForm(true);
  };

  const handleOpenEdit = (country) => {
    setEditingCountry(country);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    const res = await deleteCountry(id);
    if (res?.success) {
      toast.success('Country deleted');
    } else {
      toast.error(res?.message || 'Failed to delete');
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Reach Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Country <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-400">Registry</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Maintain and manage global shipping regions and geographic data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchCountries()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>

          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={14} strokeWidth={3} /> Add Country
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard label="Global Registry" value={countries.length} icon={Globe} color="indigo" />
        <MetricCard label="Registry Status" value="Stable" icon={CheckCircle2} color="emerald" subText="Verified" />
      </div>

      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20">
          <div className="relative w-full sm:w-64 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={13} />
            <input
              type="text"
              placeholder="Search by country name..."
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {filteredCountries.length} Regions Traceable
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Internal Designation</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center min-w-[140px]">Registration Data</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && countries.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 opacity-20" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold border border-rose-100 uppercase tracking-widest">
                      <ShieldAlert size={14} /> Error: {error}
                    </div>
                  </td>
                </tr>
              ) : filteredCountries.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">No regions found</td>
                </tr>
              ) : (
                filteredCountries.map((country, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                    key={country.id} className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center border border-white shadow-sm overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                           <Globe size={14} className="text-slate-400" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{country.name}</span>
                          <span className="text-[9px] font-black text-slate-400 mt-0.5 tracking-widest uppercase opacity-70">UID: {country.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-700">
                           {country.created_at ? new Date(country.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </span>
                        {country.created_at && (
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            at {new Date(country.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(country)}
                          className="p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-sm active:scale-95 transition-all"
                        >
                          <Pencil size={14} strokeWidth={3} />
                        </button>

                         <AnimatePresence mode="wait" initial={false}>
                          {confirmDeleteId === country.id ? (
                            <motion.div
                              key="confirm-delete"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1.5"
                            >
                              <button
                                onClick={() => handleDelete(country.id)}
                                disabled={deletingId === country.id}
                                className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                              >
                                {deletingId === country.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="p-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg shadow-sm active:scale-95 transition-all"
                              >
                                <X size={14} strokeWidth={3} />
                              </button>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="delete-button"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              onClick={() => setConfirmDeleteId(country.id)}
                              className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-all active:scale-95"
                            >
                              <Trash2 size={14} strokeWidth={3} />
                            </motion.button>
                          )}
                         </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
             Showing: {filteredCountries.length} Regions
           </span>
           <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
             Registry Sync
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <CountryFormModal
            country={editingCountry}
            onClose={() => { setShowForm(false); setEditingCountry(null); }}
            onCreate={createCountry}
            onUpdate={updateCountry}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────
// Country Form Modal
// ──────────────────────────────────────────────
function CountryFormModal({ country, onClose, onCreate, onUpdate }) {
  const [name, setName] = useState(country?.name || '');
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100"
      >
        <div className="p-8 font-sans">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100">
               <Globe size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {country ? 'Update Region' : 'Register Country'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Geographic identity</p>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!name.trim()) return toast.error('Designation is required');
            setSubmitting(true);
            const res = country ? await onUpdate(country.id, { name: name.trim() }) : await onCreate({ name: name.trim() });
            if (res?.success) {
              toast.success(country ? 'Region updated' : 'Country registered');
              onClose();
            } else {
              toast.error(res?.message || 'Operation failed');
            }
            setSubmitting(false);
          }} className="space-y-6">
            
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                Country Designation
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={submitting}
                placeholder="e.g. Cambodia"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-3.5 rounded-2xl text-[10px] font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 uppercase tracking-widest transition-all active:scale-95"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-3.5 bg-emerald-500 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-[0.95] hover:bg-emerald-600"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={14} strokeWidth={3} />
                )}
                {country ? 'Sync Region' : 'Register Region'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Metric Card
// ──────────────────────────────────────────────
function MetricCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    purple: 'bg-purple-600 shadow-purple-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500 text-left">
      <div className={`p-2 rounded-xl w-8 h-8 flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10 ${themes[color] || themes.indigo}`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <div className="flex items-baseline gap-2 relative z-10">
        <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
        {subText && <span className="text-[9px] font-bold text-slate-400">{subText}</span>}
      </div>
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out opacity-50" />
    </div>
  );
}