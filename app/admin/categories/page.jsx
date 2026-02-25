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
    <div className="space-y-10 pb-10 font-sans">

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category List</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Categories</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchCategories()}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={18} strokeWidth={2.5} /> New Category
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Categories" value={categories.length} icon={LayoutGrid} color="indigo" />
        <MetricCard label="Active Categories" value={categories.filter(c => c.status == 1).length} icon={CheckCircle2} color="emerald" />
        <MetricCard label="Inactive" value={categories.filter(c => c.status != 1).length} icon={XCircle} color="purple" />
      </div>

      {/* --- CATEGORY TABLE --- */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/20">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Update</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && categories.length === 0 ? (
                 <tr><td colSpan="4" className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 opacity-20" />
                 </td></tr>
              ) : filteredCategories.length === 0 ? (
                  <tr><td colSpan="4" className="py-20 text-center text-sm font-bold text-slate-400 uppercase tracking-wider">No categories found</td></tr>
              ) : (
                filteredCategories.map((category, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    key={category.id} className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-white shadow-sm overflow-hidden relative">
                           {category.category_image ? (
                              <motion.img
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                src={category.category_image} className="w-full h-full object-cover"
                              />
                           ) : (
                              <Package className="w-5 h-5 text-slate-400" />
                           )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{category.name}</span>
                          <span className="text-[10px] font-medium text-slate-400 mt-0.5 tracking-wider uppercase">ID: {category.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${
                        category.status == 1
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        {category.status == 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-slate-500">
                        {new Date(category.updated_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Link
                          href={`/admin/categories/details?categoryId=${category.id}`}
                          className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                          title="View Products"
                        >
                          <Eye size={14} strokeWidth={2.5} />
                        </Link>
                        <button
                          onClick={() => { setSelectedItem(category); setIsFormOpen(true); }}
                          className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                        >
                          <Edit3 size={14} strokeWidth={2.5} />
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
                                className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-sm disabled:opacity-50"
                                title="Confirm Delete"
                              >
                                {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 hover:text-slate-600 transition-all shadow-sm"
                                title="Cancel"
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
                              onClick={() => setConfirmDeleteId(category.id)}
                              className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                              title="Delete Category"
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
