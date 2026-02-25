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
    <div className="max-w-7xl mx-auto space-y-10 pb-32 font-sans pt-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <motion.button 
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="w-14 h-14 flex items-center justify-center bg-white border border-slate-200 rounded-[24px] text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-2xl transition-all group"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Store Profile</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{store.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-xl p-2 pr-6 border border-white rounded-[28px] shadow-sm">
           <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
              <Tag size={18} />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Store Status</span>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-0.5 font-sans">Active Store</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- SIDEBAR: ASSET CARD --- */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 translate-x-16 -translate-y-16 rounded-full bg-indigo-600 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative mb-8">
              <div className="w-40 h-40 rounded-[48px] bg-slate-50 border-[6px] border-white shadow-2xl mx-auto flex items-center justify-center text-4xl font-black text-slate-200 relative z-10 overflow-hidden group-hover:rotate-3 transition-all duration-700 p-2">
                {store.store_image ? (
                  <Image src={getCleanImageUrl(store.store_image)} alt={store.name} fill sizes="(max-width: 768px) 100vw, 33vw" priority className="object-cover rounded-[40px] p-1" />
                ) : <Store size={60} />}
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 relative z-10 mb-2">{store.name}</h3>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
               Active
            </div>

            <div className="grid grid-cols-1 gap-3 mt-10 relative z-10">
               <InfoRow icon={Calendar} label="Since" value={new Date(store.created_at).toLocaleDateString()} />
               <InfoRow icon={Layers} label="Type" value="Retail Store" highlight />
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
               <Smartphone size={140} />
             </div>
             <div className="relative z-10 text-left">
                <div className="flex items-center gap-2 mb-4 text-emerald-400">
                  <Activity size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em]">Inventory Status</span>
                </div>
                <h3 className="text-2xl font-black mb-4 leading-tight">Active Inventory</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium mb-10">
                  Store stock is fully synchronized with the product directory.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                     <span className="block text-[9px] font-black text-slate-500 uppercase mb-1">Stock</span>
                     <span className="text-xl font-black">---</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                     <span className="block text-[9px] font-black text-slate-500 uppercase mb-1">Sales</span>
                     <span className="text-xl font-black">---</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT: AUDIT DATA --- */}
        <div className="lg:col-span-8 space-y-10 text-left">
          
          {/* Owner & Company Linkage */}
          <section className="bg-white p-10 sm:p-12 rounded-[52px] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <Users size={200} />
             </div>
             
             <div className="flex items-center gap-3 mb-10">
                <ShieldCheck size={18} className="text-indigo-600" />
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Ownership</h4>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Executive Profile */}
                <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-3">Store Owner</h5>
                   <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-[32px] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                      <div className="w-16 h-16 rounded-[24px] bg-white border border-slate-100 flex items-center justify-center overflow-hidden relative shadow-sm shrink-0">
                         {owner?.profile?.image_profile ? 
                            <Image src={getCleanImageUrl(owner.profile.image_profile)} alt={owner.name} fill sizes="64px" className="object-cover" /> 
                            : owner?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-lg font-black text-slate-900 mb-0.5">{owner?.name || 'Unknown User'}</span>
                         <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{owner?.email}</span>
                      </div>
                   </div>
                   <button 
                     onClick={() => router.push(`/admin/company/details?userId=${owner?.id}`)}
                     className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest px-6 py-3 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all w-full justify-center"
                   >
                     View Owner Profile <ArrowUpRight size={14} />
                   </button>
                </div>

                {/* Company Association */}
                <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-3">Main Company</h5>
                   {company ? (
                     <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-[32px] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                        <div className="w-16 h-16 rounded-[24px] bg-white border border-slate-100 flex items-center justify-center overflow-hidden relative shadow-sm shrink-0">
                           {company.company_image ? 
                              <Image src={getCleanImageUrl(company.company_image)} alt={company.company_name} fill sizes="64px" className="object-cover p-2" /> 
                              : <Building2 className="text-slate-200" />}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-lg font-black text-slate-900 mb-0.5">{company.company_name}</span>
                           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{company.address?.province || 'Main Hub'}</span>
                        </div>
                     </div>
                   ) : (
                     <div className="p-10 border border-dashed border-slate-200 rounded-[32px] text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No parent company found</p>
                     </div>
                   )}
                </div>
             </div>
          </section>

          {/* Operational Infrastructure Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <StatCard label="Current Stock" value="0.0" icon={Box} />
             <StatCard label="Sales Volume" value="0.0" icon={ShoppingCart} emerald />
             <StatCard label="System Status" value="Stable" icon={Globe} />
          </div>

          <div className="bg-white p-10 sm:p-12 rounded-[52px] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <Box className="text-indigo-600" size={18} />
                   <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Inventory</h3>
                </div>
                <button 
                  onClick={() => router.push(`/admin/products?storeId=${store.id}`)}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                >
                  View Full Directory
                </button>
             </div>

             {productsLoading ? (
               <div className="py-20 text-center">
                 <Loader2 className="animate-spin text-slate-200 mx-auto mb-4" size={32} />
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Accessing product nodes...</p>
               </div>
             ) : products.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {products.map((product) => (
                   <div key={product.id} className="p-4 bg-slate-50/50 rounded-[32px] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all flex items-center gap-4">
                      <div className="w-16 h-16 rounded-[24px] bg-white border border-slate-100 overflow-hidden relative shadow-sm shrink-0">
                         {product.images?.[0]?.image ? (
                           <Image src={product.images[0].image} alt={product.name} fill sizes="64px" className="object-cover" />
                         ) : <Package className="text-slate-200 m-auto" size={24} />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-black text-slate-900 truncate mb-0.5">{product.name}</h4>
                         <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter bg-indigo-50 px-1.5 py-0.5 rounded-md">
                               {product.category?.name || 'Category'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">${parseFloat(product.price).toLocaleString()}</span>
                         </div>
                      </div>
                      <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors mr-2" />
                   </div>
                 ))}
               </div>
             ) : (
               <div className="py-20 text-center border border-dashed border-slate-100 rounded-[40px]">
                 <Package className="text-slate-100 mx-auto mb-4" size={48} />
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No products detected in inventory</p>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function StoreDetailsPage() {
  return (
    <Suspense fallback={
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6 font-sans">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-1">Loading Store</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preparing data stream...</p>
        </div>
      </div>
    }>
      <StoreDetailsContent />
    </Suspense>
  );
}

function InfoRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-3xl transition-all ${highlight ? 'bg-indigo-50/50 border border-indigo-100 shadow-sm' : 'bg-slate-50/50 border border-transparent'}`}>
       <div className={`p-2 rounded-2xl bg-white shadow-sm shrink-0 ${highlight ? 'text-indigo-600' : 'text-slate-400'}`}>
         <Icon size={16} strokeWidth={2.5} />
       </div>
       <div className="flex flex-col text-left">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] leading-tight mb-1">{label}</span>
          <span className={`text-xs font-black truncate max-w-[180px] ${highlight ? 'text-indigo-600' : 'text-slate-800'}`}>{value}</span>
       </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, emerald }) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center flex flex-col items-center group hover:border-indigo-100 transition-all">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-inner ${emerald ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-indigo-600'} group-hover:scale-110 transition-transform`}>
          <Icon size={22} strokeWidth={2.5} />
       </div>
       <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5">{label}</span>
       <span className="text-lg font-black text-slate-900 uppercase">{value}</span>
    </div>
  );
}
