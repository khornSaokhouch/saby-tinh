import { Palette, Layout, Moon } from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function AppearanceSection() {
  const { language } = useLanguageStore();

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
       <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg"><Palette size={16} strokeWidth={3} /></div>
        <h3 className="text-base font-black text-slate-900 tracking-tighter">{t('UI Aesthetics', language)}</h3>
      </div>
      <div className="space-y-2 relative z-10">
         <label className="flex items-center justify-between p-3 rounded-xl border border-indigo-600 bg-indigo-50/50 cursor-pointer group/row transition-all shadow-sm">
           <div className="flex items-center gap-3">
             <Layout size={14} className="text-indigo-600" strokeWidth={2.5} />
             <span className="text-[11px] font-black text-indigo-900 uppercase tracking-widest">{t('Light Mode', language)}</span>
           </div>
           <div className="w-3.5 h-3.5 rounded-full border-[4px] border-indigo-600 bg-white" />
         </label>
         <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all group/row">
           <div className="flex items-center gap-3">
             <Moon size={14} className="text-slate-400" strokeWidth={2.5} />
             <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover/row:text-slate-600 transition-colors">{t('Dark Mode', language)}</span>
           </div>
           <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 bg-white" />
         </label>
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}