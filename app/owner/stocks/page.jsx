'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Package, Search, AlertCircle, ArrowUpRight, 
  TrendingDown, TrendingUp, Filter, Download, 
  Info, ShoppingBag, Eye, History, LayoutGrid, List,
  Image as ImageIcon, RefreshCw, Layers, ShieldCheck, Box
} from 'lucide-react';
import { useStockStore } from '@/stores/useStockStore';
import { useUserStore } from '@/stores/userStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function OwnerStocksPage() {
  const { stocks, loading, error, fetchStocks } = useStockStore();
  const { user, fetchProfile } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); 

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

  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventory Hub</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Stock</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">Status for {today}</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchStocks()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-md hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest">
                <Download size={14} strokeWidth={3} /> Report
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Total SKU" value={metrics.totalItems} icon={Layers} color="indigo" />
        <MetricCard label="Alerts" value={metrics.lowStock} icon={AlertCircle} color="amber" subText="Low Supply" />
        <MetricCard label="Depleted" value={metrics.outOfStock} icon={TrendingDown} color="rose" subText="Zero Stock" />
      </div>

      {/* --- INVENTORY LIST --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
              <input 
                type="text" 
                placeholder="Search Item or SKU..." 
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:border-indigo-100 transition-all outline-none placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="hidden sm:block flex-1" />
            
            <div className="flex items-center bg-white border border-slate-100 p-0.5 rounded-lg h-fit">
                <button 
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-slate-500'}`}
                >
                    <List size={14} strokeWidth={3} />
                </button>
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-slate-500'}`}
                >
                    <LayoutGrid size={14} strokeWidth={3} />
                </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Identity</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Facility</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Attributes</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Supply Health</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Vault...</span>
                      </div>
                   </td>
                </tr>
              ) : filteredStocks.length > 0 ? filteredStocks.map((stock, idx) => (
                <motion.tr 
                  key={stock.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                        {stock.product_item?.product?.images?.[0]?.image ? (
                          <img src={stock.product_item.product.images[0].image} alt="product" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={14} className="text-slate-200" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black text-slate-900 truncate tracking-tight uppercase leading-tight">{stock.product_item?.product?.name || 'Unknown Item'}</span>
                        <span className="text-[9px] font-black text-indigo-400 tracking-widest uppercase mt-0.5">SKU: {stock.product_item?.sku || 'NO-SKU'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Box size={11} className="text-indigo-500" strokeWidth={3} />
                        <span className="text-[11px] font-black uppercase tracking-tight">{stock.store?.name || 'Main Registry'}</span>
                      </div>
                      <span className="text-[8px] font-black text-slate-300 uppercase mt-0.5">Unit {stock.store?.id || '00'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                        {stock.product_item?.variants?.[0]?.color && (
                            <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                                {stock.product_item.variants[0].color.name}
                            </span>
                        )}
                        {stock.product_item?.variants?.[0]?.size && (
                            <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                                {stock.product_item.variants[0].size.name}
                            </span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-50 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${
                                        stock.product_item?.quantity_in_stock > 10 ? 'bg-emerald-500' : 
                                        stock.product_item?.quantity_in_stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}
                                    style={{ width: `${Math.min((stock.product_item?.quantity_in_stock || 0) * 2, 100)}%` }}
                                />
                            </div>
                            <span className={`text-[11px] font-black tabular-nums ${
                                stock.product_item?.quantity_in_stock > 10 ? 'text-emerald-600' : 
                                stock.product_item?.quantity_in_stock > 0 ? 'text-amber-600' : 'text-rose-600'
                            }`}>
                                {stock.product_item?.quantity_in_stock || 0}
                            </span>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="p-1.5 bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg shadow-sm active:scale-95 transition-all">
                        <History size={14} strokeWidth={3} />
                    </button>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Package size={40} className="text-slate-100" />
                       <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">No records mapping "{searchTerm}"</p>
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
    indigo: "bg-indigo-600 shadow-indigo-100",
    amber: "bg-amber-500 shadow-amber-100",
    rose: "bg-rose-500 shadow-rose-100",
  };
  
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
        <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 mb-3 relative z-10`}>
            <Icon size={14} strokeWidth={3} />
        </div>
        <div className="relative z-10">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
                {subText && <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{subText}</span>}
            </div>
        </div>
        <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}
