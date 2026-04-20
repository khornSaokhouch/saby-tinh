'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Eye, MoreHorizontal, 
  ArrowUpDown, CheckCircle2, Clock, Truck, XCircle, X,
  ChevronLeft, ChevronRight, Calendar, ChevronDown,
  ShoppingBag, DollarSign, Activity, RefreshCw, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useShopOrderStore } from '@/stores/useShopOrderStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function OrdersPage() {
  const { orders, fetchOrders, loading, error } = useShopOrderStore();
  const { language } = useLanguageStore();
  const [selectedStatus, setSelectedStatus] = useState(t('All', language));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState(t('All Time', language));
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    // Exclude orders that have already been paid out
    if (order.invoice?.payout) return false;

    const statusName = order.order_status?.status || 'Pending';
    const matchesStatus = 
      selectedStatus === 'All' || 
      selectedStatus === t('All', language) ||
      statusName === selectedStatus || 
      t(statusName, language) === selectedStatus;

    const customerName = order.user?.name || 'Unknown';
    const orderId = `#ORD-${order.id}`;
    
    const matchesSearch = 
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
      customerName.toLowerCase().includes(searchQuery.toLowerCase());

    // Date Filter Logic
    const orderDate = new Date(order.created_at);
    const now = new Date();
    let matchesDate = true;

    const range1Week = t('1 Week', language);
    const range15Days = t('15 Days', language);
    const range1Month = t('1 Month', language);

    if (selectedRange === range1Week) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      matchesDate = orderDate >= cutoff;
    } else if (selectedRange === range15Days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 15);
      matchesDate = orderDate >= cutoff;
    } else if (selectedRange === range1Month) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      matchesDate = orderDate >= cutoff;
    }
      
    return matchesStatus && matchesSearch && matchesDate;
  });

  const totalValue = orders.reduce((sum, order) => sum + parseFloat(order.order_total || 0), 0);
  const pendingCount = orders.filter(o => o.order_status?.status === 'Pending' || o.order_status?.status === 'Processing').length;
  const avgValue = orders.length > 0 ? totalValue / orders.length : 0;

  const handleExport = (range) => {
    const now = new Date();
    let cutoff = new Date();
    
    if (range === '1 Week') cutoff.setDate(now.getDate() - 7);
    else if (range === '15 Days') cutoff.setDate(now.getDate() - 15);
    else if (range === '1 Month') cutoff.setDate(now.getDate() - 30);
    else cutoff = new Date(0);

    const filtered = orders.filter(o => new Date(o.created_at) >= cutoff);

    if (filtered.length === 0) {
      alert(t('No data found for this range', language));
      return;
    }

    const headers = ['Order ID', 'Customer', 'Email', 'Status', 'Total', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filtered.map(o => [
        `ORD-${o.id}`,
        o.user?.name || 'Guest',
        o.user?.email || '',
        o.order_status?.status || 'Pending',
        o.order_total,
        new Date(o.created_at).toLocaleDateString()
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${range.toLowerCase().replace(' ', '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-8 font-sans max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t('Registry Operations', language)}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
            {t('Global', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-400">{t('Orders', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            {t('Monitor and coordinate global customer transactions.', language)}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchOrders()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase tracking-widest active:scale-95"
          >
            <Download size={14} strokeWidth={3} /> {t('Export Data', language)}
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t('Total Orders', language)} value={orders.length.toLocaleString()} icon={ShoppingBag} color="indigo" />
        <StatCard label={t('In-Process', language)} value={pendingCount.toString()} icon={Clock} color="rose" />
        <StatCard label={t('Gross Revenue', language)} value={`$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={DollarSign} color="emerald" />
        <StatCard label={t('Avg. Value', language)} value={`$${avgValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={Activity} color="blue" />
      </div>

      {/* --- MAIN TABLE CONTAINER --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row gap-3 justify-between items-center bg-white">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder={t('Search ID or Customer...', language)} 
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
             <FilterSelect 
               options={['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(opt => t(opt, language))} 
               value={selectedStatus} 
               onChange={setSelectedStatus}
               language={language}
             />
             <div className="h-4 w-px bg-slate-200 mx-1"></div>
             <FilterSelect 
                options={['All Time', '1 Week', '15 Days', '1 Month'].map(opt => t(opt, language))} 
                value={selectedRange} 
                onChange={setSelectedRange} 
                language={language}
             />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('Order ID', language)}</th>
                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('Customer', language)}</th>
                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('ORDER STATUS', language)}</th>
                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('Payment', language)}</th>
                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">{t('Total price', language)}</th>
                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('Product Item', language)}</th> 
                <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">{t('Action', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="7" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse">{t('Scanning Registry...', language)}</td></tr>
              ) : filteredOrders.map((order, idx) => (
                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-indigo-600 tracking-tight">{t('ORD-', language)}{order.id}</span>
                      <span className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{order.user?.name || t('Guest', language)}</span>
                      <span className="text-[9px] text-slate-400 font-medium truncate max-w-[120px]">{order.user?.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.order_status?.status || 'Pending'} language={language} />
                  </td>
                  <td className="px-4 py-4">
                    <PaymentBadge status={order.payment_status?.status || 'Pending'} language={language} />
                  </td>
                  <td className="px-4 py-4 text-right text-xs font-bold text-slate-900">
                    ${parseFloat(order.order_total).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 max-w-[160px]">
                      <div className="w-8 h-8 rounded-lg border border-slate-100 bg-slate-50 shrink-0 overflow-hidden">
                        <img src={order.order_lines?.[0]?.product_item_variant?.product_item?.product?.images?.[0]?.image || '/placeholder.png'} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 truncate">{order.order_lines?.[0]?.product_item_variant?.product_item?.product?.name || t('Item', language)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 rounded-lg shadow-sm transition-all active:scale-95" title="Quick View">
                        <Eye size={14} strokeWidth={2.5} />
                      </button>
                      <button className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-all shadow-sm active:scale-95">
                        <ArrowUpRight size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center px-6">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t('Page', language)} 1 {t('of', language)} {Math.ceil(orders.length / 15) || 1} • {filteredOrders.length} {t('Results', language)}</p>
            <div className="flex gap-1">
              <button className="p-1 border border-slate-200 rounded hover:bg-white text-slate-400"><ChevronLeft size={12} /></button>
              <button className="p-1 border border-slate-200 rounded hover:bg-white text-slate-400"><ChevronRight size={12} /></button>
            </div>
        </div>
      </div>

      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        onExport={(range) => {
          handleExport(range);
          setShowExportModal(false);
        }}
        language={language}
      />
    </div>
  );
}

// --- LOGIC HELPERS --- (Removed redundant handleExport)

// --- SUB-COMPONENTS (Dashboard/Registry Pattern) ---

function StatCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    rose: 'bg-rose-500 shadow-rose-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    blue: 'bg-blue-600 shadow-blue-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
      <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-bold text-slate-900 tracking-tighter leading-none">{value}</h3>
          {subText && <span className="text-[9px] font-bold text-slate-400">{subText}</span>}
        </div>
      </div>
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}

function StatusBadge({ status, language }) {
  const config = {
    Pending: "bg-orange-50 text-orange-600 border-orange-100",
    Processing: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Shipped: "bg-blue-50 text-blue-600 border-blue-100",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Cancelled: "bg-slate-100 text-slate-400 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[8px] font-bold uppercase tracking-widest ${config[status] || config.Cancelled}`}>
      <span className="w-1 h-1 rounded-full bg-current mr-1.5 animate-pulse" />
      {t(status, language)}
    </span>
  );
}

function PaymentBadge({ status, language }) {
  const styles = {
    Paid: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Unpaid: "text-rose-600 bg-rose-50 border-rose-100",
    Failed: "text-rose-600 bg-rose-50 border-rose-100",
  };
  return (
    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${styles[status] || "text-orange-600 bg-orange-50 border-orange-100"}`}>
      {t(status, language)}
    </span>
  );
}

function FilterSelect({ options, value, onChange, language }) {
  return (
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-slate-100 rounded-lg pl-3 pr-8 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-600 outline-none transition-all cursor-pointer shadow-sm"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
    </div>
  );
}

function ExportModal({ isOpen, onClose, onExport, language }) {
  if (!isOpen) return null;

  const ranges = [
    { label: '1 Week', icon: Calendar },
    { label: '15 Days', icon: Clock },
    { label: '1 Month', icon: ShoppingBag },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all z-10"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Download size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{t('Export Data', language)}</h3>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">{t('Select range for registry download', language)}</p>
            </div>
          </div>

          <div className="space-y-3">
            {ranges.map((range) => (
              <button
                key={range.label}
                onClick={() => onExport(range.label)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                    <range.icon size={14} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{t(range.label, language)}</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                  <ChevronRight size={12} strokeWidth={3} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}