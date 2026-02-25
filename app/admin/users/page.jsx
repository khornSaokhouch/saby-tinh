'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Users, UserPlus, Search, ShieldCheck, ShieldAlert, ArrowUpRight, 
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
    <div className="space-y-10 pb-10 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">User Directory</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Customers</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchAllUsers()}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>

          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Users" value={visibleUsers.length} icon={Users} color="indigo" />
        <MetricCard label="Active Users" value={visibleUsers.filter(u => u.role !== 'banned').length} icon={ShieldCheck} color="emerald" />
        <MetricCard label="Banned Users" value={visibleUsers.filter(u => u.role === 'banned').length} icon={ShieldAlert} color="purple" />
      </div>

      {/* --- REGISTRY TABLE --- */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/20">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email, or ID..." 
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="pl-4 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-all min-w-[140px]"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="banned">Banned</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ShieldCheck size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Update</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && users.length === 0 ? (
                 <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 opacity-20" /></td></tr>
              ) : filteredUsers.length === 0 ? (
                 <tr><td colSpan="4" className="py-20 text-center text-sm font-bold text-slate-400 uppercase tracking-wider">No users found</td></tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    key={user.id} className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs border border-white shadow-sm overflow-hidden relative">
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
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</span>
                          <span className="text-xs font-medium text-slate-500 mt-0.5">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wide focus:ring-2 focus:ring-indigo-500/10 outline-none cursor-pointer"
                      >
                        <option value="user">User</option>
                        <option value="owner">Owner</option>
                        <option value="banned">Banned</option>
                      </select>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-slate-500">
                        {new Date(user.updated_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
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
                                className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 disabled:opacity-50"
                              >
                                {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={2.5} />}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 hover:text-slate-600 transition-all shadow-sm"
                              >
                                <X size={14} />
                              </button>
                            </motion.div>
                          ) : (
                              <motion.button
                                key="delete-button"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => setConfirmDeleteId(user.id)}
                                className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                              >
                                <Trash2 size={14} strokeWidth={2.5} />
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
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600"
  };
  return (
    <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-colors">
      <div className={`p-3 rounded-xl w-fit mb-4 ${colors[color]}`}><Icon size={20} /></div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-all opacity-40" />
    </div>
  );
}
