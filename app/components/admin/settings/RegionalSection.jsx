import { Globe } from "lucide-react";
import { useState } from "react";

export default function RegionalSection() {
  const [language, setLanguage] = useState("en");

  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Globe size={20} strokeWidth={2.5} /></div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Localization</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
            Interface Language
          </label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          >
            <option value="en">English (US)</option>
            <option value="km">Khmer (KH)</option>
          </select>
        </div>
      </div>
    </div>
  );
}