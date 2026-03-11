'use client';

import { useState, useEffect, useMemo  } from 'react';
import { 
  RefreshCw , Search, LayoutGrid , ArrowUpRight, 
  Trash2, CheckCircle2, XCircle, Edit3, Plus, 
  Loader2, Check, X, Eye, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoryStore } from '@/stores/useCategoryStore';
import CategoryFormModal from '@/app/components/admin/modelform/CategoryFormModal';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CategoryPage() {
  const { 
    categories, 
    loading, 
    fetchCategories, 
    search, 
    setSearch,
    saveCategory, 
    deleteCategory 
  } = useCategoryStore();
  
  // Search filter
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      (category.name || '').toLowerCase().includes(search.toLowerCase()) ||
      String(category.id).includes(search)
    );
  }, [categories, search]);

  useEffect(() => {
    fetchCategories();

    const interval = setInterval(() => {
      fetchCategories();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchCategories]);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Handlers
  const handleSave = async (formData) => {
    setIsActionLoading(true);
    try {
      await saveCategory({ ...formData, id: selectedItem?.id });
      setIsFormOpen(false);
      toast.success('Category saved');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsActionLoading(true);
    try {
      await deleteCategory(id);
      setConfirmDeleteId(null);
      toast.success('Category deleted');
    } catch (error) {
       console.error(error);
       toast.error('Failed to remove category');
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
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventory Taxonomy</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Categories</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchCategories()}
            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl transition-all active:scale-95 shadow-sm"
            title="Sync Registry"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <Plus size={14} strokeWidth={3} /> New Category
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Total Nodes" value={categories.length} icon={LayoutGrid} color="indigo" />
        <MetricCard label="Active Indices" value={categories.filter(c => c.status == 1).length} icon={CheckCircle2} color="emerald" />
        <MetricCard label="Restricted" value={categories.filter(c => c.status != 1).length} icon={XCircle} color="purple" />
      </div>

      {/* --- CATEGORY TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={13} />
              <input
                type="text"
                placeholder="Filter by name or ID..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {filteredCategories.length} Active Classes
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Category Identity</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status Node</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Last Sync</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && categories.length === 0 ? (
                 <tr>
                   <td colSpan="4" className="py-20 text-center">
                     <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Index...</span>
                     </div>
                   </td>
                 </tr>
              ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                       <div className="flex flex-col items-center gap-3 text-slate-200">
                          <Package size={40} />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zero category nodes detected</p>
                       </div>
                    </td>
                  </tr>
              ) : (
                filteredCategories.map((category, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                    key={category.id} className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center border border-white shadow-sm overflow-hidden relative shrink-0 transition-transform group-hover:scale-105">
                           {category.category_image ? (
                              <motion.img
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                src={category.category_image} className="w-full h-full object-cover"
                              />
                           ) : (
                              <Package className="w-4 h-4 text-slate-400" />
                           )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11px] font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tight">{category.name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">ID: {category.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                        category.status == 1
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        {category.status == 1 ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="text-[10px] font-bold text-slate-500">
                        {new Date(category.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-left">
                         <Link
                          href={`/admin/categories/details?categoryId=${category.id}`}
                          className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-black shadow-sm active:scale-95 transition-all inline-flex"
                          title="View Details"
                        >
                          <ArrowUpRight size={14} strokeWidth={3} />
                        </Link>
                        <button
                          onClick={() => { setSelectedItem(category); setIsFormOpen(true); }}
                          className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 shadow-sm active:scale-95 transition-all"
                        >
                          <Edit3 size={14} strokeWidth={3} />
                        </button>

                        <AnimatePresence mode="wait" initial={false}>
                          {confirmDeleteId === category.id ? (
                            <motion.div
                              key="confirm-delete"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1"
                            >
                              <button
                                onClick={() => handleDelete(category.id)}
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
                              onClick={() => setConfirmDeleteId(category.id)}
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
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
             Total Scanned: {filteredCategories.length} Node Classes
           </span>
           <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
             Verified Taxonomy
           </div>
        </div>
      </div>

      <CategoryFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSave}
        initialData={selectedItem}
        isSubmitting={isActionLoading}
      />
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
