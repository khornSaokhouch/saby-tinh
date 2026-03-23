'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Briefcase, Search, Plus, Edit3, Trash2, Clock, 
  Loader2, CheckCircle2, Layers, ChevronLeft, ChevronRight, X, Check, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrandStore } from '@/stores/useBrandStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import BrandFormModal from '@/app/components/admin/modelform/BrandFormModal';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import { toast } from 'react-hot-toast';

export default function BrandsPage() {
  const { language } = useLanguageStore();
  const { 
    brands, 
    loading, 
    fetchBrands, 
    search, 
    setSearch, 
    saveBrand, 
    deleteBrand,
    deleteMultipleBrands 
  } = useBrandStore();

  const { categories, fetchCategories } = useCategoryStore();

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
    fetchBrands();
    fetchCategories();

    const interval = setInterval(() => {
      fetchBrands();
      fetchCategories();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchBrands, fetchCategories]);

  // Reset pagination and selection on search or filter change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [search, selectedCategoryId]);

  const filteredBrands = useMemo(() => {
    return (brands || []).filter(brand => {
      const matchesSearch = (brand?.name || '').toLowerCase().includes((search || '').toLowerCase());
      const matchesCategory = selectedCategoryId === 'all' || brand.category_id === Number(selectedCategoryId);
      return matchesSearch && matchesCategory;
    });
  }, [brands, search, selectedCategoryId]);

  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBrands.slice(start, start + pageSize);
  }, [filteredBrands, currentPage]);

  const totalPages = Math.ceil(filteredBrands.length / pageSize);

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? t(category.name, language) : t('Unassigned', language);
  };

  // --- Handlers ---
  const handleSelectAll = () => {
    if (selectedIds.length === filteredBrands.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBrands.map(b => b.id));
    }
  };

  const toggleSelectId = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (window.confirm(t(`Are you sure you want to delete count brands?`, language).replace('count', selectedIds.length))) {
      setIsActionLoading(true);
      try {
        await deleteMultipleBrands(selectedIds);
        setSelectedIds([]);
        toast.success(t('Removed counts brands', language).replace('counts', selectedIds.length));
      } catch (error) {
        toast.error(t('Batch deletion failed', language));
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const handleSave = async (data) => {
    setIsActionLoading(true);
    try {
      await saveBrand({ ...data, id: selectedItem?.id });
      setIsFormOpen(false);
      toast.success(t('Brand saved', language));
    } catch (error) {
      console.error('Failed to save brand:', error);
      toast.error(t('Failed to save brand', language));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsActionLoading(true);
    try {
      await deleteBrand(id);
      setConfirmDeleteId(null);
      toast.success(t('Brand deleted', language));
    } catch (error) {
      console.error('Failed to delete brand:', error);
      toast.error(t('Failed to delete brand', language));
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
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">{t('Selected Brands', language)}</span>
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
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Industry Registry', language)}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Corporate', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-400">{t('Brands', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            {t('Maintain and organize your platform\'s brand architecture.', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchBrands()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-500 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={14} strokeWidth={3} /> {t('Create Brand', language)}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label={t('Total Brands', language)} value={brands.length} icon={Briefcase} color="indigo" />
        <MetricCard label={t('Active Items', language)} value={brands.filter(b => Number(b.status) === 1).length} icon={CheckCircle2} color="emerald" subText={t('Live', language)} />
        <MetricCard label={t('System Integrity', language)} value={t('Unified', language)} icon={Clock} color="purple" />
      </div>

      {/* --- BRANDS TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={13} />
              <input
                type="text"
                placeholder={t('Search brands...', language)}
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
                  <option key={cat.id} value={cat.id}>{t(cat.name, language)}</option>
                ))}
              </select>
              <Layers className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
            </div>
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {t('count Brands Found', language).replace('count', filteredBrands.length)}
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
                    selectedIds.length === filteredBrands.length && filteredBrands.length > 0
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'bg-white border-slate-200 hover:border-indigo-400'
                  }`}>
                    {selectedIds.length === filteredBrands.length && filteredBrands.length > 0 && <Check size={10} className="text-white" strokeWidth={5} />}
                  </div>
                </th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">{t('Brand Detail', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center min-w-[120px]">{t('Category', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center min-w-[120px]">{t('Status', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center min-w-[140px]">{t('Last Update', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Action', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-left">
              {loading && brands.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse">{t('Loading ...', language)}</td>
                </tr>
              ) : paginatedBrands.length === 0 ? (
                <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Briefcase size={40} className="text-slate-100" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('No brands matching filter', language)}</p>
                      </div>
                    </td>
                </tr>
              ) : paginatedBrands.map((brand, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                  key={brand.id} className={`group hover:bg-slate-50/30 transition-colors ${selectedIds.includes(brand.id) ? 'bg-indigo-50/40' : ''}`}
                >
                  <td className="pl-6 py-3.5">
                    <div 
                      onClick={() => toggleSelectId(brand.id)}
                      className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                      selectedIds.includes(brand.id) 
                        ? 'bg-indigo-600 border-indigo-600' 
                        : 'bg-white border-slate-200 group-hover:border-indigo-300'
                    }`}>
                      {selectedIds.includes(brand.id) && <Check size={10} className="text-white" strokeWidth={5} />}
                    </div>
                  </td>
                   <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center border border-white shadow-sm overflow-hidden relative shrink-0 transition-transform group-hover:scale-105">
                         {brand.brand_image ? (
                            <motion.img 
                               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                               src={brand.brand_image} className="w-full h-full object-contain p-2" 
                            />
                         ) : (
                            <Briefcase className="w-5 h-5 text-slate-400" />
                         )}
                      </div>
                      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg text-[8px] font-black uppercase tracking-widest">
                      <Layers size={10} className="text-slate-400" strokeWidth={3} />
                      {getCategoryName(brand.category_id)}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                      Number(brand.status) === 1 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${Number(brand.status) === 1 ? 'bg-emerald-600 animate-pulse' : 'bg-rose-500'}`} />
                      {Number(brand.status) === 1 ? t('Live', language) : t('Hidden', language)}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-slate-700">
                        {new Date(brand.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        {t('at', language)} {new Date(brand.updated_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => { setSelectedItem(brand); setIsFormOpen(true); }} 
                        className="p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-sm active:scale-95 transition-all"
                      >
                        <Edit3 size={14} strokeWidth={3} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === brand.id ? (
                          <motion.div
                            key="confirm-delete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1.5"
                          >
                            <button
                              onClick={() => handleDelete(brand.id)}
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
                            onClick={() => setConfirmDeleteId(brand.id)}
                            className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-all active:scale-95"
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
               {t('Showing', language)} {paginatedBrands.length} {t('of', language)} {filteredBrands.length}
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
               className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-600 transition-all shadow-sm uppercase tracking-wider flex items-center gap-1"
             >
               <ChevronLeft size={12} strokeWidth={3} /> {t('Previous', language)}
             </button>
             <button
               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
               disabled={currentPage >= totalPages}
               className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-600 transition-all shadow-sm uppercase tracking-wider flex items-center gap-1"
             >
               {t('Next', language)} <ChevronRight size={12} strokeWidth={3} />
             </button>
           </div>
        </div>
      </div>

      <BrandFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedItem} 
        onSubmit={handleSave}
        isSubmitting={isActionLoading}
        categories={categories}
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
