'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, ShoppingCart, BarChart3, 
  TrendingUp, ArrowUpRight, 
  MoreHorizontal, Plus, ShieldCheck, RefreshCw,
  Store, DollarSign, CheckCircle2, Clock, Truck,
  XCircle, Loader2, Box, ChevronRight, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShopOrderStore } from '@/stores/useShopOrderStore';
import { useProductStore } from '@/stores/useProductStore';
import { useStore } from '@/stores/useStore';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const StatusBadge = ({ status }) => {
  const config = {
    Shipped: { icon: Truck, style: "bg-blue-50 text-blue-600 border-blue-100" },
    Processing: { icon: Clock, style: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    Pending: { icon: Clock, style: "bg-orange-50 text-orange-600 border-orange-100" },
    Cancelled: { icon: XCircle, style: "bg-slate-100 text-slate-500 border-slate-200" },
    Delivered: { icon: CheckCircle2, style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  };
  const { icon: Icon, style } = config[status] || config.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${style}`}>
      <Icon size={10} strokeWidth={2.5} />
      {status}
    </span>
  );
};

const PaymentBadge = ({ status }) => {
  const isPaid = status === 'Success';
  
  const style = isPaid 
    ? "text-emerald-600 bg-emerald-50 border-emerald-100" 
    : "text-rose-600 bg-rose-50 border-rose-100";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${style}`}>
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );
};

function ProductPreview({ orderLines }) {
  if (!orderLines || orderLines.length === 0) {
    return <span className="text-xs text-slate-400 font-medium">No products</span>;
  }
  const firstLine = orderLines[0];
  const product = firstLine?.product_item_variant?.product_item?.product;
  const image =
    product?.images?.find(img => img.is_primary === 1)?.image ||
    product?.images?.[0]?.image ||
    null;
  return (
    <div className="flex items-center gap-3">
      {image ? (
        <img src={image} alt={product?.name || 'Product'} className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shadow-sm" />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <ImageIcon size={14} className="text-slate-300" />
        </div>
      )}
      <div className="flex flex-col max-w-[160px]">
        <span className="text-[13px] font-bold text-slate-900 truncate leading-tight">
          {product?.name || 'Unknown Product'}
          {orderLines.length > 1 && (
            <span className="text-slate-400 font-semibold text-[11px]"> +{orderLines.length - 1}</span>
          )}
        </span>
        <span className="text-[11px] text-slate-400 font-medium">Qty: {firstLine?.quantity || 1}</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, subText, loading }) {
  const themes = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100/50' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100/50' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100/50' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100/50' },
  };
  const t = themes[color] || themes.indigo;
  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className={`p-2.5 rounded-xl w-fit mb-4 ${t.bg} ${t.text} border ${t.border}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      {loading ? (
        <div className="h-7 w-20 bg-slate-100 animate-pulse rounded-lg" />
      ) : (
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
          {subText && <span className="text-[10px] font-bold text-slate-400">{subText}</span>}
        </div>
      )}
      <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-slate-50/80 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { orders, loading: ordersLoading, fetchOrders } = useShopOrderStore();
  const { products, loading: productsLoading, fetchProducts } = useProductStore();
  const { stores, fetchStores } = useStore();
  const { user, fetchProfile } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchOrders();
    fetchProducts();
    fetchStores();
  }, [fetchProfile, fetchOrders, fetchProducts, fetchStores]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchOrders(), fetchProducts(), fetchStores()]);
    setIsRefreshing(false);
  };

  // Compute stats from real data
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + parseFloat(o.order_total || 0), 0);
    const activeOrders = orders.filter(o => {
      const s = (o.order_status?.status || '').toLowerCase();
      return s.includes('pending') || s.includes('processing');
    }).length;
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status).length;
    const paidOrders = orders.filter(o => {
      const s = (o.payment_status?.status || '').toLowerCase();
      return s.includes('success');
    }).length;

    return { totalRevenue, activeOrders, totalProducts, activeProducts, paidOrders, totalOrders: orders.length };
  }, [orders, products]);

  // Monthly revenue chart data — group orders by month
  const chartData = useMemo(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const buckets = Array(12).fill(0);
    orders.forEach(o => {
      const d = new Date(o.order_date || o.created_at);
      if (!isNaN(d)) buckets[d.getMonth()] += parseFloat(o.order_total || 0);
    });
    const max = Math.max(...buckets, 1);
    return buckets.map((v, i) => ({ month: months[i], value: v, pct: Math.round((v / max) * 100) }));
  }, [orders]);

  const myStore = useMemo(() => {
    if (!user) return null;
    return stores.find(s => String(s.user_id) === String(user.id)) || stores[0] || null;
  }, [stores, user]);

  const recentOrders = useMemo(() => orders.slice(0, 8), [orders]);
  const loading = ordersLoading || productsLoading;

  const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Owner Control Center</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            {myStore ? myStore.name : 'My Dashboard'}
          </h1>
          <p className="text-[11px] font-medium text-slate-400">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-3 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <Link
            href="/owner/products/create"
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={15} strokeWidth={2.5} /> New Product
          </Link>
        </div>
      </div>

      {/* --- METRICS GRID --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="indigo"
          loading={loading}
        />
        <MetricCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="amber"
          subText={`${stats.activeOrders} pending`}
          loading={loading}
        />
        <MetricCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="rose"
          subText={`${stats.activeProducts} active`}
          loading={loading}
        />
        <MetricCard
          label="Paid Orders"
          value={stats.paidOrders}
          icon={CheckCircle2}
          color="emerald"
          loading={loading}
        />
      </div>

      {/* --- CHARTS & TABLES GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* REVENUE CHART */}
        <div className="lg:col-span-8 bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={16}/></div>
              <div>
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Monthly Revenue</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Based on order totals</p>
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 tracking-tight">
              ${stats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>

          {loading ? (
            <div className="h-40 bg-slate-50 rounded-2xl animate-pulse" />
          ) : (
            <div className="h-40 flex items-end justify-between gap-1 px-1">
              {chartData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="w-full bg-indigo-100 hover:bg-indigo-500 transition-all rounded-t-md cursor-pointer relative"
                    style={{ height: `${Math.max(item.pct, 4)}%`, minHeight: '4px' }}
                  >
                    {item.value > 0 && (
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[7px] px-1.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                        ${item.value.toFixed(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">{item.month}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STORE INFO CARD */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Store Info</span>
            </div>

            {myStore ? (
              <>
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-700 border-2 border-slate-600 flex items-center justify-center mb-3">
                  {myStore.store_image ? (
                    <img src={myStore.store_image} alt={myStore.name} className="w-full h-full object-cover" />
                  ) : (
                    <Store size={20} className="text-slate-400" />
                  )}
                </div>
                <h4 className="text-lg font-black mb-1 leading-tight">{myStore.name}</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  {stats.totalProducts} products listed · {stats.totalOrders} orders received
                </p>
              </>
            ) : (
              <p className="text-[13px] text-slate-400 font-medium mt-2">No store found.</p>
            )}
          </div>

          <Link
            href="/owner/stores"
            className="mt-6 w-full py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
          >
            Manage Store <ChevronRight size={12} />
          </Link>
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-indigo-600/30 rounded-full blur-[60px]" />
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-12 bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Recent Orders</h3>
            <Link
              href="/owner/orders"
              className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline underline-offset-4"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Products</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ordersLoading && orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 size={24} className="animate-spin text-indigo-400" />
                        <p className="text-[11px] font-bold text-slate-400">Loading orders...</p>
                      </div>
                    </td>
                  </tr>
                ) : recentOrders.length > 0 ? recentOrders.map((order, i) => {
                  const productCount = order.order_lines?.length || 0;
                  const customerName = order.user?.name || order.user?.username || `User #${order.user_id}`;
                  const orderStatus = order.order_status?.status || 'Pending';
                  const paymentStatus = order.payment_status?.status || 'Pending';
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="text-[12px] font-black text-indigo-600">
                          #ORD-{order.id}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-black shrink-0">
                            {customerName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[12px] font-bold text-slate-800 max-w-[120px] truncate">{customerName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <ProductPreview orderLines={order.order_lines || []} />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[13px] font-black text-slate-900">${parseFloat(order.order_total || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={orderStatus} />
                      </td>
                      <td className="px-4 py-4">
                        <PaymentBadge status={paymentStatus} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => router.push(`/owner/orders/details-order?id=${order.id}`)}
                          className="p-2 hover:bg-indigo-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingCart size={32} className="text-slate-200" />
                        <p className="text-[12px] font-bold text-slate-400">No orders yet</p>
                        <p className="text-[10px] text-slate-300">Orders will appear here when customers place them.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}