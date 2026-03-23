'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Search, Filter, Mail, Phone, 
  ShieldAlert, Download, Trash2, CheckCircle2, FileText, 
  ExternalLink, Loader2, Clock, RefreshCw, ChevronDown, Check, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import { useSellerStore } from '@/stores/useSellerStore';
import DeleteSellerModal from '@/app/components/admin/modeldeleted/DeleteSellerModal';

export default function SellerManagementPage() {
  const { language } = useLanguageStore();
  const { 
    sellers, 
    loading, 
    fetchSellers, 
    approveSeller, 
    rejectSeller,
    deleteMultipleSellers 
  } = useSellerStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); 
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // --- Bulk Selection State ---
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchSellers();
    const interval = setInterval(() => fetchSellers(), 30000);
    return () => clearInterval(interval);
  }, [fetchSellers]);

  // Reset selection on search or tab change
  useEffect(() => {
    setSelectedIds([]);
  }, [searchTerm, activeTab]);

  const filteredSellers = useMemo(() => {
    return sellers.filter(seller => {
      const matchesSearch = 
        (seller.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (seller.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (seller.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'all' || seller.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [sellers, searchTerm, activeTab]);

  const stats = useMemo(() => ({
    total: sellers.length,
    pending: sellers.filter(s => s.status === 'pending').length,
    approved: sellers.filter(s => s.status === 'approved').length,
  }), [sellers]);

  // --- Handlers ---
  const handleSelectAll = () => {
    if (selectedIds.length === filteredSellers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSellers.map(s => s.id));
    }
  };

  const toggleSelectId = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} seller requests?`)) {
      setActionLoading('batch');
      const res = await deleteMultipleSellers(selectedIds);
      if (res?.success) {
        toast.success(t('Removed count requests', language).replace('count', selectedIds.length));
        setSelectedIds([]);
      } else {
        toast.error(res?.message || t('Batch deletion failed', language));
      }
      setActionLoading(null);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveSeller(id);
      toast.success(t('Merchant application approved', language));
    } catch (error) {
      toast.error(t('Failed to approve merchant', language));
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
      toast.success(t('Merchant application rejected', language));
    } catch (error) {
      toast.error(t('Failed to reject application', language));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500 relative">
      
      {/* --- BATCH ACTIONS BAR --- */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-6"
          >
            <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
              <div className="bg-indigo-500 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black">
                {selectedIds.length}
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">{t('Selected Requests', language)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBatchDelete}
                disabled={actionLoading === 'batch'}
                className="flex items-center gap-2 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black transition-all active:scale-95 disabled:opacity-50"
              >
                {actionLoading === 'batch' ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} strokeWidth={3} />}
                {t('Delete Selected', language)}
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black transition-all"
              >
                {t('Cancel', language)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Partner Onboarding', language)}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Seller', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">{t('Requests', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            {t('Manage merchant applications and business licensing.', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchSellers()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black hover:bg-slate-800 transition-all shadow-md uppercase tracking-widest active:scale-95">
            <Download size={14} strokeWidth={3} />
            {t('Export', language)}
          </button>
        </div>
      </div>

      {/* --- KPI GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label={t('Total Requests', language)} value={sellers.length} icon={FileText} color="indigo" language={language} />
        <StatCard 
          label={t('Pending Review', language)} 
          value={sellers.filter(s => s.status === 'pending').length} 
          icon={Clock} 
          color="rose" 
          isWarning={sellers.filter(s => s.status === 'pending').length > 0} 
          language={language}
        />
        <StatCard label={t('Approved Partners', language)} value={sellers.filter(s => s.status === 'approved').length} icon={CheckCircle2} color="emerald" language={language} />
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder={t('Search merchants...', language)} 
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative flex-1 sm:flex-none w-full sm:w-auto">
            <select
              value={activeTab}
              onChange={e => setActiveTab(e.target.value)}
              className="w-full sm:w-auto pl-4 pr-10 h-[32px] bg-slate-50 border border-transparent rounded-lg text-[9px] font-black text-slate-500 outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-all min-w-[140px] uppercase tracking-widest"
            >
              <option value="all">{t('All Requests', language)}</option>
              <option value="pending">{t('Pending', language)}</option>
              <option value="approved">{t('Approved', language)}</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={12} />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="pl-6 w-10 py-3 text-left">
                  <div 
                    onClick={handleSelectAll}
                    className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                    selectedIds.length === filteredSellers.length && filteredSellers.length > 0
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'bg-white border-slate-200 hover:border-indigo-400'
                  }`}>
                    {selectedIds.length === filteredSellers.length && filteredSellers.length > 0 && <Check size={10} className="text-white" strokeWidth={5} />}
                  </div>
                </th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Business Info', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Contact Details', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Documents', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Status', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Actions', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse italic">{t('Scanning Registry...', language)}</td></tr>
              ) : filteredSellers.length === 0 ? (
                <tr><td colSpan="6" className="py-16 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('No requests found', language)}</td></tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller.id} className={`group hover:bg-slate-50/30 transition-colors ${selectedIds.includes(seller.id) ? 'bg-indigo-50/40' : ''}`}>
                    <td className="pl-6 py-4">
                      <div 
                        onClick={() => toggleSelectId(seller.id)}
                        className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                        selectedIds.includes(seller.id) 
                          ? 'bg-indigo-600 border-indigo-600' 
                          : 'bg-white border-slate-200 group-hover:border-indigo-300'
                      }`}>
                        {selectedIds.includes(seller.id) && <Check size={10} className="text-white" strokeWidth={5} />}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                          {seller.company_name}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{t('Rep:', language)} {seller.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><Mail size={10} /> {seller.email}</span>
                        <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1 mt-0.5"><Phone size={10} /> {seller.phone_number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {seller.document_path ? (
                        <a 
                          href={seller.document_path} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-white transition-all"
                        >
                          <FileText size={10} /> {t('License', language)} <ExternalLink size={8} />
                        </a>
                      ) : (
                        <span className="text-[8px] font-black text-slate-300 uppercase">{t('Missing File', language)}</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={seller.status} language={language} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {seller.status === 'pending' && (
                          <button 
                            onClick={() => handleApprove(seller.id)}
                            disabled={actionLoading === seller.id}
                            className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-sm active:scale-95 transition-all"
                          >
                            {actionLoading === seller.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} strokeWidth={3} />}
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteClick(seller)}
                          className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm active:scale-95 transition-all"
                        >
                          <Trash2 size={14} strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteSellerModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleRejectConfirm}
        isDeleting={actionLoading === selectedSeller?.id}
        sellerName={selectedSeller?.company_name}
        language={language}
      />
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatCard({ label, value, icon: Icon, color, isWarning, language }) {
  const themes = {
    indigo: 'bg-indigo-600',
    rose: 'bg-rose-500',
    emerald: 'bg-emerald-500',
  };

  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm group relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className={`p-2 rounded-xl ${themes[color]} text-white shadow-lg`}>
          <Icon size={16} strokeWidth={3} />
        </div>
        {isWarning && (
          <div className="text-[8px] font-black px-1.5 py-0.5 rounded border border-rose-100 bg-rose-50 text-rose-600 uppercase tracking-widest animate-pulse">
            {t('Action Req.', language)}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-0.5">{label}</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tighter">{value}</h3>
      </div>
    </div>
  );
}

function StatusBadge({ status, language }) {
  const config = {
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${config[status] || "bg-slate-50 text-slate-400 border-slate-100"}`}>
      <span className="w-1 h-1 rounded-full bg-current mr-1.5 animate-pulse" />
      {status === 'approved' ? t('Partner', language) : t('Review', language)}
    </span>
  );
}