'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Box, Search, Plus, Edit3, Trash2, Tag, 
  Loader2, CheckCircle2, Layers, X, Check, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypeStore } from '@/stores/useTypeStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import TypeFormModal from '@/app/components/admin/modelform/TypeFormModal';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import { toast } from 'react-hot-toast';

export default function TypePage() {
  const { 
    types, 
    loading, 
    fetchTypes, 
    search, 
    setSearch, 
    saveType, 
    deleteType,
    deleteMultipleTypes 
  } = useTypeStore();
  
  const { categories, fetchCategories } = useCategoryStore();
  const { language } = useLanguageStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // --- Bulk Selection State ---
  const [selectedIds, setSelectedIds] = useState([]);

  // --- Pagination & Filter State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const pageSize = 10;

  useEffect(() => {
    fetchTypes();
    fetchCategories();

    const interval = setInterval(() => {
      fetchTypes();
      fetchCategories();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchTypes, fetchCategories]);

  // Reset pagination and selection on search or filter change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [search, selectedCategoryId]);

  const filteredTypes = useMemo(() => {
    return types.filter(type => {
      const matchesSearch = (type.name || '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategoryId === 'all' || type.category_id === Number(selectedCategoryId);
      return matchesSearch && matchesCategory;
    });
  }, [types, search, selectedCategoryId]);

  const paginatedTypes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTypes.slice(start, start + pageSize);
  }, [filteredTypes, currentPage]);

  const totalPages = Math.ceil(filteredTypes.length / pageSize);

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // --- Handlers ---
  const handleSelectAll = () => {
    if (selectedIds.length === filteredTypes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTypes.map(t => t.id));
    }
  };

  const toggleSelectId = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} types?`)) {
      setIsActionLoading(true);
      try {
        await deleteMultipleTypes(selectedIds);
        setSelectedIds([]);
        toast.success(t(`Removed ${selectedIds.length} types`, language));
      } catch (error) {
        toast.error('Batch deletion failed');
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const handleSave = async (data) => {
    setIsActionLoading(true);
    try {
      await saveType({ ...data, id: selectedItem?.id });
      setIsFormOpen(false);
      toast.success(t('Type updated', language));
    } catch (err) {
      console.error(err);
      toast.error('Failed to save type');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsActionLoading(true);
    try {
      await deleteType(id);
      setConfirmDeleteId(null);
      toast.success(t('Type deleted', language));
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove type');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500 relative">
      {/* --- BATCH ACTIONS BAR --- */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-6"
          >
            <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
              <div className="bg-indigo-500 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black">
                {selectedIds.length}
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">{t('Selected Types', language)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBatchDelete}
                disabled={isActionLoading}
                className="flex items-center gap-2 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black transition-all active:scale-95 disabled:opacity-50"
              >
                {isActionLoading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} strokeWidth={3} />}
                {t('Delete Selected', language)}
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black transition-all"
              >
                {t('Cancel', language)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Taxonomy Registry', language)}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Product', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-400">{t('Types', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Organize and classify your platform's product architecture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { fetchTypes(); fetchCategories(); }}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={14} strokeWidth={3} /> {t('Create Type', language)}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label={t('Total Types', language)} value={types.length} icon={Tag} color="indigo" />
        <MetricCard label={t('Registry Sync', language)} value={categories.length} icon={Layers} color="emerald" subText={t('Categories', language)} />
        <MetricCard label={t('System Status', language)} value={t('Unified', language)} icon={CheckCircle2} color="purple" />
      </div>

      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={13} />
              <input
                type="text"
                placeholder={t('Search types...', language)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-48 group text-left">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full pl-4 pr-10 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:border-blue-100 transition-all appearance-none cursor-pointer"
              >
                <option value="all">{t('All Categories', language)}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <Layers className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
            </div>
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {filteredTypes.length} {t('Types Found', language)}
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-left">
                <th className="pl-6 w-10 py-3 text-left">
                  <div 
                    onClick={handleSelectAll}
                    className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                    selectedIds.length === filteredTypes.length && filteredTypes.length > 0
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'bg-white border-slate-200 hover:border-indigo-400'
                  }`}>
                    {selectedIds.length === filteredTypes.length && filteredTypes.length > 0 && <Check size={10} className="text-white" strokeWidth={5} />}
                  </div>
                </th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">{t('Type Detail', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center min-w-[120px]">{t('Category', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center min-w-[140px]">{t('Last Update', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Action', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-left">
              {loading && types.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 opacity-20" />
                  </td>
                </tr>
              ) : paginatedTypes.length === 0 ? (
                <tr>
                    <td colSpan="5" className="py-20 text-center text-sm font-bold text-slate-400 uppercase tracking-wider">{t('No types matching filter', language)}</td>
                </tr>
              ) : paginatedTypes.map((type, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                  key={type.id} className={`group hover:bg-slate-50/30 transition-colors ${selectedIds.includes(type.id) ? 'bg-indigo-50/40' : ''}`}
                >
                  <td className="pl-6 py-3.5">
                    <div 
                      onClick={() => toggleSelectId(type.id)}
                      className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                      selectedIds.includes(type.id) 
                        ? 'bg-indigo-600 border-indigo-600' 
                        : 'bg-white border-slate-200 group-hover:border-indigo-300'
                    }`}>
                      {selectedIds.includes(type.id) && <Check size={10} className="text-white" strokeWidth={5} />}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center border border-white shadow-sm overflow-hidden relative shrink-0 transition-transform group-hover:scale-105">
                        <Box size={14} className="text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{type.name}</span>
                        <span className="text-[9px] font-black text-slate-400 mt-0.5 tracking-widest uppercase opacity-70">{t('UID:', language)} {type.id}</span>
                      </div>
                    </div>
                  </td>
                    <td className="px-6 py-3.5 text-center">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg text-[8px] font-black uppercase tracking-widest">
                        <Layers size={10} className="text-slate-400" strokeWidth={3} />
                        {getCategoryName(type.category_id)}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-700">
                            {new Date(type.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                          {t('at', language)} {new Date(type.updated_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => { setSelectedItem(type); setIsFormOpen(true); }} 
                        className="p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-sm active:scale-95 transition-all"
                        title={t('Edit Type', language)}
                      >
                        <Edit3 size={14} strokeWidth={3} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === type.id ? (
                          <motion.div
                            key="confirm-delete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1.5"
                          >
                            <button
                              onClick={() => handleDelete(type.id)}
                              disabled={isActionLoading}
                              className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                              title={t('Confirm Delete', language)}
                            >
                              {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg shadow-sm active:scale-95 transition-all"
                              title={t('Cancel Delete', language)}
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
                            onClick={() => setConfirmDeleteId(type.id)}
                            className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-all active:scale-95"
                            title={t('Delete Type', language)}
                          >
                            <Trash2 size={14} strokeWidth={3} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-4">
           <div className="flex items-center gap-4 order-2 sm:order-1">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
               {t('Showing', language)} {paginatedTypes.length} {t('of', language)} {filteredTypes.length}
             </span>
             <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
             <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
               {t('Page', language)} {currentPage} {t('of', language)} {Math.max(1, totalPages)}
             </div>
           </div>

           <div className="flex items-center gap-2 order-1 sm:order-2">
             <button
               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
               disabled={currentPage === 1}
               className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-600 transition-all shadow-sm uppercase tracking-wider"
             >
               {t('Previous', language)}
             </button>
             <button
               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
               disabled={currentPage >= totalPages}
               className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-600 transition-all shadow-sm uppercase tracking-wider"
             >
               {t('Next', language)}
             </button>
           </div>
        </div>
      </div>

      <TypeFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedItem} 
        onSubmit={handleSave}
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
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
      <div className={`w-8 h-8 rounded-xl ${themes[color]} flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
          {subText && <span className="text-[9px] font-bold text-slate-400">{subText}</span>}
        </div>
      </div>
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}