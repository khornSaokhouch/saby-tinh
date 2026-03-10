import { Save, Loader2 } from 'lucide-react';

export default function SettingsHeader({ isSaving, onSave }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Account Settings</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Update your account details and preferences</p>
      </div>
      <button 
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest"
      >
        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={2.5} />}
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}