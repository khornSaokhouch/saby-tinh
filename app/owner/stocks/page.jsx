'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Package, Search, AlertCircle, ArrowUpRight, 
  TrendingDown, TrendingUp, Filter, Download, 
  Info, ShoppingBag, Eye, History, LayoutGrid, List,
  Image as ImageIcon, RefreshCw, Layers, ShieldCheck
} from 'lucide-react';
import { useStockStore } from '@/stores/useStockStore';
import { useUserStore } from '@/stores/userStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function OwnerStocksPage() {
  const { stocks, loading, error, fetchStocks } = useStockStore();
  const { user, fetchProfile } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  useEffect(() => {
    fetchProfile();
    fetchStocks();
  }, [fetchProfile, fetchStocks]);

  // Filtering Logic
  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const productName = stock.product_item?.product?.name || '';
      const sku = stock.product_item?.sku || '';
      const searchLower = searchTerm.toLowerCase();
      
      return productName.toLowerCase().includes(searchLower) || 
             sku.toLowerCase().includes(searchLower);
    });
  }, [stocks, searchTerm]);

  // Metrics Calculation
  const metrics = useMemo(() => {
    const totalItems = stocks.length;
    const lowStock = stocks.filter(s => s.product_item?.quantity_in_stock > 0 && s.product_item?.quantity_in_stock <= 10).length;
    const outOfStock = stocks.filter(s => s.product_item?.quantity_in_stock === 0).length;

    return { totalItems, lowStock, outOfStock };
  }, [stocks]);

  return (
    <div className="space-y-10 pb-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory Tracking</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Global Stock</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchStocks()}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="h-10 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
          <button className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 hover:shadow-slate-300 transition-all active:scale-95">
             Generate Report
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Tracking SKUs" value={metrics.totalItems} icon={Layers} color="indigo" />
        <MetricCard label="Low Stock Alert" value={metrics.lowStock} icon={AlertCircle} color="amber" subText="Under 10 units" />
        <MetricCard label="Out of Stock" value={metrics.outOfStock} icon={TrendingDown} color="rose" />
      </div>

      {/* --- INVENTORY LIST --- */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by Product name or SKU..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl h-fit">
            <button 
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
                <List size={18} />
            </button>
            <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
                <LayoutGrid size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Product & SKU</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Location</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Attributes</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                      <p className="text-slate-400 font-bold tracking-tight">Accessing Inventory Ledger...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStocks.length > 0 ? filteredStocks.map((stock, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={stock.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                        {stock.product_item?.product?.images?.[0]?.image ? (
                          <img src={stock.product_item.product.images[0].image} alt="product" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">{stock.product_item?.product?.name || 'Unknown Product'}</span>
                        <span className="text-[10px] font-black text-slate-400 mt-0.5 tracking-widest flex items-center gap-1.5 uppercase">
                            <ShieldCheck size={10} className="text-rose-500" />
                            SKU: {stock.product_item?.sku || 'NO-SKU'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <ShoppingBag size={12} className="text-indigo-500" />
                        <span className="text-sm font-bold uppercase tracking-tight">{stock.store?.name || 'Main Warehouse'}</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase">Branch ID: {stock.store?.id || '---'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                        {stock.product_item?.variants?.[0]?.color && (
                            <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-600 capitalize">
                                Color: {stock.product_item.variants[0].color.name}
                            </span>
                        )}
                        {stock.product_item?.variants?.[0]?.size && (
                            <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">
                                Size: {stock.product_item.variants[0].size.name}
                            </span>
                        )}
                        {!stock.product_item?.variants?.[0]?.color && !stock.product_item?.variants?.[0]?.size && (
                            <span className="text-[10px] font-medium text-slate-400 italic">Standard Unit</span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${
                                        stock.product_item?.quantity_in_stock > 10 ? 'bg-emerald-500' : 
                                        stock.product_item?.quantity_in_stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}
                                    style={{ width: `${Math.min(stock.product_item?.quantity_in_stock || 0, 100)}%` }}
                                />
                            </div>
                            <span className={`text-sm font-black ${
                                stock.product_item?.quantity_in_stock > 10 ? 'text-emerald-700' : 
                                stock.product_item?.quantity_in_stock > 0 ? 'text-amber-700' : 'text-rose-700'
                            }`}>
                                {stock.product_item?.quantity_in_stock || 0}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                            {stock.product_item?.quantity_in_stock > 10 ? 'Optimal Supply' : 
                             stock.product_item?.quantity_in_stock > 0 ? 'Replenishment Needed' : 'Sold Out'}
                        </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 rounded-2xl transition-all shadow-sm">
                        <History size={16} />
                    </button>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="px-8 py-10 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200 inline-block">
                        <div className="flex flex-col items-center gap-2">
                            <ShoppingBag size={40} className="text-slate-200" />
                            <p className="text-slate-400 font-bold tracking-tight">No stock records found for "{searchTerm}"</p>
                        </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
    amber: "bg-amber-50 text-amber-600 border-amber-100/50",
    rose: "bg-rose-50 text-rose-600 border-rose-100/50"
  };
  
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)] relative overflow-hidden group hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-500">
      <div className={`p-4 rounded-2xl w-fit mb-6 shadow-sm border ${themes[color]}`}><Icon size={24} strokeWidth={2.5} /></div>
      
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
            {subText && <span className="text-xs font-bold text-slate-400 tracking-tight">{subText}</span>}
        </div>
      </div>

      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className={`p-1.5 rounded-full ${themes[color]}`}>
            <ArrowUpRight size={14} />
        </div>
      </div>
      
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out -z-0" />
    </div>
  );
}
