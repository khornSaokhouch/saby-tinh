import { Globe } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { t } from "@/util/translations";

export default function RegionalSection() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex items-center gap-2.5 mb-5 relative z-10">
        <div className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-md"><Globe size={14} strokeWidth={2.5} /></div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">{t('Localization', language)}</h3>
      </div>

      <div className="space-y-4 relative z-10 px-0.5">
        <div>
          <label className="block text-[8px] font-bold text-slate-400 tracking-wide mb-1 ml-1">
            {t('System language', language)}
          </label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[12px] font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-100 transition-all shadow-inner appearance-none cursor-pointer"
          >
            <option value="en">{t('English (US)', language)}</option>
            <option value="km">{t('Khmer (KH)', language)}</option>
          </select>
        </div>
      </div>
      <div className="absolute -right-5 -bottom-5 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}