'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Store, Building2, Calendar, Users, Info, 
  MapPin, Clock, ArrowLeft, ExternalLink, 
  Package, ShoppingCart, Tag, Activity,
  ChevronRight, ArrowUpRight, ShieldCheck,
  CreditCard, Globe, Navigation, Loader2,
  Box, Smartphone, Layers
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useProductStore } from '@/stores/useProductStore';
import { getCleanImageUrl } from '@/components/nabvar/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

function StoreDetailsContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get('storeId');
  const router = useRouter();
  const { fetchStoreById, loading: storeLoading } = useStore();
  const { products, fetchProductsByStore, loading: productsLoading } = useProductStore();
  const [store, setStore] = useState(null);

  useEffect(() => {
    const loadStore = async () => {
      if (storeId) {
        const res = await fetchStoreById(storeId);
        if (res?.success) setStore(res.data);
        await fetchProductsByStore(storeId);
      }
    };
    loadStore();
  }, [storeId, fetchStoreById, fetchProductsByStore]);

  if (storeLoading || !store) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6 font-sans">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-1">Loading Store Details</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accessing store information...</p>
        </div>
      </div>
    );
  }

  const owner = store.user;
  const company = owner?.company_info;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 font-sans pt-4 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Asset Profile</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
              {store.name.split(' ').map((word, i) => i === store.name.split(' ').length - 1 ? (
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400"> {word}</span>
              ) : <span key={i}>{word} </span>)}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 pr-4 border border-slate-100 rounded-2xl shadow-sm">
           <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ShieldCheck size={14} />
           </div>
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">Registry Status</span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">Verified Entity</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- SIDEBAR: ASSET CARD --- */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 translate-x-8 -translate-y-8 rounded-full bg-indigo-600 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-[32px] bg-slate-50 border-[4px] border-white shadow-xl mx-auto flex items-center justify-center text-3xl font-black text-slate-200 relative z-10 overflow-hidden group-hover:rotate-2 transition-all duration-700 p-2">
                {store.store_image ? (
                  <Image src={getCleanImageUrl(store.store_image)} alt={store.name} fill sizes="(max-width: 768px) 100vw, 33vw" priority className="object-cover rounded-[24px]" />
                ) : <Store size={48} />}
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 relative z-10 mb-2 truncate px-4">{store.name}</h3>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
               Operational
            </div>

            <div className="grid grid-cols-1 gap-2.5 mt-8 relative z-10">
               <InfoRow icon={Calendar} label="Nodes Since" value={new Date(store.created_at).toLocaleDateString()} />
               <InfoRow icon={Layers} label="Deployment" value="Standard Retail" highlight />
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
               <Activity size={100} />
             </div>
             <div className="relative z-10 text-left">
                <div className="flex items-center gap-2 mb-3 text-indigo-400">
                  <Activity size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Asset Performance</span>
                </div>
                <h3 className="text-xl font-black mb-3 leading-tight">Inventory Pulse</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium mb-8">
                  Active stock nodes are fully synchronized with the central directory.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                     <span className="block text-[8px] font-black text-slate-500 uppercase mb-0.5 tracking-widest">Stock Nodes</span>
                     <span className="text-lg font-black">{products.length}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                     <span className="block text-[8px] font-black text-slate-500 uppercase mb-0.5 tracking-widest">Value Shift</span>
                     <span className="text-lg font-black">Stable</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT: AUDIT DATA --- */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Owner & Company Linkage */}
          <section className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                <Users size={160} />
             </div>
             
             <div className="flex items-center gap-3 mb-8">
                <Building2 size={16} className="text-indigo-600" />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Branch Governance</h4>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Executive Profile */}
                <div className="space-y-4">
                    <h5 className="text-[9px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-2">Principal Owner</h5>
                   <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-[28px] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                      <div className="w-12 h-12 rounded-[20px] bg-white border border-slate-100 flex items-center justify-center overflow-hidden relative shadow-sm shrink-0">
                         {owner?.profile?.image_profile ? 
                            <Image src={getCleanImageUrl(owner.profile.image_profile)} alt={owner.name} fill sizes="48px" className="object-cover" /> 
                            : <span className="text-sm font-black text-slate-400">{owner?.name?.charAt(0) || 'U'}</span>}
                      </div>
                      <div className="flex flex-col min-w-0">
                         <span className="text-sm font-black text-slate-900 mb-0.5 truncate">{owner?.name || 'Unknown Executive'}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{owner?.email}</span>
                      </div>
                   </div>
                   <button 
                     onClick={() => router.push(`/admin/company/details?userId=${owner?.id}`)}
                     className="flex items-center gap-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest px-5 py-3 bg-indigo-50/50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all w-full justify-center"
                   >
                     Executive Audit <ArrowUpRight size={12} />
                   </button>
                </div>

                {/* Company Association */}
                <div className="space-y-4">
                    <h5 className="text-[9px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-2">Parent Entity</h5>
                   {company ? (
                     <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-[28px] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                        <div className="w-12 h-12 rounded-[20px] bg-white border border-slate-100 flex items-center justify-center overflow-hidden relative shadow-sm shrink-0">
                           {company.company_image ? 
                              <Image src={getCleanImageUrl(company.company_image)} alt={company.company_name} fill sizes="48px" className="object-cover p-1.5" /> 
                              : <Building2 className="text-slate-200" size={24} />}
                        </div>
                        <div className="flex flex-col min-w-0">
                           <span className="text-sm font-black text-slate-900 mb-0.5 truncate">{company.company_name}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{company.address?.province || 'HQ'}</span>
                        </div>
                     </div>
                   ) : (
                     <div className="p-8 border border-dashed border-slate-200 rounded-[28px] text-center flex items-center justify-center h-full min-h-[82px]">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Parent Registry Found</p>
                     </div>
                   )}
                </div>
             </div>
          </section>

          {/* Operational Infrastructure Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <MetricCard label="Stock Capacity" value={products.length} icon={Box} color="indigo" />
             <MetricCard label="Node Localization" value={store.user?.company_info?.address?.province || 'Global'} icon={MapPin} color="emerald" />
             <MetricCard label="Registry Status" value="Online" icon={Globe} color="purple" />
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <Package className="text-indigo-600" size={16} />
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventory Nodes</h3>
                </div>
                <button 
                  onClick={() => router.push(`/admin/products?storeId=${store.id}`)}
                  className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                >
                  Full Registry Survey
                </button>
             </div>

             {productsLoading ? (
               <div className="py-20 text-center">
                 <Loader2 className="animate-spin text-slate-200 mx-auto mb-3" size={28} />
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Syncing inventory nodes...</p>
               </div>
             ) : products.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {products.slice(0, 6).map((product) => (
                   <div key={product.id} className="p-3.5 bg-slate-50/50 rounded-[24px] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[16px] bg-white border border-slate-100 overflow-hidden relative shadow-sm shrink-0">
                         {product.images?.[0]?.image ? (
                           <Image src={product.images[0].image} alt={product.name} fill sizes="48px" className="object-cover" />
                         ) : <Package className="text-slate-200 m-auto" size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-[11px] font-black text-slate-900 truncate mb-0.5">{product.name}</h4>
                         <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded-md">
                               REGISTRY
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-tight">${parseFloat(product.price).toLocaleString()}</span>
                         </div>
                      </div>
                      <ArrowUpRight size={12} className="text-slate-300 group-hover:text-indigo-600 transition-colors mr-1" />
                   </div>
                 ))}
               </div>
             ) : (
               <div className="py-20 text-center border border-dashed border-slate-100 rounded-[32px]">
                 <Package className="text-slate-100 mx-auto mb-3" size={32} />
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No stock nodes detected</p>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    purple: 'bg-purple-600 shadow-purple-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
  };
  return (
    <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500 text-center flex flex-col items-center">
      <div className={`p-2 rounded-xl w-9 h-9 flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10 ${themes[color]}`}>
        <Icon size={16} strokeWidth={3} />
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className="text-lg font-black text-slate-900 tracking-tighter leading-none relative z-10 whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-2">{value}</h3>
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out opacity-50" />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`flex items-center gap-3.5 p-3 rounded-2xl transition-all ${highlight ? 'bg-indigo-50/50 border border-indigo-100' : 'bg-slate-50/50 border border-transparent'}`}>
       <div className={`p-2 rounded-xl bg-white shadow-sm shrink-0 ${highlight ? 'text-indigo-600' : 'text-slate-400'}`}>
         <Icon size={14} strokeWidth={2.5} />
       </div>
       <div className="flex flex-col text-left overflow-hidden">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] leading-tight mb-0.5">{label}</span>
          <span className={`text-[11px] font-black truncate max-w-full ${highlight ? 'text-indigo-600' : 'text-slate-800'}`}>{value}</span>
       </div>
    </div>
  );
}

export default function StoreDetails() {
  return (
    <Suspense fallback={
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6 font-sans">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-1">Loading Store Details</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accessing store information...</p>
        </div>
      </div>
    }>
      <StoreDetailsContent />
    </Suspense>
  );
}
