'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, ShieldCheck, ShieldAlert, ArrowUpRight, 
  Download, Trash2, Loader2, ChevronDown, Check, X, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { getCleanImageUrl } from '@/components/nabvar/utils';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function CompanyPage() {
  const { users, loading, fetchAllUsers, updateUserRole, deleteUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Inline Delete State
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // ✅ Only show owners
  const visibleUsers = useMemo(
    () => users.filter(user => user.role === 'owner'),
    [users]
  );

  useEffect(() => {
    fetchAllUsers();

    const interval = setInterval(() => {
      fetchAllUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllUsers]);

  // Search filter
  useEffect(() => {
    setFilteredUsers(
      visibleUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.id).includes(searchTerm)
      )
    );
  }, [visibleUsers, searchTerm]);

  // Handlers
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success('Role updated');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Update failed');
    }
  };

  const handleDeleteConfirm = async (userId) => {
    setIsActionLoading(true);
    try {
      await deleteUser(userId);
      setConfirmDeleteId(null);
      toast.success('Partner deleted');
    } catch (error) {
       console.error(error);
       toast.error('Failed to delete partner');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Partner Network Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Corporate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Partners</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchAllUsers()}
            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl transition-all active:scale-95 shadow-sm"
            title="Sync Registry"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={14} /> Export Registry
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard label="Global Partners" value={visibleUsers.length} icon={Users} color="indigo" />
          <MetricCard label="Verified Active" value={visibleUsers.filter(u => u.role !== 'banned').length} icon={ShieldCheck} color="emerald" />
          <MetricCard label="Restricted" value={visibleUsers.filter(u => u.role === 'banned').length} icon={ShieldAlert} color="purple" />
      </div>

      {/* --- REGISTRY TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={13} />
              <input 
                type="text" 
                placeholder="Search by name, email or ID..." 
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {filteredUsers.length} Node Partners
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Partner Identity</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Role Config</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Last Sync</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && users.length === 0 ? (
                 <tr>
                   <td colSpan="4" className="py-20 text-center">
                     <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Node Network...</span>
                     </div>
                   </td>
                 </tr>
              ) : filteredUsers.length === 0 ? (
                 <tr>
                    <td colSpan="4" className="py-20 text-center">
                       <div className="flex flex-col items-center gap-3 text-slate-200">
                          <Users size={40} />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zero partner nodes detected</p>
                       </div>
                    </td>
                 </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                    className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-[11px] border border-white shadow-sm overflow-hidden relative shrink-0 transition-transform group-hover:scale-105">
                           {getCleanImageUrl(user.profile?.image_profile) ? (
                              <Image 
                                src={getCleanImageUrl(user.profile?.image_profile)} 
                                alt={user.name} 
                                fill 
                                className="object-cover" 
                              />
                           ) : (
                              user.name.charAt(0).toUpperCase()
                           )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11px] font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tight">{user.name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="px-2 py-1 bg-slate-50/50 border border-slate-100 rounded-lg text-[8px] font-black uppercase tracking-widest focus:border-blue-100 outline-none cursor-pointer hover:bg-white transition-all min-w-[100px]"
                      >
                        <option value="user">USER</option>
                        <option value="owner">OWNER</option>
                      </select>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="text-[10px] font-bold text-slate-500">
                        {new Date(user.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                     <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2 text-left">
                        <AnimatePresence mode="wait" initial={false}>
                          {confirmDeleteId === user.id ? (
                            <motion.div
                              key="confirm"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1"
                            >
                              <button
                                onClick={() => handleDeleteConfirm(user.id)}
                                disabled={isActionLoading}
                                className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm active:scale-95 transition-all text-sm disabled:opacity-50"
                              >
                                {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="p-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg shadow-sm active:scale-95 transition-all"
                              >
                                <X size={14} strokeWidth={3} />
                              </button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="actions"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1"
                            >
                              <Link 
                                href={`/admin/company/details?userId=${user.id}`}
                                className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-black shadow-sm active:scale-95 transition-all inline-flex"
                                title="View Details"
                              >
                                <ArrowUpRight size={14} strokeWidth={3} />
                              </Link>
                              <button 
                                onClick={() => setConfirmDeleteId(user.id)}
                                className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm active:scale-95 transition-all inline-flex"
                              >
                                <Trash2 size={14} strokeWidth={3} />
                              </button>
                            </motion.div>
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
             Total: {filteredUsers.length} Corporate Nodes
           </span>
           <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
             Governance Access
           </div>
        </div>
      </div>
    </div>
  );
}
 
function MetricCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    purple: 'bg-purple-600 shadow-purple-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
      <div className={`p-2 rounded-xl w-8 h-8 flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10 ${themes[color]}`}>
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
