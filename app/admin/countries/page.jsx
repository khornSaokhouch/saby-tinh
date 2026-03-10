'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Globe, Plus, Pencil, Trash2, Search, Loader2,
  ArrowUpRight, ShieldAlert, MapPin, X, Check, RefreshCw
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
    <div className="space-y-10 font-sans">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Country Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Countries</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchCountries()}
            className="p-3 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-3.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-[0.2em]"
          >
            <Plus size={16} strokeWidth={3} />
            Create Entry
          </button>
        </div>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <MetricCard label="Total Countries" value={countries.length} icon={Globe} color="indigo" />
        <MetricCard label="Search Results" value={filteredCountries.length} icon={MapPin} color="purple" />
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">

        {/* Search Bar */}
        <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search country registry..."
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 shadow-sm text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {filteredCountries.length} of {countries.length} Records
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16 text-center">ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Country Designation</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Registration Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && countries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-indigo-500" size={32} />
                      Loading countries...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="px-8 py-10 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">
                      <ShieldAlert size={14} /> {error}
                    </div>
                  </td>
                </tr>
              ) : filteredCountries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-bold">
                    No countries found.
                  </td>
                </tr>
              ) : (
                filteredCountries.map((country, idx) => (
                  <tr key={country.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-slate-400 text-[10px] border border-white shadow-sm group-hover:bg-white transition-colors mx-auto">
                        {idx + 1}
                      </div>
                    </td>
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
        <div className="p-6 border-t border-slate-50 bg-slate-50/10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Total: {filteredCountries.length} Entries
          </span>
        </div>
      </div>

      {/* --- FORM MODAL --- */}
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
// Form Modal
// ──────────────────────────────────────────────
function CountryFormModal({ country, onClose, onCreate, onUpdate }) {
  const [name, setName] = useState(country?.name || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Country name is required');

    setSubmitting(true);
    const res = country
      ? await onUpdate(country.id, { name: name.trim() })
      : await onCreate({ name: name.trim() });

    if (res?.success) {
      toast.success(country ? 'Country updated!' : 'Country created!');
      onClose();
    } else {
      toast.error(res?.message || 'Failed to save');
    }
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white"
      >
        <div className="p-10 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {country ? 'Update Country' : 'New Country'}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Country Details</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                Country Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cambodia"
                autoFocus
                className="w-full px-6 py-4 bg-slate-50/50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-5 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-5 bg-indigo-600 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:bg-indigo-700"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {country ? 'Update Country' : 'Save Country'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Metric Card
// ──────────────────────────────────────────────
function MetricCard({ label, value, icon: Icon, color }) {
  const themes = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500 text-left">
      <div className="absolute top-0 right-0 w-20 h-20 translate-x-8 -translate-y-8 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-[0.03] active:opacity-[0.05] group-hover:rotate-45 transition-all duration-700" />
      <div className={`p-2.5 rounded-xl w-fit mb-4 border-2 border-white shadow-sm relative z-10 ${themes[color] || themes.indigo}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}