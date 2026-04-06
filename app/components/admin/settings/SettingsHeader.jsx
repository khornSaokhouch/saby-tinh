import { Save, Loader2 } from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function SettingsHeader({ isSaving, onSave }) {
  const { language } = useLanguageStore();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="text-left">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 tracking-wide">{t('Settings configuration', language)}</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none capitalize">
          {t('Account', language)} <span className="text-indigo-600">{t('settings', language)}</span>
        </h1>
        <p className="text-slate-500 text-[11px] font-medium mt-1">{t('Update your account details and preferences', language)}</p>
      </div>
      <button 
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed tracking-wide"
      >
        {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} strokeWidth={2.5} />}
        {isSaving ? t('Saving...', language) : t('Save changes', language)}
      </button>
    </div>
  );
}