import { Save, Loader2 } from 'lucide-react';

export default function SettingsHeader({ isSaving, onSave }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="text-left">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">User Profile Configuration</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
          Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Settings</span>
        </h1>
        <p className="text-slate-500 text-[12px] font-medium mt-1">Update your account details and preferences</p>
      </div>
      <button 
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-black shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest"
      >
        {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} strokeWidth={3} />}
        {isSaving ? 'Syncing...' : 'Save Changes'}
      </button>
    </div>
  );
}