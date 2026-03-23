import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function ToggleRow({ title, desc, defaultChecked }) {
  const { language } = useLanguageStore();
  return (
    <div className="flex items-center justify-between py-1">
      <div className="text-left">
        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{t(title, language)}</h4>
        <p className="text-[9px] font-medium text-slate-500 mt-0.5">{t(desc, language)}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );
}