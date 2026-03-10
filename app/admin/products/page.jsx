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
    <div className="space-y-10 pb-10 font-sans">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Inventory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Global Products Catalog</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchProducts()}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} strokeWidth={2.5} />
          </button>
          <div className="px-4 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-2 shadow-sm">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Admin View Only</span>
          </div>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Products" value={stats.total} icon={Box} color="indigo" />
        <MetricCard label="Active Listings" value={stats.active} icon={CheckCircle2} color="emerald" subText={`${stats.total - stats.active} inactive`} />
        <MetricCard label="Top Price" value={`$${stats.topPrice.toLocaleString()}`} icon={DollarSign} color="rose" />
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 border-b border-slate-50 bg-slate-50/20 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 sm:max-w-sm group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[12px] font-medium text-slate-700 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border bg-white border-slate-100 text-slate-600 hover:bg-slate-50 text-[11px] font-black uppercase tracking-widest transition-all shadow-sm"
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && (
                <span className="bg-indigo-600 text-white text-[9px] font-black rounded-full px-1.5 py-0.5">ON</span>
              )}
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 text-[11px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 shadow-sm shadow-rose-50"
              >
                <X size={15} /> Clear
              </button>
            )}

            <div className="hidden sm:block sm:flex-1" />

            {/* Results Count */}
            <div className="px-4 py-3 bg-slate-100/50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">
              {filteredProducts.length} Results
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {/* Store Filter */}
                  <FilterSelect
                    icon={Store}
                    label="Store"
                    value={filterStore}
                    onChange={setFilterStore}
                    options={stores.map(s => ({ value: String(s.id), label: s.name }))}
                  />
                  {/* Category Filter */}
                  <FilterSelect
                    icon={Layers}
                    label="Category"
                    value={filterCategory}
                    onChange={setFilterCategory}
                    options={categories.map(c => ({ value: String(c.id), label: c.name }))}
                  />
                  {/* Brand Filter */}
                  <FilterSelect
                    icon={Tag}
                    label="Brand"
                    value={filterBrand}
                    onChange={setFilterBrand}
                    options={brands.map(b => ({ value: String(b.id), label: b.name }))}
                  />
                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                      <DollarSign size={10} />Price Range
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-900 placeholder:text-slate-300"
                      />
                      <span className="text-slate-300 font-bold text-sm">–</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-900 placeholder:text-slate-300"
                      />
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand & Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Store</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                      <p className="text-slate-400 font-bold tracking-tight">Loading products...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? filteredProducts.map((product, idx) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                        {product.images?.[0]?.image ? (
                          <img src={product.images[0].image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">{product.name}</span>
                        <span className="text-[10px] font-black text-slate-300 mt-0.5 tracking-tighter flex items-center gap-1 uppercase">
                          <ShieldCheck size={10} className="text-rose-500" />
                          ID: #{product.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Brand & Category */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md w-fit">
                        {product.category?.name || '—'}
                      </span>
                      <span className="text-xs font-bold text-slate-400 ml-0.5">{product.brand?.name || '—'}</span>
                    </div>
                  </td>

                  {/* Store */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Store size={12} className="text-indigo-400 shrink-0" />
                      <span className="text-xs font-bold truncate max-w-[120px]">{product.store?.name || '—'}</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 tracking-tight">${parseFloat(product.price || 0).toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Base SRP</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${product.status ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {product.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package size={40} className="text-slate-200" />
                      <p className="text-slate-400 font-bold tracking-tight">No products match the current filters.</p>
                      {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">
                          Clear all filters
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
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {filteredProducts.length} of {products.length} products
          </span>
          <div className="px-3 py-1.5 bg-indigo-50 rounded-xl text-[9px] font-black text-indigo-500 uppercase tracking-widest">
            Admin View · View Only
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
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-1">Loading Products</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preparing data stream...</p>
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
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
    rose: 'bg-rose-50 text-rose-600 border-rose-100/50',
  };
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
      <div className={`p-2.5 rounded-xl w-fit mb-4 border ${themes[color]}`}><Icon size={18} strokeWidth={2.5} /></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2 relative z-10">
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
        {subText && <span className="text-[10px] font-bold text-slate-400">{subText}</span>}
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}

function FilterSelect({ icon: Icon, label, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
        <Icon size={10} />{label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-12 pl-4 pr-10 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 outline-none appearance-none cursor-pointer"
        >
          <option value="">All {label}s</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}