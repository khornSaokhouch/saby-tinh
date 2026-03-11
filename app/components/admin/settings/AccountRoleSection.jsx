import { Lock } from 'lucide-react';

export default function AccountRoleSection({ role }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
       <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg"><Lock size={16} strokeWidth={3} /></div>
        <h3 className="text-base font-black text-slate-900 tracking-tighter">Access Tier</h3>
      </div>
      <div className="bg-slate-900 rounded-2xl px-5 py-4 text-white mb-2 shadow-xl shadow-slate-200 relative z-10 overflow-hidden group/role">
        <div className="relative z-10">
          <p className="text-[8px] font-black opacity-60 uppercase tracking-widest mb-1.5">Authorized Level</p>
          <div className="flex justify-between items-center mt-1">
            <h4 className="text-xl font-black capitalize tracking-tighter">{role || 'Administrator'}</h4>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/5 rounded-full group-hover/role:scale-150 transition-transform duration-700" />
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}