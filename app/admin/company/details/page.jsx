'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Building2, Globe, Clock, MapPin, Loader2, 
  Mail, Phone, ExternalLink, ArrowLeft,
   ShieldCheck, Calendar, Navigation, Building, ShieldAlert,
  CreditCard, Store, PieChart, Activity,
  Info, CheckCircle2, AlertCircle, Bookmark,
  TrendingUp, Wallet, DollarSign, Fingerprint
} from 'lucide-react';
import { useCompanyStore } from '@/stores/useCompanyStore';
import { useUserStore } from '@/stores/userStore';
import { getCleanImageUrl } from '@/components/nabvar/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically load map component
const LocationPicker = dynamic(() => import('@/components/owner/LocationPicker'), { 
  ssr: false,
  loading: () => (
    <div className="h-80 w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center border border-slate-200">
      <div className="flex flex-col items-center gap-2 text-slate-400">
        <Loader2 className="animate-spin text-indigo-500" />
        <span className="text-xs font-bold uppercase tracking-widest">Initialising Map...</span>
      </div>
    </div>
  )
});

function PartnerDetailsContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const router = useRouter();
  
  const { companies, fetchCompanies, loading: companyLoading } = useCompanyStore();
  const { fetchUserById, loading: userLoading } = useUserStore();
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    fetchCompanies();
    const loadPartner = async () => {
      if (userId) {
        const res = await fetchUserById(userId);
        if (res?.success) setPartner(res.data);
      }
    };
    loadPartner();
  }, [fetchCompanies, fetchUserById, userId]);

  const company = useMemo(() => companies.find(c => String(c.user_id) === userId), [companies, userId]);

  if (companyLoading || userLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6 font-sans">
        <div className="relative">
          <Loader2 className="animate-spin text-indigo-600" size={48} strokeWidth={1.5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-1">Loading Details</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accessing partner information...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="max-w-2xl mx-auto mt-20">
        <div className="bg-white p-12 rounded-[48px] border border-slate-100 text-center shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden font-sans">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShieldAlert className="text-slate-300" size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Partner Not Found</h2>
          <p className="text-slate-500 font-medium mb-10 text-balance">The partner you are looking for does not exist in our directory.</p>
          <button onClick={() => router.back()} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 mx-auto hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
            <ArrowLeft size={16} /> Return to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-6">
        <div className="flex items-center gap-8">
          <motion.button 
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="w-14 h-14 flex items-center justify-center bg-white border border-slate-200 rounded-[24px] text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </motion.button>
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2 ml-0.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Partner Profile</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{partner.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-xl p-2 pr-6 border border-white rounded-[28px] shadow-sm">
           <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Activity size={18} />
           </div>
           <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Status</span>
               <span className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-0.5">Active Partner</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- SIDEBAR: EXECUTIVE CARD --- */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 translate-x-16 -translate-y-16 rounded-full bg-indigo-600 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-[44px] bg-slate-50 border-[6px] border-white shadow-2xl mx-auto flex items-center justify-center text-4xl font-black text-slate-200 relative z-10 overflow-hidden uppercase">
                {partner.profile?.image_profile ? (
                  <Image src={getCleanImageUrl(partner.profile.image_profile)} alt={partner.name} fill className="object-cover" />
                ) : partner.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 right-1/2 translate-x-12 z-20 w-10 h-10 bg-indigo-600 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-xl">
                 <ShieldCheck size={18} />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 relative z-10">{partner.name}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 relative z-10 leading-relaxed px-4">
              {partner.email}
            </p>

            <div className="grid grid-cols-1 gap-3 mt-10 relative z-10">
               <InfoRow icon={Mail} label="Contact" value={partner.email} />
               <InfoRow icon={Phone} label="Line ID" value={partner.phone_number || 'Not Linked'} />
               <InfoRow icon={Calendar} label="Joined" value={new Date(partner.created_at).toLocaleDateString()} />
               <InfoRow icon={Fingerprint} label="Partner ID" value={`#${partner.id.toString().padStart(5, '0')}`} highlight />
            </div>

            <div className="mt-10 pt-10 border-t border-slate-50 grid grid-cols-2 gap-6 relative z-10">
               <div className="text-left py-1">
                 <span className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 ml-0.5">Trust Score</span>
                 <div className="flex gap-0.5">
                   {[1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 4 ? 'bg-indigo-500' : 'bg-slate-200'}`} />)}
                 </div>
               </div>
               <div className="text-left py-1 border-l border-slate-50 pl-6">
                 <span className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 ml-0.5">Affiliation</span>
                  <span className="text-[10px] font-black text-slate-900 uppercase">Partner</span>
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
               <PieChart size={140} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-indigo-300">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em]">Analytics</span>
                </div>
                <h3 className="text-2xl font-black mb-4 leading-tight">Predictive Analytics Ready</h3>
                <p className="text-xs text-indigo-100/70 leading-relaxed font-medium mb-10">
                   View partner performance and growth metrics to gain better business insights.
                </p>
                <button className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 hover:bg-white/20 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/20 backdrop-blur-sm shadow-xl">
                   View Analytics <ExternalLink size={14} />
                </button>
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT: ENTERPRISE DATA --- */}
        <div className="lg:col-span-8 space-y-10 text-left">
          
          {/* Section 1: Business Identity */}
          <section className="bg-white p-10 sm:p-12 rounded-[52px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.015)] relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 pb-12 border-b border-slate-50 mb-12">
              <div className="w-28 h-28 rounded-[38px] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden relative p-4 group shrink-0">
                {company?.company_image ? (
                    <Image src={getCleanImageUrl(company.company_image)} alt={company.company_name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                    <Building2 className="text-slate-200" size={40} />
                )}
                {!company && <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[1px]" />}
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{company?.company_name || 'Partner Company'}</h2>
                   {company && <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100/50">Verified Business</span>}
                </div>
                <div className="flex flex-wrap gap-6">
                  {company?.website_url && (
                    <a href={company.website_url} target="_blank" className="flex items-center gap-2.5 text-[11px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                      <Globe size={16} /> Official Domain <ExternalLink size={12} />
                    </a>
                  )}
                  {company?.open_time && (
                    <div className="flex items-center gap-2.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={16} className="text-slate-300" /> Operational Cycle: {company.open_time} - {company.close_time}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Bookmark size={14} className="text-indigo-600" />
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">About Company</h4>
                  </div>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed text-balance">
                    {company?.description || 'No company description available.'}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation size={14} className="text-indigo-600" />
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location</h4>
                  </div>
                  {company?.address ? (
                    <div className="p-6 bg-slate-50/80 rounded-[32px] border border-slate-100 shadow-inner group">
                      <p className="text-sm font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                        {company.address.house_number ? `#${company.address.house_number}, ` : ''}{company.address.street}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                        {company.address.commune}, {company.address.district}<br />
                        {company.address.province}, {company.address.country?.name || 'Main Region'}
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No address linked</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-full min-h-[300px] rounded-[42px] overflow-hidden border border-slate-100 shadow-xl relative mt-4">
                {company?.address ? (
                  <LocationPicker 
                    lat={company.address.latitude} 
                    lng={company.address.longitude} 
                    onChange={() => {}} 
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-10 text-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-2">
                       <MapPin className="text-slate-200" size={32} />
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No map data available</p>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-[6px] px-4 py-2 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-lg border border-white flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Asset Verified: {company?.address?.province || 'Global'}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Financial & Operational Infrastructure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             
             {/* Store Asset */}
             <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                   <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                      <Store size={22} strokeWidth={2.5} />
                   </div>
                   <div className="px-3 py-1 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 cursor-default">Store Details</div>
                </div>
                
                {partner.store ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden relative p-1 border border-slate-100 shadow-inner group-hover:rotate-3 transition-transform">
                          {partner.store.store_image ? <Image src={getCleanImageUrl(partner.store.store_image)} alt={partner.store.name} fill className="object-cover rounded-xl" /> : <Store className="text-slate-200" />}
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1.5">{partner.store.name}</h4>
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Status: Open for Trade</span>
                       </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                       Business location for managing products and sales.
                    </p>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No store linked</p>
                  </div>
                )}
             </div>

             {/* Financial Assets */}
             <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                   <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                      <Wallet size={22} strokeWidth={2.5} />
                   </div>
                   <div className="px-3 py-1 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 cursor-default">Payment Methods</div>
                </div>
                
                <div className="space-y-4">
                  {partner.payment_accounts?.length > 0 ? (
                    partner.payment_accounts.map((acc) => (
                      <div key={acc.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group/acc hover:bg-white hover:shadow-xl transition-all">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm border border-slate-50 group-hover/acc:scale-110 transition-transform">
                             <CreditCard size={14} strokeWidth={2.5} />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[11px] font-black text-slate-800 leading-none mb-1">{acc.account_name}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{acc.account_type}</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className="text-[10px] font-black text-slate-900">{acc.account_id}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No payment methods linked</p>
                    </div>
                  )}
                </div>
             </div>
          </div>

          {/* Internal Metadata */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-20">
             <StatBox label="Active Since" value="24h ago" icon={Activity} />
             <StatBox label="Status" value="Verified" icon={ShieldCheck} success />
             <StatBox label="Rank" value="#12" icon={TrendingUp} />
             <StatBox label="Sales" value="Active" icon={DollarSign} success />
          </section>
        </div>
      </div>
    </div>
  );
}

export default function PartnerDetailsPage() {
  return (
    <Suspense fallback={
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6 font-sans">
        <Loader2 className="animate-spin text-indigo-600" size={48} strokeWidth={1.5} />
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-1">Loading Partner</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preparing data stream...</p>
        </div>
      </div>
    }>
      <PartnerDetailsContent />
    </Suspense>
  );
}

function InfoRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all ${highlight ? 'bg-indigo-50/50 border border-indigo-100 shadow-[0_4px_20px_rgba(79,70,229,0.05)]' : 'border border-transparent bg-slate-50'}`}>
       <div className={`p-2 rounded-xl bg-white shadow-sm shrink-0 ${highlight ? 'text-indigo-600' : 'text-slate-400'}`}>
         <Icon size={14} strokeWidth={2.5} />
       </div>
       <div className="flex flex-col text-left">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] leading-tight mb-0.5">{label}</span>
          <span className={`text-[11px] font-black truncate max-w-[160px] ${highlight ? 'text-indigo-600' : 'text-slate-700'}`}>{value}</span>
       </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, success }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-center flex flex-col items-center group hover:border-indigo-100 transition-all">
       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 shadow-inner ${success ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'} group-hover:scale-110 transition-transform`}>
          <Icon size={18} strokeWidth={2.5} />
       </div>
       <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{label}</span>
       <span className={`text-sm font-black uppercase ${success ? 'text-emerald-600' : 'text-slate-900'}`}>{value}</span>
    </div>
  );
}
