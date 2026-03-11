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
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 font-sans animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all group shadow-sm"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Partner Node Profile</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {partner.name.split(' ').map((word, i) => (
                <span key={i} className={i === partner.name.split(' ').length - 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm self-start md:self-center">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Verified Identity</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- SIDEBAR: EXECUTIVE CARD --- */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 translate-x-8 -translate-y-8 rounded-full bg-blue-600 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-[24px] bg-slate-50 border-4 border-white shadow-xl mx-auto flex items-center justify-center text-3xl font-black text-slate-200 relative z-10 overflow-hidden uppercase">
                {partner.profile?.image_profile ? (
                  <Image src={getCleanImageUrl(partner.profile.image_profile)} alt={partner.name} fill className="object-cover" />
                ) : partner.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 right-1/2 translate-x-10 z-20 w-8 h-8 bg-blue-600 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                 <ShieldCheck size={14} />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 relative z-10 tracking-tight">{partner.name}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1 relative z-10 opacity-70">
              Executive Node
            </p>

            <div className="grid grid-cols-1 gap-2 mt-8 relative z-10">
               <InfoRow icon={Mail} label="Primary Contact" value={partner.email} />
               <InfoRow icon={Phone} label="Network ID" value={partner.phone_number || 'Internal'} />
               <InfoRow icon={Calendar} label="Sync Date" value={new Date(partner.created_at).toLocaleDateString()} />
               <InfoRow icon={Fingerprint} label="Node ID" value={`#${partner.id.toString().padStart(5, '0')}`} highlight />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-8 rounded-[32px] text-white shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
               <PieChart size={100} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-blue-200/80">
                  <TrendingUp size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Operational Insights</span>
                </div>
                <h3 className="text-lg font-black mb-3 leading-tight tracking-tight text-white/95">Network Performance Hub</h3>
                <p className="text-[10px] text-blue-100/60 leading-relaxed font-bold mb-8">
                   Predictive analysis and growth trajectories for corporate node optimization.
                </p>
                <button className="flex items-center justify-center gap-3 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-white/20 backdrop-blur-sm">
                   View Analytics <ExternalLink size={12} />
                </button>
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT: ENTERPRISE DATA --- */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Section 1: Business Identity */}
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pb-8 border-b border-slate-50">
              <div className="w-20 h-20 rounded-[20px] bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden relative p-3 group shrink-0">
                {company?.company_image ? (
                    <Image src={getCleanImageUrl(company.company_image)} alt={company.company_name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                    <Building2 className="text-slate-200" size={32} />
                )}
                {!company && <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[1px]" />}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{company?.company_name || 'Business Unit'}</h2>
                   {company && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-100/50">Verified Entity</span>}
                </div>
                <div className="flex flex-wrap gap-4">
                  {company?.website_url && (
                    <a href={company.website_url} target="_blank" className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                      <Globe size={14} /> Domain <ExternalLink size={10} />
                    </a>
                  )}
                  {company?.open_time && (
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={14} className="text-slate-300" /> Cycle: {company.open_time} - {company.close_time}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                   <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Enterprise Abstract</h4>
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed text-balance">
                    {company?.description || 'No corporate description available in this node.'}
                  </p>
                </div>
                
                <div className="space-y-3">
                   <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Address</h4>
                  {company?.address ? (
                    <div className="p-4 bg-slate-50 rounded-[20px] border border-slate-100 group">
                      <p className="text-[11px] font-black text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                        {company.address.house_number ? `#${company.address.house_number}, ` : ''}{company.address.street}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                        {company.address.commune}, {company.address.district}, {company.address.province}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-[20px] border border-dashed border-slate-200 text-center">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Location Matrix Empty</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-full min-h-[200px] rounded-[24px] overflow-hidden border border-slate-100 shadow-sm relative">
                {company?.address ? (
                  <LocationPicker 
                    lat={company.address.latitude} 
                    lng={company.address.longitude} 
                    onChange={() => {}} 
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center gap-3">
                     <MapPin className="text-slate-200" size={24} />
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Map Node Unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Financial & Operational Infrastructure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Store Asset */}
             <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6">
                   <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Store size={18} strokeWidth={3} />
                   </div>
                   <div className="px-2 py-0.5 bg-slate-50 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">Asset Node</div>
                </div>
                
                {partner.store ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden relative border border-slate-100 group-hover:rotate-2 transition-transform">
                          {partner.store.store_image ? <Image src={getCleanImageUrl(partner.store.store_image)} alt={partner.store.name} fill className="object-cover rounded-lg" /> : <Store className="text-slate-200" />}
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">{partner.store.name}</h4>
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">Operational</span>
                       </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                       Primary retail outlet managing hardware and consumer flow.
                    </p>
                  </div>
                ) : (
                  <div className="py-6 text-center border border-dashed border-slate-100 rounded-2xl">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Store Indexed</p>
                  </div>
                )}
             </div>

             {/* Financial Assets */}
             <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6">
                   <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                      <Wallet size={18} strokeWidth={3} />
                   </div>
                   <div className="px-2 py-0.5 bg-slate-50 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">Ledger Config</div>
                </div>
                
                <div className="space-y-2">
                  {partner.payment_accounts?.length > 0 ? (
                    partner.payment_accounts.map((acc) => (
                      <div key={acc.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-50 group/acc hover:bg-white hover:shadow-md transition-all">
                        <div className="flex items-center gap-2.5">
                           <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-amber-500 border border-slate-50 shadow-sm group-hover/acc:scale-110 transition-transform">
                             <CreditCard size={12} strokeWidth={3} />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[10px] font-black text-slate-800 leading-none mb-0.5">{acc.account_name}</span>
                             <span className="text-[7px] font-black text-slate-400 uppercase tracking-tight">{acc.account_type}</span>
                           </div>
                        </div>
                        <span className="text-[9px] font-black text-slate-900 tabular-nums">{acc.account_id}</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center border border-dashed border-slate-100 rounded-2xl">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Methods Linked</p>
                    </div>
                  )}
                </div>
             </div>
          </div>

          {/* Internal Metadata */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-10">
             <StatBox label="Last Seen" value="Active" icon={Activity} />
             <StatBox label="Security" value="System" icon={ShieldCheck} success />
             <StatBox label="Hierarchy" value="Partner" icon={Building} />
             <StatBox label="Verification" value="Pass" icon={CheckCircle2} success />
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
    <div className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${highlight ? 'bg-blue-50/50 border border-blue-100 shadow-sm' : 'border border-transparent bg-slate-50/50'}`}>
       <div className={`p-1.5 rounded-lg bg-white shadow-sm shrink-0 ${highlight ? 'text-blue-600' : 'text-slate-400'}`}>
         <Icon size={12} strokeWidth={3} />
       </div>
       <div className="flex flex-col text-left overflow-hidden min-w-0">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{label}</span>
          <span className={`text-[10px] font-black truncate ${highlight ? 'text-blue-600' : 'text-slate-700'}`}>{value}</span>
       </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, success }) {
  return (
    <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm text-center flex flex-col items-center group hover:border-blue-100 transition-all">
       <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 shadow-inner ${success ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'} group-hover:scale-110 transition-transform`}>
          <Icon size={14} strokeWidth={3} />
       </div>
       <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{label}</span>
       <span className={`text-[11px] font-black uppercase tracking-tight ${success ? 'text-emerald-600' : 'text-slate-900'}`}>{value}</span>
    </div>
  );
}
