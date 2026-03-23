'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Package, Calendar, 
  ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { useStore } from '@/stores/useStore';
import { useReportByStore } from '@/stores/useReportByStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';


export default function ReportByStore() {
    const { language } = useLanguageStore();
    // Top-Level State
    const [dateRange, setDateRange] = useState(7); // default 7 days
    const [activeTab, setActiveTab] = useState('Overview');

    // Context Providers
    const { user, fetchProfile } = useUserStore();
    const { stores, fetchStores } = useStore();
    
    // Extracted Zustand Store
    const { 
        stats, 
        recentOrders, 
        topProducts, 
        loading, 
        error, 
        fetchReports 
    } = useReportByStore();

    // Derived user's store
    const userStoreId = useMemo(() => {
        if (!user || !stores.length) return null;
        const myStore = stores.find(s => String(s.user_id) === String(user.id));
        return myStore ? myStore.id : null;
    }, [user, stores]);

    useEffect(() => {
        fetchProfile();
        fetchStores();
    }, [fetchProfile, fetchStores]);

    // Data Fetching via Store
    useEffect(() => {
        if (userStoreId) {
            fetchReports(userStoreId, dateRange);
        }
    }, [userStoreId, dateRange, fetchReports]);


    // Fallback UI states
    if (!userStoreId && !loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-slate-500 gap-3">
                <Package size={48} className="text-slate-200" />
                <p className="font-bold text-[13px]">{t('No store associated with your account.', language)}</p>
            </div>

        );
    }

    const ranges = [
        { label: t('7 Days', language), val: 7 },
        { label: t('15 Days', language), val: 15 },
        { label: t('1 Month', language), val: 30 },
        { label: t('6 Months', language), val: 180 },
        { label: t('1 Year', language), val: 365 }
    ];


    return (
        <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500 relative">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Store Analytics', language)}</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                        {t('Performance', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">{t('Reports', language)}</span>
                    </h1>
                    <p className="text-slate-500 text-[12px] font-medium mt-1">
                        {t("Monitor your store's sales, orders, and customer activity.", language)}
                    </p>

                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm overflow-x-auto no-scrollbar">
                        {ranges.map(range => (
                            <button
                                key={range.val}
                                onClick={() => setDateRange(range.val)}
                                className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                                    dateRange === range.val 
                                    ? 'bg-slate-900 text-white shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 rounded-[30px] bg-slate-50/50 border border-slate-100">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('Compiling Reports...', language)}</p>
                </div>

            ) : error ? (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                    <p className="text-rose-600 font-bold text-sm">{error}</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={dateRange} // Re-animate when date changes
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-5"
                    >
                        {/* --- METRICS --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <MetricCard 
                                label={t('Total Revenue', language)} 
                                value={`$${(stats?.revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                                trend={stats?.revenueGrowth} 
                                icon={DollarSign} 
                                color="indigo" 
                            />
                            <MetricCard 
                                label={t('Total Orders', language)} 
                                value={(stats?.orders || 0).toLocaleString()} 
                                trend={stats?.ordersGrowth} 
                                icon={Package} 
                                color="emerald" 
                            />
                            <MetricCard 
                                label={t('Avg. Order Value', language)} 
                                value={`$${(stats?.avgOrderValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                                trend={stats?.aovGrowth} 
                                icon={BarChart3} 
                                color="rose" 
                            />

                        </div>

                        {/* --- TAB NAVIGATION --- */}
                        <div className="flex items-center gap-6 border-b border-slate-200">
                            {['Overview', 'Sales by Product', 'Customer Insights'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 text-[11px] font-black uppercase tracking-widest transition-colors relative ${
                                        activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {t(tab, language)}

                                    {activeTab === tab && (
                                        <motion.div 
                                            layoutId="activeTabIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* --- CONTENT AREA (Grid) --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            
                            {/* Main Table: Recent Orders */}
                            <div className="lg:col-span-2 bg-white rounded-[20px] border border-slate-100 shadow-sm flex flex-col min-h-[400px]">
                                <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-slate-400" size={16} />
                                        <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-widest">{t('Recent Transactions', language)}</h2>
                                    </div>
                                    <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
                                        {t('View All', language)} <ArrowUpRight size={12} />
                                    </button>
                                </div>
                                
                                <div className="overflow-x-auto no-scrollbar flex-1">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50">
                                                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('Order ID', language)}</th>
                                                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('Customer', language)}</th>
                                                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('Date', language)}</th>
                                                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t('Status', language)}</th>
                                                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">{t('Amount', language)}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 relative">
                                            {recentOrders.length > 0 ? recentOrders.map((order, idx) => (
                                                <motion.tr 
                                                    key={order.id}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="group hover:bg-slate-50/30 transition-colors cursor-pointer"
                                                >
                                                    <td className="px-5 py-4">
                                                        <span className="text-[11px] font-black text-indigo-600 uppercase tracking-wider">{order.id}</span>
                                                        <div className="text-[9px] font-bold text-slate-400 mt-0.5">{order.items} {t('items', language)}</div>
                                                    </td>
 Kinder
                                                    <td className="px-5 py-4 min-w-[120px]">
                                                        <span className="text-[11px] font-bold text-slate-800">{order.customer}</span>
                                                    </td>
                                                    <td className="px-5 py-4 whitespace-nowrap">
                                                        <span className="text-[10px] font-medium text-slate-500">{order.date}</span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest
                                                            ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                            ['Processing', 'Pending'].includes(order.status) ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                                            'bg-rose-50 text-rose-500 border-rose-100'}`}>
                                                            {t(order.status, language)}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span className="text-[12px] font-black text-slate-900 tracking-tight">${Number(order.amount).toFixed(2)}</span>
                                                    </td>
                                                </motion.tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-20 text-center">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Package size={32} className="text-slate-200" />
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{t('No recent orders.', language)}</p>
                                                        </div>

                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right sidebar: Top Products */}
                            <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm flex flex-col min-h-[400px]">
                                <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="text-slate-400" size={16} />
                                        <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-widest">{t('Top Products', language)}</h2>
                                    </div>

                                </div>
                                
                                <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                                    {topProducts.length > 0 ? topProducts.map((product, idx) => (
                                        <motion.div 
                                            key={product.id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-sm transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                                                <Package size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[11px] font-black text-slate-900 truncate" title={product.name}>{product.name}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] font-bold text-slate-400 max-w-[80px] truncate">{t(product.category, language)}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-[9px] font-black text-indigo-600 whitespace-nowrap">{product.sales} {t('sold', language)}</span>
                                                </div>

                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-[11px] font-black text-slate-900">${Number(product.revenue).toLocaleString()}</div>
                                                <div className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${product.inventory > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {product.inventory > 0 ? `${product.inventory} ${t('in stock', language)}` : t('Out of stock', language)}
                                                </div>

                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="flex flex-col items-center justify-center p-12 h-full gap-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-8">{t('Not enough data.', language)}</p>
                                        </div>

                                    )}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, color, trend }) {
    const themes = {
        indigo: 'bg-indigo-600 shadow-indigo-100',
        emerald: 'bg-emerald-500 shadow-emerald-100',
        rose: 'bg-rose-500 shadow-rose-100',
    };
    
    // Safety check for trend
    const renderTrend = () => {
        if (trend === undefined || trend === null) return null;
        
        const isPositive = trend > 0;
        const trendVal = Math.abs(trend).toFixed(1);
        
        return (
            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                {trendVal}%
            </div>
        );
    };
    
    return (
        <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
            <div className="flex items-start justify-between">
                <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10`}>
                    <Icon size={14} strokeWidth={3} />
                </div>
                {renderTrend()}
            </div>
            
            <div className="relative z-10">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
                </div>
            </div>
            <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
        </div>
    );
}
