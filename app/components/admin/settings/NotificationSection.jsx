import { Bell } from 'lucide-react';
import ToggleRow from './ToggleRow'; // See shared components

export default function NotificationSection() {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50 relative z-10">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg"><Bell size={16} strokeWidth={3} /></div>
        <h3 className="text-base font-black text-slate-900 tracking-tighter">Event Logs</h3>
      </div>
      
      <div className="space-y-4 relative z-10">
        <ToggleRow title="System Pulse" desc="Critical sync status & errors" defaultChecked />
        <ToggleRow title="Security Shield" desc="Active protection alerts" defaultChecked />
        <ToggleRow title="Node Reports" desc="Weekly analytical summaries" />
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}