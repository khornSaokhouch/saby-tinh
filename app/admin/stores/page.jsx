'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Store, Search, Filter, ArrowUpRight, 
  Download, Trash2, Building2, Users, Clock, Edit3, Plus, Image as ImageIcon,
  Loader2, MapPin, ChevronDown, RefreshCw
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function StoresPage() {
  const { stores, loading, fetchStores, deleteStore } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  
  useEffect(() => {
    fetchStores();

    const interval = setInterval(() => {
      fetchStores();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStores]);

  const locations = useMemo(() => {
    const provinces = stores
      .map(s => s.user?.company_info?.address?.province)
      .filter(Boolean);
    return [...new Set(provinces)].sort();
  }, [stores]);

  const filteredStores = useMemo(() => {
    return stores.filter(s => {
      const name = s.name || "";
      const ownerName = s.user?.name || "";
      const province = s.user?.company_info?.address?.province || '';
      const matchSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(s.id).includes(searchTerm);
      const matchLocation = !filterLocation || province === filterLocation;
      return matchSearch && matchLocation;
    });
  }, [stores, searchTerm, filterLocation]);


  return (
    <div className="space-y-10 pb-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Units</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Stores</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchStores()}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Stores" value={stores.length} icon={Store} color="indigo" />
        <MetricCard label="Store Owners" value={new Set(stores.map(s => s.user_id)).size} icon={Users} color="purple" />
        <MetricCard label="System Status" value="Online" icon={Clock} color="emerald" />
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        
        <div className="p-6 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 sm:max-w-sm group text-left">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search stores or owners..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Location Filter */}
          <div className="relative">
            <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              className="h-[50px] pl-9 pr-10 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-all"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
          <div className="sm:flex-1" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{filteredStores.length} Results</span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Store Info</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Created At</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="4" className="px-8 py-20 text-center">
                     <Loader2 className="animate-spin text-indigo-500 mx-auto mb-2" />
                     <span className="text-xs font-medium text-slate-400">Loading stores...</span>
                   </td>
                </tr>
              ) : filteredStores.map((store, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={store.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                        {store.store_image ? (
                          <img src={store.store_image} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{store.name}</span>
                        <span className="text-xs font-medium text-indigo-600 mt-0.5">ID: {store.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{store.user?.name || 'Loading...'}</span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">UID: {store.user_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin size={12} className="text-rose-500" />
                        <span className="text-sm font-bold">
                          {store.user?.company_info?.address?.province || 'No Location'}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">{store.user?.company_info?.address?.city || 'City Not Set'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-slate-500">
                      {new Date(store.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Link 
                      href={`/admin/stores/details?storeId=${store.id}`}
                      className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                      title="View Details"
                    >
                      <ArrowUpRight size={18} strokeWidth={2.5} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600"
  };
  return (
    <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className={`p-3 rounded-xl w-fit mb-4 ${colors[color]}`}><Icon size={20} /></div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 text-left">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900 tracking-tight text-left">{value}</h3>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-all opacity-40" />
    </div>
  );
}
