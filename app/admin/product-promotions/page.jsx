'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp , Search, Plus, Edit3, Trash2, Clock, 
  Loader2, CheckCircle2, Ticket, Zap, LayoutGrid, Filter,
  Package, Store as StoreIcon, Tag, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';

export default function ProductPromotionsPage() {
  const { 
    products, 
    loading: productLoading, 
    fetchProductsByFilters,
  } = useProductStore();

  const {
    categories,
    loading: catLoading,
    fetchCategories
  } = useCategoryStore();

  const [searchLocal, setSearchLocal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Fetch products that HAVE promotions
    fetchProductsByFilters({ has_promotion: true });
    fetchCategories();

    const interval = setInterval(() => {
      fetchProductsByFilters({ has_promotion: true });
      fetchCategories();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchProductsByFilters, fetchCategories]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchLocal.toLowerCase()) ||
                          p.brand?.name?.toLowerCase().includes(searchLocal.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      p.category_id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const loading = productLoading || catLoading;

  return (
    <div className="space-y-10 pb-10 font-sans">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Offer Audit</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Discounted Catalog</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              fetchProductsByFilters({ has_promotion: true });
              fetchCategories();
            }}
            className="p-3 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Discounted" value={products.length} icon={Package} color="indigo" />
        <MetricCard label="Active Stores" value={new Set(products.map(p => p.store_id)).size} icon={StoreIcon} color="emerald" subText="With Offers" />
        <MetricCard label="Categories" value={new Set(products.map(p => p.category_id)).size} icon={LayoutGrid} color="purple" />
      </div>

      {/* --- FILTERS & PRODUCT TABLE --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search offer catalog..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 shadow-sm text-slate-700 font-sans"
              value={searchLocal}
              onChange={(e) => setSearchLocal(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-10 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-700 min-w-[180px] appearance-none cursor-pointer outline-none hover:border-indigo-200 transition-all tracking-widest shadow-sm"
              >
                <option value="all">All Inventory </option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <LayoutGrid size={12} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Discounted Item</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Merchant / Scope</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Point</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Offers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-600 opacity-20" />
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Analyzing Inventory...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Package size={40} className="text-slate-100" />
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No discounted items located</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.map((product, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={product.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl bg-white overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                        {product.images?.[0]?.image ? (
                          <img src={product.images[0].image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50 font-black text-[9px]">NO IMG</div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-1">{product.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wider">ID: #{product.id} • {product.brand?.name || 'GENERIC'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 italic">
                          <StoreIcon size={10} strokeWidth={3} />
                        </div>
                        <span className="text-[12px] font-black text-slate-700 uppercase tracking-tight">{product.store?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                            {product.category?.category_image ? (
                              <img src={product.category.category_image} alt="" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <LayoutGrid size={10} strokeWidth={3} />
                            )}
                         </div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.category?.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-black">
                    <div className="flex flex-col">
                      <span className="text-[15px] text-slate-900">${Number(product.price).toLocaleString()}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{product.type?.name || 'Retail'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                       {product.category?.promotions?.map(promo => (
                         <div key={promo.id} className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-100 ring-1 ring-rose-600/5 group-hover:scale-105 transition-transform shadow-sm">
                           <TrendingUp size={10} strokeWidth={3} />
                           {promo.discount_percentage}% OFF • {promo.name}
                         </div>
                       ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  const themes = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
    purple: 'bg-purple-50 text-purple-600 border-purple-100/50',
  };
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500 text-left">
      <div className="absolute top-0 right-0 w-20 h-20 translate-x-8 -translate-y-8 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-[0.03] active:opacity-[0.05] group-hover:rotate-45 transition-all duration-700" />
      <div className={`p-2.5 rounded-xl w-fit mb-4 border-2 border-white shadow-sm relative z-10 ${themes[color] || themes.indigo}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}
