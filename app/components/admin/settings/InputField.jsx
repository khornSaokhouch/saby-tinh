export default function InputField({ label, value, name, onChange, placeholder, type = "text", disabled = false, icon: Icon }) {
  return (
    <div className="relative">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative">
        <input 
          type={type} 
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all ${Icon ? 'pl-10' : ''} ${disabled ? 'opacity-60 cursor-not-allowed text-slate-500' : ''}`}
        />
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
      </div>
    </div>
  );
}