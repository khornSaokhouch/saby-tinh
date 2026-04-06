'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Building2, Globe, Clock, MapPin, Loader2, 
  Mail, Phone, ExternalLink, ArrowLeft,
   ShieldCheck, Calendar, ArrowUpRight , Building, ShieldAlert,
  CreditCard, Store, PieChart, Activity,
  Info, CheckCircle2, AlertCircle, Bookmark,
  TrendingUp, Wallet, DollarSign, Fingerprint, Users, Shield
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
  const { fetchUserById, fetchStoreMembers, loading: userLoading } = useUserStore();
  const [partner, setPartner] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
    const loadPartner = async () => {
      if (userId) {
        const res = await fetchUserById(userId);
        if (res?.success) {
            setPartner(res.data);
            // If user has a store, fetch its members
            if (res.data.store?.id) {
                setTeamLoading(true);
                const teamRes = await fetchStoreMembers(res.data.store.id);
                if (teamRes?.success) setTeamMembers(teamRes.data);
                setTeamLoading(false);
            }
        }
      }
    };
    loadPartner();
  }, [fetchCompanies, fetchUserById, fetchStoreMembers, userId]);

  const company = useMemo(() => companies.find(c => String(c.user_id) === userId), [companies, userId]);

  if (companyLoading || userLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 font-sans text-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <div className="space-y-1">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Loading Profile</h2>
          <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Accessing company details...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 font-sans text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm mb-2">
          <ShieldAlert className="text-slate-300" size={32} />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Company Not Found</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Directory verification failed</p>
        </div>
        <button onClick={() => router.back()} className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all">
          <ArrowLeft size={14} strokeWidth={3} /> Go Back
        </button>
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
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Business Profile</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
              {partner.name.split(' ').map((word, i, arr) => (
                <span key={i} className={i === arr.length - 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500" : ""}>
                   {word}{' '}
                </span>
              ))}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl shadow-sm self-start md:self-center">
           <ShieldCheck size={14} className="text-indigo-600" />
           <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none">Verified Merchant</span>
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
            
            <h3 className="text-xl font-black text-slate-900 relative z-10 tracking-tighter">{partner.name}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 relative z-10">
              Business Owner
            </p>

            <div className="grid grid-cols-1 gap-2 mt-8 relative z-10">
               <InfoRow icon={Mail} label="Owner Email" value={partner.email} />
               <InfoRow icon={Phone} label="Contact Number" value={partner.phone_number || 'Not Linked'} />
               <InfoRow icon={Calendar} label="Member Since" value={new Date(partner.created_at).toLocaleDateString()} />
               <InfoRow icon={Fingerprint} label="Internal ID" value={`#${partner.id.toString().padStart(5, '0')}`} highlight />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-700 to-rose-800 p-8 rounded-[32px] text-white shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
               <PieChart size={100} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-indigo-300">
                  <TrendingUp size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Business Health</span>
                </div>
                <h3 className="text-lg font-black mb-3 leading-tight tracking-tight text-white italic">Strategic Performance</h3>
                <p className="text-[10px] text-blue-100/60 leading-relaxed font-bold mb-8">
                   Strategic growth trajectory and business health overview.
                </p>
                <button className="flex items-center justify-center gap-3 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/20 backdrop-blur-sm">
                   View Full Report <ArrowUpRight size={12} strokeWidth={3} />
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
                   <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{company?.company_name || 'Business Entity'}</h2>
                   {company && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-indigo-100/50">Registered Company</span>}
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
                   <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">About Company</h4>
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed text-balance">
                    {company?.description || 'No business description provided for this profile.'}
                  </p>
                </div>
                
                <div className="space-y-3">
                   <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Headquarters</h4>
                  {company?.address ? (
                    <div className="p-4 bg-slate-50 rounded-[20px] border border-slate-100 group">
                      <p className="text-[11px] font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                        {company.address.house_number ? `#${company.address.house_number}, ` : ''}{company.address.street}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                        {company.address.commune}, {company.address.district}, {company.address.province}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-[20px] border border-dashed border-slate-200 text-center">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Location Not Set</p>
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
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Map Unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Store Asset */}
             <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group text-left">
                <div className="flex items-center justify-between mb-6">
                   <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Store size={18} strokeWidth={3} />
                   </div>
                   <div className="px-2 py-0.5 bg-slate-50 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">Business Unit</div>
                </div>
                
                {partner.store ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden relative border border-slate-100 group-hover:rotate-2 transition-transform">
                          {partner.store.store_image ? <Image src={getCleanImageUrl(partner.store.store_image)} alt={partner.store.name} fill className="object-cover rounded-lg" /> : <Store className="text-slate-200" />}
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">{partner.store.name}</h4>
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Operational</span>
                       </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                       Official business storefront and retail presence.
                    </p>
                  </div>
                ) : (
                  <div className="py-6 text-center border border-dashed border-slate-100 rounded-2xl">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Store Linked</p>
                  </div>
                )}
             </div>

             {/* Financial Assets */}
             <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group text-left">
                <div className="flex items-center justify-between mb-6">
                   <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                      <Wallet size={18} strokeWidth={3} />
                   </div>
                   <div className="px-2 py-0.5 bg-slate-50 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">Payment Methods</div>
                </div>
                
                <div className="space-y-2">
                  {partner.payment_accounts?.length > 0 ? (
                    partner.payment_accounts.map((acc) => (
                      <div key={acc.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-50 group/acc hover:bg-white hover:shadow-md transition-all">
                        <div className="flex items-center gap-2.5">
                           <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-rose-500 border border-slate-50 shadow-sm group-hover/acc:scale-110 transition-transform">
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
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Accounts Found</p>
                    </div>
                  )}
                </div>
             </div>
          </div>

          {/* Section 3: Team Registry (NEW) */}
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden text-left">
              <div className="flex items-center justify-between mb-8">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <Users size={16} className="text-indigo-600" />
                       <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Workforce Registry</h3>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tighter">Team Members</h2>
                 </div>
                 <div className="px-3 py-1 bg-slate-50 rounded-xl text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                    {teamMembers.length} Accounts Registered
                 </div>
              </div>

              {teamLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="animate-spin text-indigo-500" size={24} />
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest tracking-[0.2em]">Syncing Team Data...</span>
                  </div>
              ) : teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teamMembers.map((member, idx) => (
                           <div key={member.id} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all group/member">
                               <div className="flex items-center gap-3 min-w-0">
                                   <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden relative shadow-sm shrink-0">
                                       {member.profile?.image_profile ? (
                                           <Image src={getCleanImageUrl(member.profile.image_profile)} alt={member.name} fill className="object-cover" />
                                       ) : (
                                           <span className="text-xs font-black text-slate-300 uppercase">{member.name.charAt(0)}</span>
                                       )}
                                   </div>
                                   <div className="flex flex-col min-w-0">
                                       <span className="text-[11px] font-black text-slate-900 group-hover/member:text-indigo-600 transition-colors truncate tracking-tighter leading-none mb-1">{member.name}</span>
                                       <div className="flex items-center gap-1.5 opacity-60">
                                            <Shield size={9} className="text-indigo-500" />
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate">{member.role || 'Member'}</span>
                                       </div>
                                   </div>
                               </div>
                               <div className="flex flex-col items-end shrink-0 gap-1">
                                   <span className="text-[9px] font-black text-slate-900 tabular-nums">#{member.id.toString().padStart(4, '0')}</span>
                                   <div className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[7px] font-black uppercase tracking-tighter">Verified</div>
                               </div>
                           </div>
                      ))}
                  </div>
              ) : (
                  <div className="py-12 text-center border-2 border-dashed border-slate-50 rounded-[24px] flex flex-col items-center gap-3">
                      <Users size={32} className="text-slate-100" />
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Team Members Linked</p>
                  </div>
              )}
          </section>

          {/* Internal Metadata */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             <StatBox label="Live Status" value="Active" icon={Activity} />
             <StatBox label="Protection" value="System" icon={ShieldCheck} success />
             <StatBox label="Membership" value="Partner" icon={Building} />
             <StatBox label="Validation" value="Pass" icon={CheckCircle2} success />
          </section>
        </div>
      </div>
    </div>
  );
}

export default function PartnerDetailsPage() {
  return (
    <Suspense fallback={
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 font-sans text-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <div className="space-y-1">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Loading Profile</h2>
          <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Preparing data stream...</p>
        </div>
      </div>
    }>
      <PartnerDetailsContent />
    </Suspense>
  );
}

function InfoRow({ icon: Icon, label, value, highlight }) {
  return (
     <div className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${highlight ? 'bg-indigo-50/50 border border-indigo-100 shadow-sm' : 'border border-transparent bg-slate-50/50'}`}>
        <div className={`p-1.5 rounded-lg bg-white shadow-sm shrink-0 ${highlight ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Icon size={12} strokeWidth={3} />
        </div>
        <div className="flex flex-col text-left overflow-hidden min-w-0">
           <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{label}</span>
           <span className={`text-[10px] font-black truncate ${highlight ? 'text-indigo-600' : 'text-slate-700'}`}>{value}</span>
        </div>
     </div>
  );
}

function StatBox({ label, value, icon: Icon, success }) {
  return (
    <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm text-center flex flex-col items-center group hover:border-indigo-100 transition-all">
       <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 shadow-inner ${success ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'} group-hover:scale-110 transition-transform`}>
          <Icon size={14} strokeWidth={3} />
       </div>
       <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{label}</span>
       <span className={`text-[11px] font-black uppercase tracking-tight ${success ? 'text-emerald-600' : 'text-slate-900'}`}>{value}</span>
    </div>
  );
}
