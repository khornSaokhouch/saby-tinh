'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  TrendingUp, Search, RefreshCw, LayoutGrid, 
  Package, Store as StoreIcon, Filter, ChevronDown,
  Zap, ArrowUpRight, Tag, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function ProductPromotionsPage() {
  const { language } = useLanguageStore();
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
    fetchProductsByFilters({ has_promotion: true });
    fetchCategories();

    const interval = setInterval(() => {
      fetchProductsByFilters({ has_promotion: true });
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
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Promotion Audit', language)}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Discounted', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">{t('Catalog', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            {t('Monitoring active product offers and merchant discounts.', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchProductsByFilters({ has_promotion: true })}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-rose-500 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label={t('Total Offers', language)} value={products.length} icon={Tag} color="rose" language={language} />
        <StatCard label={t('Live Merchants', language)} value={new Set(products.map(p => p.store_id)).size} icon={StoreIcon} color="indigo" language={language} />
        <StatCard label={t('Categories', language)} value={new Set(products.map(p => p.category_id)).size} icon={LayoutGrid} color="blue" language={language} />
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder={t('Search offer catalog...', language)} 
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-rose-100 transition-all placeholder:text-slate-400"
              value={searchLocal}
              onChange={(e) => setSearchLocal(e.target.value)}
            />
          </div>

          <div className="relative flex-1 sm:flex-none w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto pl-4 pr-10 h-[32px] bg-slate-50 border border-transparent rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-all min-w-[140px]"
            >
              <option value="all">{t('All Inventory', language)}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={12} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Discounted Item', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Merchant Info', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Price Point', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Active Campaign', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse">{t('Scanning Catalog...', language)}</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="4" className="py-16 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('No products matching filter', language)}</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 shadow-sm">
                          {product.images?.[0]?.image ? (
                            <img src={product.images[0].image} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-[8px]">{t('NULL', language)}</div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-900 tracking-tight group-hover:text-rose-500 transition-colors truncate">{product.name}</span>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{product.brand?.name || t('GENERIC', language)} • {t('ID:', language)} {product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <StoreIcon size={10} className="text-indigo-500" />
                          <span className="text-[10px] font-bold text-slate-700">{product.store?.name}</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">{product.category?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900">${Number(product.price).toLocaleString()}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{product.type?.name || t('Retail', language)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {product.category?.promotions?.map(promo => (
                          <span key={promo.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-md text-[8px] font-black uppercase tracking-widest shadow-sm">
                            <TrendingUp size={9} strokeWidth={3} />
                            {promo.discount_percentage}% {t('OFF', language)}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-50/50 border-t border-slate-50 text-center">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('Authorized Promotion Audit', language)} • {filteredProducts.length} {t('Active Discounts', language)}</p>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (Dashboard/Registry Style) ---

function StatCard({ label, value, icon: Icon, color, language }) {
  const themes = {
    rose: "bg-rose-500 shadow-rose-100",
    indigo: "bg-indigo-600 shadow-indigo-100",
    blue: "bg-blue-600 shadow-blue-100",
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
      <div className={`w-8 h-8 rounded-xl ${themes[color]} flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10`}>
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