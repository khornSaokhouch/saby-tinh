'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Users, ExternalLink , Home, Globe, Calendar, 
  Loader2, Search, Filter, Download, ArrowUpRight,
  ShieldCheck, Map as MapIcon, Link as LinkIcon,
  ShieldAlert, MoreHorizontal, Trash2, RefreshCw
} from 'lucide-react';
import { useAddressStore } from '@/stores/useAddressStore';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';

export default function OwnerAddressesPage() {
  const { userAddresses, fetchUserAddresses, loading, error } = useAddressStore();
  const { user: authUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserAddresses('dashboard');
    const interval = setInterval(() => {
      fetchUserAddresses('dashboard');
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchUserAddresses]);

  const filteredMappings = useMemo(() => {
    return userAddresses.filter(m => {
      const userName = m.user_name || authUser?.name || '';
      const userEmail = m.user_email || authUser?.email || '';
      const countryName = m.country?.name || m.country_name || '';
      
      return (
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(m.province || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(m.street || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [userAddresses, searchTerm, authUser]);

  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Geo Protocol</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Registry <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Addresses</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">Directory for {today}</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchUserAddresses('dashboard')}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-md hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest">
            <Download size={14} strokeWidth={3} /> Export Data
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Saved Nodes" value={userAddresses.length} icon={LinkIcon} color="indigo" />
        <MetricCard label="Unique Hubs" value={[...new Set(userAddresses.map(m => m.id))].length} icon={MapIcon} color="emerald" />
        <MetricCard label="Coverage" value={`${[...new Set(userAddresses.map(m => m.province))].length} Prov.`} icon={Globe} color="rose" />
      </div>

      {/* --- ADDRESSES LIST --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
              <input 
                type="text" 
                placeholder="Search address strings..." 
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:border-indigo-100 transition-all outline-none placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="hidden sm:block flex-1" />
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-500" /> Integrity Verified
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Profile Identity</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Address Descriptor</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Zone</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && userAddresses.length === 0 ? (
                 <tr><td colSpan="4" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                   <div className="flex flex-col items-center gap-3">
                     <RefreshCw className="animate-spin text-indigo-500" size={24} />
                     Scanning Registry...
                   </div>
                 </td></tr>
              ) : filteredMappings.length === 0 ? (
                 <tr><td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <MapPin size={40} className="text-slate-100" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] mt-2">Zero records found</p>
                    </div>
                 </td></tr>
              ) : (
                filteredMappings.map((mapping, idx) => (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 text-[10px] uppercase transition-all group-hover:bg-slate-900 group-hover:text-white">
                           {mapping.user_name ? mapping.user_name.charAt(0) : (authUser?.name ? authUser.name.charAt(0) : '?')}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11px] font-black text-slate-900 truncate tracking-tight uppercase leading-tight">{mapping.user_name || authUser?.name || 'Owner'}</span>
                          <span className="text-[9px] font-black text-slate-300 tracking-widest uppercase mt-0.5 truncate">{mapping.user_email || authUser?.email || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${mapping.latitude},${mapping.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col group/address"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-black text-slate-700 leading-tight uppercase group-hover/address:text-indigo-600 transition-colors">
                            {mapping.house_number ? `#${mapping.house_number}, ` : ''}{mapping.street}
                          </span>
                          <ExternalLink size={10} className="text-slate-300 opacity-0 group-hover/address:opacity-100 group-hover/address:text-indigo-400 transition-all" />
                        </div>
                        <span className="text-[9px] font-black text-slate-300 mt-0.5 uppercase tracking-tighter truncate">
                          {mapping.commune}, {mapping.district}, {mapping.province}
                        </span>
                      </a>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[8px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                        {mapping.country?.name || mapping.country_name || 'Unset'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                       <div className="flex flex-col items-end">
                         <span className="text-[10px] font-black text-slate-700 tracking-tight uppercase">
                           {mapping.linked_at ? new Date(mapping.linked_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Active'}
                         </span>
                         <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase mt-0.5 tracking-widest">
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
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    rose: "bg-rose-500 shadow-rose-100",
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
        <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 mb-3 relative z-10`}>
            <Icon size={14} strokeWidth={3} />
        </div>
        <div className="relative z-10">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
        </div>
        <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}
