'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Users, ExternalLink , Home, Globe, Calendar, 
  Loader2, Search, Filter, Download, ArrowUpRight,
  ShieldCheck, Map as MapIcon, Link as LinkIcon,
  ShieldAlert, MoreHorizontal, Trash2, RefreshCw
} from 'lucide-react';
import { useAddressStore } from '@/stores/useAddressStore';
import { motion } from 'framer-motion';

export default function AdminAddressesPage() {
  const { allAddresses, fetchAllAddresses, loading, error } = useAddressStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllAddresses();

    const interval = setInterval(() => {
      fetchAllAddresses();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllAddresses]);

  const filteredMappings = useMemo(() => {
    return allAddresses.filter(m => 
      String(m.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(m.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(m.province || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(m.country_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allAddresses, searchTerm]);

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Logistics Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Delivery <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-400">Points</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Manage global shipping endpoints and user address associations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchAllAddresses()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest">
            <Download size={14} strokeWidth={3} /> Export DB
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Delivery Points" value={allAddresses.length} icon={LinkIcon} color="indigo" />
        <MetricCard label="Unique Hubs" value={[...new Set(allAddresses.map(m => m.address_id))].length} icon={MapIcon} color="purple" />
        <MetricCard label="User Linkage" value={`${((allAddresses.length / Math.max(1, [...new Set(allAddresses.map(m => m.user_id))].length))).toFixed(1)}x`} icon={Users} color="emerald" subText="Density" />
      </div>

      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder="Search by city, user or country..." 
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
             {filteredMappings.length} Records Traceable
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">User Identity</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Geographic Link</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Region</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 opacity-20" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                   <td colSpan="4" className="py-20 text-center">
                      <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold border border-rose-100 uppercase tracking-widest">
                        <ShieldAlert size={14} /> Error: {error}
                      </div>
                   </td>
                </tr>
              ) : filteredMappings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">No addresses found</td>
                </tr>
              ) : (
                filteredMappings.map((mapping, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                    key={`${mapping.user_id}-${mapping.address_id}-${idx}`} className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 text-[11px] border border-white shadow-sm overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                           {mapping.user_name ? mapping.user_name.charAt(0) : '?'}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{mapping.user_name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 opacity-70 truncate max-w-[150px]">{mapping.user_email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${mapping.latitude},${mapping.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col text-left group/address"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-black text-slate-700 leading-tight group-hover/address:text-indigo-600 transition-colors">
                            {mapping.house_number ? `#${mapping.house_number}, ` : ''}{mapping.street}
                          </span>
                          <ExternalLink size={10} className="text-slate-300 opacity-0 group-hover/address:opacity-100 group-hover/address:text-indigo-400 transition-all" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 opacity-70 truncate max-w-[200px]">
                          {mapping.commune}, {mapping.district}, {mapping.province}
                        </span>
                      </a>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100/50 transition-all shadow-sm">
                        {mapping.country_name || 'Unset'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                       <div className="flex flex-col items-end">
                         <span className="text-[10px] font-bold text-slate-700">
                           {new Date(mapping.linked_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                         </span>
                         <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase mt-0.5 tracking-[0.2em]">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Live
                         </div>
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
             Showing: {filteredMappings.length} Endpoints
           </span>
           <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
             Registry Sync
           </div>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value, trend, icon: Icon, color, subText }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    purple: 'bg-purple-600 shadow-purple-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
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
