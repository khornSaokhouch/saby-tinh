import { Globe } from "lucide-react";
import { useState } from "react";

export default function RegionalSection() {
  const [language, setLanguage] = useState("en");

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg"><Globe size={16} strokeWidth={3} /></div>
        <h3 className="text-base font-black text-slate-900 tracking-tighter">Node Localization</h3>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Core Language
          </label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-100 transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="en">English (US)</option>
            <option value="km">Khmer (KH)</option>
          </select>
        </div>
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}