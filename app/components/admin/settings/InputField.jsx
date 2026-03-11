export default function InputField({ label, value, name, onChange, placeholder, type = "text", disabled = false, icon: Icon }) {
  return (
    <div className="relative text-left">
      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
      <div className="relative">
        <input 
          type={type} 
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-100 transition-all ${Icon ? 'pl-9' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} shadow-sm`}
        />
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />}
      </div>
    </div>
  );
}