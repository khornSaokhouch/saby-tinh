'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Tag, Trash2, Package, Search, 
  MoreHorizontal, Filter, Layers, CheckCircle2, AlertCircle, Loader2,
  Image as ImageIcon, TrendingUp, DollarSign, Box, RefreshCw, ChevronRight,
  ShieldCheck, ArrowUpRight, Check, X, Edit3, SlidersHorizontal, ChevronDown
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
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // Modal & Action States
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchProducts();
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
        <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Catalog</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                        Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Products</span>
                    </h1>
                    <p className="text-slate-500 text-[12px] font-medium mt-1">
                        Organize and monitor your store inventory.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => fetchProducts()}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
                    </button>
                    <button 
                        onClick={() => router.push('/owner/products/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-md hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest"
                    >
                        <Plus size={14} strokeWidth={3} /> Add Item
                    </button>
                </div>
            </div>

            {/* --- METRICS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard label="Total Items" value={stats.total} icon={Box} color="indigo" />
                <MetricCard label="Active Items" value={stats.active} icon={CheckCircle2} color="emerald" subText={`${stats.total - stats.active} Hidden`} />
                <MetricCard label="Inventory Value" value={`$${stats.totalValue.toLocaleString()}`} icon={DollarSign} color="rose" />
            </div>

            {/* --- TABLE AREA --- */}
            <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-50 bg-slate-50/20 space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search */}
                        <div className="relative w-full sm:w-64 group text-left">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
                            <input 
                                type="text" 
                                placeholder="Search inventory..." 
                                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:border-indigo-100 transition-all outline-none placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="hidden sm:block sm:flex-1" />

                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                            {filteredProducts.length} Items Listed
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Info</th>
                                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Category & Brand</th>
                                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Condition</th>
                                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading && products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-indigo-500" size={24} />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing ...</span>
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

                                    <td className="px-6 py-3.5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                                                {product.category?.name || 'General'}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 truncate">{product.brand?.name || 'No Brand'}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-black text-slate-900 tracking-tight">${parseFloat(product.price || 0).toLocaleString()}</span>
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{product.type?.name || 'Retail'}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-3.5">
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest
                                            ${product.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                            <div className={`w-1 h-1 rounded-full ${product.status ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                                            {product.status ? 'Active' : 'Hidden'}
                                        </div>
                                    </td>

                                    <td className="px-6 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => router.push(`/owner/products/${product.id}/edit`)} 
                                                className="p-1.5 bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg shadow-sm active:scale-95 transition-all"
                                            >
                                                <Edit3 size={14} strokeWidth={3} />
                                            </button>
                                            
                                            <AnimatePresence mode="wait" initial={false}>
                                                {confirmDeleteId === product.id ? (
                                                    <motion.div
                                                        key="confirm"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <button
                                                            onClick={() => handleDeleteConfirm(product.id)}
                                                            className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm"
                                                        >
                                                            <Check size={12} strokeWidth={3} />
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            className="p-1.5 bg-slate-100 text-slate-400 rounded-lg"
                                                        >
                                                            <X size={12} strokeWidth={3} />
                                                        </button>
                                                    </motion.div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmDeleteId(product.id)}
                                                        className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-all active:scale-95"
                                                    >
                                                        <Trash2 size={14} strokeWidth={3} />
                                                    </button>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package size={40} className="text-slate-100" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Zero items found.</p>
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
                        {filteredProducts.length} Items listed
                    </span>
                    <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                        Total Value: ${stats.totalValue.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, color, subText }) {
    const themes = {
        indigo: 'bg-indigo-600 shadow-indigo-100',
        emerald: 'bg-emerald-500 shadow-emerald-100',
        rose: 'bg-rose-500 shadow-rose-100',
    };
    return (
        <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
            <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10`}>
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
