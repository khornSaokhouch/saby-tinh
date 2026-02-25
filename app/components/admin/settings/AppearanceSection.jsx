import { Palette, Layout, Moon } from 'lucide-react';

export default function AppearanceSection() {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
       <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Palette size={20} strokeWidth={2.5} /></div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Aesthetics</h3>
      </div>
      <div className="space-y-3">
         <label className="flex items-center justify-between p-3 rounded-xl border border-indigo-600 bg-indigo-50 cursor-pointer">
           <div className="flex items-center gap-3">
             <Layout size={16} className="text-indigo-600" />
             <span className="text-xs font-bold text-indigo-900">Light Mode</span>
           </div>
           <div className="w-4 h-4 rounded-full border-[5px] border-indigo-600" />
         </label>
         <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
           <div className="flex items-center gap-3">
             <Moon size={16} className="text-slate-500" />
             <span className="text-xs font-bold text-slate-600">Dark Mode</span>
           </div>
           <div className="w-4 h-4 rounded-full border border-slate-300" />
         </label>
      </div>
    </div>
  );
}