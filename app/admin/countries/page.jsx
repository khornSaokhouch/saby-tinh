'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Globe, Plus, Pencil, Trash2, Search, Loader2,
  ShieldAlert, MapPin, X, Check, RefreshCw
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
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 font-sans animate-in fade-in duration-500 pt-4">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Reach</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Countries <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-400">Registry</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchCountries()}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Registry"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} strokeWidth={2.5} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            Add Country
          </button>
        </div>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <MetricCard label="Global Registry" value={countries.length} icon={Globe} color="indigo" />
        <MetricCard label="Contextual Range" value={filteredCountries.length} icon={MapPin} color="purple" />
      </div>

      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
            <input
              type="text"
              placeholder="Search by country name..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium text-slate-700 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            {filteredCountries.length} Regions Traceable
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-[40%] text-left">Internal Name</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Registration Date</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && countries.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-indigo-500" size={32} />
                      Loading countries...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="3" className="px-8 py-10 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">
                      <ShieldAlert size={14} /> {error}
                    </div>
                  </td>
                </tr>
              ) : filteredCountries.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    No regions found in registry
                  </td>
                </tr>
              ) : (
                filteredCountries.map((country, idx) => (
                  <tr key={country.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          <Globe size={14} />
                        </div>
                        <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{country.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[11px] font-black text-slate-900 italic">
                        {country.created_at
                          ? new Date(country.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(country)}
                          className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100/50"
                        >
                          <Pencil size={14} strokeWidth={2.5} />
                        </button>

                         {confirmDeleteId === country.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(country.id)}
                              disabled={deletingId === country.id}
                              className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-sm disabled:opacity-50"
                            >
                              {deletingId === country.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={3} />}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                            >
                              <X size={12} strokeWidth={3} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(country.id)}
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100/50"
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/10 flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {filteredCountries.length} Regions Cataloged
          </span>
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
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white"
      >
        <div className="p-8 font-sans">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {country ? 'Update Region' : 'Register Country'}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Geographic Identity</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"
            >
              <X size={20} />
            </button>
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
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                Country Designation
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Globe size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={submitting}
                  placeholder="e.g. United States"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-[13px] font-black text-slate-900 focus:bg-white focus:border-indigo-600 transition-all outline-none shadow-sm disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-50">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-5 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:bg-indigo-700"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <div className="p-1 bg-white/10 rounded-lg"><Check size={14} strokeWidth={3} /></div>}
                {country ? 'Sync Region' : 'Register Country'}
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