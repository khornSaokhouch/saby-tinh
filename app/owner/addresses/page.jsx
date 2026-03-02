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
    fetchUserAddresses();

    const interval = setInterval(() => {
      fetchUserAddresses();
    }, 30000);

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

  return (
    <div className="space-y-10 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address Directory</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Addresses</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchUserAddresses()}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>

          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
            <Download size={16} className="group-hover:text-indigo-600 transition-colors" /> 
            <span className="group-hover:text-slate-900 transition-colors">Export Addresses</span>
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          label="My Addresses"
          value={userAddresses.length}
          trend="+8%"
          icon={LinkIcon}
        />
        <MetricCard
          label="Unique Locations"
          value={[...new Set(userAddresses.map(m => m.id))].length}
          trend="+5.2%"
          icon={MapIcon}
        />
        <MetricCard
          label="Coverage"
          value={`${[...new Set(userAddresses.map(m => m.province))].length} Prov.`}
          trend="+1.2%"
          icon={Users}
        />
      </div>

      {/* --- ADDRESSES TABLE --- */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter addresses..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 text-slate-500 hover:text-indigo-600 transition-colors group">
            <Filter size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold">Filters</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Address Details</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Country</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                 <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                   <div className="flex flex-col items-center gap-4">
                     <Loader2 className="animate-spin text-indigo-500" size={32} />
                     Loading addresses...
                   </div>
                 </td></tr>
              ) : error ? (
                 <tr><td colSpan="4" className="px-8 py-10 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">
                      <ShieldAlert size={14} /> Error: {error}
                    </div>
                 </td></tr>
              ) : filteredMappings.length === 0 ? (
                 <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-bold">No addresses found.</td></tr>
              ) : (
                filteredMappings.map((mapping, idx) => (
                  <tr key={`${mapping.user_id || 'me'}-${mapping.id || mapping.address_id}-${idx}`} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-xs border border-white shadow-sm uppercase group-hover:bg-white transition-colors">
                           {mapping.user_name ? mapping.user_name.charAt(0) : (authUser?.name ? authUser.name.charAt(0) : '?')}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{mapping.user_name || authUser?.name || 'Owner'}</span>
                          <span className="text-xs font-medium text-slate-500 mt-0.5">{mapping.user_email || authUser?.email || ''}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${mapping.latitude},${mapping.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col group/address"
                        title="Open in Google Maps"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-700 leading-tight group-hover/address:text-indigo-600 transition-colors">
                            {mapping.house_number ? `#${mapping.house_number}, ` : ''}{mapping.street}
                          </span>
                          <ExternalLink size={12} className="text-slate-300 opacity-0 group-hover/address:opacity-100 group-hover/address:text-indigo-400 transition-all" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 mt-0.5 uppercase tracking-wide group-hover/address:text-slate-500 transition-colors">
                          {mapping.commune}, {mapping.district}, {mapping.province}
                        </span>
                      </a>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                        {mapping.country?.name || mapping.country_name || 'Unset'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex flex-col items-end">
                         <span className="text-xs font-bold text-slate-600">
                           {mapping.linked_at ? new Date(mapping.linked_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                         </span>
                         <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase mt-0.5 tracking-tighter">
                            <ShieldCheck size={10} /> Active
                         </div>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
             Total: {filteredMappings.length} Addresses
           </span>
           <div className="flex gap-3">
              <button className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30 uppercase tracking-widest" disabled>Prev</button>
              <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95">Next Page</button>
           </div>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value, trend, icon: Icon, isWarning }) {
  return (
    <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-colors">
      <div className={`absolute top-0 right-0 w-24 h-24 translate-x-8 -translate-y-8 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700 ${isWarning ? 'bg-rose-600' : 'bg-indigo-600'}`} />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`p-3 rounded-2xl ${isWarning ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend} <ArrowUpRight size={10} strokeWidth={3} />
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
