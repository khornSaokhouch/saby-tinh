import { Lock } from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function AccountRoleSection({ role }) {
  const { language } = useLanguageStore();

  return (
    <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group">
       <div className="flex items-center gap-2.5 mb-5 relative z-10">
        <div className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-md"><Lock size={14} strokeWidth={2.5} /></div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">{t('Account access', language)}</h3>
      </div>
      <div className="bg-slate-900 rounded-xl px-5 py-4 text-white mb-2 shadow-xl shadow-slate-100 relative z-10 overflow-hidden group/role">
        <div className="relative z-10">
          <p className="text-[9px] font-bold opacity-60 tracking-wide mb-1">{t('Permissions level', language)}</p>
          <div className="flex justify-between items-center mt-1">
            <h4 className="text-lg font-bold capitalize tracking-tight">{t(role || 'Administrator', language)}</h4>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-14 h-14 bg-white/5 rounded-full group-hover/role:scale-150 transition-transform duration-700" />
      </div>
      <div className="absolute -right-5 -bottom-5 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}