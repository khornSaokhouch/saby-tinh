'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Tag , Trash2, Package, Search, 
  MoreHorizontal, Filter, Layers , CheckCircle2, AlertCircle, Loader2,
  Image as ImageIcon, TrendingUp, DollarSign, Box, RefreshCw, ChevronRight,
  ShieldCheck, ArrowUpRight, Check, X ,Edit3 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/stores/useProductStore';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function OwnerProductsPage() {
    const { products, loading, fetchProducts, deleteProduct } = useProductStore();
    const { user, fetchProfile } = useUserStore();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal & Action States
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchProducts();

        const interval = setInterval(() => {
            fetchProducts();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchProfile, fetchProducts]);

    const handleDeleteConfirm = async (id) => {
        if (!id) return;
        setIsActionLoading(true);
        try {
            await deleteProduct(id);
            setConfirmDeleteId(null);
            toast.success('Product deleted');
            fetchProducts();
        } catch (err) {
            console.error("Deletion failed:", err);
            toast.error('Failed to delete product');
        } finally {
            setIsActionLoading(false);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const nameMatch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase());
            const idMatch = String(p.id).includes(searchTerm);
            return nameMatch || idMatch;
        });
    }, [products, searchTerm]);

    // Stats Calculations
    const stats = useMemo(() => {
        const total = filteredProducts.length;
        const active = filteredProducts.filter(p => p.status).length;
        const totalValue = filteredProducts.reduce((acc, p) => acc + (parseFloat(p.price || 0)), 0);
        return { total, active, totalValue };
    }, [filteredProducts]);

    return (
        <div className="space-y-6 pb-10 font-sans">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-indigo-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inventory Control</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">My Products</h1>
        </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => fetchProducts()}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button 
            onClick={() => router.push('/owner/products/create')}
            className="flex items-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={2.5} /> Add Product
          </button>
                </div>
            </div>

            {/* --- METRICS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <MetricCard label="Total Items" value={stats.total} icon={Box} color="indigo" />
                <MetricCard label="Market Ready" value={stats.active} icon={CheckCircle2} color="emerald" subText={`${stats.total - stats.active} in dev`} />
                <MetricCard label="Stock Value" value={`$${stats.totalValue.toLocaleString()}`} icon={DollarSign} color="rose" />
            </div>

            {/* --- PRODUCT REGISTRY --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by product name or ID..." 
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Info</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promotion</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading && products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                                            <p className="text-slate-400 font-bold tracking-tight">Syncing inventory...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length > 0 ? filteredProducts.map((product, idx) => (
                                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={product.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:shadow-md transition-all duration-300">
                                                {product.images?.[0]?.image ? (
                                                    <img src={product.images[0].image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50 font-black text-[9px]">NO IMG</div>
                                                )}
                                            </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-1">{product.name}</span>
                        <span className="text-[10px] font-medium text-slate-400 mt-0.5">ID: #{product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Layers size={12} className="text-indigo-500" />
                        <span className="text-[13px] font-bold text-slate-700">{product.category?.name || 'General'}</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.brand?.name || 'Default'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-black text-slate-900">${product.price}</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{product.type?.name || 'Retail'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                       {product.category?.promotions?.length > 0 ? (
                         <>
                           <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black ring-1 ring-rose-600/10 w-fit">
                             <TrendingUp size={10} /> {product.category.promotions[0].discount_percentage}% OFF
                           </span>
                           <span className="text-[9px] text-slate-400 font-medium truncate max-w-[100px]">{product.category.promotions[0].name}</span>
                         </>
                       ) : (
                         <span className="text-[10px] text-slate-300 font-medium italic">No active offer</span>
                       )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest
                        ${product.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        <div className={`w-1 h-1 rounded-full ${product.status ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                        {product.status ? 'Market Ready' : 'Hidden'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => router.push(`/owner/products/${product.id}/edit`)} 
                        className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                      >
                        <Edit3 size={14} strokeWidth={2.5} />
                      </button>
                                            
                                            <AnimatePresence mode="wait" initial={false}>
                                                {confirmDeleteId === product.id ? (
                                                    <motion.div
                                                        key="confirm-delete"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <button
                                                            onClick={() => handleDeleteConfirm(product.id)}
                                                            disabled={isActionLoading}
                                                            className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-sm disabled:opacity-50"
                                                        >
                                                            {isActionLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={2.5} />}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                            >
                              <X size={12} strokeWidth={2.5} />
                            </button>
                                                    </motion.div>
                                                ) : (
                                                    <motion.button
                                                        key="delete-button"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        onClick={() => setConfirmDeleteId(product.id)}
                                                        className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
                          </motion.button>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package size={40} className="text-slate-200" />
                                            <p className="text-slate-400 font-bold tracking-tight">Zero items found in this section.</p>
                                            <Link href="/owner/products/create" className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">Launch your first product</Link>
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
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
        rose: "bg-rose-50 text-rose-600 border-rose-100/50"
    };
    
    return (
        <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)] relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className={`p-2.5 rounded-xl w-fit mb-4 shadow-sm border ${themes[color]}`}><Icon size={18} strokeWidth={2.5} /></div>
            
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
                    {subText && <span className="text-[10px] font-bold text-slate-400 tracking-tight">{subText}</span>}
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
