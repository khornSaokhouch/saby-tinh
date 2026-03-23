'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Store, Building2, Calendar, Users, 
  MapPin, ArrowLeft, ArrowUpRight, ShieldCheck,
  Activity, Loader2, Box, Globe, Layers, Receipt
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useProductStore } from '@/stores/useProductStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import { getCleanImageUrl } from '@/components/nabvar/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';

function StoreDetailsContent() {
  const { language } = useLanguageStore();
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
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 font-sans text-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <div className="space-y-1">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('Loading Info', language)}</h2>
          <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t('Accessing store details...', language)}</p>
        </div>
      </div>
    );
  }

  const owner = store.user;
  const company = owner?.company_info;

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
          >
            <ArrowLeft size={16} strokeWidth={3} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Business Profile', language)}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
              {store.name.split(' ').map((word, i, arr) => (
                <span key={i} className={i === arr.length - 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-2 shadow-sm">
            <ShieldCheck size={12} className="text-indigo-600" />
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{t('Verified Merchant', language)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* --- LEFT SIDE: STORE ASSETS --- */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
            <div className="relative mb-5 flex justify-center">
              <div className="w-24 h-24 rounded-[20px] bg-slate-50 border border-slate-100 shadow-inner overflow-hidden relative">
                {store.store_image ? (
                  <Image src={getCleanImageUrl(store.store_image)} alt={store.name} fill className="object-cover" />
                ) : <Store className="m-auto h-12 w-12 text-slate-200" />}
              </div>
            </div>
            
            <h3 className="text-lg font-black text-slate-900 mb-1">{store.name}</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-emerald-100 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest mb-6">
               <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
               {t('Operational', language)}
            </span>

            <div className="space-y-2 text-left">
               <InfoRow icon={Calendar} label={t('Member Since', language)} value={new Date(store.created_at).toLocaleDateString()} />
               <InfoRow icon={Layers} label={t('Business Category', language)} value={t('Retail Store', language)} highlight />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[24px] text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Activity size={14} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{t('Business Health', language)}</span>
                </div>
                <div>
                   <h3 className="text-lg font-black tracking-tight">{t('Standard Performance', language)}</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('Growth & Status Overview', language)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                     <span className="text-lg font-black">Active</span>
                  </div>
                </div>
             </div>
             <Activity className="absolute -right-8 -bottom-8 opacity-[0.05] text-white" size={150} />
          </div>
        </div>

        {/* --- RIGHT SIDE: DRILL-DOWN DATA --- */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Ownership Block */}
          <section className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <Building2 size={16} className="text-indigo-600" />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Ownership & Business Details', language)}</h4>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                   <h5 className="text-[8px] font-black text-slate-300 uppercase tracking-widest px-1">{t('Business Owner', language)}</h5>
                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 overflow-hidden relative shadow-sm shrink-0">
                         {owner?.profile?.image_profile ? 
                            <Image src={getCleanImageUrl(owner.profile.image_profile)} alt={owner.name} fill className="object-cover" /> 
                            : <span className="m-auto text-xs font-black text-slate-300">{owner?.name?.charAt(0)}</span>}
                      </div>
                      <div className="min-w-0">
                         <p className="text-xs font-black text-slate-900 truncate uppercase">{owner?.name || t('Store Manager', language)}</p>
                         <p className="text-[9px] font-bold text-slate-400 truncate">{owner?.email}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => router.push(`/admin/company/details?userId=${owner?.id}`)}
                     className="flex items-center justify-center gap-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest px-4 py-2.5 bg-indigo-50/50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all w-full"
                   >
                     {t('Owner Profile', language)} <ArrowUpRight size={12} strokeWidth={3} />
                   </button>
                </div>

                <div className="space-y-3">
                   <h5 className="text-[8px] font-black text-slate-300 uppercase tracking-widest px-1">{t('Associated Company', language)}</h5>
                   {company ? (
                     <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 overflow-hidden relative shadow-sm shrink-0">
                           {company.company_image ? 
                              <Image src={getCleanImageUrl(company.company_image)} alt={company.company_name} fill className="object-cover p-1" /> 
                              : <Building2 className="m-auto text-slate-200" size={18} />}
                        </div>
                        <div className="min-w-0">
                           <p className="text-xs font-black text-slate-900 truncate uppercase">{company.company_name}</p>
                           <p className="text-[9px] font-bold text-slate-400 truncate tracking-widest">{company.address?.province || t('Registered HQ', language)}</p>
                        </div>
                     </div>
                   ) : (
                     <div className="h-[92px] border border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{t('No Corporate Data', language)}</p>
                     </div>
                   )}
                </div>
             </div>
          </section>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <StatCard label={t('Total Products', language)} value={products.length} icon={Box} color="indigo" subText={t('Units', language)} />
             <StatCard label={t('Region', language)} value={store.user?.company_info?.address?.province || t('Global', language)} icon={MapPin} color="emerald" />
             <StatCard label={t('Accessibility', language)} value={t('Online', language)} icon={Globe} color="purple" />
          </div>

          {/* Product Registry Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <Box className="text-indigo-600" size={16} />
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Product Catalog', language)}</h3>
                </div>
                <button 
                   onClick={() => router.push(`/admin/products?storeId=${store.id}`)}
                   className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                >
                   {t('View All Products', language)}
                </button>
             </div>

             {productsLoading ? (
               <div className="py-12 text-center text-slate-400 font-black text-[9px] uppercase animate-pulse">{t('Loading Catalog...', language)}</div>
             ) : products.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {products.slice(0, 6).map((product) => (
                   <div key={product.id} className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 overflow-hidden relative shrink-0">
                         {product.images?.[0]?.image ? (
                           <Image src={product.images[0].image} alt={product.name} fill className="object-cover" />
                         ) : <Package className="m-auto text-slate-200" size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-[11px] font-black text-slate-900 truncate uppercase">{product.name}</h4>
                         <span className="text-[9px] font-black text-slate-400">${parseFloat(product.price).toLocaleString()}</span>
                      </div>
                      <ArrowUpRight size={12} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                   </div>
                 ))}
               </div>
             ) : (
               <div className="py-12 text-center border border-dashed border-slate-100 rounded-2xl">
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{t('No products registered', language)}</p>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS (Compact Style) ---

function StatCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    purple: 'bg-purple-600 shadow-purple-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm group relative overflow-hidden transition-all hover:shadow-md">
      <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <div className="flex items-baseline gap-1.5 min-w-0">
          <h3 className="text-xl font-black text-slate-900 truncate leading-none">{value}</h3>
          {subText && <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter whitespace-nowrap">{subText}</span>}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${highlight ? 'bg-indigo-50/30 border-indigo-100' : 'bg-slate-50/50 border-transparent'}`}>
       <div className={`p-1.5 rounded-lg bg-white shadow-sm shrink-0 ${highlight ? 'text-indigo-600' : 'text-slate-400'}`}>
         <Icon size={12} strokeWidth={3} />
       </div>
       <div className="flex flex-col text-left overflow-hidden">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{label}</span>
          <span className={`text-[10px] font-black truncate ${highlight ? 'text-indigo-600' : 'text-slate-800'}`}>{value}</span>
       </div>
    </div>
  );
}

export default function StoreDetails() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>}>
      <StoreDetailsContent />
    </Suspense>
  );
}