'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Users, ChevronDown, Search, ShieldCheck, ShieldAlert, ArrowUpRight, 
  Download, Trash2, Loader2, Check, X, Mail, Phone, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { getCleanImageUrl } from '@/components/nabvar/utils';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function CustomersPage() {
  const { users, loading, fetchAllUsers, updateUserRole, deleteUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  
  // Inline Delete State
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const visibleUsers = useMemo(
    () => users.filter(user => user.role !== 'admin'),
    [users]
  );

  useEffect(() => {
    fetchAllUsers();

    const interval = setInterval(() => {
      fetchAllUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllUsers]);

  const filteredUsers = useMemo(() => {
    return visibleUsers.filter(user => {
      const matchSearch =
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.id).includes(searchTerm);
      const matchRole = !filterRole || user.role === filterRole;
      return matchSearch && matchRole;
    });
  }, [visibleUsers, searchTerm, filterRole]);

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

  const handleDelete = async (userId) => {
    setIsActionLoading(true);
    try {
      await deleteUser(userId);
      setConfirmDeleteId(null);
      toast.success('User deleted');
    } catch (error) {
       console.error(error);
       toast.error('Could not delete user');
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
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Identity Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            User <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">Registry</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchAllUsers()}
            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-xl transition-all active:scale-95 shadow-sm"
            title="Sync Registry"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={14} /> Export Node Data
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Total Nodes" value={visibleUsers.length} icon={Users} color="indigo" />
        <MetricCard label="Verified" value={visibleUsers.filter(u => u.role !== 'banned').length} icon={ShieldCheck} color="emerald" />
        <MetricCard label="Restricted" value={visibleUsers.filter(u => u.role === 'banned').length} icon={ShieldAlert} color="purple" />
      </div>

      {/* --- REGISTRY TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
              <input 
                type="text" 
                placeholder="Search by name, email or ID..." 
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative w-full sm:w-48 text-left">
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="w-full pl-4 pr-9 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                <option value="">All Architectures</option>
                <option value="user">Retailer</option>
                <option value="owner">Executive</option>
                <option value="banned">Restricted</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={13} />
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identity Node</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Role Config</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Sync</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && users.length === 0 ? (
                 <tr>
                   <td colSpan="4" className="py-20 text-center">
                     <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Identity Vault...</span>
                     </div>
                   </td>
                 </tr>
              ) : filteredUsers.length === 0 ? (
                 <tr>
                    <td colSpan="4" className="py-20 text-center">
                       <div className="flex flex-col items-center gap-3 text-slate-200">
                          <Users size={40} />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching nodes found</p>
                       </div>
                    </td>
                 </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                    key={user.id} className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs border border-white shadow-sm overflow-hidden relative shrink-0">
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
                          <span className="text-[11px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate tracking-tight">{user.name}</span>
                          <span className="text-[9px] font-bold text-slate-400 truncate">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="px-2 py-1 bg-slate-50/50 border border-slate-100 rounded-lg text-[8px] font-black uppercase tracking-widest focus:border-indigo-100 outline-none cursor-pointer hover:bg-white transition-all"
                      >
                        <option value="user">Retailer</option>
                        <option value="owner">Executive</option>
                        <option value="banned">Restricted</option>
                      </select>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-[10px] font-bold text-slate-500">
                        {new Date(user.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2 text-left">
                        <AnimatePresence mode="wait" initial={false}>
                          {confirmDeleteId === user.id ? (
                            <motion.div
                              key="confirm-delete"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1"
                            >
                              <button
                                onClick={() => handleDelete(user.id)}
                                disabled={isActionLoading}
                                className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm active:scale-95 transition-all disabled:opacity-50"
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
                              <motion.button
                                key="delete-button"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => setConfirmDeleteId(user.id)}
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
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            {filteredUsers.length} Nodes in Registry
          </span>
          <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
             System Admin Access
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
        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">{value}</h3>
        {subText && <span className="text-[9px] font-bold text-slate-400">{subText}</span>}
      </div>
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out opacity-50" />
    </div>
  );
}
