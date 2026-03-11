'use client';

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Package, Search, Filter, X, ChevronDown,
  Image as ImageIcon, DollarSign, Box,
  CheckCircle2, ShieldCheck, SlidersHorizontal,
  Store, Tag, Layers, RefreshCw, ArrowUpRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useBrandStore } from '@/stores/useBrandStore';
import { useStore } from '@/stores/useStore';

function AdminProductsContent() {
  const { products, loading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { brands, fetchBrands } = useBrandStore();
  const { stores, fetchStores } = useStore();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [filterStore, setFilterStore] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  const initialStoreId = searchParams.get('storeId');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
    fetchStores();
    
    if (initialStoreId) {
      setFilterStore(initialStoreId);
      setIsFilterOpen(true);
    }
  }, [fetchProducts, fetchCategories, fetchBrands, fetchStores, initialStoreId]);

  // Apply filters client-side for instant feedback; backend call used for initial load
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search ||
        (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.brand?.name || '').toLowerCase().includes(search.toLowerCase());
      const matchStore = !filterStore || String(p.store_id) === filterStore;
      const matchCategory = !filterCategory || String(p.category_id) === filterCategory;
      const matchBrand = !filterBrand || String(p.brand_id) === filterBrand;
      const matchMinPrice = !minPrice || parseFloat(p.price) >= parseFloat(minPrice);
      const matchMaxPrice = !maxPrice || parseFloat(p.price) <= parseFloat(maxPrice);
      return matchSearch && matchStore && matchCategory && matchBrand && matchMinPrice && matchMaxPrice;
    });
  }, [products, search, filterStore, filterCategory, filterBrand, minPrice, maxPrice]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.status).length,
    topPrice: products.reduce((max, p) => Math.max(max, parseFloat(p.price || 0)), 0),
  }), [products]);

  const hasActiveFilters = filterStore || filterCategory || filterBrand || minPrice || maxPrice;

  const clearFilters = () => {
    setFilterStore('');
    setFilterCategory('');
    setFilterBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
  };

  return (
    <div className="space-y-6 pb-10 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
 
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Product Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Inventory <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Registry</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchProducts()}
            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 rounded-xl transition-all active:scale-95 shadow-sm"
            title="Sync Registry"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl flex items-center gap-2 shadow-sm">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Admin Node</span>
          </div>
        </div>
      </div>
 
      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Active Stock" value={stats.total} icon={Box} color="indigo" />
        <MetricCard label="Operational" value={stats.active} icon={CheckCircle2} color="emerald" subText={`${stats.total - stats.active} off`} />
        <MetricCard label="Valuation Apex" value={`$${stats.topPrice.toLocaleString()}`} icon={DollarSign} color="purple" />
      </div>
 
      {/* --- TABLE AREA --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
 
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
 
            {/* Search */}
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={13} />
              <input
                type="text"
                placeholder="Search by name, brand or ID..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:border-emerald-100 transition-all outline-none placeholder:text-slate-400"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
 
            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isFilterOpen ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm'}`}
            >
              <SlidersHorizontal size={14} />
              Configuration
              {hasActiveFilters && (
                <span className="bg-emerald-500 text-white text-[8px] font-black rounded-full px-1.5 py-0.5 ml-1">SET</span>
              )}
            </button>
 
            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
              >
                <X size={14} /> Reset
              </button>
            )}
 
            <div className="hidden sm:block sm:flex-1" />
 
            {/* Results Count */}
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
              {filteredProducts.length} Entries Detected
            </div>
          </div>
 
          {/* Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-slate-50 mt-2 pt-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Store Filter */}
                  <FilterSelect
                    icon={Store}
                    label="Store Node"
                    value={filterStore}
                    onChange={setFilterStore}
                    options={stores.map(s => ({ value: String(s.id), label: s.name }))}
                  />
                  {/* Category Filter */}
                  <FilterSelect
                    icon={Layers}
                    label="Vertical"
                    value={filterCategory}
                    onChange={setFilterCategory}
                    options={categories.map(c => ({ value: String(c.id), label: c.name }))}
                  />
                  {/* Brand Filter */}
                  <FilterSelect
                    icon={Tag}
                    label="Label"
                    value={filterBrand}
                    onChange={setFilterBrand}
                    options={brands.map(b => ({ value: String(b.id), label: b.name }))}
                  />
                  {/* Price Range */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                      <DollarSign size={10} className="text-emerald-500" />Valuation Range
                    </label>
                    <div className="flex items-center gap-2">
                       <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300">MIN</span>
                          <input
                            type="number"
                            value={minPrice}
                            onChange={e => setMinPrice(e.target.value)}
                            className="w-full h-10 pl-10 pr-3 bg-white border border-slate-100 rounded-xl text-[11px] font-bold focus:border-emerald-100 outline-none text-slate-700"
                          />
                       </div>
                       <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300">MAX</span>
                          <input
                            type="number"
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                            className="w-full h-10 pl-10 pr-3 bg-white border border-slate-100 rounded-xl text-[11px] font-bold focus:border-emerald-100 outline-none text-slate-700"
                          />
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
 
        {/* Table */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Metadata</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Node Path</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-emerald-500" size={24} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronizing Registry...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? filteredProducts.map((product, idx) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  {/* Product */}
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {product.images?.[0]?.image ? (
                          <img src={product.images[0].image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={16} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black text-slate-900 truncate tracking-tight">{product.name}</span>
                        <span className="text-[9px] font-black text-slate-300 tracking-widest uppercase">ID: #{product.id}</span>
                      </div>
                    </div>
                  </td>
 
                  {/* Brand & Category */}
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                        {product.category?.name || '—'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 truncate">{product.brand?.name || '—'}</span>
                    </div>
                  </td>
 
                  {/* Store */}
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Store size={10} className="text-indigo-400 shrink-0" />
                      <span className="text-[11px] font-bold truncate max-w-[140px]">{product.store?.name || '—'}</span>
                    </div>
                  </td>
 
                  {/* Price */}
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-slate-900 tracking-tight">${parseFloat(product.price || 0).toLocaleString()}</span>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Unit SRP</span>
                    </div>
                  </td>
 
                  {/* Status */}
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${product.status ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                         {product.status ? 'Operational' : 'Inactive'}
                       </span>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-200">
                      <Package size={40} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zero entries detected</p>
                      {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-emerald-600 text-[9px] font-black uppercase tracking-widest mt-2 hover:underline">
                          Reset Environment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
 
        {/* Footer */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            {filteredProducts.length} Nodes in view
          </span>
          <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
            Read Only Access
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default function AdminProductsPage() {
  return (
    <Suspense fallback={
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6 font-sans">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <div className="text-center">
          <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-1">Loading Assets</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Syncing with directory hardware...</p>
        </div>
      </div>
    }>
      <AdminProductsContent />
    </Suspense>
  );
}
 
// --- SUB COMPONENTS ---
 
function MetricCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    rose: 'bg-rose-500 shadow-rose-100',
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
 
function FilterSelect({ icon: Icon, label, value, onChange, options }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
        <Icon size={10} className="text-emerald-500" />{label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-10 pl-3 pr-8 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 focus:border-emerald-100 outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-all"
        >
          <option value="">All Entries</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
