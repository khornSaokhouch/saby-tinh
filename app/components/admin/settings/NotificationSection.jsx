import { Bell } from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import ToggleRow from './ToggleRow'; 

export default function NotificationSection() {
  const { language } = useLanguageStore();

  return (
    <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-50 relative z-10">
        <div className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-md"><Bell size={14} strokeWidth={2.5} /></div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">{t('Notifications', language)}</h3>
      </div>
      
      <div className="space-y-3 relative z-10 px-0.5">
        <ToggleRow title="System status" desc="Get alerts on sync status & errors" defaultChecked />
        <ToggleRow title="Security alerts" desc="Stay notified of active protection" defaultChecked />
        <ToggleRow title="Weekly reports" desc="Receive analytical summaries" />
      </div>
      <div className="absolute -right-5 -bottom-5 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}