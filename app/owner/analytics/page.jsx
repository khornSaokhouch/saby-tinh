'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, TrendingUp, ShoppingCart, Package,
  DollarSign, CheckCircle2, Clock, XCircle, Truck,
  RefreshCw, ArrowUpRight, ArrowDownRight, Star,
  Layers, Calendar, ChevronDown, Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useShopOrderStore } from '@/stores/useShopOrderStore';
import { useProductStore } from '@/stores/useProductStore';
import { useStore } from '@/stores/useStore';
import { useUserStore } from '@/stores/userStore';

// --- HELPERS ---
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function StatusBadge({ status }) {
  const config = {
    Shipped:    { style: 'bg-blue-50 text-blue-600 border-blue-100', Icon: Truck },
    Processing: { style: 'bg-indigo-50 text-indigo-600 border-indigo-100', Icon: Clock },
    Pending:    { style: 'bg-orange-50 text-orange-600 border-orange-100', Icon: Clock },
    Cancelled:  { style: 'bg-slate-100 text-slate-500 border-slate-200', Icon: XCircle },
    Delivered:  { style: 'bg-emerald-50 text-emerald-600 border-emerald-100', Icon: CheckCircle2 },
  };
  const { style, Icon } = config[status] || config.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${style}`}>
      <Icon size={9} strokeWidth={2.5} />{status}
    </span>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color, loading, trend }) {
  const palette = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100' },
    amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100' },
    slate:   { bg: 'bg-slate-100',  text: 'text-slate-600',   border: 'border-slate-200' },
  };
  const p = palette[color] || palette.indigo;
  return (
    <div className="bg-white p-5 rounded-[22px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
      <div className={`p-2.5 rounded-xl w-fit mb-4 border ${p.bg} ${p.text} ${p.border}`}>
        <Icon size={17} strokeWidth={2.5} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      {loading ? (
        <div className="h-7 w-24 bg-slate-100 rounded-lg animate-pulse" />
      ) : (
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
          {sub && <span className="text-[10px] font-bold text-slate-400">{sub}</span>}
        </div>
      )}
      {trend !== undefined && !loading && (
        <div className={`absolute top-5 right-5 flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {Math.abs(trend)}%
        </div>
      )}
      <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-slate-50/80 rounded-full group-hover:scale-150 transition-all duration-700" />
    </div>
  );
}

// Horizontal bar chart
function HBarChart({ data, max }) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-500 w-20 truncate shrink-0 text-right">{item.label}</span>
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${max > 0 ? (item.value / max) * 100 : 0}%` }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className={`h-full rounded-full ${item.color || 'bg-indigo-500'}`}
            />
          </div>
          <span className="text-[10px] font-black text-slate-700 w-14 shrink-0">{item.display ?? item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function OwnerAnalyticsPage() {
  const { orders, loading: ordersLoading, fetchOrders } = useShopOrderStore();
  const { products, loading: productsLoading, fetchProducts } = useProductStore();
  const { stores, fetchStores } = useStore();
  const { user, fetchProfile } = useUserStore();

  const [period, setPeriod] = useState('This Year');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchOrders();
    fetchProducts();
    fetchStores();
  }, [fetchProfile, fetchOrders, fetchProducts, fetchStores]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchOrders(), fetchProducts()]);
    setIsRefreshing(false);
  };

  const loading = ordersLoading || productsLoading;

  // --- Filter orders by period ---
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(o => {
      const d = new Date(o.order_date || o.created_at);
      if (isNaN(d)) return true;
      if (period === 'This Month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (period === 'Last 30 Days') return (now - d) / 86400000 <= 30;
      if (period === 'Last 7 Days') return (now - d) / 86400000 <= 7;
      return d.getFullYear() === now.getFullYear(); // This Year
    });
  }, [orders, period]);

  // --- Core KPIs ---
  const kpis = useMemo(() => {
    const revenue = filteredOrders.reduce((a, o) => a + parseFloat(o.order_total || 0), 0);
    const count   = filteredOrders.length;
    const avg     = count > 0 ? revenue / count : 0;
    const paid    = filteredOrders.filter(o => (o.payment_status?.status || '').toLowerCase().includes('success')).length;
    const pending = filteredOrders.filter(o => (o.order_status?.status || '').toLowerCase().includes('pending')).length;
    return { revenue, count, avg, paid, pending };
  }, [filteredOrders]);

  // --- Monthly Revenue Chart ---
  const monthlyRevenue = useMemo(() => {
    const buckets = Array(12).fill(0);
    filteredOrders.forEach(o => {
      const d = new Date(o.order_date || o.created_at);
      if (!isNaN(d)) buckets[d.getMonth()] += parseFloat(o.order_total || 0);
    });
    return buckets;
  }, [filteredOrders]);

  const maxMonthRev = Math.max(...monthlyRevenue, 1);

  // --- Monthly Order Count ---
  const monthlyOrders = useMemo(() => {
    const buckets = Array(12).fill(0);
    filteredOrders.forEach(o => {
      const d = new Date(o.order_date || o.created_at);
      if (!isNaN(d)) buckets[d.getMonth()]++;
    });
    return buckets;
  }, [filteredOrders]);

  const maxMonthOrd = Math.max(...monthlyOrders, 1);

  // --- Order Status Breakdown ---
  const statusBreakdown = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      const s = o.order_status?.status || 'Pending';
      map[s] = (map[s] || 0) + 1;
    });
    const colors = { Pending: 'bg-orange-400', Processing: 'bg-indigo-400', Shipped: 'bg-blue-400', Delivered: 'bg-emerald-400', Cancelled: 'bg-slate-400' };
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value, color: colors[label] || 'bg-slate-300' }));
  }, [filteredOrders]);

  const maxStatus = Math.max(...statusBreakdown.map(s => s.value), 1);

  // --- Payment Breakdown ---
  const paymentBreakdown = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      const s = o.payment_status?.status || 'Pending';
      map[s] = (map[s] || 0) + 1;
    });
    const colors = { Success: 'bg-emerald-400', Pending: 'bg-orange-400', Failed: 'bg-rose-400', Refunded: 'bg-slate-400' };
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value, color: colors[label] || 'bg-slate-300' }));
  }, [filteredOrders]);

  const maxPayment = Math.max(...paymentBreakdown.map(p => p.value), 1);

  // --- Top Products by Revenue ---
  const topProducts = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      (o.order_lines || []).forEach(line => {
        const product = line?.product_item_variant?.product_item?.product;
        if (!product) return;
        const id = product.id;
        if (!map[id]) map[id] = { product, revenue: 0, units: 0 };
        map[id].revenue += parseFloat(line.price || 0) * parseInt(line.quantity || 1);
        map[id].units += parseInt(line.quantity || 1);
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  }, [filteredOrders]);

  const maxProductRev = Math.max(...topProducts.map(p => p.revenue), 1);

  // --- Category Breakdown ---
  const categoryBreakdown = useMemo(() => {
    const map = {};
    products.forEach(p => {
      const cat = p.category?.name || 'Uncategorized';
      map[cat] = (map[cat] || 0) + 1;
    });
    const palette = ['bg-indigo-400','bg-rose-400','bg-amber-400','bg-emerald-400','bg-purple-400','bg-blue-400'];
    return Object.entries(map)
      .sort((a,b) => b[1]-a[1])
      .slice(0,6)
      .map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }));
  }, [products]);

  const maxCat = Math.max(...categoryBreakdown.map(c => c.value), 1);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6 pb-10 font-sans">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Analytics</h1>
          <p className="text-[11px] font-medium text-slate-400">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-3 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          {/* Period Selector */}
          <div className="relative">
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 font-bold text-[11px] pl-4 pr-9 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 cursor-pointer shadow-sm"
            >
              {['Last 7 Days', 'Last 30 Days', 'This Month', 'This Year'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard label="Total Revenue" value={`$${kpis.revenue.toLocaleString(undefined, {minimumFractionDigits:2,maximumFractionDigits:2})}`} icon={DollarSign} color="indigo" loading={loading} />
        <MetricCard label="Total Orders" value={kpis.count} icon={ShoppingCart} color="amber" loading={loading} />
        <MetricCard label="Avg. Order Value" value={`$${kpis.avg.toFixed(2)}`} icon={TrendingUp} color="emerald" loading={loading} />
        <MetricCard label="Paid Orders" value={kpis.paid} icon={CheckCircle2} color="slate" loading={loading} />
        <MetricCard label="Pending Orders" value={kpis.pending} icon={Clock} color="rose" loading={loading} />
      </div>

      {/* --- REVENUE & ORDER CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Revenue Bar Chart */}
        <div className="bg-white rounded-[22px] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><DollarSign size={15}/></div>
              <div>
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Monthly Revenue</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Order totals per month</p>
              </div>
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tighter">${kpis.revenue.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
          </div>
          {loading ? (
            <div className="h-36 bg-slate-50 rounded-2xl animate-pulse" />
          ) : (
            <div className="h-36 flex items-end gap-1">
              {monthlyRevenue.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((v / maxMonthRev) * 128, v > 0 ? 6 : 2)}px` }}
                      transition={{ duration: 0.6, delay: i * 0.04 }}
                      className="w-full bg-indigo-100 hover:bg-indigo-500 transition-colors rounded-t-md cursor-pointer"
                    />
                    {v > 0 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[7px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ${v.toFixed(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-[7px] font-bold text-slate-400 uppercase">{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Count Chart */}
        <div className="bg-white rounded-[22px] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><ShoppingCart size={15}/></div>
              <div>
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Monthly Orders</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Order count per month</p>
              </div>
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tighter">{kpis.count}</span>
          </div>
          {loading ? (
            <div className="h-36 bg-slate-50 rounded-2xl animate-pulse" />
          ) : (
            <div className="h-36 flex items-end gap-1">
              {monthlyOrders.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((v / maxMonthOrd) * 128, v > 0 ? 6 : 2)}px` }}
                      transition={{ duration: 0.6, delay: i * 0.04 }}
                      className="w-full bg-amber-100 hover:bg-amber-400 transition-colors rounded-t-md cursor-pointer"
                    />
                    {v > 0 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[7px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {v} orders
                      </div>
                    )}
                  </div>
                  <span className="text-[7px] font-bold text-slate-400 uppercase">{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- BREAKDOWN ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-[22px] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><BarChart3 size={15}/></div>
            <div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Order Status</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Distribution by status</p>
            </div>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />)}</div>
          ) : statusBreakdown.length > 0 ? (
            <HBarChart data={statusBreakdown} max={maxStatus} />
          ) : (
            <p className="text-[11px] text-slate-400 font-medium text-center py-6">No orders found</p>
          )}
        </div>

        {/* Payment Status Breakdown */}
        <div className="bg-white rounded-[22px] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={15}/></div>
            <div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Payment Status</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Distribution by payment</p>
            </div>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />)}</div>
          ) : paymentBreakdown.length > 0 ? (
            <HBarChart data={paymentBreakdown} max={maxPayment} />
          ) : (
            <p className="text-[11px] text-slate-400 font-medium text-center py-6">No data</p>
          )}
        </div>

        {/* Product by Category */}
        <div className="bg-white rounded-[22px] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Layers size={15}/></div>
            <div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">By Category</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Product count per category</p>
            </div>
          </div>
          {productsLoading ? (
            <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />)}</div>
          ) : categoryBreakdown.length > 0 ? (
            <HBarChart data={categoryBreakdown} max={maxCat} />
          ) : (
            <p className="text-[11px] text-slate-400 font-medium text-center py-6">No products</p>
          )}
        </div>
      </div>

      {/* --- TOP PRODUCTS --- */}
      <div className="bg-white rounded-[22px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex items-center gap-3">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Star size={15}/></div>
          <div>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Top Products by Revenue</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Best performing products in selected period</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Units Sold</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-5 py-3">
                      <div className="h-8 bg-slate-100 rounded-xl animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : topProducts.length > 0 ? topProducts.map(({ product, revenue, units }, i) => {
                const img = product?.images?.find(x => x.is_primary === 1)?.image || product?.images?.[0]?.image;
                const pct = Math.round((revenue / maxProductRev) * 100);
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 border border-white shadow-sm flex items-center justify-center shrink-0">
                          {img ? <img src={img} alt={product.name} className="w-full h-full object-cover" /> : <ImageIcon size={13} className="text-slate-300" />}
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-900 leading-tight line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {product.category?.name || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[13px] font-black text-slate-800">{units}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[13px] font-black text-slate-900">${revenue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.06 }}
                            className="h-full bg-rose-400 rounded-full"
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 w-9">{pct}%</span>
                      </div>
                    </td>
                  </motion.tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package size={32} className="text-slate-200" />
                      <p className="text-[12px] font-bold text-slate-400">No sales data for this period</p>
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