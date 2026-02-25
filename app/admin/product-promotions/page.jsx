'use client';

import { useEffect, useState } from 'react';
import { 
  Percent, Search, Plus, Edit3, Trash2, Clock, 
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
            <Tag className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discounted Inventory</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Product Discounts</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              fetchProductsByFilters({ has_promotion: true });
              fetchCategories();
            }}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Items" value={products.length} icon={Package} color="indigo" />
        <MetricCard label="Active Offers" value="Live" icon={CheckCircle2} color="emerald" />
        <MetricCard label="Categories" value={new Set(products.map(p => p.category_id)).size} icon={LayoutGrid} color="purple" />
      </div>

      {/* --- FILTERS & PRODUCT TABLE --- */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400"
              value={searchLocal}
              onChange={(e) => setSearchLocal(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none appearance-none cursor-pointer hover:border-indigo-200 min-w-[180px]"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <LayoutGrid size={14} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Product Info</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Store & Category</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Active Promotions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 opacity-20" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <p className="text-sm font-medium text-slate-400">No products found with active promotions.</p>
                  </td>
                </tr>
              ) : filteredProducts.map((product, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={product.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                        {product.images?.[0]?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.images[0].image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 line-clamp-1">{product.name}</span>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">{product.brand?.name || 'Generic'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <StoreIcon size={12} className="text-slate-400" />
                        {product.store?.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <LayoutGrid size={10} className="text-slate-300" />
                        {product.category?.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">${Number(product.price).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                       {product.category?.promotions?.map(promo => (
                         <div key={promo.id} className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase border border-rose-100 italic transition-transform group-hover:scale-105">
                           <Ticket size={10} />
                           {promo.discount_percentage}% OFF - {promo.name}
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
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600"
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
