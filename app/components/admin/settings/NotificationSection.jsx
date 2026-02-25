import { Bell } from 'lucide-react';
import ToggleRow from './ToggleRow'; // See shared components

export default function NotificationSection() {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-50">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Bell size={20} strokeWidth={2.5} /></div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Email Notifications</h3>
      </div>
      
      <div className="space-y-4">
        <ToggleRow title="System Alerts" desc="Get notified about server status and errors." defaultChecked />
        <ToggleRow title="Security Alerts" desc="Notify me about suspicious login attempts." defaultChecked />
        <ToggleRow title="Email Reports" desc="Receive weekly analytical reports." />
      </div>
    </div>
  );
}