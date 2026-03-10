'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Search, Filter, Mail, Phone, 
  ShieldCheck, ShieldAlert, ArrowUpRight, 
  Download, Trash2, CheckCircle2, FileText, 
  ExternalLink, Loader2, Clock, RefreshCw 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSellerStore } from '@/stores/useSellerStore';
import DeleteSellerModal from '@/app/components/admin/modeldeleted/DeleteSellerModal';

export default function SellerManagementPage() {
  const { 
    sellers, loading, fetchSellers, 
    approveSeller, rejectSeller, success 
  } = useSellerStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'approved'
  
  // Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchSellers();

    const interval = setInterval(() => {
      fetchSellers();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchSellers]);

  const filteredSellers = useMemo(() => {
    return sellers.filter(seller => {
      const matchesSearch = 
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = 
        activeTab === 'all' || 
        seller.status === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [sellers, searchTerm, activeTab]);

  const stats = useMemo(() => ({
    total: sellers.length,
    pending: sellers.filter(s => s.status === 'pending').length,
    approved: sellers.filter(s => s.status === 'approved').length,
  }), [sellers]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveSeller(id);
      toast.success('Merchant application approved');
    } catch (error) {
      console.error(error);
      toast.error('Failed to approve merchant');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (seller) => {
    setSelectedSeller(seller);
    setIsDeleteOpen(true);
  };

  const handleRejectConfirm = async () => {
    setActionLoading(selectedSeller.id);
    try {
      await rejectSeller(selectedSeller.id);
      setIsDeleteOpen(false);
      toast.success('Merchant application rejected');
    } catch (error) {
      console.error(error);
      toast.error('Failed to reject application');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-10 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Seller Requests</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Seller Requests</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchSellers()}
            className="p-3 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <button className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest">
            <Download size={16} strokeWidth={2.5} /> Export Requests
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          label="Total Requests"
          value={stats.total}
          trend="+8%"
          icon={FileText}
          color="indigo"
        />
        <MetricCard
          label="Pending Review"
          value={stats.pending}
          trend="Required"
          icon={Clock}
          color="amber"
          isWarning={stats.pending > 0}
        />
        <MetricCard
          label="Approved Sellers"
          value={stats.approved}
          trend="Validated"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-50 flex flex-col lg:flex-row items-center justify-between gap-6 bg-slate-50/20">
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-100 rounded-xl self-start shadow-sm">
            <TabBtn active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Requests</TabBtn>
            <TabBtn active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>Pending</TabBtn>
            <TabBtn active={activeTab === 'approved'} onClick={() => setActiveTab('approved')}>Approved</TabBtn>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium text-slate-700 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
              <Filter size={14} className="text-indigo-400" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company & Agent</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documents</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading requests...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldAlert className="w-8 h-8 text-slate-200" />
                      <p className="text-sm font-bold text-slate-400">No matching requests found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {seller.company_name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-medium text-slate-500">{seller.name}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{seller.country_region}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                          <Mail size={12} className="text-slate-400" /> {seller.email}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                          <Phone size={12} className="text-slate-400" /> {seller.phone_number}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {seller.document_path ? (
                        <a 
                          href={seller.document_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black hover:bg-indigo-100 transition-all border border-indigo-100/50 uppercase tracking-widest"
                        >
                          <FileText size={12} /> View License <ExternalLink size={8} />
                        </a>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">No File</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={seller.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {seller.status === 'pending' && (
                          <button 
                            onClick={() => handleApprove(seller.id)}
                            disabled={actionLoading === seller.id}
                            className="bg-emerald-500 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-emerald-200 hover:bg-emerald-600 disabled:opacity-50 active:scale-95"
                            title="Approve Merchant"
                          >
                            {actionLoading === seller.id ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <CheckCircle2 size={16} strokeWidth={2.5} />
                            )}
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteClick(seller)}
                          className="bg-rose-500 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-rose-100 hover:bg-rose-600 disabled:opacity-50 active:scale-95"
                          title="Reject Request"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {filteredSellers.length} Requests Found
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Prev</button>
            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 transition-all">Next Page</button>
          </div>
        </div>
      </div>

      <DeleteSellerModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleRejectConfirm}
        isDeleting={actionLoading === selectedSeller?.id}
        sellerName={selectedSeller?.company_name}
      />
    </div>
  );
}

// --- SUB COMPONENTS ---

function MetricCard({ label, value, trend, icon: Icon, color, isWarning }) {
  const themes = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100/50',
    amber: 'bg-amber-50 text-amber-600 border-amber-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
  };

  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl border-2 border-white shadow-sm ${themes[color] || themes.indigo}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${isWarning ? 'bg-rose-50 text-rose-600 animate-pulse border border-rose-100/50' : 'bg-slate-50 text-slate-400 border border-slate-100/50'}`}>
          {trend}
        </div>
      </div>
      <div className="relative z-10 text-left">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}

function StatusBadge({ status }) {
  const configs = {
    pending: { label: 'Pending Review', color: 'bg-amber-50 text-amber-600 border-amber-100/50' },
    approved: { label: 'Approved Seller', color: 'bg-emerald-50 text-emerald-600 border-emerald-100/50' },
  };
  const config = configs[status] || configs.pending;

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${config.color}`}>
      {config.label}
    </span>
  );
}

function TabBtn({ children, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
        active 
          ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
          : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}
