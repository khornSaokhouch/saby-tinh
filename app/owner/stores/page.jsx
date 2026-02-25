'use client';

import { useState, useEffect } from 'react';
import { 
  Store, Search, MapPin , ArrowUpRight, 
  Download, Trash2, Building2, Users, Clock, Edit3,  Plus, Image as ImageIcon, RefreshCw, Check, X
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

    const interval = setInterval(() => {
      fetchStores();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchProfile, fetchStores]);

  // Enhanced filtering: search + ownership enforcement
  const filteredStores = stores.filter(s => {
    // Ownership check (using String for safe comparison if IDs are inconsistent types)
    const isOwner = user?.id && String(s.user_id) === String(user.id);
    if (!isOwner) return false;

    // Search check
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

  const handleDeleteClick = (store) => {
    setSelectedStore(store);
    setIsDeleteOpen(true);
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
    <div className="space-y-10 pb-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Management</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">My Stores</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchStores()}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>

          {user?.role === 'owner' && filteredStores.length > 0 ? (
            <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Store className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider leading-none">Limit Reached</p>
                <p className="text-xs font-bold text-amber-700 mt-0.5">One store per account</p>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleAddStore}
              className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
            >
              <Plus size={18} strokeWidth={2.5} /> Register Store
            </button>
          )}
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Active Stores" value={filteredStores.length} icon={Store} color="indigo" />
        <MetricCard label="Account Status" value={user?.role || 'Owner'} icon={Users} color="purple" />
        <MetricCard label="System Status" value="Online" icon={Clock} color="emerald" />
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        
        <div className="p-6 border-b border-slate-50 bg-slate-50/20">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search my stores..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Store Branding</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Business Hours</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Registered</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStores.length > 0 ? filteredStores.map((store, idx) => (
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
                        <span className="text-xs font-medium text-rose-500 mt-0.5">ID: {store.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-left">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Clock size={12} className="text-indigo-500" />
                        <span className="text-sm font-bold">
                          {store.user?.company_info?.open_time || '00:00'} - {store.user?.company_info?.close_time || '00:00'}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Operating Cycle</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-left">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin size={12} className="text-rose-500" />
                        <span className="text-sm font-bold">
                          {store.user?.company_info?.address?.province || 'No Location'}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">{store.user?.company_info?.address?.city || 'Zone Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-slate-500">
                      {new Date(store.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditStore(store)} 
                        className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                      >
                        <Edit3 size={16} strokeWidth={2.5} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === store.id ? (
                          <motion.div
                            key="confirm-delete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1"
                          >
                            <button
                              onClick={() => handleDeleteConfirm(store.id)}
                              disabled={isActionLoading}
                              className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-sm disabled:opacity-50"
                            >
                              {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={2.5} />}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button
                            key="delete-button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setConfirmDeleteId(store.id)}
                            className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))
 : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Store size={40} className="text-slate-200" />
                       <p className="text-slate-400 font-bold tracking-tight">No stores found under your account.</p>
                       <button onClick={handleAddStore} className="text-indigo-600 text-xs font-black uppercase tracking-widest mt-2 hover:underline">Register your first store</button>
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
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600"
  };
  return (
    <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className={`p-3 rounded-xl w-fit mb-4 ${colors[color]}`}><Icon size={20} /></div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-all opacity-40" />
    </div>
  );
}
