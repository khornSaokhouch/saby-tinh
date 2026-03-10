import { Bell } from 'lucide-react';
import ToggleRow from './ToggleRow'; // See shared components

export default function NotificationSection() {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50 relative z-10">
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border-2 border-white shadow-sm border-amber-100/50"><Bell size={18} strokeWidth={2.5} /></div>
        <h3 className="text-base font-black text-slate-900 tracking-tight italic uppercase">Email Notifications</h3>
      </div>
      
      <div className="space-y-4 relative z-10">
        <ToggleRow title="System Alerts" desc="Critical server status and errors" defaultChecked />
        <ToggleRow title="Security Alerts" desc="Suspicious login attempts" defaultChecked />
        <ToggleRow title="Email Reports" desc="Weekly analytical reports" />
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}