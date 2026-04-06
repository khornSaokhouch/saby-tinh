export default function InputField({ label, value, name, onChange, placeholder, type = "text", disabled = false, icon: Icon }) {
  return (
    <div className="relative text-left space-y-1">
      <div className="flex items-center gap-2 opacity-50 px-1">
        <span className="text-[8px] font-bold text-slate-400 tracking-wide">{label}</span>
      </div>
      <div className="relative">
        <input 
          type={type} 
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-100 transition-all ${Icon ? 'pl-9' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} shadow-inner`}
        />
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />}
      </div>
    </div>
  );
}