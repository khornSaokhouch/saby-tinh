import { useRef } from 'react';
import { User, Calendar, Upload, Camera, Phone, Mail, Key } from 'lucide-react';
import InputField from './InputField'; // See shared components below

export default function ProfileSection({ user, formData, imagePreview, onInputChange, onImageChange }) {
  const fileInputRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border-2 border-white shadow-sm border-indigo-100/50"><User size={18} strokeWidth={2.5} /></div>
          <h3 className="text-base font-black text-slate-900 tracking-tight italic uppercase">Public Profile</h3>
        </div>
        <div className="px-3 py-1 bg-slate-50 rounded-xl flex items-center gap-2 border border-slate-100/50">
            <Calendar size={10} className="text-slate-400" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Joined: {formatDate(user?.created_at)}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* AVATAR UPLOAD AREA */}
        <div className="col-span-2 flex items-center gap-5 mb-2 relative z-10">
          <div className="relative group/avatar">
            <div className="w-20 h-20 rounded-[24px] bg-slate-50 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-slate-200 uppercase tracking-tighter">
                  {user?.name?.charAt(0) || "A"}
                </span>
              )}
            </div>
            <div 
              onClick={() => fileInputRef.current.click()}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] rounded-[24px] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all cursor-pointer"
            >
              <Camera className="text-white" size={20} strokeWidth={2.5} />
            </div>
          </div>

          <div className="space-y-1">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onImageChange} 
              className="hidden" 
              accept="image/*"
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100/50 flex items-center gap-1.5"
            >
              <Upload size={12} strokeWidth={3} /> Change Avatar
            </button>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight ml-1">JPG or PNG. Max 2MB.</p>
          </div>
        </div>

        <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />

        {/* INPUT FIELDS */}
        <div className="col-span-2 sm:col-span-1">
          <InputField label="Full Name" name="name" value={formData.name} onChange={onInputChange} icon={User} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <InputField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={onInputChange} icon={Phone} placeholder="e.g. 095 867 475" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <InputField label="Email Address" name="email" value={formData.email} onChange={onInputChange} type="email" icon={Mail} />
        </div>
        <div className="col-span-2 sm:col-span-1">
           <InputField label="New Password" name="password" value={formData.password} onChange={onInputChange} type="password" icon={Key} placeholder="Leave empty to keep" />
        </div>
        
        <div className="col-span-2 space-y-2 relative z-10">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Bio / About Me</label>
          <textarea 
            name="bio"
            value={formData.bio}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[12px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 transition-all h-24 resize-none placeholder:text-slate-300 leading-relaxed shadow-sm"
            placeholder="Tell us a bit about yourself..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}