'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Store, Search, Filter, ArrowUpRight, 
  Download, Trash2, Building2, Users, Clock, Edit3, Plus, Image as ImageIcon,
  Loader2, MapPin, ChevronDown, RefreshCw
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function StoresPage() {
  const { language } = useLanguageStore();
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
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Network Infrastructure', language)}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Manage', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">{t('Stores', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            {t('Coordinate and monitor your decentralized storefront network.', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchStores()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label={t('Total Stores', language)} value={stores.length} icon={Store} color="indigo" language={language} />
        <MetricCard label={t('Store Owners', language)} value={new Set(stores.map(s => s.user_id)).size} icon={Users} color="purple" language={language} />
        <MetricCard label={t('System Status', language)} value={t('Online', language)} icon={Clock} color="emerald" language={language} />
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
              <input 
                type="text" 
                placeholder={t('Search stores, owners...', language)} 
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Location Filter */}
            <div className="relative w-full sm:w-40 text-left">
              <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={filterLocation}
                onChange={e => setFilterLocation(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-700 outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-all truncate"
              >
                <option value="">{t('All Regions', language)}</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{filteredStores.length} {t('Stores Found', language)}</span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Store Detail', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Owner', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Location', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Date', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Action', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="5" className="px-8 py-20 text-center">
                     <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-indigo-500" size={24} />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('Loading Stores...', language)}</span>
                     </div>
                   </td>
                </tr>
              ) : filteredStores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-200">
                       <Store size={40} />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('No matching stores found', language)}</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStores.map((store, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  key={store.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 border border-white shadow-sm flex items-center justify-center shrink-0">
                        {store.store_image ? (
                          <img src={store.store_image} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={16} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-900">{store.name}</span>
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">ID: {store.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-700">{store.user?.name || '---'}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">UID: {store.user_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin size={10} className="text-indigo-400" />
                        <span className="text-[11px] font-bold">
                          {store.user?.company_info?.address?.province || t('Global', language)}
                        </span>
                      </div>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mt-0.5">{store.user?.company_info?.address?.city || t('Central District', language)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-[10px] font-bold text-slate-500">
                      {new Date(store.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link 
                      href={`/admin/stores/details?storeId=${store.id}`}
                      className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-black shadow-sm active:scale-95 transition-all inline-flex"
                    >
                      <ArrowUpRight size={14} strokeWidth={3} />
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

function MetricCard({ label, value, icon: Icon, color, subText, language }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    purple: 'bg-purple-600 shadow-purple-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
      <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
          {subText && <span className="text-[9px] font-bold text-slate-400">{subText}</span>}
        </div>
      </div>
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}
