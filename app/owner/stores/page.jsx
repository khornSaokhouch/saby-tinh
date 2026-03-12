'use client';

import { useState, useEffect } from 'react';
import { 
  Store, Search, MapPin, ArrowUpRight, 
  Download, Trash2, Building2, Users, Clock, Edit3, Plus, Image as ImageIcon, RefreshCw, Check, X, Loader2
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useUserStore } from '@/stores/userStore';
import OwnerStoreFormModal from '@/app/components/owner/StoreFormModal';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function OwnerStoresPage() {
  const { stores, loading, fetchStores, deleteStore } = useStore();
  const { user, fetchProfile } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchStores();
  }, [fetchProfile, fetchStores]);

  // Enhanced filtering: search + ownership enforcement
  const filteredStores = stores.filter(s => {
    const isOwner = user?.id && String(s.user_id) === String(user.id);
    if (!isOwner) return false;

    const name = s.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           String(s.id).includes(searchTerm);
  });

  const handleAddStore = () => {
    setSelectedStore(null);
    setIsFormOpen(true);
  };

  const handleEditStore = (store) => {
    setSelectedStore(store);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async (id) => {
    if (!id) return;
    try {
      setIsActionLoading(true);
      await deleteStore(id);
      setConfirmDeleteId(null);
      toast.success('Store decommissioned');
    } catch (err) {
      console.error('Failed to delete store:', err);
      toast.error('Failed to purge store');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Business Identity</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Store <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Registry</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Manage your physical and digital presence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchStores()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>

          {user?.role === 'owner' && filteredStores.length > 0 ? (
            <div className="px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Ownership Limit Reached</span>
            </div>
          ) : (
            <button 
              onClick={handleAddStore}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-md hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest"
            >
              <Plus size={14} strokeWidth={3} /> Register Unit
            </button>
          )}
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Active Units" value={filteredStores.length} icon={Store} color="indigo" />
        <MetricCard label="Account Type" value={user?.role || 'Owner'} icon={Users} color="emerald" />
        <MetricCard label="Instance status" value="Verifed" icon={Clock} color="rose" />
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        <div className="p-4 border-b border-slate-50 bg-slate-50/20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
              <input 
                type="text" 
                placeholder="Search my stores..." 
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:border-indigo-100 transition-all outline-none placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="hidden sm:block flex-1" />
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                {filteredStores.length} Stores Verified
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Operations</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Geography</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStores.length > 0 ? filteredStores.map((store, idx) => (
                <motion.tr 
                  key={store.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                        {store.store_image ? (
                          <img src={store.store_image} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={16} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black text-slate-900 truncate tracking-tight uppercase">{store.name}</span>
                        <span className="text-[9px] font-black text-slate-300 tracking-widest uppercase mt-0.5">ID: {store.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Clock size={11} className="text-indigo-500" strokeWidth={3} />
                        <span className="text-[11px] font-black">
                          {store.user?.company_info?.open_time || '00:00'} - {store.user?.company_info?.close_time || '00:00'}
                        </span>
                      </div>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Hours Active</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin size={11} className="text-rose-500" strokeWidth={3} />
                        <span className="text-[11px] font-black truncate max-w-[120px]">
                          {store.user?.company_info?.address?.province || 'No Location'}
                        </span>
                      </div>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{store.user?.company_info?.address?.city || 'Zone Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button 
                            onClick={() => handleEditStore(store)} 
                            className="p-1.5 bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg shadow-sm active:scale-95 transition-all"
                        >
                            <Edit3 size={14} strokeWidth={3} />
                        </button>
                        
                        <AnimatePresence mode="wait" initial={false}>
                            {confirmDeleteId === store.id ? (
                                <motion.div
                                    key="confirm"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-1"
                                >
                                    <button
                                        onClick={() => handleDeleteConfirm(store.id)}
                                        className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm"
                                    >
                                        <Check size={12} strokeWidth={3} />
                                    </button>
                                    <button
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="p-1.5 bg-slate-100 text-slate-400 rounded-lg"
                                    >
                                        <X size={12} strokeWidth={3} />
                                    </button>
                                </motion.div>
                            ) : (
                                <button
                                    onClick={() => setConfirmDeleteId(store.id)}
                                    className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-all active:scale-95"
                                >
                                    <Trash2 size={14} strokeWidth={3} />
                                </button>
                            )}
                        </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Store size={40} className="text-slate-100" />
                       <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">No units found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}
      <OwnerStoreFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedStore} 
        isSubmitting={isActionLoading}
      />

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
