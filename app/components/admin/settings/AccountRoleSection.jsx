import { Lock } from 'lucide-react';

export default function AccountRoleSection({ role }) {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
       <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border-2 border-white shadow-sm border-rose-100/50"><Lock size={18} strokeWidth={2.5} /></div>
        <h3 className="text-base font-black text-slate-900 tracking-tight italic uppercase">Account Role</h3>
      </div>
      <div className="bg-slate-900 rounded-2xl p-4 text-white mb-2 shadow-xl shadow-slate-200 relative z-10 overflow-hidden group/role">
        <div className="relative z-10">
          <p className="text-[9px] font-black opacity-60 uppercase tracking-widest">Current Access</p>
          <div className="flex justify-between items-end mt-1">
            <h4 className="text-lg font-black capitalize tracking-tight italic">{role || 'Admin'}</h4>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mb-1.5 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/5 rounded-full group-hover/role:scale-150 transition-transform duration-700" />
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}