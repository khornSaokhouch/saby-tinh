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
    <div className="space-y-10 font-sans pb-10">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partner Directory</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Partners</h1>
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
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <MetricCard
            label="Total Partners"
            value={visibleUsers.length}
            icon={Users}
            color="indigo"
          />
          <MetricCard
            label="Active Partners"
            value={visibleUsers.filter(u => u.role !== 'banned').length}
            icon={ShieldCheck}
            color="emerald"
          />
          <MetricCard
            label="Banned Partners"
            value={visibleUsers.filter(u => u.role === 'banned').length}
            icon={ShieldAlert}
            color="purple"
          />
      </div>

      {/* --- REGISTRY TABLE --- */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search partners..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 text-slate-500 hover:text-indigo-600 transition-colors">
            <Filter size={18} />
            <span className="text-sm font-bold">Filters</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Partner Name</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Role</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Last Update</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                 <tr><td colSpan="4" className="px-8 py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" /></td></tr>
              ) : filteredUsers.length === 0 ? (
                 <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-bold">No partners found.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs border border-white shadow-sm overflow-hidden relative transition-transform group-hover:scale-105">
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
                          <span className="text-sm font-bold text-slate-900">{user.name}</span>
                          <span className="text-xs font-medium text-slate-500 mt-0.5">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wide focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer appearance-none"
                      >
                        <option value="user">User</option>
                        <option value="owner">Owner</option>
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
                              key="confirm"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1"
                            >
                              <button
                                onClick={() => handleDeleteConfirm(user.id)}
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
                            <motion.div
                              key="actions"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1"
                            >
                              <Link 
                                href={`/admin/company/details?userId=${user.id}`}
                                className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                                title="View Profile"
                              >
                                <ArrowUpRight size={18} strokeWidth={2.5} />
                              </Link>
                              <button 
                                onClick={() => setConfirmDeleteId(user.id)}
                                className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                              >
                                <Trash2 size={18} strokeWidth={2.5} />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/10">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
             Showing {filteredUsers.length} Partners
           </span>
           <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Prev</button>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md shadow-slate-200">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---
function MetricCard({ label, value, icon: Icon, color }) {
  const themes = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-colors text-left">
      <div className="absolute top-0 right-0 w-24 h-24 translate-x-8 -translate-y-8 rounded-full bg-indigo-600 opacity-[0.03] group-hover:scale-150 transition-transform duration-700" />
      <div className={`p-3 rounded-xl w-fit mb-4 ${themes[color] || themes.indigo}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700" />
    </div>
  );
}
