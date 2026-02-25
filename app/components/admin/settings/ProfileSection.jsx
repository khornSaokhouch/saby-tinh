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
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><User size={20} strokeWidth={2.5} /></div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Public Profile</h3>
        </div>
        <div className="px-4 py-1.5 bg-slate-50 rounded-full flex items-center gap-2">
            <Calendar size={12} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Joined: {formatDate(user?.created_at)}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* AVATAR UPLOAD AREA */}
        <div className="col-span-2 flex items-center gap-5 mb-2">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[32px] bg-slate-50 border-2 border-white shadow-xl flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-slate-300 uppercase">
                  {user?.name?.charAt(0) || "A"}
                </span>
              )}
            </div>
            <div 
              onClick={() => fileInputRef.current.click()}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm rounded-[32px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <Camera className="text-white" size={24} />
            </div>
          </div>

          <div className="space-y-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onImageChange} 
              className="hidden" 
              accept="image/*"
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
            >
              <Upload size={14} strokeWidth={2.5} /> Update Asset
            </button>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Max Resolution: 2MB (JPG/PNG)</p>
          </div>
        </div>

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
        
        <div className="col-span-2 space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Bio / About Me</label>
          <textarea 
            name="bio"
            value={formData.bio}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-100 rounded-[32px] px-8 py-6 text-sm font-medium text-slate-700 focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-100 transition-all h-32 resize-none placeholder:text-slate-300 leading-relaxed"
            placeholder="Tell us a bit about yourself..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}