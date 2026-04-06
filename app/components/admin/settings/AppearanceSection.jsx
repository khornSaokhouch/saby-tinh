import { Palette, Layout, Moon } from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function AppearanceSection() {
  const { language } = useLanguageStore();

  return (
    <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-2.5 mb-5 relative z-10">
        <div className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-md"><Palette size={14} strokeWidth={2.5} /></div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">{t('Appearance', language)}</h3>
      </div>
      <div className="space-y-1.5 relative z-10">
         <label className="flex items-center justify-between p-2.5 rounded-xl border border-indigo-600 bg-indigo-50/50 cursor-pointer transition-all shadow-sm">
           <div className="flex items-center gap-2.5">
             <Layout size={12} className="text-indigo-600" strokeWidth={2.5} />
             <span className="text-[12px] font-bold text-indigo-900 pb-0.5">{t('Light mode', language)}</span>
           </div>
           <div className="w-3 h-3 rounded-full border-[3px] border-indigo-600 bg-white" />
         </label>
         <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all group/row">
           <div className="flex items-center gap-2.5">
             <Moon size={12} className="text-slate-400" strokeWidth={2.5} />
             <span className="text-[12px] font-bold text-slate-400 group-hover/row:text-slate-600 transition-colors pb-0.5">{t('Dark mode', language)}</span>
           </div>
           <div className="w-3 h-3 rounded-full border-2 border-slate-200 bg-white" />
         </label>
      </div>
      <div className="absolute -right-5 -bottom-5 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}