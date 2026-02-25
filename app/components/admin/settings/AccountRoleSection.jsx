import { Lock } from 'lucide-react';

export default function AccountRoleSection({ role }) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
       <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Lock size={20} strokeWidth={2.5} /></div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Account Role</h3>
      </div>
      <div className="bg-slate-900 rounded-xl p-4 text-white mb-4 shadow-lg shadow-slate-400/20">
        <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Current Access</p>
        <div className="flex justify-between items-end mt-1">
          <h4 className="text-xl font-bold capitalize">{role || 'Admin'}</h4>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mb-1.5"></div>
        </div>
      </div>
    </div>
  );
}